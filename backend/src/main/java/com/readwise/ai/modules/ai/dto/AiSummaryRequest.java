package com.readwise.ai.modules.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiSummaryRequest {

    private Long articleId;

    @NotBlank(message = "Article text content is required")
    private String text;
}
