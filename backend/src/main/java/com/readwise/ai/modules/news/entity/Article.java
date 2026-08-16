package com.readwise.ai.modules.news.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "articles", indexes = {
    @Index(name = "idx_article_category", columnList = "category"),
    @Index(name = "idx_article_published_at", columnList = "published_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id")
    private String sourceId;

    @Column(name = "source_name")
    private String sourceName;

    private String author;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String url;

    @Column(name = "url_to_image", columnDefinition = "TEXT")
    private String urlToImage;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 50)
    private String category;

    @Column(name = "read_time_minutes")
    @Builder.Default
    private Integer readTimeMinutes = 3;

    @Column(name = "summary_bullet_1", columnDefinition = "TEXT")
    private String summaryBullet1;

    @Column(name = "summary_bullet_2", columnDefinition = "TEXT")
    private String summaryBullet2;

    @Column(name = "summary_bullet_3", columnDefinition = "TEXT")
    private String summaryBullet3;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
