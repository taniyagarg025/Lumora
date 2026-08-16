package com.readwise.ai.modules.news.repository;

import com.readwise.ai.modules.news.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    Page<Article> findByCategoryIgnoreCaseOrderByPublishedAtDesc(String category, Pageable pageable);

    Page<Article> findAllByOrderByPublishedAtDesc(Pageable pageable);

    @Query("SELECT a FROM Article a WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY a.publishedAt DESC")
    Page<Article> searchArticles(@Param("query") String query, Pageable pageable);

    boolean existsByUrl(String url);

    Optional<Article> findByUrl(String url);
}
