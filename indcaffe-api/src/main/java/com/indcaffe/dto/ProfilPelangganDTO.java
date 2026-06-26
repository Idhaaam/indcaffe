package com.indcaffe.dto;

public record ProfilPelangganDTO(
    Long id,
    String username,
    String email,
    String namaLengkap,
    String noTelpon,
    String alamat
) {}
