package com.indcaffe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoryRequestDTO(
    @NotBlank(message = "Nama kategori tidak boleh kosong")
    String name,

    @NotNull(message = "ID Cafe tidak boleh kosong")
    Long cafeId
) {}
