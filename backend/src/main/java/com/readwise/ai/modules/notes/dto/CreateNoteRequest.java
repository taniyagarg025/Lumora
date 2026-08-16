package com.readwise.ai.modules.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNoteRequest {

    @NotNull(message = "Article ID is required")
    private Long articleId;

    @NotBlank(message = "Highlighted text is required")
    private String highlightedText;

    private String noteContent;
    private String colorTag = "yellow";
}
