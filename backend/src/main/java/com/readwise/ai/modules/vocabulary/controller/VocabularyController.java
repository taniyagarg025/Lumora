package com.readwise.ai.modules.vocabulary.controller;

import com.readwise.ai.common.dto.ApiResponse;
import com.readwise.ai.modules.vocabulary.dto.CreateVocabRequest;
import com.readwise.ai.modules.vocabulary.dto.VocabularyDto;
import com.readwise.ai.modules.vocabulary.service.VocabularyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vocabulary")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VocabularyDto>>> getUserVocabulary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Boolean isMastered
    ) {
        List<VocabularyDto> list = vocabularyService.getUserVocabulary(userDetails.getUsername(), isMastered);
        return ResponseEntity.ok(ApiResponse.success(list, "Vocabulary list retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VocabularyDto>> saveWord(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateVocabRequest request
    ) {
        VocabularyDto response = vocabularyService.saveWord(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Word added to Vocabulary Vault"));
    }

    @PatchMapping("/{vocabId}/master")
    public ResponseEntity<ApiResponse<VocabularyDto>> toggleMastered(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long vocabId
    ) {
        VocabularyDto response = vocabularyService.toggleMastered(userDetails.getUsername(), vocabId);
        return ResponseEntity.ok(ApiResponse.success(response, "Vocabulary mastery status updated"));
    }

    @DeleteMapping("/{vocabId}")
    public ResponseEntity<ApiResponse<Void>> deleteWord(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long vocabId
    ) {
        vocabularyService.deleteWord(userDetails.getUsername(), vocabId);
        return ResponseEntity.ok(ApiResponse.success(null, "Word removed from vault"));
    }
}
