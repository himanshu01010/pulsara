package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

// Matches Python ContentResponse schema exactly
public class ContentResponseDTO {

    private List<ArticleDTO> articles;

    @JsonProperty("skipped_duplicates")
    private int skippedDuplicates;

    @JsonProperty("total_processed")
    private int totalProcessed;

    // ── Getters & Setters ──────────────────────────────────

    public List<ArticleDTO> getArticles() {
        return articles;
    }

    public void setArticles(List<ArticleDTO> articles) {
        this.articles = articles;
    }

    public int getSkippedDuplicates() {
        return skippedDuplicates;
    }

    public void setSkippedDuplicates(int skippedDuplicates) {
        this.skippedDuplicates = skippedDuplicates;
    }

    public int getTotalProcessed() {
        return totalProcessed;
    }

    public void setTotalProcessed(int totalProcessed) {
        this.totalProcessed = totalProcessed;
    }
}