package com.indcaffe.service;

import com.indcaffe.dto.*;
import com.indcaffe.entity.*;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GudangServiceImpl implements GudangService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final SurplusPostRepository surplusPostRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final OpnameApprovalRepository opnameApprovalRepository;

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
    }

    @Override
    @Transactional
    public StockTransaction inputBarangMasuk(BarangMasukDTO request, Long userId) {
        Product p = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        p.setCurrentStock(p.getCurrentStock() + request.quantity());
        productRepository.save(p);

        StockTransaction tx = new StockTransaction();
        tx.setProduct(p);
        tx.setQuantity(request.quantity());
        tx.setType(TransactionType.INCOMING);
        tx.setNotes(request.notes());
        tx.setTransactionDate(LocalDateTime.now());
        stockTransactionRepository.save(tx);

        auditLogRepository.save(AuditLog.builder()
                .action("BARANG_MASUK")
                .entityName("Product")
                .entityId(p.getId())
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .newValue("Stok Bertambah: " + request.quantity() + ". " + request.notes())
                .build());

        return tx;
    }

    @Override
    @Transactional
    public StockTransaction inputBarangKeluar(BarangKeluarDTO request, Long userId) {
        Product p = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        if (p.getCurrentStock() < request.quantity()) {
            throw new IllegalArgumentException("Stok tidak mencukupi untuk dikeluarkan. Stok saat ini: " + p.getCurrentStock());
        }

        p.setCurrentStock(p.getCurrentStock() - request.quantity());
        productRepository.save(p);

        StockTransaction tx = new StockTransaction();
        tx.setProduct(p);
        tx.setQuantity(request.quantity());
        tx.setType(TransactionType.OUTGOING);
        tx.setNotes(request.notes());
        tx.setTransactionDate(LocalDateTime.now());
        stockTransactionRepository.save(tx);

        auditLogRepository.save(AuditLog.builder()
                .action("BARANG_KELUAR")
                .entityName("Product")
                .entityId(p.getId())
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .newValue("Stok Berkurang: " + request.quantity() + ". " + request.notes())
                .build());

        return tx;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getExpiryAlert() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysLater = now.plusDays(7);
        return productRepository.findExpiryAlerts(now, sevenDaysLater);
    }

    @Override
    @Transactional
    public Object stockOpname(StockOpnameDTO request, Long userId) {
        Product p = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        Double currentSystemStock = p.getCurrentStock();
        Double difference = request.physicalStock() - currentSystemStock;
        
        Double selisihAbsolute = Math.abs(difference);
        Double selisihPersen = currentSystemStock == 0 ? 
                (request.physicalStock() > 0 ? 100.0 : 0.0) : 
                (selisihAbsolute / currentSystemStock) * 100;

        if (selisihPersen > 20.0) {
            OpnameApproval approval = OpnameApproval.builder()
                    .productId(p.getId())
                    .namaProduct(p.getName())
                    .stokSistem(currentSystemStock)
                    .stokFisik(request.physicalStock())
                    .selisihPersen(selisihPersen)
                    .status("PENDING")
                    .requestedBy(userId)
                    .build();
            opnameApprovalRepository.save(approval);

            auditLogRepository.save(AuditLog.builder()
                    .action("STOCK_OPNAME_PENDING")
                    .entityName("OpnameApproval")
                    .entityId(approval.getId())
                    .userId(userId)
                    .timestamp(LocalDateTime.now())
                    .newValue("Selisih " + String.format("%.2f", selisihPersen) + "%. Menunggu approval Manager.")
                    .build());

            return java.util.Map.of(
                "message", "Selisih melebihi 20%, menunggu persetujuan Manager",
                "approvalId", approval.getId(),
                "selisihPersen", selisihPersen
            );
        }

        p.setCurrentStock(request.physicalStock());
        productRepository.save(p);

        StockTransaction tx = new StockTransaction();
        tx.setProduct(p);
        tx.setQuantity(Math.abs(difference));
        tx.setType(difference >= 0 ? TransactionType.INCOMING : TransactionType.OUTGOING);
        tx.setNotes("Stock Opname: " + request.notes() + " (Selisih: " + difference + ")");
        tx.setTransactionDate(LocalDateTime.now());
        stockTransactionRepository.save(tx);

        auditLogRepository.save(AuditLog.builder()
                .action("STOCK_OPNAME")
                .entityName("Product")
                .entityId(p.getId())
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .newValue("Sistem: " + currentSystemStock + ", Fisik: " + request.physicalStock())
                .build());

        return tx;
    }

    @Override
    @Transactional
    public SurplusPost tandaiSiapDonasi(Long productId, SiapDonasiDTO request, Long userId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        if (p.getCurrentStock() < request.quantity()) {
            throw new IllegalArgumentException("Stok tidak mencukupi untuk disiapkan sebagai donasi");
        }

        // Potong stok
        p.setCurrentStock(p.getCurrentStock() - request.quantity());
        productRepository.save(p);

        SurplusPost post = new SurplusPost();
        post.setProduct(p);
        post.setCafe(p.getCafe());
        post.setQuantity(request.quantity());
        post.setExpiryDate(request.expiryDate());
        post.setStatus(SurplusStatus.TERSEDIA);
        post.setCatatan(request.notes());
        post.setCreatedAt(LocalDateTime.now());
        surplusPostRepository.save(post);

        auditLogRepository.save(AuditLog.builder()
                .action("SIAP_DONASI")
                .entityName("SurplusPost")
                .entityId(post.getId())
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .newValue("Produk " + p.getName() + " ditandai SIAP DONASI. Jumlah: " + request.quantity())
                .build());

        return post;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getStokRealTime() {
        return productRepository.findAll();
    }
}
