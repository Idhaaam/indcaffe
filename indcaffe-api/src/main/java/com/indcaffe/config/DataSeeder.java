package com.indcaffe.config;

import com.indcaffe.entity.*;
import com.indcaffe.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CafeRepository cafeRepository;
    private final MitraRepository mitraRepository;
    private final PelangganRepository pelangganRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // Hanya seed SystemConfigs jika kosong
        if (systemConfigRepository.count() == 0) {
            System.out.println("⏳ Mulai seeding SystemConfig default...");
            
            // Perhatikan: Karena belum ada user (updatedBy = null) saat awal mula
            systemConfigRepository.save(new SystemConfig(null, "threshold_stok", "10", "Batas minimum stok", LocalDateTime.now(), null, 0L));
            systemConfigRepository.save(new SystemConfig(null, "expiry_alert_days", "7", "H-X Peringatan Kedaluwarsa", LocalDateTime.now(), null, 0L));
            systemConfigRepository.save(new SystemConfig(null, "donasi_approval_threshold", "50", "Batas kuantitas donasi butuh approval Manager", LocalDateTime.now(), null, 0L));
            
            System.out.println("✅ Data Seeding Konfigurasi Selesai!");
        } else {
            System.out.println("✅ Data Konfigurasi sudah ada, skipping seeding...");
        }
    }
}
