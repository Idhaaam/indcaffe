package com.indcaffe.controller;

import com.indcaffe.dto.CheckoutRequestDTO;
import com.indcaffe.dto.OrderResponseDTO;
import com.indcaffe.entity.OrderStatus;
import com.indcaffe.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    @PreAuthorize("hasAnyAuthority('ROLE_PELANGGAN', 'ROLE_MITRA')")
    public ResponseEntity<OrderResponseDTO> checkout(@Valid @RequestBody CheckoutRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.checkout(request, auth.getName()));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyAuthority('ROLE_PELANGGAN', 'ROLE_MITRA')")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.getMyOrders(auth.getName()));
    }

    @GetMapping("/cafe")
    @PreAuthorize("hasAuthority('ROLE_CAFE')")
    public ResponseEntity<List<OrderResponseDTO>> getCafeOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.getCafeOrders(auth.getName()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_CAFE')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam(required = false) OrderStatus status,
            @RequestBody(required = false) Map<String, String> body) {
        
        OrderStatus newStatus = status;
        if (newStatus == null && body != null && body.containsKey("status")) {
            newStatus = OrderStatus.valueOf(body.get("status"));
        }
        
        if (newStatus == null) {
            return ResponseEntity.badRequest().build();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.updateOrderStatus(id, newStatus, auth.getName()));
    }
}
