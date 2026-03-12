package com.indiroad.magazine.repository;

import com.indiroad.magazine.entity.MagazineArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MagazineRepository extends JpaRepository<MagazineArticle, Long> {

    List<MagazineArticle> findByCategory(MagazineArticle.Category category);

    Optional<MagazineArticle> findBySlug(String slug);
}
