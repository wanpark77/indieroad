package com.indiroad.storepromo.controller;

import com.indiroad.common.ApiResponse;
import com.indiroad.storepromo.dto.PromoApplicationRequest;
import com.indiroad.storepromo.dto.PromoApplicationResponse;
import com.indiroad.storepromo.dto.StorePromoResponse;
import com.indiroad.storepromo.service.StorePromoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store-promo")
@RequiredArgsConstructor
@Tag(name = "Store Promo", description = "매장 홍보 API")
public class StorePromoController {

    private final StorePromoService storePromoService;

    @GetMapping
    @Operation(summary = "매장 목록 조회")
    public ResponseEntity<ApiResponse<List<StorePromoResponse>>> getStores() {
        return ResponseEntity.ok(ApiResponse.ok(storePromoService.getStores()));
    }

    @PostMapping("/apply")
    @Operation(summary = "홍보 신청 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<PromoApplicationResponse>> applyPromo(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody PromoApplicationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("홍보 신청이 완료되었습니다.", storePromoService.applyPromo(userId, request)));
    }

    @GetMapping("/my")
    @Operation(summary = "내 홍보 신청 목록 조회 (인증 필요)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<PromoApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(storePromoService.getMyApplications(userId)));
    }
}
