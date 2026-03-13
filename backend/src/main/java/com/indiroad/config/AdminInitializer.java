package com.indiroad.config;

import com.indiroad.user.entity.User;
import com.indiroad.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${admin.email:admin@indiroad.com}")
    private String adminEmail;

    @Value("${admin.password:Admin@1234}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .nickname("관리자")
                    .name("관리자")
                    .phone("01000000000")
                    .role(User.Role.ADMIN)
                    .points(0)
                    .build();
            userRepository.save(admin);
            log.info("관리자 계정 생성 완료: {}", adminEmail);
        }
    }
}
