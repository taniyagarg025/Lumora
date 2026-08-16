package com.readwise.ai.modules.notes.entity;

import com.readwise.ai.modules.auth.entity.User;
import com.readwise.ai.modules.news.entity.Article;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(name = "highlighted_text", nullable = false, columnDefinition = "TEXT")
    private String highlightedText;

    @Column(name = "note_content", columnDefinition = "TEXT")
    private String noteContent;

    @Column(name = "color_tag", length = 20)
    @Builder.Default
    private String colorTag = "yellow"; // yellow, emerald, indigo, purple, rose

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
