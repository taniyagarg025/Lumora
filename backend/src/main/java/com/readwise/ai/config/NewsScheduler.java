package com.readwise.ai.config;

import com.readwise.ai.modules.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class NewsScheduler {

    private final NewsService newsService;

    /**
     * Automatically fetches fresh live Times of India (TOI) headlines every morning at 6:00 AM.
     */
    @Scheduled(cron = "0 0 6 * * *")
    public void scheduleDailyNewsSync() {
        log.info("Cron trigger: Starting daily Times of India (TOI) news headlines sync...");
        newsService.syncNewsFeed("all");
        newsService.syncNewsFeed("technology");
        newsService.syncNewsFeed("business");
        newsService.syncNewsFeed("world");
        log.info("Daily Times of India news sync completed successfully.");
    }
}
