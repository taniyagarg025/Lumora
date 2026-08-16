package com.readwise.ai.modules.news.controller;

import com.readwise.ai.common.dto.ApiResponse;
import com.readwise.ai.common.dto.PageResponse;
import com.readwise.ai.modules.news.dto.ArticleDto;
import com.readwise.ai.modules.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<PageResponse<ArticleDto>>> getNewsFeed(
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<ArticleDto> feed = newsService.getNewsFeed(category, q, page, size);
        return ResponseEntity.ok(ApiResponse.success(feed, "News feed retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArticleDto>> getArticleById(@PathVariable Long id) {
        ArticleDto article = newsService.getArticleById(id);
        return ResponseEntity.ok(ApiResponse.success(article, "Article retrieved successfully"));
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<Void>> syncNewsFeed(@RequestParam(defaultValue = "all") String category) {
        newsService.syncNewsFeed(category);
        return ResponseEntity.ok(ApiResponse.success(null, "News feed sync completed for category: " + category));
    }
}
