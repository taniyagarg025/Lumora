package com.readwise.ai.modules.habit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyActivityDto {
    private String date; // YYYY-MM-DD
    private Integer count; // Articles read on date
    private Integer intensity; // 0 (empty), 1 (light), 2 (medium), 3 (high)
}
