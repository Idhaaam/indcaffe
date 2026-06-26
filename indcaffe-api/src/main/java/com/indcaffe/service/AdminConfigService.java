package com.indcaffe.service;

import com.indcaffe.dto.*;
import org.springframework.data.domain.Page;

public interface AdminConfigService {
    // System Config
    Page<SystemConfigResponseDTO> getAllConfigs(int page, int size);
    SystemConfigResponseDTO getConfigByKey(String key);
    SystemConfigResponseDTO createConfig(SystemConfigRequestDTO request, Long userId);
    SystemConfigResponseDTO updateConfig(String key, SystemConfigRequestDTO request, Long userId);

    // Audit Log
    Page<AuditLogResponseDTO> getAuditLogs(int page, int size);
}
