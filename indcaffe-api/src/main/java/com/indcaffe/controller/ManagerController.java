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
@PreAuthorize("hasAuthority('MANAGER')")
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

        // Mocked chart data
        List<java.util.Map<String, Object>> pieChartData = java.util.Arrays.asList(
            java.util.Map.of("name", "Makanan Berat", "value", 400),
            java.util.Map.of("name", "Snack", "value", 300),
            java.util.Map.of("name", "Minuman", "value", 300)
        );

        List<java.util.Map<String, Object>> barChartData = java.util.Arrays.asList(
            java.util.Map.of("name", "Jan", "surplus", 4000, "value", 2400),
            java.util.Map.of("name", "Feb", "surplus", 3000, "value", 1398),
            java.util.Map.of("name", "Mar", "surplus", 2000, "value", 9800),
            java.util.Map.of("name", "Apr", "surplus", 2780, "value", 3908),
            java.util.Map.of("name", "May", "surplus", 1890, "value", 4800),
            java.util.Map.of("name", "Jun", "surplus", 2390, "value", 3800)
        );

        ManagerAnalyticsResponseDTO response = ManagerAnalyticsResponseDTO.builder()
                .totalSurplusSaved(totalSurplusSaved)
                .totalValue(totalValue)
                .activeCafesCount(activeCafesCount)
                .newUsersCount(newUsersCount)
                .pieChartData(pieChartData)
                .barChartData(barChartData)
                .build();

        return ResponseEntity.ok(response);
    }
}
