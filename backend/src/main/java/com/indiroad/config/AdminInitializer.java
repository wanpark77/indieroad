package com.indiroad.config;

import com.indiroad.user.entity.User;
import com.indiroad.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        String adminEmail = "admin@indiroad.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin1234"))
                    .nickname("관리자")
                    .role(User.Role.ADMIN)
                    .points(0)
                    .build();
            userRepository.save(admin);
            log.info("어드민 계정 생성 완료: {}", adminEmail);
        } else {
            // 기존 계정 비밀번호/역할 강제 업데이트
            userRepository.findByEmail(adminEmail).ifPresent(user -> {
                user.setPassword(passwordEncoder.encode("admin1234"));
                user.setRole(User.Role.ADMIN);
                userRepository.save(user);
                log.info("어드민 계정 업데이트 완료: {}", adminEmail);
            });
        }
    }
}
