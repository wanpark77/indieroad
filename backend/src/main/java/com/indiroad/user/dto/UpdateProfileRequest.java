package com.indiroad.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProfileRequest {

    private String nickname;
    private String role;
    private String artistName;
    private String artistLink;
}
