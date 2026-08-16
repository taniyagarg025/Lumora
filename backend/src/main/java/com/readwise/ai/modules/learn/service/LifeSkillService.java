package com.readwise.ai.modules.learn.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwise.ai.modules.ai.client.GeminiApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LifeSkillService {

    private final GeminiApiClient geminiApiClient;
    private final ObjectMapper objectMapper;

    public Map<String, Object> generateLifeSkill(String topic) {
        log.info("Generating life skill lesson for topic: {}", topic);
        
        String prompt = "Generate a comprehensive life skill lesson on the following topic: " + topic + ".\n" +
                "Format the response strictly as a JSON object with the following structure:\n" +
                "{\n" +
                "  \"title\": \"Title of the lesson\",\n" +
                "  \"summary\": \"A short engaging summary of why this skill is important\",\n" +
                "  \"sections\": [\n" +
                "    {\n" +
                "      \"heading\": \"Section heading\",\n" +
                "      \"content\": \"Detailed explanation for this section.\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"actionableAdvice\": \"One clear, practical piece of advice the user can apply today.\"\n" +
                "}\n" +
                "Ensure the output is pure JSON without Markdown code blocks.";

        String rawJson = geminiApiClient.generateContent(prompt);
        
        try {
            return objectMapper.readValue(rawJson.replace("```json", "").replace("```", "").trim(), Map.class);
        } catch (Exception e) {
            log.error("Failed to parse Gemini response for life skill: {}", e.getMessage());
            throw new RuntimeException("Failed to generate life skill content", e);
        }
    }
}
