package com.readwise.ai.modules.ai.controller;

import com.readwise.ai.common.dto.ApiResponse;
import com.readwise.ai.modules.ai.dto.*;
import com.readwise.ai.modules.ai.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/summarize")
    public ResponseEntity<ApiResponse<AiSummaryResponse>> generateSummary(@Valid @RequestBody AiSummaryRequest request) {
        AiSummaryResponse response = aiService.generateSummary(request.getArticleId(), request.getText());
        return ResponseEntity.ok(ApiResponse.success(response, "AI 3-bullet summary generated successfully"));
    }

    @PostMapping("/simplify")
    public ResponseEntity<ApiResponse<AiSimplifyResponse>> simplifyText(@Valid @RequestBody AiSimplifyRequest request) {
        AiSimplifyResponse response = aiService.simplifyText(request.getText(), request.getTargetLevel());
        return ResponseEntity.ok(ApiResponse.success(response, "Text transformed to target reading level"));
    }

    @PostMapping("/extract-vocab")
    public ResponseEntity<ApiResponse<AiVocabResponse>> extractVocabulary(@RequestBody AiSummaryRequest request) {
        AiVocabResponse response = aiService.extractVocabulary(request.getText());
        return ResponseEntity.ok(ApiResponse.success(response, "Vocabulary extracted successfully"));
    }

    @PostMapping("/extract-entities")
    public ResponseEntity<ApiResponse<AiEntityResponse>> extractEntities(@RequestBody AiSummaryRequest request) {
        AiEntityResponse response = aiService.extractEntities(request.getText());
        return ResponseEntity.ok(ApiResponse.success(response, "Entities extracted successfully"));
    }
}
