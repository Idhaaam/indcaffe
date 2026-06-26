package com.indcaffe.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "opname_approvals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpnameApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String namaProduct;

    @Column(nullable = false)
    private Double stokSistem;

    @Column(nullable = false)
    private Double stokFisik;

    @Column(nullable = false)
    private Double selisihPersen;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Long requestedBy;

    private Long reviewedBy;

    private LocalDateTime reviewedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }
}
