package com.indiroad.user.service;

import com.indiroad.user.dto.PointsResponse;
import com.indiroad.user.dto.UpdateProfileRequest;
import com.indiroad.user.dto.UserProfileResponse;
import com.indiroad.user.entity.User;
import com.indiroad.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(Long userId) {
        User user = findUserById(userId);
        return UserProfileResponse.from(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUserById(userId);

        if (StringUtils.hasText(request.getNickname())) {
            if (!request.getNickname().equals(user.getNickname()) &&
                    userRepository.existsByNickname(request.getNickname())) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }
            user.setNickname(request.getNickname());
        }

        if (request.getArtistName() != null) {
            user.setArtistName(request.getArtistName());
        }

        if (request.getArtistLink() != null) {
            user.setArtistLink(request.getArtistLink());
        }

        return UserProfileResponse.from(user);
    }

    public PointsResponse getPoints(Long userId) {
        User user = findUserById(userId);
        return new PointsResponse(user.getPoints());
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
    }
}
