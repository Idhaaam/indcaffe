package com.indcaffe.service;

import com.indcaffe.dto.*;
import java.util.List;

public interface AdminMasterDataService {
    // Category
    List<CategoryResponseDTO> getAllCategories();
    CategoryResponseDTO createCategory(CategoryRequestDTO request);
    CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO request);
    void deleteCategory(Long id);

    // Supplier
    List<SupplierResponseDTO> getAllSuppliers();
    SupplierResponseDTO createSupplier(SupplierRequestDTO request);
    SupplierResponseDTO updateSupplier(Long id, SupplierRequestDTO request);
    void deleteSupplier(Long id);

    // Product
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO createProduct(ProductRequestDTO request);
    ProductResponseDTO updateProduct(Long id, ProductRequestDTO request);
    void deleteProduct(Long id);
}
