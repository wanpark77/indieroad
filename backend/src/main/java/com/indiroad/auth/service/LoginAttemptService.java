package com.indiroad.auth.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 5;

    private record AttemptInfo(int count, LocalDateTime lastAttempt) {}

    private final Map<String, AttemptInfo> attempts = new ConcurrentHashMap<>();

    public void loginFailed(String email) {
        AttemptInfo info = attempts.get(email);
        int count = (info != null) ? info.count() + 1 : 1;
        attempts.put(email, new AttemptInfo(count, LocalDateTime.now()));
    }

    public void loginSucceeded(String email) {
        attempts.remove(email);
    }

    public boolean isBlocked(String email) {
        AttemptInfo info = attempts.get(email);
        if (info == null) return false;
        if (info.count() < MAX_ATTEMPTS) return false;
        // 잠금 시간이 지났으면 해제
        if (info.lastAttempt().plusMinutes(LOCK_MINUTES).isBefore(LocalDateTime.now())) {
            attempts.remove(email);
            return false;
        }
        return true;
    }

    public long remainingLockSeconds(String email) {
        AttemptInfo info = attempts.get(email);
        if (info == null) return 0;
        LocalDateTime unlockTime = info.lastAttempt().plusMinutes(LOCK_MINUTES);
        long seconds = java.time.Duration.between(LocalDateTime.now(), unlockTime).getSeconds();
        return Math.max(0, seconds);
    }
}
