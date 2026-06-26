package com.indcaffe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendMessageRequestDTO(
    @NotNull(message = "Sender ID cannot be null")
    Long senderId,
    
    @NotNull(message = "Receiver ID cannot be null")
    Long receiverId,
    
    @NotBlank(message = "Message text cannot be empty")
    String text
) {}
