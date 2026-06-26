package com.indcaffe.dto;

import java.time.LocalDateTime;

public record RiwayatKlaimDTO(
    Long id,
    String namaProduk,
    Double jumlah,
    String status,
    LocalDateTime createdAt,
    String catatan,
    String namaKafe
) {}
