package com.indcaffe.service;

import com.indcaffe.dto.*;
import com.indcaffe.entity.Product;
import com.indcaffe.entity.SurplusPost;
import com.indcaffe.entity.StockTransaction;

import java.util.List;

public interface GudangService {
    StockTransaction inputBarangMasuk(BarangMasukDTO request, Long userId);
    StockTransaction inputBarangKeluar(BarangKeluarDTO request, Long userId);
    List<Product> getExpiryAlert();
    Object stockOpname(StockOpnameDTO request, Long userId);
    SurplusPost tandaiSiapDonasi(Long productId, SiapDonasiDTO request, Long userId);
    List<Product> getStokRealTime();
}
