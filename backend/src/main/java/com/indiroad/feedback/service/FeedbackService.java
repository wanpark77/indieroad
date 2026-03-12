package com.indiroad.feedback.service;

import com.indiroad.feedback.dto.FeedbackSubmissionRequest;
import com.indiroad.feedback.dto.FeedbackSubmissionResponse;
import com.indiroad.feedback.dto.FeedbackTrackRequest;
import com.indiroad.feedback.dto.FeedbackTrackResponse;
import com.indiroad.feedback.entity.FeedbackSubmission;
import com.indiroad.feedback.entity.FeedbackTrack;
import com.indiroad.feedback.repository.FeedbackSubmissionRepository;
import com.indiroad.feedback.repository.FeedbackTrackRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedbackService {

    private final FeedbackTrackRepository trackRepository;
    private final FeedbackSubmissionRepository submissionRepository;

    public List<FeedbackTrackResponse> getTracks(String status) {
        List<FeedbackTrack> tracks;

        if (StringUtils.hasText(status)) {
            try {
                FeedbackTrack.Status trackStatus = FeedbackTrack.Status.valueOf(status.toUpperCase());
                tracks = trackRepository.findByStatus(trackStatus);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("올바르지 않은 상태입니다. (OPEN, CLOSED)");
            }
        } else {
            tracks = trackRepository.findAll();
        }

        return tracks.stream()
                .map(FeedbackTrackResponse::from)
                .collect(Collectors.toList());
    }

    public FeedbackTrackResponse getTrack(Long id) {
        FeedbackTrack track = findTrackById(id);
        return FeedbackTrackResponse.from(track);
    }

    @Transactional
    public void applyForFeedback(Long trackId, Long userId) {
        FeedbackTrack track = findTrackById(trackId);

        if (track.getStatus() == FeedbackTrack.Status.CLOSED) {
            throw new IllegalStateException("마감된 피드백 트랙입니다.");
        }

        if (submissionRepository.existsByTrackIdAndUserId(trackId, userId)) {
            throw new IllegalStateException("이미 신청한 피드백 트랙입니다.");
        }

        if (track.getMaxApplicants() != null && track.getApplicants() >= track.getMaxApplicants()) {
            throw new IllegalStateException("최대 신청 인원을 초과했습니다.");
        }

        track.setApplicants(track.getApplicants() + 1);

        if (track.getMaxApplicants() != null && track.getApplicants() >= track.getMaxApplicants()) {
            track.setStatus(FeedbackTrack.Status.CLOSED);
        }
    }

    @Transactional
    public FeedbackSubmissionResponse submitFeedback(Long trackId, Long userId, FeedbackSubmissionRequest request) {
        FeedbackTrack track = findTrackById(trackId);

        int rewardCount = (track.getMaxApplicants() != null && track.getMaxApplicants() > 0)
                ? track.getMaxApplicants() : 1;
        int perPersonReward = track.getReward() / rewardCount;

        FeedbackSubmission submission = FeedbackSubmission.builder()
                .trackId(trackId)
                .userId(userId)
                .impression(request.getImpression())
                .highlights(request.getHighlights())
                .improvements(request.getImprovements())
                .reward(perPersonReward)
                .build();

        return FeedbackSubmissionResponse.from(submissionRepository.save(submission));
    }

    public List<FeedbackSubmissionResponse> getTrackSubmissions(Long trackId) {
        return submissionRepository
                .findByTrackIdAndStatusIn(trackId, List.of(FeedbackSubmission.Status.APPROVED, FeedbackSubmission.Status.REJECTED))
                .stream()
                .map(FeedbackSubmissionResponse::from)
                .collect(Collectors.toList());
    }

    public List<FeedbackSubmissionResponse> getMyTrackSubmissions(Long trackId, Long userId) {
        FeedbackTrack track = findTrackById(trackId);
        if (!userId.equals(track.getUserId())) {
            throw new IllegalStateException("본인의 트랙만 조회할 수 있습니다.");
        }
        return submissionRepository.findByTrackId(trackId).stream()
                .map(FeedbackSubmissionResponse::from)
                .collect(Collectors.toList());
    }

    public List<FeedbackSubmissionResponse> getMySubmissions(Long userId) {
        return submissionRepository.findByUserId(userId).stream()
                .map(submission -> {
                    FeedbackTrack track = trackRepository.findById(submission.getTrackId()).orElse(null);
                    return FeedbackSubmissionResponse.from(submission, track);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackTrackResponse createTrack(FeedbackTrackRequest request, Long userId) {
        FeedbackTrack track = FeedbackTrack.builder()
                .title(request.getTitle())
                .artist(request.getArtist())
                .duration(request.getDuration())
                .genre(request.getGenre())
                .reward(request.getReward())
                .maxApplicants(request.getMaxApplicants())
                .description(request.getDescription())
                .userId(userId)
                .build();
        return FeedbackTrackResponse.from(trackRepository.save(track));
    }

    public List<FeedbackTrackResponse> getMyTracks(Long userId) {
        return trackRepository.findByUserId(userId).stream()
                .map(FeedbackTrackResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackTrackResponse updateMyTrack(Long trackId, Long userId, FeedbackTrackRequest request) {
        FeedbackTrack track = findTrackById(trackId);
        if (!userId.equals(track.getUserId())) {
            throw new IllegalStateException("본인이 등록한 곡만 수정할 수 있습니다.");
        }
        track.setTitle(request.getTitle());
        track.setArtist(request.getArtist());
        track.setDuration(request.getDuration());
        track.setGenre(request.getGenre());
        track.setReward(request.getReward());
        track.setMaxApplicants(request.getMaxApplicants());
        track.setDescription(request.getDescription());
        return FeedbackTrackResponse.from(trackRepository.save(track));
    }

    private FeedbackTrack findTrackById(Long id) {
        return trackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("피드백 트랙을 찾을 수 없습니다."));
    }
}
