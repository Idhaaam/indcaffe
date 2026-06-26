package com.indcaffe.dto;

public record StockAlertDTO(
    Long productId,
    String productName,
    String cafeName,
    Double currentStock,
    Double threshold
) {}
