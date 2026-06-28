package com.indcaffe.dto;

import com.indcaffe.entity.Role;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserManagementDTO {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private Boolean isActive;
    private Boolean isApproved;
    private LocalDateTime date;
}
