package com.indcaffe.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CheckoutRequestDTO(
    @NotEmpty(message = "Daftar barang tidak boleh kosong")
    List<OrderItemRequestDTO> items,

    @NotNull(message = "Metode pengiriman tidak boleh kosong")
    String deliveryMethod,

    @NotNull(message = "Metode pembayaran tidak boleh kosong")
    String paymentMethod
) {}
