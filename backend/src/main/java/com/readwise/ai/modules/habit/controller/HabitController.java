package com.readwise.ai.modules.habit.controller;

import com.readwise.ai.common.dto.ApiResponse;
import com.readwise.ai.modules.habit.dto.ReadingStreakDto;
import com.readwise.ai.modules.habit.dto.UserStatsDto;
import com.readwise.ai.modules.habit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/habit")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @GetMapping("/streak")
    public ResponseEntity<ApiResponse<ReadingStreakDto>> getStreak(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReadingStreakDto streak = habitService.getStreakInfo(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(streak, "Streak information retrieved"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<UserStatsDto>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserStatsDto stats = habitService.getUserDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(stats, "User dashboard statistics retrieved"));
    }

    @PostMapping("/log-read")
    public ResponseEntity<ApiResponse<Void>> logArticleRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long articleId,
            @RequestParam(required = false, defaultValue = "180") Integer duration
    ) {
        habitService.logArticleRead(userDetails.getUsername(), articleId, duration);
        return ResponseEntity.ok(ApiResponse.success(null, "Article reading logged successfully"));
    }
}
