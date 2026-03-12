package com.indiroad.storepromo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class PromoApplicationRequest {

    @NotBlank(message = "트랙 제목은 필수입니다.")
    private String trackTitle;

    @NotBlank(message = "매장명은 필수입니다.")
    private String storeName;

    private String plan;

    @NotNull(message = "시작일은 필수입니다.")
    private LocalDate startDate;

    @NotNull(message = "종료일은 필수입니다.")
    private LocalDate endDate;
}
