package com.indiroad.feedback.controller;

import com.indiroad.common.ApiResponse;
import com.indiroad.feedback.dto.FeedbackSubmissionRequest;
import com.indiroad.feedback.dto.FeedbackSubmissionResponse;
import com.indiroad.feedback.dto.FeedbackTrackRequest;
import com.indiroad.feedback.dto.FeedbackTrackResponse;
import com.indiroad.feedback.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback", description = "피드백 API")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping("/tracks")
    @Operation(summary = "피드백 트랙 목록 조회", description = "status 필터: OPEN, CLOSED")
    public ResponseEntity<ApiResponse<List<FeedbackTrackResponse>>> getTracks(
            @Parameter(description = "상태 필터")
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getTracks(status)));
    }

    @GetMapping("/tracks/{id}")
    @Operation(summary = "피드백 트랙 상세 조회")
    public ResponseEntity<ApiResponse<FeedbackTrackResponse>> getTrack(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getTrack(id)));
    }

    @PostMapping("/apply")
    @Operation(summary = "피드백 트랙 신청 등록 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FeedbackTrackResponse>> createTrack(
            @RequestBody FeedbackTrackRequest request,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("피드백 신청이 완료되었습니다.", feedbackService.createTrack(request, userId)));
    }

    @GetMapping("/my-tracks")
    @Operation(summary = "내가 신청한 피드백 트랙 목록 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<FeedbackTrackResponse>>> getMyTracks(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getMyTracks(userId)));
    }

    @PutMapping("/my-tracks/{id}")
    @Operation(summary = "내 피드백 트랙 수정 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FeedbackTrackResponse>> updateMyTrack(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId,
            @RequestBody FeedbackTrackRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("수정되었습니다.", feedbackService.updateMyTrack(id, userId, request)));
    }

    @GetMapping("/tracks/{id}/submissions")
    @Operation(summary = "트랙의 승인된 피드백 목록 조회 (공개)")
    public ResponseEntity<ApiResponse<List<FeedbackSubmissionResponse>>> getTrackSubmissions(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getTrackSubmissions(id)));
    }

    @PostMapping("/tracks/{id}/apply")
    @Operation(summary = "피드백 신청 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Map<String, String>>> applyForFeedback(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        feedbackService.applyForFeedback(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("피드백 신청이 완료되었습니다.", Map.of("status", "applied")));
    }

    @PostMapping("/tracks/{trackId}/submit")
    @Operation(summary = "피드백 제출 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FeedbackSubmissionResponse>> submitFeedback(
            @PathVariable Long trackId,
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody FeedbackSubmissionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("피드백이 제출되었습니다.", feedbackService.submitFeedback(trackId, userId, request)));
    }

    @GetMapping("/my-tracks/{trackId}/submissions")
    @Operation(summary = "내 트랙의 피드백 전체 조회 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<FeedbackSubmissionResponse>>> getMyTrackSubmissions(
            @PathVariable Long trackId,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getMyTrackSubmissions(trackId, userId)));
    }

    @GetMapping("/my")
    @Operation(summary = "내 피드백 목록 조회 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<FeedbackSubmissionResponse>>> getMyFeedbacks(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getMySubmissions(userId)));
    }
}
