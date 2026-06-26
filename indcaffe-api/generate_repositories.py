import os

base_dir = r"C:\Users\Budiman\.gemini\antigravity\scratch\indcaffe-api\src\main\java\com\indcaffe\repository"

repositories = {
    "UserRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
""",
    "CafeRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CafeRepository extends JpaRepository<Cafe, Long> {
    Optional<Cafe> findByUserId(Long userId);
}
""",
    "MitraRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.Mitra;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MitraRepository extends JpaRepository<Mitra, Long> {
    Optional<Mitra> findByUserId(Long userId);
}
""",
    "CategoryRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByCafeId(Long cafeId);
}
""",
    "SupplierRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByCafeId(Long cafeId);
}
""",
    "ProductRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCafeId(Long cafeId);
    List<Product> findByCategoryId(Long categoryId);
}
""",
    "StockTransactionRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByProductCafeId(Long cafeId);
    List<StockTransaction> findByProductId(Long productId);
}
""",
    "SurplusPostRepository.java": """package com.indcaffe.repository;

import com.indcaffe.entity.SurplusPost;
import com.indcaffe.entity.SurplusStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SurplusPostRepository extends JpaRepository<SurplusPost, Long> {
    List<SurplusPost> findByCafeId(Long cafeId);
    List<SurplusPost> findByStatus(SurplusStatus status);
    List<SurplusPost> findByClaimedById(Long mitraId);
}
"""
}

for filename, content in repositories.items():
    with open(os.path.join(base_dir, filename), "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {filename}")
