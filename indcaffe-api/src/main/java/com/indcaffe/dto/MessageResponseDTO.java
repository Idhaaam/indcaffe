package com.indcaffe.dto;

public record MessageResponseDTO(
    Long id,
    Long senderId,
    Long receiverId,
    String text,
    String timestamp,
    String senderRole
) {}
