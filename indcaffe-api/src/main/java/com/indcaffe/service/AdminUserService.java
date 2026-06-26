package com.indcaffe.service;

import com.indcaffe.dto.UserRequestDTO;
import com.indcaffe.dto.UserResponseDTO;
import java.util.List;

public interface AdminUserService {
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Long id);
    UserResponseDTO createUser(UserRequestDTO request);
    UserResponseDTO updateUser(Long id, UserRequestDTO request);
    void deleteUser(Long id);
}
