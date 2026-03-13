package com.indiroad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignupRequest {

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, max = 64, message = "비밀번호는 8~64자 이어야 합니다.")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$",
        message = "비밀번호는 영문 대/소문자, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다."
    )
    private String password;

    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(min = 2, max = 20, message = "닉네임은 2~20자 이어야 합니다.")
    private String nickname;

    @NotBlank(message = "이름은 필수입니다.")
    @Size(min = 2, max = 20, message = "이름은 2~20자 이어야 합니다.")
    private String name;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(regexp = "^01[016789]\\d{7,8}$", message = "올바른 전화번호 형식이 아닙니다. (예: 01012345678)")
    private String phone;

    private String role;  // LISTENER, ARTIST, PROFESSIONAL
    private String artistName;
    private String artistLink;
}
