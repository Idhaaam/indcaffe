package com.indcaffe.controller;

import com.indcaffe.dto.*;
import com.indcaffe.entity.User;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.service.ManagerService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;
    private final UserRepository userRepository;
    private final com.indcaffe.repository.SurplusPostRepository surplusPostRepository;
    private final com.indcaffe.repository.CafeRepository cafeRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        return currentUser.getId();
    }

    // --- DASHBOARD ---
    @GetMapping("/dashboard")
    public ResponseEntity<ManagerDashboardDTO> getDashboard() {
        return ResponseEntity.ok(managerService.getDashboardSummary());
    }

    // --- APPROVAL DONASI ---
    @PutMapping("/donations/{id}/approve")
    public ResponseEntity<SurplusPostResponseDTO> approveDonation(@PathVariable Long id) {
        Long managerId = getCurrentUserId();
        return ResponseEntity.ok(managerService.approveDonation(id, managerId));
    }

    @PutMapping("/donations/{id}/reject")
    public ResponseEntity<SurplusPostResponseDTO> rejectDonation(@PathVariable Long id) {
        Long managerId = getCurrentUserId();
        return ResponseEntity.ok(managerService.rejectDonation(id, managerId));
    }

    // --- LAPORAN ---
    @GetMapping("/reports/donations")
    public ResponseEntity<Page<SurplusPostResponseDTO>> getDonationReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(managerService.getDonationReport(page, size));
    }

    @GetMapping("/reports/waste")
    public ResponseEntity<org.springframework.data.domain.Page<SurplusPostResponseDTO>> getWasteReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(managerService.getWasteReport(page, size));
    }

    @GetMapping("/opname-approval")
    public ResponseEntity<java.util.List<OpnameApprovalResponseDTO>> getPendingOpnameApprovals() {
        return ResponseEntity.ok(managerService.getPendingOpnameApprovals());
    }

    @PutMapping("/opname-approval/{id}/setujui")
    public ResponseEntity<OpnameApprovalResponseDTO> approveOpname(@PathVariable Long id, @RequestBody(required = false) OpnameApprovalRequestDTO request) {
        Long managerId = getCurrentUserId();
        return ResponseEntity.ok(managerService.approveOpname(id, managerId, request));
    }

    @PutMapping("/opname-approval/{id}/tolak")
    public ResponseEntity<OpnameApprovalResponseDTO> rejectOpname(@PathVariable Long id, @RequestBody(required = false) OpnameApprovalRequestDTO request) {
        Long managerId = getCurrentUserId();
        return ResponseEntity.ok(managerService.rejectOpname(id, managerId, request));
    }

    // --- NOTIFIKASI STOK ---
    @GetMapping("/notifications/stock-alerts")
    public ResponseEntity<List<StockAlertDTO>> getStockAlerts() {
        return ResponseEntity.ok(managerService.getStockAlerts());
    }

    // --- ANALYTICS ---
    @GetMapping("/analytics")
    public ResponseEntity<ManagerAnalyticsResponseDTO> getAnalytics() {
        Double totalSurplusSaved = surplusPostRepository.sumQuantityByStatus(com.indcaffe.entity.SurplusStatus.SELESAI);
        if (totalSurplusSaved == null) totalSurplusSaved = 0.0;
        
        Double totalValue = surplusPostRepository.sumValueByStatus(com.indcaffe.entity.SurplusStatus.SELESAI);
        if (totalValue == null) totalValue = 0.0;

        long activeCafesCount = cafeRepository.count();
        
        java.time.LocalDateTime startOfMonth = java.time.LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        long newUsersCount = userRepository.countByCreatedAtAfter(startOfMonth);

        // Dynamic Chart data
        List<Object[]> rawPieData = surplusPostRepository.getPieChartData();
        List<java.util.Map<String, Object>> pieChartData = new java.util.ArrayList<>();
        for (Object[] row : rawPieData) {
            pieChartData.add(java.util.Map.of("name", String.valueOf(row[0]), "value", ((Number) row[1]).longValue()));
        }

        String[] monthNames = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        List<Object[]> rawBarData = surplusPostRepository.getBarChartData();
        List<java.util.Map<String, Object>> barChartData = new java.util.ArrayList<>();
        for (Object[] row : rawBarData) {
            int monthIdx = ((Number) row[0]).intValue();
            String mName = (monthIdx >= 1 && monthIdx <= 12) ? monthNames[monthIdx] : "Unknown";
            barChartData.add(java.util.Map.of("name", mName, "surplus", ((Number) row[1]).longValue(), "value", ((Number) row[2]).doubleValue()));
        }

        List<Object[]> rawLineData = userRepository.getLineChartData();
        List<java.util.Map<String, Object>> lineChartData = new java.util.ArrayList<>();
        for (Object[] row : rawLineData) {
            int monthIdx = ((Number) row[0]).intValue();
            String mName = (monthIdx >= 1 && monthIdx <= 12) ? monthNames[monthIdx] : "Unknown";
            lineChartData.add(java.util.Map.of("name", mName, "pengguna", ((Number) row[1]).longValue()));
        }

        ManagerAnalyticsResponseDTO response = ManagerAnalyticsResponseDTO.builder()
                .totalSurplusSaved(totalSurplusSaved)
                .totalValue(totalValue)
                .activeCafesCount(activeCafesCount)
                .newUsersCount(newUsersCount)
                .pieChartData(pieChartData)
                .barChartData(barChartData)
                .lineChartData(lineChartData)
                .build();

        return ResponseEntity.ok(response);
    }
}
