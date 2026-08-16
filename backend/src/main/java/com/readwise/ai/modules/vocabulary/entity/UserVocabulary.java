package com.readwise.ai.modules.vocabulary.entity;

import com.readwise.ai.modules.auth.entity.User;
import com.readwise.ai.modules.news.entity.Article;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_vocabulary", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_word", columnNames = {"user_id", "word"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private Article article;

    @Column(nullable = false, length = 100)
    private String word;

    @Column(length = 100)
    private String phonetics;

    @Column(name = "part_of_speech", length = 50)
    private String partOfSpeech;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String definition;

    @Column(name = "context_sentence", columnDefinition = "TEXT")
    private String contextSentence;

    @Column(name = "is_mastered")
    @Builder.Default
    private Boolean isMastered = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
