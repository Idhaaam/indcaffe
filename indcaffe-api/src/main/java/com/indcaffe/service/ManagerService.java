package com.indcaffe.service;

import com.indcaffe.dto.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ManagerService {
    ManagerDashboardDTO getDashboardSummary();
    SurplusPostResponseDTO approveDonation(Long id, Long managerId);
    SurplusPostResponseDTO rejectDonation(Long id, Long managerId);
    Page<SurplusPostResponseDTO> getDonationReport(int page, int size);
    Page<SurplusPostResponseDTO> getWasteReport(int page, int size);
    List<StockAlertDTO> getStockAlerts();
    List<OpnameApprovalResponseDTO> getPendingOpnameApprovals();
    OpnameApprovalResponseDTO approveOpname(Long id, Long managerId, OpnameApprovalRequestDTO request);
    OpnameApprovalResponseDTO rejectOpname(Long id, Long managerId, OpnameApprovalRequestDTO request);
}
