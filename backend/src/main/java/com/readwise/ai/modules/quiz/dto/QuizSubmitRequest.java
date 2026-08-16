package com.readwise.ai.modules.quiz.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class QuizSubmitRequest {

    @NotNull(message = "Answers map is required")
    private Map<Long, String> answers; // QuestionId -> SelectedOption ('A', 'B', 'C', 'D')
}
