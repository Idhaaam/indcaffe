package com.indcaffe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BarangMasukDTO(
    @NotNull(message = "ID Produk wajib diisi") Long productId,
    @NotNull(message = "Kuantitas wajib diisi") @Min(value = 1, message = "Kuantitas minimal 1") Double quantity,
    String notes
) {}
