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
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class GudangController {

    private final GudangService gudangService;
    private final UserRepository userRepository;
    private final com.indcaffe.repository.WarehouseStockRepository warehouseStockRepository;
    private final com.indcaffe.repository.ProductRepository productRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        return currentUser.getId();
    }

    @PostMapping("/api/gudang/barang-masuk")
    public ResponseEntity<StockTransaction> inputBarangMasuk(@Valid @RequestBody BarangMasukDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.inputBarangMasuk(request, userId));
    }

    @PostMapping("/api/gudang/barang-keluar")
    public ResponseEntity<StockTransaction> inputBarangKeluar(@Valid @RequestBody BarangKeluarDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.inputBarangKeluar(request, userId));
    }

    @GetMapping("/api/gudang/expiry-alert")
    public ResponseEntity<List<Product>> getExpiryAlert() {
        return ResponseEntity.ok(gudangService.getExpiryAlert());
    }

    @PostMapping("/api/gudang/stock-opname")
    public ResponseEntity<?> stockOpname(@Valid @RequestBody StockOpnameDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.stockOpname(request, userId));
    }

    @PutMapping("/api/gudang/produk/{id}/siap-donasi")
    public ResponseEntity<SurplusPost> tandaiSiapDonasi(@PathVariable Long id, @Valid @RequestBody SiapDonasiDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(gudangService.tandaiSiapDonasi(id, request, userId));
    }

    @GetMapping("/api/gudang/stok")
    public ResponseEntity<List<Product>> getStokRealTime() {
        return ResponseEntity.ok(gudangService.getStokRealTime());
    }

    @GetMapping("/api/warehouse/inventory")
    public ResponseEntity<List<com.indcaffe.entity.WarehouseStock>> getAllStock() {
        return ResponseEntity.ok(warehouseStockRepository.findAll());
    }

    @PostMapping("/api/warehouse/inventory")
    public ResponseEntity<?> recordMovement(@RequestBody MovementRequestDTO request) {
        if (request.getProductId() == null || request.getQuantity() == null || request.getType() == null) {
            return ResponseEntity.badRequest().body("ProductId, quantity, and type are required");
        }

        java.util.Optional<Product> productOpt = productRepository.findById(request.getProductId());
        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        Product product = productOpt.get();
        com.indcaffe.entity.WarehouseStock stock = warehouseStockRepository.findByProductId(product.getId())
                .orElse(com.indcaffe.entity.WarehouseStock.builder().product(product).build());

        if (request.getType().equalsIgnoreCase("IN")) {
            stock.setQuantityIn(stock.getQuantityIn() + request.getQuantity());
            stock.setCurrentStock(stock.getCurrentStock() + request.getQuantity());
        } else if (request.getType().equalsIgnoreCase("OUT")) {
            if (stock.getCurrentStock() < request.getQuantity()) {
                return ResponseEntity.badRequest().body("Insufficient stock in warehouse");
            }
            stock.setQuantityOut(stock.getQuantityOut() + request.getQuantity());
            stock.setCurrentStock(stock.getCurrentStock() - request.getQuantity());
        } else {
            return ResponseEntity.badRequest().body("Invalid movement type, must be IN or OUT");
        }

        com.indcaffe.entity.WarehouseStock saved = warehouseStockRepository.save(stock);
        return ResponseEntity.ok(saved);
    }
}
