package com.indiroad.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private Long userId;
    private String email;
    private String nickname;
    private String role;

    public static LoginResponse of(String token, Long userId, String email, String nickname, String role) {
        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(userId)
                .email(email)
                .nickname(nickname)
                .role(role)
                .build();
    }
}
