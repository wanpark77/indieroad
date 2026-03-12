package com.indiroad.admin.dto;

import com.indiroad.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminMemberResponse {

    private Long id;
    private String email;
    private String nickname;
    private String role;
    private Integer points;
    private String artistName;
    private LocalDateTime createdAt;

    public static AdminMemberResponse from(User user) {
        return AdminMemberResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .role(user.getRole().name())
                .points(user.getPoints())
                .artistName(user.getArtistName())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
