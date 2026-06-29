package com.indcaffe.service;

import com.indcaffe.dto.CheckoutRequestDTO;
import com.indcaffe.dto.OrderItemRequestDTO;
import com.indcaffe.dto.OrderItemResponseDTO;
import com.indcaffe.dto.OrderResponseDTO;
import com.indcaffe.entity.*;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.OrderRepository;
import com.indcaffe.repository.PelangganRepository;
import com.indcaffe.repository.MitraRepository;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.repository.CafeRepository;
import com.indcaffe.repository.SurplusPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PelangganRepository pelangganRepository;
    private final MitraRepository mitraRepository;
    private final UserRepository userRepository;
    private final CafeRepository cafeRepository;
    private final SurplusPostRepository surplusPostRepository;

    @Override
    @Transactional
    public OrderResponseDTO checkout(CheckoutRequestDTO request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        Order order = new Order();
        if ("PELANGGAN".equals(user.getRole().name())) {
            Pelanggan pelanggan = pelangganRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pelanggan tidak ditemukan"));
            order.setPelanggan(pelanggan);
        } else if ("MITRA".equals(user.getRole().name())) {
            Mitra mitra = mitraRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mitra tidak ditemukan"));
            order.setMitra(mitra);
        } else {
            throw new IllegalArgumentException("Hanya Pelanggan dan Mitra yang dapat membuat order");
        }

        order.setDeliveryMethod(request.deliveryMethod());
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus(OrderStatus.PENDING);
        
        double totalAmount = 0.0;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequestDTO itemDto : request.items()) {
            SurplusPost surplusPost = surplusPostRepository.findById(itemDto.surplusPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));
            
            if (surplusPost.getQuantity() < itemDto.quantity()) {
                throw new IllegalArgumentException("Stok tidak mencukupi untuk " + surplusPost.getProduct().getName());
            }

            // Decrement quantity and handle optimistic locking
            surplusPost.setQuantity(surplusPost.getQuantity() - itemDto.quantity());
            
            // If quantity becomes 0, we can update status
            if (surplusPost.getQuantity() == 0) {
                surplusPost.setStatus(SurplusStatus.SELESAI);
            }
            
            surplusPostRepository.save(surplusPost); // Persist updated stock

            Double itemPrice = surplusPost.getPrice() != null ? surplusPost.getPrice() : 0.0;
            totalAmount += (itemPrice * itemDto.quantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setSurplusPost(surplusPost);
            orderItem.setQuantity(itemDto.quantity());
            orderItem.setPrice(itemPrice);

            items.add(orderItem);
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getMyOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        if ("PELANGGAN".equals(user.getRole().name())) {
            Pelanggan pelanggan = pelangganRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pelanggan tidak ditemukan"));
            return orderRepository.findByPelangganId(pelanggan.getId()).stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else if ("MITRA".equals(user.getRole().name())) {
            Mitra mitra = mitraRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mitra tidak ditemukan"));
            return orderRepository.findByMitraId(mitra.getId()).stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("User role not supported for my-orders");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getCafeOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        
        Cafe cafe = cafeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cafe tidak ditemukan"));
                
        return orderRepository.findByCafeId(cafe.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, OrderStatus status, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        
        Cafe cafe = cafeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cafe tidak ditemukan"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order tidak ditemukan"));
        
        // Verify cafe ownership
        boolean isOwner = order.getItems().stream()
                .anyMatch(item -> item.getSurplusPost().getProduct().getCafe().getId().equals(cafe.getId()));
                
        if (!isOwner) {
            throw new IllegalArgumentException("Anda tidak berhak mengubah status order ini");
        }
        
        order.setStatus(status);
        orderRepository.save(order);
        return mapToDTO(order);
    }

    private OrderResponseDTO mapToDTO(Order order) {
        Long pelangganId = order.getPelanggan() != null ? order.getPelanggan().getId() : null;
        Long mitraId = order.getMitra() != null ? order.getMitra().getId() : null;
        
        String buyerName = null;
        if (order.getPelanggan() != null) {
            buyerName = order.getPelanggan().getNamaLengkap();
        } else if (order.getMitra() != null) {
            buyerName = order.getMitra().getName();
        }
        
        Long cafeId = null;
        String cafeName = null;
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            Cafe cafe = order.getItems().get(0).getSurplusPost().getProduct().getCafe();
            if (cafe != null) {
                cafeId = cafe.getId();
                cafeName = cafe.getName();
            }
        }

        List<OrderItemResponseDTO> itemDTOs = new ArrayList<>();
        if (order.getItems() != null) {
            itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemResponseDTO(
                    item.getId(),
                    item.getSurplusPost().getProduct().getId(),
                    item.getSurplusPost().getProduct().getName(),
                    item.getQuantity(),
                    item.getPrice()
                )).collect(Collectors.toList());
        }

        return new OrderResponseDTO(
                order.getId(),
                pelangganId,
                mitraId,
                cafeId,
                cafeName,
                buyerName,
                order.getTotalAmount(),
                order.getDeliveryMethod(),
                order.getPaymentMethod(),
                order.getStatus(),
                order.getOrderDate(),
                itemDTOs
        );
    }
}
