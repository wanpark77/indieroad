package com.indiroad.admin.controller;

import com.indiroad.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @Value("${upload.base-url:http://localhost:8080}")
    private String baseUrl;

    @PostMapping("/magazine-cover")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadMagazineCover(
            @RequestParam("file") MultipartFile file) throws IOException {

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("이미지 파일만 업로드할 수 있습니다."));
        }

        String ext = getExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + ext;

        Path dir = Paths.get(uploadDir, "magazine");
        Files.createDirectories(dir);
        Files.copy(file.getInputStream(), dir.resolve(fileName));

        String url = baseUrl + "/uploads/magazine/" + fileName;
        log.info("매거진 커버 이미지 업로드: {}", url);

        return ResponseEntity.ok(ApiResponse.ok(Map.of("url", url)));
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf("."));
    }
}
