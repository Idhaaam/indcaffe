package com.indcaffe.dto;

import java.time.LocalDateTime;

public record SystemConfigResponseDTO(
    Long id,
    String key,
    String value,
    String description,
    LocalDateTime updatedAt,
    Long updatedBy,
    String updatedByUsername,
    Long version
) {}
