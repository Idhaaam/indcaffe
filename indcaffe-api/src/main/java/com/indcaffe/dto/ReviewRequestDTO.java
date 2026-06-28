package com.indcaffe.dto;

import lombok.Data;

@Data
public class ReviewRequestDTO {
    private Long cafeId;
    private Long pelangganId;
    private Integer rating;
    private String comment;
}
