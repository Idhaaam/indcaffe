package com.indcaffe.controller;

import com.indcaffe.entity.Cafe;
import com.indcaffe.repository.CafeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/master/cafes")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ProfileController {

    private final CafeRepository cafeRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getCafeProfile(@PathVariable Long id) {
        return cafeRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CAFE')")
    public ResponseEntity<?> updateCafeProfile(@PathVariable Long id, @RequestBody Cafe cafeDetails) {
        return cafeRepository.findById(id)
            .map(cafe -> {
                cafe.setName(cafeDetails.getName());
                cafe.setAddress(cafeDetails.getAddress());
                cafe.setCity(cafeDetails.getCity());
                return ResponseEntity.ok(cafeRepository.save(cafe));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
