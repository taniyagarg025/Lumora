package com.readwise.ai.modules.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExtractedWordDto {
    private String word;
    private String phonetics;
    private String partOfSpeech;
    private String definition;
    private String contextSentence;
}
