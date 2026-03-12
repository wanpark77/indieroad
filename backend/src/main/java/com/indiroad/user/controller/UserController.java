package com.indiroad.user.controller;

import com.indiroad.common.ApiResponse;
import com.indiroad.user.dto.PointsResponse;
import com.indiroad.user.dto.UpdateProfileRequest;
import com.indiroad.user.dto.UserProfileResponse;
import com.indiroad.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
@Tag(name = "My Page", description = "마이페이지 API")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "내 프로필 조회")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getProfile(userId)));
    }

    @PutMapping("/profile")
    @Operation(summary = "프로필 수정")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal Long userId,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("프로필이 수정되었습니다.", userService.updateProfile(userId, request)));
    }

    @GetMapping("/points")
    @Operation(summary = "포인트 조회")
    public ResponseEntity<ApiResponse<PointsResponse>> getPoints(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getPoints(userId)));
    }
}
