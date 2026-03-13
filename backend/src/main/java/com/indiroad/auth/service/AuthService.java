package com.indiroad.auth.service;

import com.indiroad.auth.dto.LoginRequest;
import com.indiroad.auth.dto.LoginResponse;
import com.indiroad.auth.dto.SignupRequest;
import com.indiroad.auth.jwt.JwtProvider;
import com.indiroad.user.entity.User;
import com.indiroad.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final LoginAttemptService loginAttemptService;

    @Transactional
    public Long signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        User.Role role = User.Role.LISTENER;
        if (StringUtils.hasText(request.getRole())) {
            try {
                role = User.Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("올바르지 않은 역할입니다. (LISTENER, ARTIST, PROFESSIONAL)");
            }
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .name(request.getName())
                .phone(request.getPhone())
                .role(role)
                .points(0)
                .artistName(request.getArtistName())
                .artistLink(request.getArtistLink())
                .build();

        return userRepository.save(user).getId();
    }

    public String findEmailByNameAndPhone(String name, String phone) {
        User user = userRepository.findByNameAndPhone(name, phone)
                .orElseThrow(() -> new IllegalArgumentException("입력하신 정보와 일치하는 계정을 찾을 수 없습니다."));
        // 이메일 일부 마스킹: ab***@example.com
        String email = user.getEmail();
        int atIdx = email.indexOf('@');
        String local = email.substring(0, atIdx);
        String masked = local.length() <= 2
                ? local.charAt(0) + "***"
                : local.substring(0, 2) + "*".repeat(local.length() - 2);
        return masked + email.substring(atIdx);
    }

    @Transactional
    public void resetPassword(String email, String name, String phone, String newPassword) {
        User user = userRepository.findByEmailAndNameAndPhone(email, name, phone)
                .orElseThrow(() -> new IllegalArgumentException("입력하신 정보와 일치하는 계정을 찾을 수 없습니다."));
        user.setPassword(passwordEncoder.encode(newPassword));
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail();

        if (loginAttemptService.isBlocked(email)) {
            long remaining = loginAttemptService.remainingLockSeconds(email);
            throw new LockedException(String.format("로그인 시도가 너무 많습니다. %d초 후에 다시 시도해주세요.", remaining));
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    loginAttemptService.loginFailed(email);
                    return new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            loginAttemptService.loginFailed(email);
            throw new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        loginAttemptService.loginSucceeded(email);
        String token = jwtProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return LoginResponse.of(token, user.getId(), user.getEmail(), user.getNickname(), user.getRole().name());
    }
}
