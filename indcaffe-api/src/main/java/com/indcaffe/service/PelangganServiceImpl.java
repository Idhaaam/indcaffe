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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PelangganServiceImpl implements PelangganService {

    private final SurplusPostRepository surplusRepo;
    private final PelangganRepository pelangganRepository;
    private final ProductRepository productRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DonasiTersediaDTO> getDonasiTersedia() {
        return surplusRepo.findByStatus(SurplusStatus.TERSEDIA).stream()
                .map(p -> new DonasiTersediaDTO(
                        p.getId(), p.getProduct().getName(), p.getQuantity(),
                        p.getCatatan(), p.getCafe().getName(), p.getCafe().getAddress(),
                        p.getExpiryDate(), p.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RiwayatKlaimDTO> getRiwayatKlaim(Long pelangganId) {
        // Asumsi kita menambah findByClaimedByPelangganId di SurplusPostRepository
        // Namun kita bisa menggunakan findAll lalu filter sementara untuk MVP,
        // atau kita tambahkan methodnya nanti. Kita filter saja dari memory jika sedikit,
        // Tapi praktik terbaik kita buat query.
        return surplusRepo.findAll().stream()
                .filter(p -> p.getClaimedByPelanggan() != null && p.getClaimedByPelanggan().getId().equals(pelangganId))
                .map(p -> new RiwayatKlaimDTO(
                        p.getId(), p.getProduct().getName(), p.getQuantity(),
                        p.getStatus().name(), p.getCreatedAt(), p.getCatatan(),
                        p.getCafe().getName()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClaimResponseDTO klaimDonasi(ClaimRequestDTO request, Long pelangganId) {
        SurplusPost post = surplusRepo.findByIdWithPessimisticLock(request.surplusPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Donasi tidak ditemukan"));

        if (post.getStatus() != SurplusStatus.TERSEDIA) {
            throw new IllegalArgumentException("Donasi tidak dapat diklaim karena statusnya bukan TERSEDIA");
        }

        Pelanggan pelanggan = pelangganRepository.findById(pelangganId)
                .orElseThrow(() -> new ResourceNotFoundException("Pelanggan tidak ditemukan"));

        post.setStatus(SurplusStatus.DIKLAIM);
        post.setClaimedByPelanggan(pelanggan);
        post.setClaimDate(LocalDateTime.now());
        post.setCatatan(request.catatan());

        surplusRepo.save(post);

        AuditLog auditLog = AuditLog.builder()
                .action("CLAIM_DONATION_PELANGGAN")
                .entityName("SurplusPost")
                .entityId(post.getId())
                .timestamp(LocalDateTime.now())
                .userId(pelanggan.getUser().getId())
                .newValue("Status -> DIKLAIM oleh PELANGGAN, Catatan: " + request.catatan())
                .build();
        auditLogRepository.save(auditLog);

        return new ClaimResponseDTO(
                post.getId(), post.getId(), null, // mitraId is null here since it's pelanggan
                post.getStatus().name(), post.getCreatedAt(), post.getCatatan()
        );
    }

    @Override
    @Transactional
    public ClaimResponseDTO batalkanKlaim(Long id, Long pelangganId) {
        SurplusPost post = surplusRepo.findByIdWithPessimisticLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donasi tidak ditemukan"));

        if (post.getClaimedByPelanggan() == null || !post.getClaimedByPelanggan().getId().equals(pelangganId)) {
            throw new IllegalArgumentException("Anda tidak berhak membatalkan klaim donasi orang lain");
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
        productRepository.save(product);

        AuditLog auditLog = AuditLog.builder()
                .action("CANCEL_CLAIM_PELANGGAN")
                .entityName("SurplusPost")
                .entityId(post.getId())
                .timestamp(LocalDateTime.now())
                .userId(post.getClaimedByPelanggan().getUser().getId())
                .newValue("Status -> DIBATALKAN")
                .build();
        auditLogRepository.save(auditLog);

        return new ClaimResponseDTO(
                post.getId(), post.getId(), null,
                post.getStatus().name(), post.getCreatedAt(), post.getCatatan()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProfilPelangganDTO getProfil(Long pelangganId) {
        Pelanggan p = pelangganRepository.findById(pelangganId)
                .orElseThrow(() -> new ResourceNotFoundException("Pelanggan tidak ditemukan"));
        return new ProfilPelangganDTO(p.getId(), p.getUser().getUsername(), p.getEmail(), p.getNamaLengkap(), p.getNoTelpon(), p.getAlamat());
    }

    @Override
    @Transactional
    public ProfilPelangganDTO updateProfil(Long pelangganId, ProfilPelangganDTO request) {
        Pelanggan p = pelangganRepository.findById(pelangganId)
                .orElseThrow(() -> new ResourceNotFoundException("Pelanggan tidak ditemukan"));
        p.setNamaLengkap(request.namaLengkap());
        p.setEmail(request.email());
        p.setNoTelpon(request.noTelpon());
        p.setAlamat(request.alamat());
        pelangganRepository.save(p);
        
        return new ProfilPelangganDTO(p.getId(), p.getUser().getUsername(), p.getEmail(), p.getNamaLengkap(), p.getNoTelpon(), p.getAlamat());
    }
}
