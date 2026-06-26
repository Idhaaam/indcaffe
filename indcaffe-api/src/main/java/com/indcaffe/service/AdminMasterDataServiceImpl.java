package com.indcaffe.service;

import com.indcaffe.dto.*;
import com.indcaffe.entity.*;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.CategoryRepository;
import com.indcaffe.repository.ProductRepository;
import com.indcaffe.repository.SupplierRepository;
import com.indcaffe.repository.CafeRepository; // Assuming Cafe exists in repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminMasterDataServiceImpl implements AdminMasterDataService {

    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    
    // We need CafeRepository to associate new master data with Cafe, as per multi-tenant design 
    // Assuming it's already there or we'd just mock the existence of findById for Cafe.
    // However, since we don't have it explicitly created in this task, I'll use EntityManager or assume it exists.
    private final jakarta.persistence.EntityManager entityManager;

    private Cafe getCafe(Long cafeId) {
        Cafe cafe = entityManager.find(Cafe.class, cafeId);
        if (cafe == null) {
            throw new ResourceNotFoundException("Cafe dengan ID " + cafeId + " tidak ditemukan");
        }
        return cafe;
    }

    // --- CATEGORY ---

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAllWithFetch().stream()
                .map(this::mapCategoryToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponseDTO createCategory(CategoryRequestDTO request) {
        Category category = Category.builder()
                .name(request.name())
                .cafe(getCafe(request.cafeId()))
                .build();
        return mapCategoryToDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));
        
        category.setName(request.name());
        if (!category.getCafe().getId().equals(request.cafeId())) {
            category.setCafe(getCafe(request.cafeId()));
        }
        return mapCategoryToDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) throw new ResourceNotFoundException("Kategori tidak ditemukan");
        categoryRepository.deleteById(id);
    }

    // --- SUPPLIER ---

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponseDTO> getAllSuppliers() {
        return supplierRepository.findAllWithFetch().stream()
                .map(this::mapSupplierToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SupplierResponseDTO createSupplier(SupplierRequestDTO request) {
        Supplier supplier = Supplier.builder()
                .name(request.name())
                .contact(request.contact())
                .cafe(getCafe(request.cafeId()))
                .build();
        return mapSupplierToDTO(supplierRepository.save(supplier));
    }

    @Override
    @Transactional
    public SupplierResponseDTO updateSupplier(Long id, SupplierRequestDTO request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier tidak ditemukan"));
        
        supplier.setName(request.name());
        supplier.setContact(request.contact());
        if (!supplier.getCafe().getId().equals(request.cafeId())) {
            supplier.setCafe(getCafe(request.cafeId()));
        }
        return mapSupplierToDTO(supplierRepository.save(supplier));
    }

    @Override
    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) throw new ResourceNotFoundException("Supplier tidak ditemukan");
        supplierRepository.deleteById(id);
    }

    // --- PRODUCT ---

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAllWithFetch().stream()
                .map(this::mapProductToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));
        
        Supplier supplier = null;
        if (request.supplierId() != null) {
            supplier = supplierRepository.findById(request.supplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier tidak ditemukan"));
        }

        Product product = Product.builder()
                .name(request.name())
                .category(category)
                .supplier(supplier)
                .cafe(getCafe(request.cafeId()))
                .unit(request.unit())
                .currentStock(request.currentStock())
                .expiryDate(request.expiryDate())
                .build();

        return mapProductToDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        product.setName(request.name());
        product.setUnit(request.unit());
        product.setCurrentStock(request.currentStock());
        product.setExpiryDate(request.expiryDate());

        if (!product.getCategory().getId().equals(request.categoryId())) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));
            product.setCategory(category);
        }

        if (request.supplierId() != null) {
            if (product.getSupplier() == null || !product.getSupplier().getId().equals(request.supplierId())) {
                Supplier supplier = supplierRepository.findById(request.supplierId())
                        .orElseThrow(() -> new ResourceNotFoundException("Supplier tidak ditemukan"));
                product.setSupplier(supplier);
            }
        } else {
            product.setSupplier(null);
        }

        if (!product.getCafe().getId().equals(request.cafeId())) {
            product.setCafe(getCafe(request.cafeId()));
        }

        return mapProductToDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) throw new ResourceNotFoundException("Produk tidak ditemukan");
        productRepository.deleteById(id);
    }

    // --- MAPPERS ---

    private CategoryResponseDTO mapCategoryToDTO(Category c) {
        return new CategoryResponseDTO(c.getId(), c.getName(), c.getCafe().getId(), c.getCafe().getName(), c.getVersion());
    }

    private SupplierResponseDTO mapSupplierToDTO(Supplier s) {
        return new SupplierResponseDTO(s.getId(), s.getName(), s.getContact(), s.getCafe().getId(), s.getCafe().getName(), s.getVersion());
    }

    private ProductResponseDTO mapProductToDTO(Product p) {
        return new ProductResponseDTO(
                p.getId(), p.getName(),
                p.getCategory().getId(), p.getCategory().getName(),
                p.getSupplier() != null ? p.getSupplier().getId() : null,
                p.getSupplier() != null ? p.getSupplier().getName() : null,
                p.getCafe().getId(), p.getCafe().getName(),
                p.getUnit(), p.getCurrentStock(), p.getExpiryDate(), p.getVersion()
        );
    }
}
