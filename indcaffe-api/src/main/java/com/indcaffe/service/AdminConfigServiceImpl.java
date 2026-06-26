package com.indcaffe.service;

import com.indcaffe.dto.*;
import com.indcaffe.entity.AuditLog;
import com.indcaffe.entity.SystemConfig;
import com.indcaffe.entity.User;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.AuditLogRepository;
import com.indcaffe.repository.SystemConfigRepository;
import com.indcaffe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminConfigServiceImpl implements AdminConfigService {

    private final SystemConfigRepository systemConfigRepository;

    private final AuditLogRepository auditLogRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<SystemConfigResponseDTO> getAllConfigs(int page, int size) {
        return systemConfigRepository.findAll(PageRequest.of(page, size))
                .map(this::mapConfigToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public SystemConfigResponseDTO getConfigByKey(String key) {
        SystemConfig config = systemConfigRepository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Konfigurasi dengan key " + key + " tidak ditemukan"));
        return mapConfigToDTO(config);
    }

    @Override
    @Transactional
    public SystemConfigResponseDTO createConfig(SystemConfigRequestDTO request, Long userId) {
        if (systemConfigRepository.findByKey(request.key()).isPresent()) {
            throw new IllegalArgumentException("Konfigurasi dengan key " + request.key() + " sudah ada");
        }

        SystemConfig config = SystemConfig.builder()
                .key(request.key())
                .value(request.value())
                .description(request.description())
                .updatedBy(userId)
                .build();

        return mapConfigToDTO(systemConfigRepository.save(config));
    }

    @Override
    @Transactional
    public SystemConfigResponseDTO updateConfig(String key, SystemConfigRequestDTO request, Long userId) {
        SystemConfig config = systemConfigRepository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Konfigurasi dengan key " + key + " tidak ditemukan"));

        config.setValue(request.value());
        config.setDescription(request.description());
        config.setUpdatedBy(userId);

        return mapConfigToDTO(systemConfigRepository.save(config));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponseDTO> getAuditLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size))
                .map(this::mapAuditLogToDTO);
    }

    private SystemConfigResponseDTO mapConfigToDTO(SystemConfig c) {
        String username = null;
        if (c.getUpdatedBy() != null) {
            username = userRepository.findById(c.getUpdatedBy()).map(User::getUsername).orElse("Unknown");
        }
        return new SystemConfigResponseDTO(
                c.getId(), c.getKey(), c.getValue(), c.getDescription(),
                c.getUpdatedAt(), c.getUpdatedBy(), username, c.getVersion()
        );
    }

    private AuditLogResponseDTO mapAuditLogToDTO(AuditLog a) {
        String username = userRepository.findById(a.getUserId()).map(User::getUsername).orElse("Unknown");
        return new AuditLogResponseDTO(
                a.getId(), a.getAction(), a.getEntityName(), a.getEntityId(),
                a.getTimestamp(), a.getUserId(), username, a.getOldValue(), a.getNewValue()
        );
    }
}
