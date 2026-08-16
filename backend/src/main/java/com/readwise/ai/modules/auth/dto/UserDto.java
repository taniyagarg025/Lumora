package com.readwise.ai.modules.auth.dto;

import com.readwise.ai.modules.auth.entity.Role;
import com.readwise.ai.modules.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private Integer dailyGoalMinutes;
    private LocalDateTime createdAt;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .dailyGoalMinutes(user.getDailyGoalMinutes())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
