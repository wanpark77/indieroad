package com.indiroad.storepromo.service;

import com.indiroad.storepromo.dto.PromoApplicationRequest;
import com.indiroad.storepromo.dto.PromoApplicationResponse;
import com.indiroad.storepromo.dto.StorePromoResponse;
import com.indiroad.storepromo.entity.PromoApplication;
import com.indiroad.storepromo.repository.PromoApplicationRepository;
import com.indiroad.storepromo.repository.StorePromoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StorePromoService {

    private final StorePromoRepository storePromoRepository;
    private final PromoApplicationRepository promoApplicationRepository;

    public List<StorePromoResponse> getStores() {
        return storePromoRepository.findAll().stream()
                .map(StorePromoResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public PromoApplicationResponse applyPromo(Long userId, PromoApplicationRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("종료일은 시작일보다 이후여야 합니다.");
        }

        PromoApplication application = PromoApplication.builder()
                .userId(userId)
                .trackTitle(request.getTrackTitle())
                .storeName(request.getStoreName())
                .plan(request.getPlan())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return PromoApplicationResponse.from(promoApplicationRepository.save(application));
    }

    public List<PromoApplicationResponse> getMyApplications(Long userId) {
        return promoApplicationRepository.findByUserId(userId).stream()
                .map(PromoApplicationResponse::from)
                .collect(Collectors.toList());
    }
}
