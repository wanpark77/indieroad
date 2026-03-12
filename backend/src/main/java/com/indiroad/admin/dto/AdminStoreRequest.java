package com.indiroad.admin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminStoreRequest {
    private String name;
    private String location;
    private String hours;
    private String mood;
    private String currentTrack;
    private String currentArtist;
}
