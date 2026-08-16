package com.readwise.ai.modules.habit.service;

import com.readwise.ai.modules.habit.dto.ReadingStreakDto;
import com.readwise.ai.modules.habit.dto.UserStatsDto;

public interface HabitService {
    ReadingStreakDto getStreakInfo(String userEmail);
    UserStatsDto getUserDashboardStats(String userEmail);
    void logArticleRead(String userEmail, Long articleId, Integer durationSeconds);
}
