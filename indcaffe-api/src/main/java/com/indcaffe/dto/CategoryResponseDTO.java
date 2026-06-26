package com.indcaffe.dto;

public record CategoryResponseDTO(
    Long id,
    String name,
    Long cafeId,
    String cafeName,
    Long version
) {}
