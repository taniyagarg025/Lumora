package com.readwise.ai.modules.news.dto;

import com.readwise.ai.modules.news.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {

    private Long id;
    private String sourceId;
    private String sourceName;
    private String author;
    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private LocalDateTime publishedAt;
    private String content;
    private String category;
    private Integer readTimeMinutes;
    private List<String> aiSummary;

    public static ArticleDto fromEntity(Article article) {
        List<String> summary = null;
        if (article.getSummaryBullet1() != null) {
            summary = List.of(
                    article.getSummaryBullet1(),
                    article.getSummaryBullet2() != null ? article.getSummaryBullet2() : "",
                    article.getSummaryBullet3() != null ? article.getSummaryBullet3() : ""
            );
        }

        return ArticleDto.builder()
                .id(article.getId())
                .sourceId(article.getSourceId())
                .sourceName(article.getSourceName())
                .author(article.getAuthor())
                .title(article.getTitle())
                .description(article.getDescription())
                .url(article.getUrl())
                .urlToImage(article.getUrlToImage())
                .publishedAt(article.getPublishedAt())
                .content(article.getContent())
                .category(article.getCategory())
                .readTimeMinutes(article.getReadTimeMinutes() != null ? article.getReadTimeMinutes() : 3)
                .aiSummary(summary)
                .build();
    }
}
