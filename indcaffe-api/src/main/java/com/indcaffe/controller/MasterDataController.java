package com.indcaffe.controller;

import com.indcaffe.entity.Category;
import com.indcaffe.entity.Product;
import com.indcaffe.entity.Supplier;
import com.indcaffe.service.MasterDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/master")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class MasterDataController {

    private final MasterDataService masterDataService;

    @GetMapping("/categories/cafe/{cafeId}")
    public ResponseEntity<?> getCategories(@PathVariable Long cafeId) {
        return ResponseEntity.ok(masterDataService.getCategoriesByCafe(cafeId));
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('CAFE')")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        return ResponseEntity.ok(masterDataService.saveCategory(category));
    }

    @GetMapping("/suppliers/cafe/{cafeId}")
    public ResponseEntity<?> getSuppliers(@PathVariable Long cafeId) {
        return ResponseEntity.ok(masterDataService.getSuppliersByCafe(cafeId));
    }

    @PostMapping("/suppliers")
    @PreAuthorize("hasRole('CAFE')")
    public ResponseEntity<?> addSupplier(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(masterDataService.saveSupplier(supplier));
    }

    @GetMapping("/products/cafe/{cafeId}")
    public ResponseEntity<?> getProducts(@PathVariable Long cafeId) {
        return ResponseEntity.ok(masterDataService.getProductsByCafe(cafeId));
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('CAFE')")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(masterDataService.saveProduct(product));
    }

    @GetMapping("/products/expiry-alerts/cafe/{cafeId}")
    public ResponseEntity<?> getExpiryAlerts(@PathVariable Long cafeId) {
        java.time.LocalDate sevenDaysFromNow = java.time.LocalDate.now().plusDays(7);
        java.util.List<Product> expiringProducts = masterDataService.getProductsByCafe(cafeId).stream()
            .filter(p -> p.getExpiryDate() != null && !p.getExpiryDate().isAfter(sevenDaysFromNow) && p.getCurrentStock() > 0)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(expiringProducts);
    }
}
