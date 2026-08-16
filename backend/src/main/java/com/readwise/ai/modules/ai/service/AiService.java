package com.readwise.ai.modules.ai.service;

import com.readwise.ai.modules.ai.dto.*;

public interface AiService {
    AiSummaryResponse generateSummary(Long articleId, String text);
    AiSimplifyResponse simplifyText(String text, String level);
    AiVocabResponse extractVocabulary(String text);
    AiEntityResponse extractEntities(String text);
}
