package com.indcaffe.service;

import com.indcaffe.dto.*;
import com.indcaffe.entity.SurplusPost;
import com.indcaffe.entity.SurplusStatus;
import com.indcaffe.entity.SystemConfig;
import com.indcaffe.entity.User;
import com.indcaffe.entity.Product;
import com.indcaffe.entity.OpnameApproval;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.ProductRepository;
import com.indcaffe.repository.SurplusPostRepository;
import com.indcaffe.repository.SystemConfigRepository;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.repository.AuditLogRepository;
import com.indcaffe.repository.OpnameApprovalRepository;
import com.indcaffe.repository.StockTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final ProductRepository productRepository;

    private final SurplusPostRepository surplusPostRepository;

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final OpnameApprovalRepository opnameApprovalRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final SystemConfigRepository systemConfigRepository;

    @Override
    @Transactional(readOnly = true)
    public ManagerDashboardDTO getDashboardSummary() {
        Long totalProducts = productRepository.count();
        Double totalStock = productRepository.sumAllStock();
        if (totalStock == null) totalStock = 0.0;
        
        Double threshold = getStockThreshold();
        Long criticalStockCount = productRepository.countCriticalStock(threshold);
        
        Long pendingDonationsCount = surplusPostRepository.countByStatus(SurplusStatus.DIKLAIM);
        
        List<CafeSummaryDTO> cafeSummaries = productRepository.getCafeStockSummaries();

        return new ManagerDashboardDTO(totalProducts, totalStock, criticalStockCount, pendingDonationsCount, cafeSummaries);
    }

    @Override
    @Transactional
    public SurplusPostResponseDTO approveDonation(Long id, Long managerId) {
        SurplusPost post = surplusPostRepository.findByIdWithPessimisticLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donasi tidak ditemukan"));

        if (post.getStatus() == SurplusStatus.SELESAI || post.getStatus() == SurplusStatus.DIBATALKAN) {
            throw new IllegalArgumentException("Donasi sudah diselesaikan atau dibatalkan");
        }
        if (post.getStatus() != SurplusStatus.DIKLAIM) {
            throw new IllegalArgumentException("Hanya donasi dengan status DIKLAIM yang dapat di-approve");
        }

        // Approval bertingkat: hanya donasi > 50 unit yang BUTUH approval Manager secara ketat (business rule check).
        // Namun, jika sudah sampai ke Manager endpoint, kita izinkan Manager meng-approve terlepas unitnya,
        // karena role Manager melingkupi hak Admin Gudang untuk approve.
        
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager tidak ditemukan"));

        post.setStatus(SurplusStatus.DIKONFIRMASI);
        post.setApprovedBy(manager);
        post.setApprovedAt(LocalDateTime.now());

        return mapToDTO(surplusPostRepository.save(post));
    }

    @Override
    @Transactional
    public SurplusPostResponseDTO rejectDonation(Long id, Long managerId) {
        SurplusPost post = surplusPostRepository.findByIdWithPessimisticLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donasi tidak ditemukan"));

        if (post.getStatus() == SurplusStatus.SELESAI || post.getStatus() == SurplusStatus.DIBATALKAN) {
            throw new IllegalArgumentException("Donasi sudah diselesaikan atau dibatalkan");
        }

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager tidak ditemukan"));

        post.setStatus(SurplusStatus.DIBATALKAN);
        post.setApprovedBy(manager);
        post.setApprovedAt(LocalDateTime.now());

        // Note: saat direject, mungkin stok perlu dikembalikan ke Product jika sebelumnya dikurangi saat CLAIMED.
        // Asumsi: stok berkurang saat DIKLAIM, maka harus ditambah kembali.
        if (post.getProduct() != null) {
            Double current = post.getProduct().getCurrentStock();
            post.getProduct().setCurrentStock(current + post.getQuantity());
            productRepository.save(post.getProduct());
        }

        return mapToDTO(surplusPostRepository.save(post));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SurplusPostResponseDTO> getDonationReport(int page, int size) {
        return surplusPostRepository.findAllWithFetch(PageRequest.of(page, size))
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SurplusPostResponseDTO> getWasteReport(int page, int size) {
        // Laporan food waste biasanya adalah yang EXPIRED atau yang dibatalkan
        return surplusPostRepository.findAllWithFetch(PageRequest.of(page, size))
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockAlertDTO> getStockAlerts() {
        Double threshold = getStockThreshold();
        return productRepository.findCriticalStocks(threshold).stream()
                .map(p -> new StockAlertDTO(
                        p.getId(), p.getName(), p.getCafe().getName(), p.getCurrentStock(), threshold
                ))
                .collect(Collectors.toList());
    }

    private Double getStockThreshold() {
        return systemConfigRepository.findByKey("STOCK_CRITICAL_THRESHOLD")
                .map(config -> Double.parseDouble(config.getValue()))
                .orElse(10.0); // Default threshold
    }

    private SurplusPostResponseDTO mapToDTO(SurplusPost p) {
        String approvedByUsername = p.getApprovedBy() != null ? p.getApprovedBy().getUsername() : null;
        String claimedByName = p.getClaimedBy() != null ? p.getClaimedBy().getName() : null;
        Long claimedById = p.getClaimedBy() != null ? p.getClaimedBy().getId() : null;
        
        return new SurplusPostResponseDTO(
                p.getId(), p.getProduct().getId(), p.getProduct().getName(),
                p.getCafe().getId(), p.getCafe().getName(),
                p.getQuantity(), p.getExpiryDate(), p.getStatus(),
                claimedById, claimedByName, p.getClaimDate(),
                p.getApprovedBy() != null ? p.getApprovedBy().getId() : null,
                approvedByUsername, p.getApprovedAt(), p.getVersion()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<OpnameApprovalResponseDTO> getPendingOpnameApprovals() {
        return opnameApprovalRepository.findAllByStatus("PENDING", PageRequest.of(0, 100)).stream()
                .map(o -> new OpnameApprovalResponseDTO(
                        o.getId(), o.getProductId(), o.getNamaProduct(), o.getStokSistem(),
                        o.getStokFisik(), o.getSelisihPersen(), o.getStatus(), o.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OpnameApprovalResponseDTO approveOpname(Long id, Long managerId, OpnameApprovalRequestDTO request) {
        OpnameApproval approval = opnameApprovalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval tidak ditemukan"));

        if (!"PENDING".equals(approval.getStatus())) {
            throw new IllegalArgumentException("Status tidak valid untuk disetujui");
        }

        Product p = productRepository.findById(approval.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        Double difference = approval.getStokFisik() - p.getCurrentStock();
        p.setCurrentStock(approval.getStokFisik());
        productRepository.save(p);

        com.indcaffe.entity.StockTransaction tx = new com.indcaffe.entity.StockTransaction();
        tx.setProduct(p);
        tx.setQuantity(Math.abs(difference));
        tx.setType(difference >= 0 ? com.indcaffe.entity.TransactionType.INCOMING : com.indcaffe.entity.TransactionType.OUTGOING);
        tx.setNotes("Stock Opname (Disetujui Manager): " + (request != null && request.notes() != null ? request.notes() : ""));
        tx.setTransactionDate(LocalDateTime.now());
        stockTransactionRepository.save(tx);

        approval.setStatus("DISETUJUI");
        approval.setReviewedBy(managerId);
        approval.setReviewedAt(LocalDateTime.now());
        opnameApprovalRepository.save(approval);

        auditLogRepository.save(com.indcaffe.entity.AuditLog.builder()
                .action("APPROVE_OPNAME")
                .entityName("OpnameApproval")
                .entityId(approval.getId())
                .userId(managerId)
                .timestamp(LocalDateTime.now())
                .newValue("Status -> DISETUJUI. Stok baru: " + approval.getStokFisik())
                .build());

        return new OpnameApprovalResponseDTO(
                approval.getId(), approval.getProductId(), approval.getNamaProduct(), approval.getStokSistem(),
                approval.getStokFisik(), approval.getSelisihPersen(), approval.getStatus(), approval.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public OpnameApprovalResponseDTO rejectOpname(Long id, Long managerId, OpnameApprovalRequestDTO request) {
        OpnameApproval approval = opnameApprovalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval tidak ditemukan"));

        if (!"PENDING".equals(approval.getStatus())) {
            throw new IllegalArgumentException("Status tidak valid untuk ditolak");
        }

        approval.setStatus("DITOLAK");
        approval.setReviewedBy(managerId);
        approval.setReviewedAt(LocalDateTime.now());
        opnameApprovalRepository.save(approval);

        auditLogRepository.save(com.indcaffe.entity.AuditLog.builder()
                .action("REJECT_OPNAME")
                .entityName("OpnameApproval")
                .entityId(approval.getId())
                .userId(managerId)
                .timestamp(LocalDateTime.now())
                .newValue("Status -> DITOLAK. Stok tetap: " + approval.getStokSistem())
                .build());

        return new OpnameApprovalResponseDTO(
                approval.getId(), approval.getProductId(), approval.getNamaProduct(), approval.getStokSistem(),
                approval.getStokFisik(), approval.getSelisihPersen(), approval.getStatus(), approval.getCreatedAt()
        );
    }
}
