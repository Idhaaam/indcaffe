package com.indcaffe.dto;

import java.util.List;

public record ManagerDashboardDTO(
    Long totalProducts,
    Double totalStock,
    Long criticalStockCount,
    Long pendingDonationsCount,
    List<CafeSummaryDTO> cafeSummaries
) {}
