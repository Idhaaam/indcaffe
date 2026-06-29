package com.indcaffe.dto;

import java.time.LocalDate;

public record ProductResponseDTO(
    Long id,
    String name,
    Long categoryId,
    String categoryName,
    Long supplierId,
    String supplierName,
    Long cafeId,
    String cafeName,
    Long cafeUserId,
    String cafeUsername,
    String unit,
    Double currentStock,
    LocalDate expiryDate,
    Long version
) {}
