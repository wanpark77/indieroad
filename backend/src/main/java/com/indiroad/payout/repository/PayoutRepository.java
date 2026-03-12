package com.indiroad.payout.repository;

import com.indiroad.payout.entity.Payout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayoutRepository extends JpaRepository<Payout, Long> {

    List<Payout> findByUserId(Long userId);

    int countByStatus(Payout.Status status);
}
