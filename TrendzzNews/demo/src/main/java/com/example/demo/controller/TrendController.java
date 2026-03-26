package com.example.demo.controller;
import com.example.demo.entity.ArticleEntity;
import com.example.demo.service.ArticleService;
import com.example.demo.service.Trendservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trends")
public class TrendController {

    private final Trendservice trendService;
    private final ArticleService articleService;

    public TrendController(Trendservice trendService, ArticleService articleService) {
        this.trendService = trendService;
        this.articleService = articleService;
    }
    
    @GetMapping
    public List<String> getTrends() {
        return trendService.fetchTrends();
    }
   //task:2) //Aotomate for a time using crons
    @PostMapping("/generate-and-save")
    public ResponseEntity<Map<String, Object>> generateAndSave(){
                try {
            ArticleService.SaveResult result = articleService.fetchAndSaveArticles();
 
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "trends_fetched", result.totalTrendsFetched,
                "articles_saved", result.savedCount,
                "skipped_duplicates_python", result.skippedDuplicatesPython,
                "skipped_duplicates_db", result.skippedDuplicatesDB
            ));
 
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }


    @GetMapping("/articles")
    public List<ArticleEntity> getAllArticles() {
        return articleService.getAllArticles();
    }
 
    // ── 4. Get articles by tag ──────────────────────────────
 
    @GetMapping("/articles/{tag}")
    public List<ArticleEntity> getArticlesByTag(@PathVariable String tag) {
        return articleService.getArticlesByTag(tag);
    }

     // ── Manually clear trends cache (force fresh scrape) ────

    @PostMapping("/refresh-cache")
    public ResponseEntity<Map<String, Object>> refreshCache() {
        trendService.evictTrendsCache();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Trends cache cleared. Next call will scrape fresh data."
        ));
    }
    @GetMapping("/test")
    public String getArticlesByTag() {
        return "test";
    }

}