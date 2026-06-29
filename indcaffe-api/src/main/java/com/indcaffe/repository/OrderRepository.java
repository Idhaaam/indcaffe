package com.indcaffe.repository;

import com.indcaffe.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByPelangganId(Long pelangganId);
    List<Order> findByMitraId(Long mitraId);
    
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i JOIN i.surplusPost sp JOIN sp.product p WHERE p.cafe.id = :cafeId")
    List<Order> findByCafeId(@Param("cafeId") Long cafeId);
}
