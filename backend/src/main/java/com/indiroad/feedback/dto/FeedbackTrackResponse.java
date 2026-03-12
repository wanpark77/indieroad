package com.indiroad.feedback.dto;

import com.indiroad.feedback.entity.FeedbackTrack;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FeedbackTrackResponse {

    private Long id;
    private String title;
    private String artist;
    private String genre;
    private String mood;
    private String description;
    private Integer reward;
    private String duration;
    private Integer applicants;
    private Integer maxApplicants;
    private String status;
    private Integer bpm;

    public static FeedbackTrackResponse from(FeedbackTrack track) {
        return FeedbackTrackResponse.builder()
                .id(track.getId())
                .title(track.getTitle())
                .artist(track.getArtist())
                .genre(track.getGenre())
                .mood(track.getMood())
                .description(track.getDescription())
                .reward(track.getReward())
                .duration(track.getDuration())
                .applicants(track.getApplicants())
                .maxApplicants(track.getMaxApplicants())
                .status(track.getStatus().name())
                .bpm(track.getBpm())
                .build();
    }
}
