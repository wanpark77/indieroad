package com.indiroad.storepromo.repository;

import com.indiroad.storepromo.entity.PromoApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromoApplicationRepository extends JpaRepository<PromoApplication, Long> {

    List<PromoApplication> findByUserId(Long userId);
}
