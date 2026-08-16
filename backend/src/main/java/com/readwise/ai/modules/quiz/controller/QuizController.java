package com.readwise.ai.modules.quiz.controller;

import com.readwise.ai.common.dto.ApiResponse;
import com.readwise.ai.modules.quiz.dto.*;
import com.readwise.ai.modules.quiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/article/{articleId}")
    public ResponseEntity<ApiResponse<QuizDto>> getOrGenerateQuiz(@PathVariable Long articleId) {
        QuizDto quiz = quizService.getOrGenerateQuizForArticle(articleId);
        return ResponseEntity.ok(ApiResponse.success(quiz, "Quiz generated successfully"));
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<ApiResponse<QuizResultDto>> submitQuiz(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long quizId,
            @Valid @RequestBody QuizSubmitRequest request
    ) {
        QuizResultDto result = quizService.submitQuiz(userDetails.getUsername(), quizId, request);
        return ResponseEntity.ok(ApiResponse.success(result, "Quiz evaluated successfully"));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<QuizResultDto>>> getUserQuizHistory(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<QuizResultDto> history = quizService.getUserQuizHistory(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(history, "Quiz attempt history retrieved"));
    }
}
