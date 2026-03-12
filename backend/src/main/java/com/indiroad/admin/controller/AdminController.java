package com.indiroad.admin.controller;

import com.indiroad.admin.dto.*;
import com.indiroad.admin.service.AdminService;
import com.indiroad.common.ApiResponse;
import com.indiroad.feedback.dto.FeedbackTrackResponse;
import com.indiroad.magazine.dto.MagazineArticleResponse;
import com.indiroad.storepromo.dto.PromoApplicationResponse;
import com.indiroad.storepromo.dto.StorePromoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ─── Dashboard ───────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboard()));
    }

    // ─── Members ──────────────────────────────────────────────────────────────────

    @GetMapping("/members")
    public ResponseEntity<ApiResponse<List<AdminMemberResponse>>> getMembers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getMembers()));
    }

    @PutMapping("/members/{id}/role")
    public ResponseEntity<ApiResponse<AdminMemberResponse>> updateRole(
            @PathVariable Long id,
            @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("역할이 변경되었습니다.", adminService.updateRole(id, request)));
    }

    @PutMapping("/members/{id}/points")
    public ResponseEntity<ApiResponse<AdminMemberResponse>> updatePoints(
            @PathVariable Long id,
            @RequestBody UpdatePointsRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("포인트가 지급/차감되었습니다.", adminService.updatePoints(id, request)));
    }

    // ─── Magazine ─────────────────────────────────────────────────────────────────

    @GetMapping("/magazine")
    public ResponseEntity<ApiResponse<List<MagazineArticleResponse>>> getMagazines() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getMagazines()));
    }

    @PostMapping("/magazine")
    public ResponseEntity<ApiResponse<MagazineArticleResponse>> createMagazine(
            @RequestBody AdminMagazineRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("매거진이 등록되었습니다.", adminService.createMagazine(request)));
    }

    @PutMapping("/magazine/{id}")
    public ResponseEntity<ApiResponse<MagazineArticleResponse>> updateMagazine(
            @PathVariable Long id,
            @RequestBody AdminMagazineRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("매거진이 수정되었습니다.", adminService.updateMagazine(id, request)));
    }

    @DeleteMapping("/magazine/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMagazine(@PathVariable Long id) {
        adminService.deleteMagazine(id);
        return ResponseEntity.ok(ApiResponse.ok("매거진이 삭제되었습니다."));
    }

    // ─── Feedback ─────────────────────────────────────────────────────────────────

    @GetMapping("/feedback/tracks")
    public ResponseEntity<ApiResponse<List<FeedbackTrackResponse>>> getFeedbackTracks() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getFeedbackTracks()));
    }

    @GetMapping("/feedback/submissions")
    public ResponseEntity<ApiResponse<List<AdminFeedbackSubmissionResponse>>> getFeedbackSubmissions() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getFeedbackSubmissions()));
    }

    @PutMapping("/feedback/submissions/{id}/approve")
    public ResponseEntity<ApiResponse<AdminFeedbackSubmissionResponse>> approveSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("피드백이 승인되었습니다.", adminService.approveSubmission(id)));
    }

    @PutMapping("/feedback/submissions/{id}/reject")
    public ResponseEntity<ApiResponse<AdminFeedbackSubmissionResponse>> rejectSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("피드백이 반려되었습니다.", adminService.rejectSubmission(id)));
    }

    // ─── Store Promo ──────────────────────────────────────────────────────────────

    @GetMapping("/store-promo/stores")
    public ResponseEntity<ApiResponse<List<StorePromoResponse>>> getStores() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getStores()));
    }

    @PostMapping("/store-promo/stores")
    public ResponseEntity<ApiResponse<StorePromoResponse>> createStore(
            @RequestBody AdminStoreRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("매장이 등록되었습니다.", adminService.createStore(request)));
    }

    @PutMapping("/store-promo/stores/{id}")
    public ResponseEntity<ApiResponse<StorePromoResponse>> updateStore(
            @PathVariable Long id,
            @RequestBody AdminStoreRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("매장이 수정되었습니다.", adminService.updateStore(id, request)));
    }

    @GetMapping("/store-promo/applications")
    public ResponseEntity<ApiResponse<List<PromoApplicationResponse>>> getPromoApplications() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getPromoApplications()));
    }

    // ─── Payout ───────────────────────────────────────────────────────────────────

    @GetMapping("/payout")
    public ResponseEntity<ApiResponse<List<AdminPayoutResponse>>> getPayouts() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getPayouts()));
    }

    @PutMapping("/payout/{id}/process")
    public ResponseEntity<ApiResponse<AdminPayoutResponse>> processPayout(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("정산이 처리되었습니다.", adminService.processPayout(id)));
    }
}
