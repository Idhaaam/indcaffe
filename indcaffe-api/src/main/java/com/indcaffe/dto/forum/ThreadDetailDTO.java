package com.indcaffe.dto.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreadDetailDTO {
    private Long id;
    private String title;
    private String content;
    private String category;
    private String authorName;
    private LocalDateTime createdAt;
    private List<ReplyDTO> replies;
}
