package com.indiroad.feedback.repository;

import com.indiroad.feedback.entity.FeedbackTrack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackTrackRepository extends JpaRepository<FeedbackTrack, Long> {

    List<FeedbackTrack> findByStatus(FeedbackTrack.Status status);
    List<FeedbackTrack> findByUserId(Long userId);
}
