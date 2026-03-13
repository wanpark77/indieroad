package com.indiroad.auth.controller;

import com.indiroad.auth.dto.LoginRequest;
import com.indiroad.auth.dto.LoginResponse;
import com.indiroad.auth.dto.SignupRequest;
import com.indiroad.auth.service.AuthService;
import com.indiroad.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "인증 API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @Operation(summary = "회원가입")
    public ResponseEntity<ApiResponse<Map<String, Long>>> signup(
            @Valid @RequestBody SignupRequest request) {
        Long userId = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("회원가입이 완료되었습니다.", Map.of("userId", userId)));
    }

    @PostMapping("/login")
    @Operation(summary = "로그인 (JWT 반환)")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인 성공", response));
    }

    @PostMapping("/find-email")
    @Operation(summary = "아이디(이메일) 찾기 - 이름+전화번호")
    public ResponseEntity<ApiResponse<Map<String, String>>> findEmail(
            @RequestBody Map<String, String> body) {
        String maskedEmail = authService.findEmailByNameAndPhone(body.get("name"), body.get("phone"));
        return ResponseEntity.ok(ApiResponse.ok("이메일을 찾았습니다.", Map.of("email", maskedEmail)));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "비밀번호 재설정 - 이메일+이름+전화번호 본인 확인 후 변경")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestBody Map<String, String> body) {
        authService.resetPassword(body.get("email"), body.get("name"), body.get("phone"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.ok("비밀번호가 재설정되었습니다.", null));
    }
}
