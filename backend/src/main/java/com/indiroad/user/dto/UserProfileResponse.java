package com.indiroad.user.dto;

import com.indiroad.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserProfileResponse {

    private Long id;
    private String email;
    private String nickname;
    private String role;
    private Integer points;
    private String artistName;
    private String artistLink;
    private LocalDateTime createdAt;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .role(user.getRole().name())
                .points(user.getPoints())
                .artistName(user.getArtistName())
                .artistLink(user.getArtistLink())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
