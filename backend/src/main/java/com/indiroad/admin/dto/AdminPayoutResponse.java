package com.indiroad.admin.dto;

import com.indiroad.payout.entity.Payout;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminPayoutResponse {

    private Long id;
    private Long userId;
    private String memberNickname;
    private Integer amount;
    private String type;
    private String status;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;

    public static AdminPayoutResponse from(Payout payout, String memberNickname) {
        return AdminPayoutResponse.builder()
                .id(payout.getId())
                .userId(payout.getUserId())
                .memberNickname(memberNickname)
                .amount(payout.getAmount())
                .type(payout.getType())
                .status(payout.getStatus().name())
                .processedAt(payout.getProcessedAt())
                .createdAt(payout.getCreatedAt())
                .build();
    }
}
