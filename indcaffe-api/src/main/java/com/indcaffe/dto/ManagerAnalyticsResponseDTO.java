package com.indcaffe.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ManagerAnalyticsResponseDTO {
    private Double totalSurplusSaved;
    private Double totalValue;
    private Long activeCafesCount;
    private Long newUsersCount;
    
    // Chart data
    private List<Map<String, Object>> pieChartData;
    private List<Map<String, Object>> barChartData;
}
