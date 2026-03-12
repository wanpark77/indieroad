package com.indiroad.storepromo.dto;

import com.indiroad.storepromo.entity.StorePromo;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StorePromoResponse {

    private Long id;
    private String name;
    private String location;
    private String hours;
    private String mood;
    private String currentTrack;
    private String currentArtist;

    public static StorePromoResponse from(StorePromo store) {
        return StorePromoResponse.builder()
                .id(store.getId())
                .name(store.getName())
                .location(store.getLocation())
                .hours(store.getHours())
                .mood(store.getMood())
                .currentTrack(store.getCurrentTrack())
                .currentArtist(store.getCurrentArtist())
                .build();
    }
}
