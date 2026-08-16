package com.readwise.ai.modules.habit.repository;

import com.readwise.ai.modules.habit.entity.UserStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreak, Long> {

    Optional<UserStreak> findByUserId(Long userId);

    Optional<UserStreak> findByUserEmail(String email);
}
