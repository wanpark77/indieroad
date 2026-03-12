package com.indiroad.feedback.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FeedbackSubmissionRequest {

    @NotBlank(message = "전체적인 인상은 필수입니다.")
    private String impression;

    private String highlights;
    private String improvements;
}
