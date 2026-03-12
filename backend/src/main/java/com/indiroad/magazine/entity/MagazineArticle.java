package com.indiroad.magazine.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "magazine_articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MagazineArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    private String categoryLabel;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String coverColor;
    private String coverImageUrl;
    private String author;
    private LocalDate date;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Integer likes = 0;

    @Builder.Default
    private Integer commentsCount = 0;

    @Column(columnDefinition = "TEXT")
    private String content;

    public enum Category {
        INTERVIEW, PLAYLIST, PRODUCT, NEWS, CONCERT
    }
}
