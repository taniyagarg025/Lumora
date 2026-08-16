package com.readwise.ai.modules.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class AiSimplifyRequest {

    @NotBlank(message = "Text is required")
    private String text;

    private String targetLevel = "SIMPLE"; // SIMPLE (ELI5), STANDARD, ADVANCED
}
