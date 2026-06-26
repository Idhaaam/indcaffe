package com.indcaffe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record SiapDonasiDTO(
    @NotNull(message = "Kuantitas wajib diisi") @Min(value = 1, message = "Kuantitas minimal 1") Double quantity,
    @NotNull(message = "Tanggal expired wajib diisi") LocalDateTime expiryDate,
    String notes
) {}
