package com.indcaffe.dto.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreadSummaryDTO {
    private Long id;
    private String title;
    private String category;
    private String authorName;
    private LocalDateTime createdAt;
    private long replyCount;
}
