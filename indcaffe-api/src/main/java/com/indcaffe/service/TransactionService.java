package com.indcaffe.service;

import com.indcaffe.dto.ClaimRequestDTO;
import com.indcaffe.dto.ClaimResponseDTO;
import com.indcaffe.entity.*;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final StockTransactionRepository stockTxRepo;
    private final ProductRepository productRepo;
    private final SurplusPostRepository surplusRepo;
    private final CafeRepository cafeRepository;
    private final AuditLogRepository auditLogRepository;
    private final MitraRepository mitraRepository;

    public List<StockTransaction> getTransactionsByCafe(Long cafeId) {
        return stockTxRepo.findByProductCafeId(cafeId);
    }

    @Transactional
    public StockTransaction addStockTransaction(StockTransaction tx) {
        Product product = productRepo.findById(tx.getProduct().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        tx.setProduct(product);

        if ("INCOMING".equals(tx.getType().name())) {
            product.setCurrentStock(product.getCurrentStock() + tx.getQuantity());
        } else if ("OUTGOING".equals(tx.getType().name())) {
            if (product.getCurrentStock() < tx.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock");
            }
            product.setCurrentStock(product.getCurrentStock() - tx.getQuantity());
        }
        productRepo.save(product);
        StockTransaction savedTx = stockTxRepo.save(tx);
        // Initialize proxies before returning to avoid LazyInitializationException
        org.hibernate.Hibernate.initialize(savedTx.getProduct().getCategory());
        org.hibernate.Hibernate.initialize(savedTx.getProduct().getCafe());
        return savedTx;
    }

    public List<SurplusPost> getAllSurplus() {
        return surplusRepo.findAll();
    }
    
    public List<SurplusPost> getSurplusByCafe(Long cafeId) {
        return surplusRepo.findByCafeId(cafeId);
    }

    @Transactional
    public SurplusPost createSurplus(SurplusPost surplus) {
        Cafe cafe = cafeRepository.findById(surplus.getCafe().getId()).orElseThrow(() -> new ResourceNotFoundException("Cafe tidak ditemukan"));
        Product product = productRepo.findById(surplus.getProduct().getId()).orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));
        
        surplus.setCafe(cafe);
        surplus.setProduct(product);
        surplus.setCreatedAt(LocalDateTime.now());
        surplus.setStatus(SurplusStatus.TERSEDIA);
        
        if (product.getCurrentStock() < surplus.getQuantity()) {
            throw new IllegalArgumentException("Stok tidak mencukupi untuk didonasikan");
        }
        product.setCurrentStock(product.getCurrentStock() - surplus.getQuantity());
        productRepo.save(product);
        
        productRepo.save(product);
        SurplusPost savedSurplus = surplusRepo.save(surplus);
        org.hibernate.Hibernate.initialize(savedSurplus.getProduct().getCategory());
        org.hibernate.Hibernate.initialize(savedSurplus.getProduct().getCafe());
        return savedSurplus;
    }

    @Transactional
    public ClaimResponseDTO claimDonasi(ClaimRequestDTO dto, Long mitraId) {
        SurplusPost post = surplusRepo.findByIdWithPessimisticLock(dto.surplusPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Donasi tidak ditemukan"));

        if (post.getStatus() != SurplusStatus.TERSEDIA) {
            throw new IllegalArgumentException("Donasi tidak dapat diklaim karena statusnya bukan TERSEDIA");
        }

        Mitra mitra = mitraRepository.findById(mitraId)
                .orElseThrow(() -> new ResourceNotFoundException("Mitra tidak ditemukan"));

        post.setStatus(SurplusStatus.DIKLAIM);
        post.setClaimedBy(mitra);
        post.setClaimDate(LocalDateTime.now());
        post.setCatatan(dto.catatan());

        surplusRepo.save(post);

        AuditLog auditLog = AuditLog.builder()
                .action("CLAIM_DONATION")
                .entityName("SurplusPost")
                .entityId(post.getId())
                .timestamp(LocalDateTime.now())
                .userId(mitra.getUser().getId())
                .newValue("Status -> DIKLAIM, Catatan: " + dto.catatan())
                .build();
        auditLogRepository.save(auditLog);

        return new ClaimResponseDTO(
                post.getId(), post.getId(), mitra.getId(),
                post.getStatus().name(), post.getCreatedAt(), post.getCatatan()
        );
    }

    @Transactional
    public ClaimResponseDTO batalkanKlaim(Long surplusPostId, Long mitraId) {
        SurplusPost post = surplusRepo.findByIdWithPessimisticLock(surplusPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Donasi tidak ditemukan"));

        if (post.getClaimedBy() == null || !post.getClaimedBy().getId().equals(mitraId)) {
            throw new IllegalArgumentException("Anda tidak berhak membatalkan klaim donasi milik mitra lain");
        }

        if (post.getStatus() == SurplusStatus.DIKONFIRMASI || post.getStatus() == SurplusStatus.SELESAI) {
            throw new IllegalArgumentException("Klaim tidak dapat dibatalkan karena donasi sudah DIKONFIRMASI atau SELESAI");
        }
        
        if (post.getStatus() != SurplusStatus.DIKLAIM) {
             throw new IllegalArgumentException("Klaim tidak valid untuk dibatalkan");
        }

        post.setStatus(SurplusStatus.DIBATALKAN);
        surplusRepo.save(post);

        Product product = post.getProduct();
        product.setCurrentStock(product.getCurrentStock() + post.getQuantity());
        productRepo.save(product);

        AuditLog auditLog = AuditLog.builder()
                .action("CANCEL_CLAIM")
                .entityName("SurplusPost")
                .entityId(post.getId())
                .timestamp(LocalDateTime.now())
                .userId(post.getClaimedBy().getUser().getId())
                .newValue("Status -> DIBATALKAN")
                .build();
        auditLogRepository.save(auditLog);

        return new ClaimResponseDTO(
                post.getId(), post.getId(), mitraId,
                post.getStatus().name(), post.getCreatedAt(), post.getCatatan()
        );
    }
}
