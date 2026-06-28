package com.indcaffe.controller;

import com.indcaffe.dto.*;
import com.indcaffe.service.AdminConfigService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.entity.User;
import com.indcaffe.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class AdminConfigController {

    private final AdminConfigService adminConfigService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        return currentUser.getId();
    }

    // --- SYSTEM CONFIG ---

    @GetMapping("/config")
    public ResponseEntity<Page<SystemConfigResponseDTO>> getAllConfigs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminConfigService.getAllConfigs(page, size));
    }

    @GetMapping("/config/{key}")
    public ResponseEntity<SystemConfigResponseDTO> getConfigByKey(@PathVariable String key) {
        return ResponseEntity.ok(adminConfigService.getConfigByKey(key));
    }

    @PostMapping("/config")
    public ResponseEntity<SystemConfigResponseDTO> createConfig(
            @Valid @RequestBody SystemConfigRequestDTO request) {
        Long userId = getCurrentUserId();
        return new ResponseEntity<>(adminConfigService.createConfig(request, userId), HttpStatus.CREATED);
    }

    @PutMapping("/config/{key}")
    public ResponseEntity<SystemConfigResponseDTO> updateConfig(
            @PathVariable String key,
            @Valid @RequestBody SystemConfigRequestDTO request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(adminConfigService.updateConfig(key, request, userId));
    }

    // --- AUDIT LOGS ---

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogResponseDTO>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminConfigService.getAuditLogs(page, size));
    }
}
