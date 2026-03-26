package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.ArticleEntity;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity,Long> {
    List<ArticleEntity> findByTag(String tag);

    boolean existsByHeadline(String headline);

    
}