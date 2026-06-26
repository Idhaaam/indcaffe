package com.indcaffe.dto;

import jakarta.validation.constraints.NotNull;

public record DonationApprovalDTO(
    @NotNull(message = "Persetujuan (approve) tidak boleh kosong")
    Boolean approve
) {}
