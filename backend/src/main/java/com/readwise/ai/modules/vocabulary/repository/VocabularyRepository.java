package com.readwise.ai.modules.vocabulary.repository;

import com.readwise.ai.modules.vocabulary.entity.UserVocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VocabularyRepository extends JpaRepository<UserVocabulary, Long> {

    List<UserVocabulary> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<UserVocabulary> findByUserIdAndIsMasteredOrderByCreatedAtDesc(Long userId, Boolean isMastered);

    Optional<UserVocabulary> findByUserIdAndWord(Long userId, String word);

    boolean existsByUserIdAndWord(Long userId, String word);

    long countByUserId(Long userId);

    long countByUserIdAndIsMastered(Long userId, Boolean isMastered);
}
