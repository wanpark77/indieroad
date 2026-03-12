package com.indiroad.magazine.controller;

import com.indiroad.common.ApiResponse;
import com.indiroad.magazine.dto.MagazineArticleResponse;
import com.indiroad.magazine.service.MagazineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/magazine")
@RequiredArgsConstructor
@Tag(name = "Magazine", description = "매거진 API")
public class MagazineController {

    private final MagazineService magazineService;

    @GetMapping
    @Operation(summary = "매거진 목록 조회", description = "카테고리 필터: INTERVIEW, PLAYLIST, PRODUCT, NEWS, CONCERT")
    public ResponseEntity<ApiResponse<List<MagazineArticleResponse>>> getArticles(
            @Parameter(description = "카테고리 필터")
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok(magazineService.getArticles(category)));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "매거진 상세 조회")
    public ResponseEntity<ApiResponse<MagazineArticleResponse>> getArticle(
            @PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(magazineService.getArticleBySlug(slug)));
    }
}
