package com.indiroad.feedback.dto;

import com.indiroad.feedback.entity.FeedbackSubmission;
import com.indiroad.feedback.entity.FeedbackTrack;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FeedbackSubmissionResponse {

    private Long id;
    private Long trackId;
    private String trackTitle;
    private String trackArtist;
    private Long userId;
    private String impression;
    private String highlights;
    private String improvements;
    private String status;
    private LocalDateTime submittedAt;
    private Integer reward;

    public static FeedbackSubmissionResponse from(FeedbackSubmission submission) {
        return FeedbackSubmissionResponse.builder()
                .id(submission.getId())
                .trackId(submission.getTrackId())
                .userId(submission.getUserId())
                .impression(submission.getImpression())
                .highlights(submission.getHighlights())
                .improvements(submission.getImprovements())
                .status(submission.getStatus().name())
                .submittedAt(submission.getSubmittedAt())
                .reward(submission.getReward())
                .build();
    }

    public static FeedbackSubmissionResponse from(FeedbackSubmission submission, FeedbackTrack track) {
        return FeedbackSubmissionResponse.builder()
                .id(submission.getId())
                .trackId(submission.getTrackId())
                .trackTitle(track != null ? track.getTitle() : null)
                .trackArtist(track != null ? track.getArtist() : null)
                .userId(submission.getUserId())
                .impression(submission.getImpression())
                .highlights(submission.getHighlights())
                .improvements(submission.getImprovements())
                .status(submission.getStatus().name())
                .submittedAt(submission.getSubmittedAt())
                .reward(submission.getReward())
                .build();
    }
}
