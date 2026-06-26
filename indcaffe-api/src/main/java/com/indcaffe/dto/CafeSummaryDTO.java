package com.indcaffe.dto;

public record CafeSummaryDTO(
    Long cafeId,
    String cafeName,
    Long productCount,
    Double totalStock
) {}
