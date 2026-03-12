package com.indiroad.magazine.dto;

import com.indiroad.magazine.entity.MagazineArticle;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MagazineArticleResponse {

    private Long id;
    private String slug;
    private String title;
    private String category;
    private String categoryLabel;
    private String summary;
    private String coverColor;
    private String coverImageUrl;
    private String author;
    private LocalDate date;
    private Integer views;
    private Integer likes;
    private Integer commentsCount;
    private String content;

    public static MagazineArticleResponse from(MagazineArticle article) {
        return MagazineArticleResponse.builder()
                .id(article.getId())
                .slug(article.getSlug())
                .title(article.getTitle())
                .category(article.getCategory().name())
                .categoryLabel(article.getCategoryLabel())
                .summary(article.getSummary())
                .coverColor(article.getCoverColor())
                .coverImageUrl(article.getCoverImageUrl())
                .author(article.getAuthor())
                .date(article.getDate())
                .views(article.getViews())
                .likes(article.getLikes())
                .commentsCount(article.getCommentsCount())
                .content(article.getContent())
                .build();
    }

    public static MagazineArticleResponse summary(MagazineArticle article) {
        return MagazineArticleResponse.builder()
                .id(article.getId())
                .slug(article.getSlug())
                .title(article.getTitle())
                .category(article.getCategory().name())
                .categoryLabel(article.getCategoryLabel())
                .summary(article.getSummary())
                .coverColor(article.getCoverColor())
                .coverImageUrl(article.getCoverImageUrl())
                .author(article.getAuthor())
                .date(article.getDate())
                .views(article.getViews())
                .likes(article.getLikes())
                .commentsCount(article.getCommentsCount())
                .build();
    }
}
