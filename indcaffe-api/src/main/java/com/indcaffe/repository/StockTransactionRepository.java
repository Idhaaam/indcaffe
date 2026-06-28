package com.indcaffe.repository;

import com.indcaffe.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT st FROM StockTransaction st JOIN FETCH st.product p JOIN FETCH p.category WHERE p.cafe.id = :cafeId")
    List<StockTransaction> findByProductCafeId(@org.springframework.data.repository.query.Param("cafeId") Long cafeId);

    @org.springframework.data.jpa.repository.Query("SELECT st FROM StockTransaction st JOIN FETCH st.product p JOIN FETCH p.category WHERE p.id = :productId")
    List<StockTransaction> findByProductId(@org.springframework.data.repository.query.Param("productId") Long productId);
}
