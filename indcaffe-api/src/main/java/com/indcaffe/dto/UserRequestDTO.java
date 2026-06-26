package com.indcaffe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.indcaffe.entity.Role;

public record UserRequestDTO(
    @NotBlank(message = "Username tidak boleh kosong")
    String username,
    
    @NotBlank(message = "Password tidak boleh kosong")
    String password,
    
    @NotNull(message = "Role tidak boleh kosong")
    Role role
) {}
