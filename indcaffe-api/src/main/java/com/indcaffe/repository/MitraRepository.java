package com.indcaffe.repository;

import com.indcaffe.entity.Mitra;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MitraRepository extends JpaRepository<Mitra, Long> {
    Optional<Mitra> findByUserId(Long userId);
}
