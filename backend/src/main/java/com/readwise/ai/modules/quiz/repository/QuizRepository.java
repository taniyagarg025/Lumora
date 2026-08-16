package com.readwise.ai.modules.quiz.repository;

import com.readwise.ai.modules.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByArticleId(Long articleId);
    boolean existsByArticleId(Long articleId);
}
