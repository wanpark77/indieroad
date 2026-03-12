package com.indiroad.feedback.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FeedbackTrackRequest {
    private String title;
    private String artist;
    private String duration;
    private String genre;
    private Integer reward;
    private Integer maxApplicants;
    private String description;
}
