package com.indcaffe.dto;

public record OrderItemResponseDTO(
    Long id,
    Long productId,
    String productName,
    Double quantity,
    Double price
) {}
