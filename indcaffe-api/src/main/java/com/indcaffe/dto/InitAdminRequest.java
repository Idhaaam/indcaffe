package com.indcaffe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InitAdminRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String namaLengkap;

    @NotBlank
    @Email
    private String email;
}
