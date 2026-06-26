package com.indcaffe.service;

import com.indcaffe.entity.Category;
import com.indcaffe.entity.Product;
import com.indcaffe.entity.Supplier;
import com.indcaffe.entity.Cafe;
import com.indcaffe.repository.CategoryRepository;
import com.indcaffe.repository.ProductRepository;
import com.indcaffe.repository.SupplierRepository;
import com.indcaffe.repository.CafeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MasterDataService {
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final CafeRepository cafeRepository;

    public List<Category> getCategoriesByCafe(Long cafeId) {
        return categoryRepository.findByCafeId(cafeId);
    }
    public Category saveCategory(Category category) {
        Cafe cafe = cafeRepository.findById(category.getCafe().getId()).orElseThrow();
        category.setCafe(cafe);
        return categoryRepository.save(category);
    }

    public List<Supplier> getSuppliersByCafe(Long cafeId) {
        return supplierRepository.findByCafeId(cafeId);
    }
    public Supplier saveSupplier(Supplier supplier) {
        Cafe cafe = cafeRepository.findById(supplier.getCafe().getId()).orElseThrow();
        supplier.setCafe(cafe);
        return supplierRepository.save(supplier);
    }

    public List<Product> getProductsByCafe(Long cafeId) {
        return productRepository.findByCafeId(cafeId);
    }
    public Product saveProduct(Product product) {
        Cafe cafe = cafeRepository.findById(product.getCafe().getId()).orElseThrow();
        product.setCafe(cafe);
        if (product.getCategory() != null) {
            product.setCategory(categoryRepository.findById(product.getCategory().getId()).orElseThrow());
        }
        if (product.getSupplier() != null && product.getSupplier().getId() != null) {
            product.setSupplier(supplierRepository.findById(product.getSupplier().getId()).orElse(null));
        }
        return productRepository.save(product);
    }
}
