package com.indcaffe.dto;

import jakarta.validation.constraints.NotNull;

public record ClaimRequestDTO(
    @NotNull(message = "ID Donasi tidak boleh kosong")
    Long surplusPostId,
    String catatan
) {}
