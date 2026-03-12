package com.indiroad.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateProfileRequest {

    private String nickname;
    private String artistName;
    private String artistLink;
}
