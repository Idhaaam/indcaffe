package com.indcaffe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ProductRequestDTO(
    @NotBlank(message = "Nama produk tidak boleh kosong")
    String name,

    @NotNull(message = "ID Kategori tidak boleh kosong")
    Long categoryId,

    Long supplierId,

    @NotNull(message = "ID Cafe tidak boleh kosong")
    Long cafeId,

    @NotBlank(message = "Satuan unit tidak boleh kosong")
    String unit,

    @NotNull(message = "Stok saat ini tidak boleh kosong")
    @Min(value = 0, message = "Stok tidak boleh negatif")
    Double currentStock,

    LocalDate expiryDate,
    String imageUrl,
    String description,
    Double price,
    Boolean isActive
) {}
