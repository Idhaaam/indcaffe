package com.indcaffe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SupplierRequestDTO(
    @NotBlank(message = "Nama supplier tidak boleh kosong")
    String name,
    
    @NotBlank(message = "Kontak tidak boleh kosong")
    String contact,

    @NotNull(message = "ID Cafe tidak boleh kosong")
    Long cafeId
) {}
