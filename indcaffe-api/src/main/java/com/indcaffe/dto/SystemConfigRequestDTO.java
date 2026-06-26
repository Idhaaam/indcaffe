package com.indcaffe.dto;

import jakarta.validation.constraints.NotBlank;

public record SystemConfigRequestDTO(
    @NotBlank(message = "Key tidak boleh kosong")
    String key,

    @NotBlank(message = "Value tidak boleh kosong")
    String value,

    String description
) {}
