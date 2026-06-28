package com.indcaffe.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponseDTO {
    private Long id;
    private Long cafeId;
    private String cafeName;
    private Long pelangganId;
    private String pelangganName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
