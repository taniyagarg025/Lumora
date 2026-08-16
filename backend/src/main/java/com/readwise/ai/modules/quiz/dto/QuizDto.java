package com.readwise.ai.modules.quiz.dto;

import com.readwise.ai.modules.quiz.entity.Quiz;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {

    private Long id;
    private Long articleId;
    private String articleTitle;
    private String title;
    private List<QuizQuestionDto> questions;

    public static QuizDto fromEntity(Quiz quiz) {
        return QuizDto.builder()
                .id(quiz.getId())
                .articleId(quiz.getArticle() != null ? quiz.getArticle().getId() : null)
                .articleTitle(quiz.getArticle() != null ? quiz.getArticle().getTitle() : null)
                .title(quiz.getTitle())
                .questions(quiz.getQuestions().stream().map(QuizQuestionDto::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
