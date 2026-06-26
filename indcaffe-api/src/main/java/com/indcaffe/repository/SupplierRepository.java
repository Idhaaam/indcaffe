package com.indcaffe.repository;

import com.indcaffe.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByCafeId(Long cafeId);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Supplier s JOIN FETCH s.cafe")
    List<Supplier> findAllWithFetch();
}
