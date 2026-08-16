package com.readwise.ai.modules.news.client;

import com.readwise.ai.modules.news.entity.Article;

import java.util.List;

public interface NewsProviderStrategy {
    List<Article> fetchTopHeadlines(String category);
}
