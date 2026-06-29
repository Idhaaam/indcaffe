package com.indcaffe.dto;

import com.indcaffe.entity.SurplusStatus;
import java.time.LocalDateTime;

public record SurplusPostResponseDTO(
    Long id,
    Long productId,
    String productName,
    Long cafeId,
    String cafeName,
    Long cafeUserId,
    String cafeUsername,
    Double quantity,
    LocalDateTime expiryDate,
    SurplusStatus status,
    Long claimedById,
    String claimedByName,
    LocalDateTime claimDate,
    Long approvedById,
    String approvedByUsername,
    LocalDateTime approvedAt,
    Integer version
) {}
