package com.indcaffe.dto;

import java.time.LocalDateTime;

public record OpnameApprovalResponseDTO(
    Long id,
    Long productId,
    String namaProduct,
    Double stokSistem,
    Double stokFisik,
    Double selisihPersen,
    String status,
    LocalDateTime createdAt
) {}
