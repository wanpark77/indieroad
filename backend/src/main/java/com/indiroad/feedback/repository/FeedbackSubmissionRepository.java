package com.indiroad.feedback.repository;

import com.indiroad.feedback.entity.FeedbackSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackSubmissionRepository extends JpaRepository<FeedbackSubmission, Long> {

    List<FeedbackSubmission> findByUserId(Long userId);

    boolean existsByTrackIdAndUserId(Long trackId, Long userId);

    int countByTrackId(Long trackId);
    List<FeedbackSubmission> findByTrackId(Long trackId);
    List<FeedbackSubmission> findByTrackIdAndStatus(Long trackId, FeedbackSubmission.Status status);
    List<FeedbackSubmission> findByTrackIdAndStatusIn(Long trackId, List<FeedbackSubmission.Status> statuses);
}
