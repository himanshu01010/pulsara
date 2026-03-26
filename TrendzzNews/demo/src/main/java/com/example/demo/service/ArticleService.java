package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.example.demo.client.PythonApiClient;
import com.example.demo.dto.ArticleDTO;
import com.example.demo.dto.ContentResponseDTO;
import com.example.demo.entity.ArticleEntity;
import com.example.demo.repository.ArticleRepository;
import org.springframework.cache.annotation.Cacheable;

@Service
public class ArticleService {
    private final PythonApiClient pythonApiClient;
    private final ArticleRepository articleRepository;
    private final Trendservice trendservice;

    public ArticleService(PythonApiClient pythonApiClient, ArticleRepository articleRepository, Trendservice trendservice){
        this.pythonApiClient=pythonApiClient;
        this.articleRepository=articleRepository;
        this.trendservice=trendservice;
    }

    @Caching(evict = {
        @CacheEvict(value = "allArticles", allEntries = true),
        @CacheEvict(value = "articleByTag", allEntries = true)
    })
    public SaveResult fetchAndSaveArticles(){
        List<String> trends = trendservice.fetchTrends();
        if(trends.isEmpty()){
            throw new RuntimeException("No trends fetched from scraper.");
        }

        ContentResponseDTO response = pythonApiClient.processTrends(trends);

        List<ArticleEntity> saved = new ArrayList<>();
        int skippedDuplicates= 0;

        for(ArticleDTO dto : response.getArticles()){
            if (articleRepository.existsByHeadline(dto.getHeadline())) {
                skippedDuplicates++;
                continue;
            }
            ArticleEntity entity = mapToEntity(dto);

            saved.add(articleRepository.save(entity));
        }

        return new SaveResult(
            saved.size(),
            skippedDuplicates,
            response.getSkippedDuplicates(),
            trends.size()
        );
    }


    @Cacheable(value = "allArticles", key = "'all'")
    public List<ArticleEntity> getAllArticles() {
        return articleRepository.findAll();
    }
    
    @Cacheable(value = "articlesByTag", key = "#tag")
    public List<ArticleEntity> getArticlesByTag(String tag) {
        return articleRepository.findByTag(tag);
    }


    private ArticleEntity mapToEntity(ArticleDTO dto){
        ArticleEntity entity = new ArticleEntity();
        entity.setTag(dto.getTag());
        entity.setHeadline(dto.getHeadline());
        entity.setSummary(dto.getSummary());
        entity.setBody(dto.getBody());
        entity.setImageUrl(dto.getImageUrl());
        entity.setImageQuery(dto.getImageQuery());
        return entity;
    }


    public static class SaveResult {
        public final int savedCount;
        public final int skippedDuplicatesDB;
        public final int skippedDuplicatesPython;
        public final int totalTrendsFetched;

        public SaveResult(int savedCount, int skippedDuplicatesDB, int skippedDuplicatesPython, int totalTrendsFetched){
            this.savedCount=savedCount;
            this.skippedDuplicatesDB=skippedDuplicatesDB;
            this.skippedDuplicatesPython=skippedDuplicatesPython;
            this.totalTrendsFetched=totalTrendsFetched;
        }
    
        
    }
    
}
