package com.indcaffe.dto;

import lombok.Data;

@Data
public class MovementRequestDTO {
    private Long productId;
    private Double quantity;
    private String type; // "IN" or "OUT"
}
