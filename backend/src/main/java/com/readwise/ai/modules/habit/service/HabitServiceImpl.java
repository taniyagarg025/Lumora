package com.readwise.ai.modules.habit.service;

import com.readwise.ai.common.exception.ResourceNotFoundException;
import com.readwise.ai.modules.auth.entity.User;
import com.readwise.ai.modules.auth.repository.UserRepository;
import com.readwise.ai.modules.habit.dto.*;
import com.readwise.ai.modules.habit.entity.ReadingLog;
import com.readwise.ai.modules.habit.entity.UserStreak;
import com.readwise.ai.modules.habit.repository.ReadingLogRepository;
import com.readwise.ai.modules.habit.repository.UserStreakRepository;
import com.readwise.ai.modules.news.entity.Article;
import com.readwise.ai.modules.news.repository.ArticleRepository;
import com.readwise.ai.modules.quiz.repository.UserQuizAttemptRepository;
import com.readwise.ai.modules.vocabulary.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HabitServiceImpl implements HabitService {

    private final UserStreakRepository streakRepository;
    private final ReadingLogRepository logRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final VocabularyRepository vocabularyRepository;
    private final UserQuizAttemptRepository quizAttemptRepository;

    @Override
    @Transactional
    public ReadingStreakDto getStreakInfo(String userEmail) {
        User user = getUser(userEmail);
        UserStreak streak = streakRepository.findByUserId(user.getId())
                .orElseGet(() -> UserStreak.builder().user(user).currentStreak(0).longestStreak(0).build());

        LocalDate today = LocalDate.now();
        LocalDate lastRead = streak.getLastReadDate();

        // Update streak logic for daily sign-in/check-in
        if (lastRead == null) {
            streak.setCurrentStreak(1);
            streak.setLastReadDate(today);
        } else if (lastRead.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            streak.setLastReadDate(today);
        } else if (lastRead.isBefore(today.minusDays(1))) {
            streak.setCurrentStreak(1);
            streak.setLastReadDate(today);
        }
        
        streak.setLongestStreak(Math.max(streak.getLongestStreak(), streak.getCurrentStreak()));
        streakRepository.save(streak);

        boolean isActive = streak.getLastReadDate() != null && 
                (!streak.getLastReadDate().isBefore(today.minusDays(1)));

        return ReadingStreakDto.builder()
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .lastReadDate(streak.getLastReadDate())
                .isStreakActive(isActive)
                .build();
    }

    @Override
    @Transactional
    public void logArticleRead(String userEmail, Long articleId, Integer durationSeconds) {
        User user = getUser(userEmail);
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article", "id", articleId));

        LocalDate today = LocalDate.now();
        int seconds = (durationSeconds != null && durationSeconds > 0) ? durationSeconds : 180;

        if (!logRepository.existsByUserIdAndArticleIdAndReadDate(user.getId(), articleId, today)) {
            ReadingLog logEntry = ReadingLog.builder()
                    .user(user)
                    .article(article)
                    .readDurationSeconds(seconds)
                    .readDate(today)
                    .build();
            logRepository.save(logEntry);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatsDto getUserDashboardStats(String userEmail) {
        User user = getUser(userEmail);
        Long userId = user.getId();

        UserStreak streak = streakRepository.findByUserId(userId)
                .orElse(UserStreak.builder().user(user).currentStreak(0).longestStreak(0).build());

        long totalArticles = logRepository.countByUserId(userId);
        long totalVocab = vocabularyRepository.countByUserId(userId);
        long totalQuizzes = quizAttemptRepository.countByUserId(userId);

        // Generate 30-day activity heatmap data
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(29);

        List<ReadingLog> recentLogs = logRepository.findByUserIdAndReadDateGreaterThanEqual(userId, startDate);
        Map<LocalDate, Long> countByDate = recentLogs.stream()
                .collect(Collectors.groupingBy(ReadingLog::getReadDate, Collectors.counting()));

        List<DailyActivityDto> heatmap = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            int count = countByDate.getOrDefault(date, 0L).intValue();
            int intensity = count == 0 ? 0 : count == 1 ? 1 : count <= 3 ? 2 : 3;

            heatmap.add(DailyActivityDto.builder()
                    .date(date.toString())
                    .count(count)
                    .intensity(intensity)
                    .build());
        }

        Integer accuracy = quizAttemptRepository.calculateAverageAccuracy(userId);
        if (accuracy == null) accuracy = 0;

        return UserStatsDto.builder()
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .totalArticlesRead(totalArticles)
                .totalVocabularySaved(totalVocab)
                .totalQuizzesTaken(totalQuizzes)
                .quizPassRatePercentage(accuracy)
                .heatmap(heatmap)
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
