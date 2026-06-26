package com.indcaffe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    
    // Type specific fields
    @NotBlank
    private String type; // "CAFE", "MITRA", "PELANGGAN"
    
    // Cafe/Mitra details
    private String name; // Cafe/Mitra Name OR Pelanggan namaLengkap
    private String city;
    private String address;
    private String organizationType; // for Mitra

    @jakarta.validation.constraints.Email
    private String email;

    private String namaLengkap;
    private String noTelpon;
}
