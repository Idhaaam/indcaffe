package com.indcaffe.dto;

import java.time.LocalDateTime;

public record DonasiTersediaDTO(
    Long id,
    String namaProduk,
    Double jumlah,
    String catatan,
    String namaKafe,
    String lokasi,
    LocalDateTime expiredAt,
    String status
) {}
