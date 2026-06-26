package com.indcaffe.repository;

import com.indcaffe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByCafeId(Long cafeId);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Category c JOIN FETCH c.cafe")
    List<Category> findAllWithFetch();
}
