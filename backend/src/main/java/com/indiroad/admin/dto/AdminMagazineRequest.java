package com.indiroad.admin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminMagazineRequest {
    private String slug;
    private String title;
    private String category;
    private String categoryLabel;
    private String summary;
    private String coverColor;
    private String author;
    private String date;
    private String content;
}
