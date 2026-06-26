package com.indcaffe.controller;

import com.indcaffe.dto.*;
import com.indcaffe.entity.User;
import com.indcaffe.entity.Pelanggan;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.repository.PelangganRepository;
import com.indcaffe.service.PelangganService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pelanggan")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('PELANGGAN')")
@RequiredArgsConstructor
public class PelangganController {

    private final PelangganService pelangganService;
    private final UserRepository userRepository;
    private final PelangganRepository pelangganRepository;

    private Long getCurrentPelangganId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        
        Pelanggan pelanggan = pelangganRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil Pelanggan tidak ditemukan untuk user ini"));
        return pelanggan.getId();
    }

    @GetMapping("/donasi-tersedia")
    public ResponseEntity<List<DonasiTersediaDTO>> getDonasiTersedia() {
        return ResponseEntity.ok(pelangganService.getDonasiTersedia());
    }

    @GetMapping("/riwayat")
    public ResponseEntity<List<RiwayatKlaimDTO>> getRiwayatKlaim() {
        Long pelangganId = getCurrentPelangganId();
        return ResponseEntity.ok(pelangganService.getRiwayatKlaim(pelangganId));
    }

    @PostMapping("/klaim")
    public ResponseEntity<ClaimResponseDTO> klaimDonasi(@Valid @RequestBody ClaimRequestDTO request) {
        Long pelangganId = getCurrentPelangganId();
        return ResponseEntity.ok(pelangganService.klaimDonasi(request, pelangganId));
    }

    @PutMapping("/klaim/{id}/batal")
    public ResponseEntity<ClaimResponseDTO> batalkanKlaim(@PathVariable Long id) {
        Long pelangganId = getCurrentPelangganId();
        return ResponseEntity.ok(pelangganService.batalkanKlaim(id, pelangganId));
    }

    @GetMapping("/profil")
    public ResponseEntity<ProfilPelangganDTO> getProfil() {
        Long pelangganId = getCurrentPelangganId();
        return ResponseEntity.ok(pelangganService.getProfil(pelangganId));
    }

    @PutMapping("/profil")
    public ResponseEntity<ProfilPelangganDTO> updateProfil(@Valid @RequestBody ProfilPelangganDTO request) {
        Long pelangganId = getCurrentPelangganId();
        return ResponseEntity.ok(pelangganService.updateProfil(pelangganId, request));
    }
}
