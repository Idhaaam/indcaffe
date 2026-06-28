package com.indcaffe.dto.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReplyRequestDTO {
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotNull(message = "Author ID is required")
    private Long authorId;
}
