package com.indcaffe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequestDTO(
    @NotNull(message = "ID Surplus Post tidak boleh kosong")
    Long surplusPostId,

    @NotNull(message = "Kuantitas tidak boleh kosong")
    @Min(value = 1, message = "Kuantitas minimal 1")
    Double quantity
) {}
