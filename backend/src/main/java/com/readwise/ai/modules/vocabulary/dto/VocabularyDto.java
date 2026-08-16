package com.readwise.ai.modules.vocabulary.dto;

import com.readwise.ai.modules.vocabulary.entity.UserVocabulary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyDto {

    private Long id;
    private Long articleId;
    private String articleTitle;
    private String word;
    private String phonetics;
    private String partOfSpeech;
    private String definition;
    private String contextSentence;
    private Boolean isMastered;
    private LocalDateTime createdAt;

    public static VocabularyDto fromEntity(UserVocabulary vocab) {
        return VocabularyDto.builder()
                .id(vocab.getId())
                .articleId(vocab.getArticle() != null ? vocab.getArticle().getId() : null)
                .articleTitle(vocab.getArticle() != null ? vocab.getArticle().getTitle() : null)
                .word(vocab.getWord())
                .phonetics(vocab.getPhonetics())
                .partOfSpeech(vocab.getPartOfSpeech())
                .definition(vocab.getDefinition())
                .contextSentence(vocab.getContextSentence())
                .isMastered(vocab.getIsMastered())
                .createdAt(vocab.getCreatedAt())
                .build();
    }
}
