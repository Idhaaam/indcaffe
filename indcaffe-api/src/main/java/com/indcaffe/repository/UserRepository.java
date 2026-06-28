package com.indcaffe.repository;

import com.indcaffe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    long countByCreatedAtAfter(java.time.LocalDateTime date);

    @org.springframework.data.jpa.repository.Query(value = "SELECT MONTH(created_at) as month, COUNT(id) as pengguna FROM app_users WHERE YEAR(created_at) = YEAR(CURDATE()) GROUP BY MONTH(created_at) ORDER BY month ASC", nativeQuery = true)
    java.util.List<Object[]> getLineChartData();
}
