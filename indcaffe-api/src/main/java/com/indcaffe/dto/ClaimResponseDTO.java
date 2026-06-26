package com.indcaffe.dto;

import java.time.LocalDateTime;

public record ClaimResponseDTO(
    Long id,
    Long surplusPostId,
    Long mitraId,
    String status,
    LocalDateTime createdAt,
    String catatan
) {}
