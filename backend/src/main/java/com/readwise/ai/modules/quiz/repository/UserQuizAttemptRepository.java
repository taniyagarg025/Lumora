package com.readwise.ai.modules.quiz.repository;

import com.readwise.ai.modules.quiz.entity.UserQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuizAttemptRepository extends JpaRepository<UserQuizAttempt, Long> {
    List<UserQuizAttempt> findByUserIdOrderByCompletedAtDesc(Long userId);
    long countByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT CASE WHEN SUM(u.totalQuestions) > 0 THEN CAST(SUM(u.score) * 100.0 / SUM(u.totalQuestions) AS int) ELSE 0 END FROM UserQuizAttempt u WHERE u.user.id = :userId")
    Integer calculateAverageAccuracy(Long userId);
}
