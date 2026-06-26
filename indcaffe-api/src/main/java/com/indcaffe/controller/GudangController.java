package com.indcaffe.controller;

import com.indcaffe.dto.*;
import com.indcaffe.entity.User;
import com.indcaffe.entity.Product;
import com.indcaffe.entity.SurplusPost;
import com.indcaffe.entity.StockTransaction;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.service.GudangService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/gudang")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ADMIN_GUDANG')")
@RequiredArgsConstructor
public class GudangController {

    private final GudangService gudangService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        return currentUser.getId();
    }

    @PostMapping("/barang-masuk")
    public ResponseEntity<StockTransaction> inputBarangMasuk(@Valid @RequestBody BarangMasukDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.inputBarangMasuk(request, userId));
    }

    @PostMapping("/barang-keluar")
    public ResponseEntity<StockTransaction> inputBarangKeluar(@Valid @RequestBody BarangKeluarDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.inputBarangKeluar(request, userId));
    }

    @GetMapping("/expiry-alert")
    public ResponseEntity<List<Product>> getExpiryAlert() {
        return ResponseEntity.ok(gudangService.getExpiryAlert());
    }

    @PostMapping("/stock-opname")
    public ResponseEntity<?> stockOpname(@Valid @RequestBody StockOpnameDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.stockOpname(request, userId));
    }

    @PutMapping("/produk/{id}/siap-donasi")
    public ResponseEntity<SurplusPost> tandaiSiapDonasi(@PathVariable Long id, @Valid @RequestBody SiapDonasiDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.tandaiSiapDonasi(id, request, userId));
    }

    @GetMapping("/stok")
    public ResponseEntity<List<Product>> getStokRealTime() {
        return ResponseEntity.ok(gudangService.getStokRealTime());
    }
}
