package com.readwise.ai.modules.quiz.service;

import com.readwise.ai.modules.quiz.dto.*;

import java.util.List;

public interface QuizService {
    QuizDto getOrGenerateQuizForArticle(Long articleId);
    QuizResultDto submitQuiz(String userEmail, Long quizId, QuizSubmitRequest request);
    List<QuizResultDto> getUserQuizHistory(String userEmail);
}
