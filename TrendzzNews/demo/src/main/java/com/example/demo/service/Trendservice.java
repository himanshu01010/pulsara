package com.example.demo.service;


// import org.jsoup.Jsoup;
// import org.jsoup.nodes.Document;
// import org.jsoup.nodes.Element;
// import org.jsoup.select.Elements;


import com.example.demo.scrapper.TrendsScraper;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Trendservice {


    @Cacheable(value = "trends",key = "'india'")
    public List<String> fetchTrends() {
        System.out.println("[Cache MISS] Scraping trends24.in...");

        TrendsScraper scraper = new TrendsScraper();

        return scraper.getTrends();
    }


    @CacheEvict(value = "trends",key = "'india'")
    public void evictTrendsCache(){
        System.out.println("[Cache EVICT] Trends cache cleared.");
    }
}