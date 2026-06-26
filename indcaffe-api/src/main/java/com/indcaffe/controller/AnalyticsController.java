package com.indcaffe.controller;

import com.indcaffe.repository.ProductRepository;
import com.indcaffe.repository.SurplusPostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class AnalyticsController {

    private final ProductRepository productRepository;
    private final SurplusPostRepository surplusPostRepository;

    @GetMapping("/cafe/{cafeId}")
    public ResponseEntity<?> getAnalytics(@PathVariable Long cafeId) {
        long totalProducts = productRepository.findByCafeId(cafeId).size();
        
        var surplusPosts = surplusPostRepository.findByCafeId(cafeId);
        long totalSurplusPosts = surplusPosts.size();
        
        double totalWasteSaved = surplusPosts.stream()
            .filter(post -> "CLAIMED".equals(post.getStatus().name()) || "PICKED_UP".equals(post.getStatus().name()))
            .mapToDouble(post -> post.getQuantity() != null ? post.getQuantity() : 0.0)
            .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalSurplusPosts", totalSurplusPosts);
        stats.put("totalWasteSavedKg", totalWasteSaved);
        
        return ResponseEntity.ok(stats);
    }
}
