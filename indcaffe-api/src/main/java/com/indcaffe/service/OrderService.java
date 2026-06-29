package com.indcaffe.service;

import com.indcaffe.dto.CheckoutRequestDTO;
import com.indcaffe.dto.OrderResponseDTO;

import java.util.List;

import com.indcaffe.entity.OrderStatus;

public interface OrderService {
    OrderResponseDTO checkout(CheckoutRequestDTO request, String username);
    List<OrderResponseDTO> getMyOrders(String username);
    List<OrderResponseDTO> getCafeOrders(String username);
    OrderResponseDTO updateOrderStatus(Long orderId, OrderStatus status, String username);
}
