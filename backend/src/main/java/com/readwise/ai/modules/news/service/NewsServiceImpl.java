package com.readwise.ai.modules.news.service;

import com.readwise.ai.common.dto.PageResponse;
import com.readwise.ai.common.exception.ResourceNotFoundException;
import com.readwise.ai.modules.news.client.NewsProviderStrategy;
import com.readwise.ai.modules.news.dto.ArticleDto;
import com.readwise.ai.modules.news.entity.Article;
import com.readwise.ai.modules.news.repository.ArticleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final ArticleRepository articleRepository;
    private final NewsProviderStrategy newsProviderStrategy;

    /**
     * On startup: wipe the old curated/stale articles and seed fresh live RSS data
     * from all configured sources (BBC, Al Jazeera, The Hindu, NDTV, India Today, TOI, NPR, ABC...).
     */
    @PostConstruct
    public void initMultiSourceFeed() {
        try {
            log.info("🗑️  Clearing old articles and seeding fresh multi-source live news feed...");
            articleRepository.deleteAll();          // Remove stale curated data so real RSS articles appear
            syncNewsFeed("all");
        } catch (Exception e) {
            log.warn("⚠️  Startup news seed failed: {}", e.getMessage());
        }
    }

    /**
     * Refresh ALL news categories automatically every 30 minutes
     * so the feed always shows the latest headlines.
     */
    @Scheduled(fixedDelay = 30 * 60 * 1000)   // every 30 minutes
    @Transactional
    public void scheduledFeedRefresh() {
        log.info("⏰ Scheduled refresh: pulling latest headlines from all sources...");
        for (String cat : List.of("all", "technology", "business", "science", "health", "sports", "world", "india")) {
            try {
                syncNewsFeed(cat);
            } catch (Exception e) {
                log.warn("⚠️  Scheduled sync failed for category '{}': {}", cat, e.getMessage());
            }
        }
    }

    @Override
    @Transactional
    public PageResponse<ArticleDto> getNewsFeed(String category, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articlePage;

        // Re-seed if DB is very low
        if (articleRepository.count() < 5) {
            syncNewsFeed("all");
        }

        if (query != null && !query.isBlank()) {
            articlePage = articleRepository.searchArticles(query.trim(), pageable);
        } else if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            articlePage = articleRepository.findByCategoryIgnoreCaseOrderByPublishedAtDesc(category.trim(), pageable);
            if (articlePage.isEmpty()) {
                syncNewsFeed(category);
                articlePage = articleRepository.findByCategoryIgnoreCaseOrderByPublishedAtDesc(category.trim(), pageable);
            }
        } else {
            articlePage = articleRepository.findAllByOrderByPublishedAtDesc(pageable);
        }

        Page<ArticleDto> dtoPage = articlePage.map(ArticleDto::fromEntity);
        return PageResponse.from(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public ArticleDto getArticleById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article", "id", id));
        return ArticleDto.fromEntity(article);
    }

    @Override
    @Transactional
    public void syncNewsFeed(String category) {
        log.info("🔄 Syncing live news for category: '{}'", category);

        List<Article> fetched = newsProviderStrategy.fetchTopHeadlines(category);
        int added = 0;
        if (fetched != null) {
            for (Article article : fetched) {
                try {
                    if (!articleRepository.existsByUrl(article.getUrl())) {
                        articleRepository.save(article);
                        added++;
                    }
                } catch (Exception e) {
                    log.debug("Skipped duplicate article: {}", article.getUrl());
                }
            }
        }
        log.info("✅ Synced {} new articles for category: '{}'", added, category);
    }
}
