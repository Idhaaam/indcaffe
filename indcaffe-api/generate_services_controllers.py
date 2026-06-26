import os

base_dir = r"C:\Users\Budiman\.gemini\antigravity\scratch\indcaffe-api\src\main\java\com\indcaffe"

services = {
    "MasterDataService.java": """package com.indcaffe.service;

import com.indcaffe.entity.Category;
import com.indcaffe.entity.Product;
import com.indcaffe.entity.Supplier;
import com.indcaffe.repository.CategoryRepository;
import com.indcaffe.repository.ProductRepository;
import com.indcaffe.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MasterDataService {
    @Autowired CategoryRepository categoryRepository;
    @Autowired SupplierRepository supplierRepository;
    @Autowired ProductRepository productRepository;

    public List<Category> getCategoriesByCafe(Long cafeId) {
        return categoryRepository.findByCafeId(cafeId);
    }
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Supplier> getSuppliersByCafe(Long cafeId) {
        return supplierRepository.findByCafeId(cafeId);
    }
    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public List<Product> getProductsByCafe(Long cafeId) {
        return productRepository.findByCafeId(cafeId);
    }
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
""",
    "TransactionService.java": """package com.indcaffe.service;

import com.indcaffe.entity.Product;
import com.indcaffe.entity.StockTransaction;
import com.indcaffe.entity.SurplusPost;
import com.indcaffe.repository.ProductRepository;
import com.indcaffe.repository.StockTransactionRepository;
import com.indcaffe.repository.SurplusPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class TransactionService {
    @Autowired StockTransactionRepository stockTxRepo;
    @Autowired ProductRepository productRepo;
    @Autowired SurplusPostRepository surplusRepo;

    public List<StockTransaction> getTransactionsByCafe(Long cafeId) {
        return stockTxRepo.findByCafeId(cafeId);
    }

    @Transactional
    public StockTransaction addStockTransaction(StockTransaction tx) {
        Product product = productRepo.findById(tx.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if ("IN".equals(tx.getType())) {
            product.setStockQuantity(product.getStockQuantity() + tx.getQuantity());
        } else if ("OUT".equals(tx.getType())) {
            if (product.getStockQuantity() < tx.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }
            product.setStockQuantity(product.getStockQuantity() - tx.getQuantity());
        }
        productRepo.save(product);
        return stockTxRepo.save(tx);
    }

    public List<SurplusPost> getAllSurplus() {
        return surplusRepo.findAll();
    }
    
    public List<SurplusPost> getSurplusByCafe(Long cafeId) {
        return surplusRepo.findByCafeId(cafeId);
    }

    public SurplusPost createSurplus(SurplusPost surplus) {
        surplus.setPostDate(LocalDateTime.now());
        surplus.setStatus("AVAILABLE");
        return surplusRepo.save(surplus);
    }
}
"""
}

controllers = {
    "MasterDataController.java": """package com.indcaffe.controller;

import com.indcaffe.entity.Category;
import com.indcaffe.entity.Product;
import com.indcaffe.entity.Supplier;
import com.indcaffe.service.MasterDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/master")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MasterDataController {

    @Autowired
    MasterDataService masterDataService;

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
}
""",
    "TransactionController.java": """package com.indcaffe.controller;

import com.indcaffe.entity.StockTransaction;
import com.indcaffe.entity.SurplusPost;
import com.indcaffe.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {

    @Autowired
    TransactionService transactionService;

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
}
"""
}

def write_files(file_dict, sub_dir):
    dir_path = os.path.join(base_dir, sub_dir)
    os.makedirs(dir_path, exist_ok=True)
    for filename, content in file_dict.items():
        with open(os.path.join(dir_path, filename), "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Created {filename}")

write_files(services, "service")
write_files(controllers, "controller")
