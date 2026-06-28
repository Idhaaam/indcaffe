package com.indcaffe.repository;

import com.indcaffe.entity.SurplusPost;
import com.indcaffe.entity.SurplusStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SurplusPostRepository extends JpaRepository<SurplusPost, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s JOIN FETCH s.product p JOIN FETCH p.category JOIN FETCH s.cafe LEFT JOIN FETCH s.claimedBy LEFT JOIN FETCH s.approvedBy WHERE s.cafe.id = :cafeId")
    List<SurplusPost> findByCafeId(@org.springframework.data.repository.query.Param("cafeId") Long cafeId);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s JOIN FETCH s.product p JOIN FETCH p.category JOIN FETCH s.cafe LEFT JOIN FETCH s.claimedBy LEFT JOIN FETCH s.approvedBy WHERE s.status = :status")
    List<SurplusPost> findByStatus(@org.springframework.data.repository.query.Param("status") SurplusStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s JOIN FETCH s.product p JOIN FETCH p.category JOIN FETCH s.cafe LEFT JOIN FETCH s.claimedBy LEFT JOIN FETCH s.approvedBy WHERE s.claimedBy.id = :mitraId")
    List<SurplusPost> findByClaimedById(@org.springframework.data.repository.query.Param("mitraId") Long mitraId);

    long countByStatus(SurplusStatus status);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s WHERE s.id = :id")
    java.util.Optional<SurplusPost> findByIdWithPessimisticLock(@org.springframework.data.repository.query.Param("id") Long id);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s JOIN FETCH s.product JOIN FETCH s.cafe LEFT JOIN FETCH s.claimedBy LEFT JOIN FETCH s.approvedBy")
    org.springframework.data.domain.Page<SurplusPost> findAllWithFetch(org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SurplusPost s JOIN FETCH s.product p JOIN FETCH p.category JOIN FETCH s.cafe LEFT JOIN FETCH s.claimedBy LEFT JOIN FETCH s.approvedBy")
    List<SurplusPost> findAllWithEagerFetch();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(s.quantity) FROM SurplusPost s WHERE s.status = :status")
    Double sumQuantityByStatus(@org.springframework.data.repository.query.Param("status") SurplusStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(s.price * s.quantity) FROM SurplusPost s WHERE s.status = :status")
    Double sumValueByStatus(@org.springframework.data.repository.query.Param("status") SurplusStatus status);

    @org.springframework.data.jpa.repository.Query(value = "SELECT c.name, COUNT(sp.id) FROM surplus_posts sp JOIN products p ON sp.product_id = p.id JOIN categories c ON p.category_id = c.id WHERE sp.status = 'SELESAI' GROUP BY c.name", nativeQuery = true)
    List<Object[]> getPieChartData();

    @org.springframework.data.jpa.repository.Query(value = "SELECT MONTH(sp.created_at) as month, SUM(sp.quantity) as surplus, SUM(sp.price * sp.quantity) as value FROM surplus_posts sp WHERE sp.status = 'SELESAI' AND YEAR(sp.created_at) = YEAR(CURDATE()) GROUP BY MONTH(sp.created_at) ORDER BY month ASC", nativeQuery = true)
    List<Object[]> getBarChartData();
}
