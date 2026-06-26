package com.indcaffe.repository;

import com.indcaffe.entity.OpnameApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OpnameApprovalRepository extends JpaRepository<OpnameApproval, Long> {
    Page<OpnameApproval> findAllByStatus(String status, Pageable pageable);
    List<OpnameApproval> findByProductIdAndStatus(Long productId, String status);
}
