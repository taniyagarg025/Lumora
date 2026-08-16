package com.readwise.ai.modules.news.service;

import com.readwise.ai.common.dto.PageResponse;
import com.readwise.ai.modules.news.dto.ArticleDto;

public interface NewsService {
    PageResponse<ArticleDto> getNewsFeed(String category, String query, int page, int size);
    ArticleDto getArticleById(Long id);
    void syncNewsFeed(String category);
}
