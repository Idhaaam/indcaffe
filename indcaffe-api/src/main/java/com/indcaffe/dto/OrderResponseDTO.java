package com.indcaffe.dto;

import com.indcaffe.entity.OrderStatus;
import java.time.LocalDateTime;

import java.util.List;

public record OrderResponseDTO(
    Long id,
    Long pelangganId,
    Long mitraId,
    Long cafeId,
    String cafeName,
    String buyerName,
    Double totalAmount,
    String deliveryMethod,
    String paymentMethod,
    OrderStatus status,
    LocalDateTime orderDate,
    List<OrderItemResponseDTO> items
) {}
