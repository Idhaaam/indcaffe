package com.indcaffe.service;

import com.indcaffe.dto.*;
import java.util.List;

public interface PelangganService {
    List<DonasiTersediaDTO> getDonasiTersedia();
    List<RiwayatKlaimDTO> getRiwayatKlaim(Long pelangganId);
    ClaimResponseDTO klaimDonasi(ClaimRequestDTO request, Long pelangganId);
    ClaimResponseDTO batalkanKlaim(Long id, Long pelangganId);
    ProfilPelangganDTO getProfil(Long pelangganId);
    ProfilPelangganDTO updateProfil(Long pelangganId, ProfilPelangganDTO request);
}
