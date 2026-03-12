package com.indiroad.admin.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AdminDashboardResponse {

    private long totalMembers;
    private long totalMagazines;
    private long pendingFeedbacks;
    private long pendingPayouts;

    private List<RecentFeedbackItem> recentFeedbacks;
    private List<RecentMemberItem> recentMembers;

    @Getter
    @Builder
    public static class RecentFeedbackItem {
        private Long id;
        private String trackTitle;
        private String submitter;
        private String status;
        private String submittedAt;
    }

    @Getter
    @Builder
    public static class RecentMemberItem {
        private Long id;
        private String email;
        private String nickname;
        private String role;
        private String joinedAt;
    }
}
