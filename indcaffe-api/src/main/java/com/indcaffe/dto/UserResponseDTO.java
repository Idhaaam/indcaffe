package com.indcaffe.dto;

import com.indcaffe.entity.Role;
import java.time.LocalDateTime;

public record UserResponseDTO(
    Long id,
    String username,
    Role role,
    Boolean isActive,
    Boolean isApproved,
    LocalDateTime createdAt
) {}
