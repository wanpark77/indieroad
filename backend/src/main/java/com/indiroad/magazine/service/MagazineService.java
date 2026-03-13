package com.indiroad.magazine.service;

import com.indiroad.magazine.dto.MagazineArticleResponse;
import com.indiroad.magazine.entity.MagazineArticle;
import com.indiroad.magazine.repository.MagazineRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MagazineService {

    private final MagazineRepository magazineRepository;

    public List<MagazineArticleResponse> getArticles(String category) {
        List<MagazineArticle> articles;

        if (StringUtils.hasText(category)) {
            try {
                MagazineArticle.Category cat = MagazineArticle.Category.valueOf(category.toUpperCase());
                articles = magazineRepository.findByCategory(cat);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("올바르지 않은 카테고리입니다. (INTERVIEW, PLAYLIST, PRODUCT, NEWS, CONCERT)");
            }
        } else {
            articles = magazineRepository.findAll();
        }

        return articles.stream()
                .map(MagazineArticleResponse::summary)
                .collect(Collectors.toList());
    }

    @Transactional
    public MagazineArticleResponse getArticleBySlug(String slug) {
        MagazineArticle article = magazineRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("아티클을 찾을 수 없습니다."));
        article.setViews(article.getViews() + 1);
        return MagazineArticleResponse.from(article);
    }

    @Transactional
    public int toggleLike(String slug) {
        MagazineArticle article = magazineRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("아티클을 찾을 수 없습니다."));
        article.setLikes(article.getLikes() + 1);
        return article.getLikes();
    }
}
