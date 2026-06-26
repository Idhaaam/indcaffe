package com.indcaffe.dto;

import java.time.LocalDateTime;

public record AuditLogResponseDTO(
    Long id,
    String action,
    String entityName,
    Long entityId,
    LocalDateTime timestamp,
    Long userId,
    String username,
    String oldValue,
    String newValue
) {}
