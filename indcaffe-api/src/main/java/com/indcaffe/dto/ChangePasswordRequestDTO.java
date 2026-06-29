package com.indcaffe.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequestDTO(
    @NotBlank(message = "Password lama tidak boleh kosong")
    String oldPassword,

    @NotBlank(message = "Password baru tidak boleh kosong")
    String newPassword
) {}
