package com.indiroad.storepromo.dto;

import com.indiroad.storepromo.entity.PromoApplication;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class PromoApplicationResponse {

    private Long id;
    private Long userId;
    private String trackTitle;
    private String storeName;
    private String plan;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime createdAt;

    public static PromoApplicationResponse from(PromoApplication application) {
        return PromoApplicationResponse.builder()
                .id(application.getId())
                .userId(application.getUserId())
                .trackTitle(application.getTrackTitle())
                .storeName(application.getStoreName())
                .plan(application.getPlan())
                .startDate(application.getStartDate())
                .endDate(application.getEndDate())
                .status(application.getStatus().name())
                .createdAt(application.getCreatedAt())
                .build();
    }
}
