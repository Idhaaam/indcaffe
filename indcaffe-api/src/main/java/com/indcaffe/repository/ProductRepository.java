package com.indcaffe.repository;

import com.indcaffe.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCafeId(Long cafeId);
    List<Product> findByCategoryId(Long categoryId);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p JOIN FETCH p.category JOIN FETCH p.cafe LEFT JOIN FETCH p.supplier")
    List<Product> findAllWithFetch();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(p.currentStock) FROM Product p")
    Double sumAllStock();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock < :threshold")
    Long countCriticalStock(@org.springframework.data.repository.query.Param("threshold") Double threshold);

    @org.springframework.data.jpa.repository.Query("SELECT new com.indcaffe.dto.CafeSummaryDTO(p.cafe.id, p.cafe.name, COUNT(p.id), SUM(p.currentStock)) FROM Product p GROUP BY p.cafe.id, p.cafe.name")
    List<com.indcaffe.dto.CafeSummaryDTO> getCafeStockSummaries();

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p JOIN FETCH p.cafe WHERE p.currentStock < :threshold")
    List<Product> findCriticalStocks(@org.springframework.data.repository.query.Param("threshold") Double threshold);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p JOIN FETCH p.cafe WHERE p.expiryDate BETWEEN :startDate AND :endDate")
    List<Product> findExpiryAlerts(
        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate, 
        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );
}
