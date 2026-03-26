package com.example.demo.scrapper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.List;

public class TrendsScraper {

    public List<String> getTrends() {

        List<String> trendsList = new ArrayList<>();

        try {
            String url = "https://trends24.in/india/";

            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            Elements trends = doc.select("ol li");

            for (Element trend : trends) {
                trendsList.add(trend.text());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return trendsList;
    }
}
