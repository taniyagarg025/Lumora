package com.readwise.ai.modules.habit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {

    private Integer currentStreak;
    private Integer longestStreak;
    private Long totalArticlesRead;
    private Long totalVocabularySaved;
    private Long totalQuizzesTaken;
    private Integer quizPassRatePercentage;
    private List<DailyActivityDto> heatmap;
}
