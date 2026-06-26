package com.indcaffe.repository;

import com.indcaffe.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByProductCafeId(Long cafeId);
    List<StockTransaction> findByProductId(Long productId);
}
