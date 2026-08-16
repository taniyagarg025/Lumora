package com.readwise.ai.modules.vocabulary.service;

import com.readwise.ai.modules.vocabulary.dto.CreateVocabRequest;
import com.readwise.ai.modules.vocabulary.dto.VocabularyDto;

import java.util.List;

public interface VocabularyService {
    List<VocabularyDto> getUserVocabulary(String userEmail, Boolean isMastered);
    VocabularyDto saveWord(String userEmail, CreateVocabRequest request);
    VocabularyDto toggleMastered(String userEmail, Long vocabId);
    void deleteWord(String userEmail, Long vocabId);
}
