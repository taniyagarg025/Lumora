package com.readwise.ai.modules.habit.repository;

import com.readwise.ai.modules.habit.entity.ReadingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReadingLogRepository extends JpaRepository<ReadingLog, Long> {

    List<ReadingLog> findByUserIdAndReadDate(Long userId, LocalDate readDate);

    List<ReadingLog> findByUserIdAndReadDateGreaterThanEqual(Long userId, LocalDate startDate);

    long countByUserId(Long userId);

    boolean existsByUserIdAndArticleIdAndReadDate(Long userId, Long articleId, LocalDate readDate);
}
