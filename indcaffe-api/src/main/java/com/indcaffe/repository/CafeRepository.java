package com.indcaffe.repository;

import com.indcaffe.entity.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CafeRepository extends JpaRepository<Cafe, Long> {
    Optional<Cafe> findByUserId(Long userId);
}
