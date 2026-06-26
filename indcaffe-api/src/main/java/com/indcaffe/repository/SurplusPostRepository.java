package com.indcaffe.repository;

import com.indcaffe.entity.SurplusPost;
import com.indcaffe.entity.SurplusStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SurplusPostRepository extends JpaRepository<SurplusPost, Long> {
    List<SurplusPost> findByCafeId(Long cafeId);
    List<SurplusPost> findByStatus(SurplusStatus status);
    List<SurplusPost> findByClaimedById(Long mitraId);

    long countByStatus(SurplusStatus status);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s WHERE s.id = :id")
    java.util.Optional<SurplusPost> findByIdWithPessimisticLock(@org.springframework.data.repository.query.Param("id") Long id);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s JOIN FETCH s.product JOIN FETCH s.cafe LEFT JOIN FETCH s.claimedBy LEFT JOIN FETCH s.approvedBy")
    org.springframework.data.domain.Page<SurplusPost> findAllWithFetch(org.springframework.data.domain.Pageable pageable);
}
