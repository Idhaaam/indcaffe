package com.indcaffe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record StockOpnameDTO(
    @NotNull(message = "ID Produk wajib diisi") Long productId,
    @NotNull(message = "Stok fisik wajib diisi") @Min(value = 0, message = "Stok fisik tidak boleh negatif") Double physicalStock,
    String notes
) {}
