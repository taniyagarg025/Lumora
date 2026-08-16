package com.readwise.ai.modules.news.client;

import com.readwise.ai.modules.news.entity.Article;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component("toiNewsRssClient")
@RequiredArgsConstructor
public class ToiNewsRssClient implements NewsProviderStrategy {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final Map<String, String> TOI_RSS_URLS = new HashMap<>();

    static {
        TOI_RSS_URLS.put("all", "https://timesofindia.indiatimes.com/rssfeedstopstories.cms");
        TOI_RSS_URLS.put("technology", "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms");
        TOI_RSS_URLS.put("business", "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms");
        TOI_RSS_URLS.put("world", "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms");
        TOI_RSS_URLS.put("science", "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms");
        TOI_RSS_URLS.put("health", "https://timesofindia.indiatimes.com/rssfeedstopstories.cms");
    }

    @Override
    public List<Article> fetchTopHeadlines(String category) {
        String catKey = (category != null && !category.isBlank()) ? category.toLowerCase() : "all";
        String rssUrl = TOI_RSS_URLS.getOrDefault(catKey, TOI_RSS_URLS.get("all"));

        log.info("Fetching live Times of India (TOI) RSS news feed for category '{}' from: {}", catKey, rssUrl);
        List<Article> articles = new ArrayList<>();

        try {
            String xmlContent = restTemplate.getForObject(rssUrl, String.class);
            if (xmlContent != null && !xmlContent.isBlank()) {
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                factory.setNamespaceAware(false);
                factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", false);
                
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(new ByteArrayInputStream(xmlContent.getBytes(StandardCharsets.UTF_8)));

                NodeList items = doc.getElementsByTagName("item");
                for (int i = 0; i < Math.min(items.getLength(), 15); i++) {
                    Element item = (Element) items.item(i);

                    String title = getTagValue(item, "title");
                    String link = getTagValue(item, "link");
                    String description = cleanHtmlTags(getTagValue(item, "description"));
                    String imageUrl = extractImageUrl(item);

                    if (title != null && !title.isBlank() && link != null && !link.isBlank()) {
                        Article article = Article.builder()
                                .sourceId("times-of-india")
                                .sourceName("Times of India")
                                .author("Times of India News Network")
                                .title(title)
                                .description(description != null && !description.isBlank() ? description : title)
                                .url(link)
                                .urlToImage(imageUrl != null ? imageUrl : "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80")
                                .publishedAt(LocalDateTime.now().minusMinutes(i * 15))
                                .content(description != null && !description.isBlank() ? description : title)
                                .category(catKey.equals("all") ? "general" : catKey)
                                .readTimeMinutes(3)
                                .summaryBullet1("Live headline reported by Times of India (TOI).")
                                .summaryBullet2("Analyzed and structured for 10-minute daily reading.")
                                .summaryBullet3("Interactive Gemini AI summary and quiz ready.")
                                .build();

                        articles.add(article);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse Times of India RSS feed ({}): {}", rssUrl, e.getMessage());
        }

        return articles;
    }

    private String getTagValue(Element element, String tagName) {
        NodeList nodeList = element.getElementsByTagName(tagName);
        if (nodeList != null && nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return "";
    }

    private String extractImageUrl(Element element) {
        NodeList enclosure = element.getElementsByTagName("enclosure");
        if (enclosure != null && enclosure.getLength() > 0) {
            Element enc = (Element) enclosure.item(0);
            return enc.getAttribute("url");
        }
        return null;
    }

    private String cleanHtmlTags(String html) {
        if (html == null) return "";
        return html.replaceAll("<[^>]*>", "").trim();
    }
}
