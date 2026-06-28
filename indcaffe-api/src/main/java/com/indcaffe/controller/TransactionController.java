package com.indcaffe.controller;

import com.indcaffe.dto.ClaimRequestDTO;
import com.indcaffe.dto.ClaimResponseDTO;
import com.indcaffe.entity.StockTransaction;
import com.indcaffe.entity.SurplusPost;
import com.indcaffe.entity.User;
import com.indcaffe.entity.Mitra;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.repository.MitraRepository;
import com.indcaffe.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;
    private final MitraRepository mitraRepository;

    private Long getCurrentMitraId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        
        Mitra mitra = mitraRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mitra profile tidak ditemukan untuk user ini"));
        return mitra.getId();
    }

    @GetMapping("/cafe/{cafeId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long cafeId) {
        return ResponseEntity.ok(transactionService.getTransactionsByCafe(cafeId));
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('CAFE')")
    public ResponseEntity<?> addTransaction(@RequestBody StockTransaction tx) {
        try {
            return ResponseEntity.ok(transactionService.addStockTransaction(tx));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/surplus")
    public ResponseEntity<?> getAllSurplus() {
        return ResponseEntity.ok(transactionService.getAllSurplus());
    }

    @GetMapping("/surplus/cafe/{cafeId}")
    public ResponseEntity<?> getSurplusByCafe(@PathVariable Long cafeId) {
        return ResponseEntity.ok(transactionService.getSurplusByCafe(cafeId));
    }

    @PostMapping("/surplus")
    @PreAuthorize("hasRole('CAFE')")
    public ResponseEntity<?> createSurplus(@RequestBody SurplusPost surplus) {
        return ResponseEntity.ok(transactionService.createSurplus(surplus));
    }

    @GetMapping("/surplus/claims/cafe/{cafeId}")
    public ResponseEntity<?> getSurplusClaimsByCafe(@PathVariable Long cafeId) {
        java.util.List<SurplusPost> claims = transactionService.getSurplusByCafe(cafeId).stream()
            .filter(p -> "DIKLAIM".equals(p.getStatus().name()) || "SELESAI".equals(p.getStatus().name()) || "DIKONFIRMASI".equals(p.getStatus().name()))
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(claims);
    }

    @PostMapping("/pelanggan/klaim")
    @PreAuthorize("hasAuthority('ROLE_MITRA')")
    public ResponseEntity<ClaimResponseDTO> claimDonasi(@Valid @RequestBody ClaimRequestDTO request) {
        Long mitraId = getCurrentMitraId();
        return ResponseEntity.ok(transactionService.claimDonasi(request, mitraId));
    }

    @PutMapping("/pelanggan/klaim/{id}/batal")
    @PreAuthorize("hasAuthority('ROLE_MITRA')")
    public ResponseEntity<ClaimResponseDTO> batalkanKlaim(@PathVariable Long id) {
        Long mitraId = getCurrentMitraId();
        return ResponseEntity.ok(transactionService.batalkanKlaim(id, mitraId));
    }
}
