package com.readwise.ai.modules.notes.repository;

import com.readwise.ai.modules.notes.entity.UserNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<UserNote, Long> {
    List<UserNote> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<UserNote> findByUserIdAndArticleIdOrderByCreatedAtDesc(Long userId, Long articleId);
    long countByUserId(Long userId);
}
