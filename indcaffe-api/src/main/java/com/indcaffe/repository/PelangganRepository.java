package com.indcaffe.repository;

import com.indcaffe.entity.Pelanggan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PelangganRepository extends JpaRepository<Pelanggan, Long> {
    Optional<Pelanggan> findByUserId(Long userId);
    boolean existsByEmail(String email);
}
