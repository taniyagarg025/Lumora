package com.readwise.ai.modules.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSimplifyResponse {

    private String simplifiedText;
    private String readingLevel;
}
