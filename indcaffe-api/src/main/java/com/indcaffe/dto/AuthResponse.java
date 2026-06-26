package com.indcaffe.dto;

import com.indcaffe.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private Role role;
    private Long id;
    private Long cafeId;
    private Long mitraId;
    private Long pelangganId;
    private String name;
    private String city;
    private String address;
}
