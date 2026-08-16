package com.readwise.ai.modules.vocabulary.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateVocabRequest {

    @NotBlank(message = "Word is required")
    private String word;

    private String phonetics;
    private String partOfSpeech;

    @NotBlank(message = "Definition is required")
    private String definition;

    private String contextSentence;
    private Long articleId;
}
