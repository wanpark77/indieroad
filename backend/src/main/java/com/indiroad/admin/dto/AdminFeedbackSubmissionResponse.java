package com.indiroad.admin.dto;

import com.indiroad.feedback.entity.FeedbackSubmission;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminFeedbackSubmissionResponse {

    private Long id;
    private Long trackId;
    private String trackTitle;
    private Long userId;
    private String submitterNickname;
    private String impression;
    private String highlights;
    private String improvements;
    private String status;
    private LocalDateTime submittedAt;
    private Integer reward;

    public static AdminFeedbackSubmissionResponse from(FeedbackSubmission submission, String trackTitle, String submitterNickname) {
        return AdminFeedbackSubmissionResponse.builder()
                .id(submission.getId())
                .trackId(submission.getTrackId())
                .trackTitle(trackTitle)
                .userId(submission.getUserId())
                .submitterNickname(submitterNickname)
                .impression(submission.getImpression())
                .highlights(submission.getHighlights())
                .improvements(submission.getImprovements())
                .status(submission.getStatus().name())
                .submittedAt(submission.getSubmittedAt())
                .reward(submission.getReward())
                .build();
    }
}
