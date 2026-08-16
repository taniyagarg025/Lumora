package com.readwise.ai.modules.habit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadingStreakDto {

    private Integer currentStreak;
    private Integer longestStreak;
    private LocalDate lastReadDate;
    private Boolean isStreakActive;
}
