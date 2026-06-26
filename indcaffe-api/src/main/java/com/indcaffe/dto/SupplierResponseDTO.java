package com.indcaffe.dto;

public record SupplierResponseDTO(
    Long id,
    String name,
    String contact,
    Long cafeId,
    String cafeName,
    Long version
) {}
