package com.indcaffe.controller;

import com.indcaffe.dto.ReviewRequestDTO;
import com.indcaffe.dto.ReviewResponseDTO;
import com.indcaffe.entity.Cafe;
import com.indcaffe.entity.Pelanggan;
import com.indcaffe.entity.Review;
import com.indcaffe.entity.User;
import com.indcaffe.repository.CafeRepository;
import com.indcaffe.repository.PelangganRepository;
import com.indcaffe.repository.ReviewRepository;
import com.indcaffe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CafeRepository cafeRepository;

    @Autowired
    private PelangganRepository pelangganRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/cafe/{cafeId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByCafe(@PathVariable Long cafeId) {
        List<Review> reviews = reviewRepository.findByCafeId(cafeId);
        List<ReviewResponseDTO> response = reviews.stream().map(r -> ReviewResponseDTO.builder()
                .id(r.getId())
                .cafeId(r.getCafe().getId())
                .cafeName(r.getCafe().getName())
                .pelangganId(r.getPelanggan().getId())
                .pelangganName(r.getPelanggan().getNamaLengkap())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(@RequestBody ReviewRequestDTO request) {
        Cafe cafe = cafeRepository.findById(request.getCafeId())
                .orElseThrow(() -> new RuntimeException("Cafe not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pelanggan pelanggan = pelangganRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Only Pelanggan can create reviews"));

        Review review = Review.builder()
                .cafe(cafe)
                .pelanggan(pelanggan)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        ReviewResponseDTO response = ReviewResponseDTO.builder()
                .id(savedReview.getId())
                .cafeId(savedReview.getCafe().getId())
                .cafeName(savedReview.getCafe().getName())
                .pelangganId(savedReview.getPelanggan().getId())
                .pelangganName(savedReview.getPelanggan().getNamaLengkap())
                .rating(savedReview.getRating())
                .comment(savedReview.getComment())
                .createdAt(savedReview.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }
}
