package com.indiroad.admin.service;

import com.indiroad.admin.dto.*;
import com.indiroad.feedback.entity.FeedbackSubmission;
import com.indiroad.feedback.entity.FeedbackTrack;
import com.indiroad.feedback.repository.FeedbackSubmissionRepository;
import com.indiroad.feedback.repository.FeedbackTrackRepository;
import com.indiroad.magazine.dto.MagazineArticleResponse;
import com.indiroad.magazine.entity.MagazineArticle;
import com.indiroad.magazine.repository.MagazineRepository;
import com.indiroad.payout.entity.Payout;
import com.indiroad.payout.repository.PayoutRepository;
import com.indiroad.storepromo.dto.PromoApplicationResponse;
import com.indiroad.storepromo.dto.StorePromoResponse;
import com.indiroad.storepromo.entity.PromoApplication;
import com.indiroad.storepromo.entity.StorePromo;
import com.indiroad.storepromo.repository.PromoApplicationRepository;
import com.indiroad.storepromo.repository.StorePromoRepository;
import com.indiroad.user.entity.User;
import com.indiroad.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final MagazineRepository magazineRepository;
    private final FeedbackTrackRepository feedbackTrackRepository;
    private final FeedbackSubmissionRepository feedbackSubmissionRepository;
    private final StorePromoRepository storePromoRepository;
    private final PromoApplicationRepository promoApplicationRepository;
    private final PayoutRepository payoutRepository;

    // ─── Dashboard ───────────────────────────────────────────────────────────────

    public AdminDashboardResponse getDashboard() {
        long totalMembers = userRepository.count();
        long totalMagazines = magazineRepository.count();
        long pendingFeedbacks = feedbackSubmissionRepository.findAll().stream()
                .filter(s -> s.getStatus() == FeedbackSubmission.Status.PENDING)
                .count();
        long pendingPayouts = payoutRepository.countByStatus(Payout.Status.PENDING);

        // Recent feedbacks (last 5)
        List<FeedbackSubmission> recentSubmissions = feedbackSubmissionRepository.findAll()
                .stream()
                .sorted((a, b) -> {
                    if (a.getSubmittedAt() == null) return 1;
                    if (b.getSubmittedAt() == null) return -1;
                    return b.getSubmittedAt().compareTo(a.getSubmittedAt());
                })
                .limit(5)
                .collect(Collectors.toList());

        Map<Long, String> trackTitles = feedbackTrackRepository.findAll().stream()
                .collect(Collectors.toMap(FeedbackTrack::getId, FeedbackTrack::getTitle));
        Map<Long, String> userNicknames = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getNickname));

        List<AdminDashboardResponse.RecentFeedbackItem> recentFeedbacks = recentSubmissions.stream()
                .map(s -> AdminDashboardResponse.RecentFeedbackItem.builder()
                        .id(s.getId())
                        .trackTitle(trackTitles.getOrDefault(s.getTrackId(), "알 수 없음"))
                        .submitter(userNicknames.getOrDefault(s.getUserId(), "알 수 없음"))
                        .status(s.getStatus().name())
                        .submittedAt(s.getSubmittedAt() != null ? s.getSubmittedAt().toString() : "")
                        .build())
                .collect(Collectors.toList());

        // Recent members (last 5)
        List<AdminDashboardResponse.RecentMemberItem> recentMembers = userRepository.findAll()
                .stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(5)
                .map(u -> AdminDashboardResponse.RecentMemberItem.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .nickname(u.getNickname())
                        .role(u.getRole().name())
                        .joinedAt(u.getCreatedAt() != null ? u.getCreatedAt().toString() : "")
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalMembers(totalMembers)
                .totalMagazines(totalMagazines)
                .pendingFeedbacks(pendingFeedbacks)
                .pendingPayouts(pendingPayouts)
                .recentFeedbacks(recentFeedbacks)
                .recentMembers(recentMembers)
                .build();
    }

    // ─── Members ──────────────────────────────────────────────────────────────────

    public List<AdminMemberResponse> getMembers() {
        return userRepository.findAll().stream()
                .map(AdminMemberResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminMemberResponse updateRole(Long id, UpdateRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));
        try {
            User.Role newRole = User.Role.valueOf(request.getRole().toUpperCase());
            user.setRole(newRole);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("올바르지 않은 역할입니다. (LISTENER, ARTIST, PROFESSIONAL, ADMIN)");
        }
        return AdminMemberResponse.from(userRepository.save(user));
    }

    @Transactional
    public AdminMemberResponse updatePoints(Long id, UpdatePointsRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));
        int newPoints = user.getPoints() + request.getAmount();
        user.setPoints(Math.max(0, newPoints));
        return AdminMemberResponse.from(userRepository.save(user));
    }

    // ─── Magazine ─────────────────────────────────────────────────────────────────

    public List<MagazineArticleResponse> getMagazines() {
        return magazineRepository.findAll().stream()
                .map(MagazineArticleResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public MagazineArticleResponse createMagazine(AdminMagazineRequest request) {
        MagazineArticle article = MagazineArticle.builder()
                .slug(request.getSlug())
                .title(request.getTitle())
                .category(MagazineArticle.Category.valueOf(request.getCategory().toUpperCase()))
                .categoryLabel(request.getCategoryLabel())
                .summary(request.getSummary())
                .coverColor(request.getCoverColor())
                .author(request.getAuthor())
                .date(request.getDate() != null ? LocalDate.parse(request.getDate()) : LocalDate.now())
                .content(request.getContent())
                .build();
        return MagazineArticleResponse.from(magazineRepository.save(article));
    }

    @Transactional
    public MagazineArticleResponse updateMagazine(Long id, AdminMagazineRequest request) {
        MagazineArticle article = magazineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("매거진을 찾을 수 없습니다."));
        if (request.getSlug() != null) article.setSlug(request.getSlug());
        if (request.getTitle() != null) article.setTitle(request.getTitle());
        if (request.getCategory() != null) {
            article.setCategory(MagazineArticle.Category.valueOf(request.getCategory().toUpperCase()));
        }
        if (request.getCategoryLabel() != null) article.setCategoryLabel(request.getCategoryLabel());
        if (request.getSummary() != null) article.setSummary(request.getSummary());
        if (request.getCoverColor() != null) article.setCoverColor(request.getCoverColor());
        if (request.getAuthor() != null) article.setAuthor(request.getAuthor());
        if (request.getDate() != null) article.setDate(LocalDate.parse(request.getDate()));
        if (request.getContent() != null) article.setContent(request.getContent());
        return MagazineArticleResponse.from(magazineRepository.save(article));
    }

    @Transactional
    public void deleteMagazine(Long id) {
        if (!magazineRepository.existsById(id)) {
            throw new EntityNotFoundException("매거진을 찾을 수 없습니다.");
        }
        magazineRepository.deleteById(id);
    }

    // ─── Feedback ─────────────────────────────────────────────────────────────────

    public List<com.indiroad.feedback.dto.FeedbackTrackResponse> getFeedbackTracks() {
        return feedbackTrackRepository.findAll().stream()
                .map(com.indiroad.feedback.dto.FeedbackTrackResponse::from)
                .collect(Collectors.toList());
    }

    public List<AdminFeedbackSubmissionResponse> getFeedbackSubmissions() {
        Map<Long, String> trackTitles = feedbackTrackRepository.findAll().stream()
                .collect(Collectors.toMap(FeedbackTrack::getId, FeedbackTrack::getTitle));
        Map<Long, String> userNicknames = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getNickname));

        return feedbackSubmissionRepository.findAll().stream()
                .map(s -> AdminFeedbackSubmissionResponse.from(
                        s,
                        trackTitles.getOrDefault(s.getTrackId(), "알 수 없음"),
                        userNicknames.getOrDefault(s.getUserId(), "알 수 없음")))
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminFeedbackSubmissionResponse approveSubmission(Long id) {
        FeedbackSubmission submission = feedbackSubmissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("피드백 제출을 찾을 수 없습니다."));
        submission.setStatus(FeedbackSubmission.Status.APPROVED);

        // 포인트 지급
        Optional<User> userOpt = userRepository.findById(submission.getUserId());
        userOpt.ifPresent(user -> {
            int reward = submission.getReward() != null ? submission.getReward() : 0;
            user.setPoints(user.getPoints() + reward);
            userRepository.save(user);

            // Payout 기록 생성
            Payout payout = Payout.builder()
                    .userId(user.getId())
                    .amount(reward)
                    .type("피드백 보상")
                    .status(Payout.Status.PENDING)
                    .build();
            payoutRepository.save(payout);
        });

        FeedbackSubmission saved = feedbackSubmissionRepository.save(submission);

        Map<Long, String> trackTitles = feedbackTrackRepository.findAll().stream()
                .collect(Collectors.toMap(FeedbackTrack::getId, FeedbackTrack::getTitle));
        Map<Long, String> userNicknames = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getNickname));

        return AdminFeedbackSubmissionResponse.from(
                saved,
                trackTitles.getOrDefault(saved.getTrackId(), "알 수 없음"),
                userNicknames.getOrDefault(saved.getUserId(), "알 수 없음"));
    }

    @Transactional
    public AdminFeedbackSubmissionResponse rejectSubmission(Long id) {
        FeedbackSubmission submission = feedbackSubmissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("피드백 제출을 찾을 수 없습니다."));
        submission.setStatus(FeedbackSubmission.Status.REJECTED);
        FeedbackSubmission saved = feedbackSubmissionRepository.save(submission);

        Map<Long, String> trackTitles = feedbackTrackRepository.findAll().stream()
                .collect(Collectors.toMap(FeedbackTrack::getId, FeedbackTrack::getTitle));
        Map<Long, String> userNicknames = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getNickname));

        return AdminFeedbackSubmissionResponse.from(
                saved,
                trackTitles.getOrDefault(saved.getTrackId(), "알 수 없음"),
                userNicknames.getOrDefault(saved.getUserId(), "알 수 없음"));
    }

    // ─── Store Promo ──────────────────────────────────────────────────────────────

    public List<StorePromoResponse> getStores() {
        return storePromoRepository.findAll().stream()
                .map(StorePromoResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public StorePromoResponse createStore(AdminStoreRequest request) {
        StorePromo store = StorePromo.builder()
                .name(request.getName())
                .location(request.getLocation())
                .hours(request.getHours())
                .mood(request.getMood())
                .currentTrack(request.getCurrentTrack())
                .currentArtist(request.getCurrentArtist())
                .build();
        return StorePromoResponse.from(storePromoRepository.save(store));
    }

    @Transactional
    public StorePromoResponse updateStore(Long id, AdminStoreRequest request) {
        StorePromo store = storePromoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("매장을 찾을 수 없습니다."));
        store.setName(request.getName());
        store.setLocation(request.getLocation());
        store.setHours(request.getHours());
        store.setMood(request.getMood());
        store.setCurrentTrack(request.getCurrentTrack());
        store.setCurrentArtist(request.getCurrentArtist());
        return StorePromoResponse.from(storePromoRepository.save(store));
    }

    public List<PromoApplicationResponse> getPromoApplications() {
        return promoApplicationRepository.findAll().stream()
                .map(PromoApplicationResponse::from)
                .collect(Collectors.toList());
    }

    // ─── Payout ───────────────────────────────────────────────────────────────────

    public List<AdminPayoutResponse> getPayouts() {
        Map<Long, String> userNicknames = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getNickname));

        return payoutRepository.findAll().stream()
                .map(p -> AdminPayoutResponse.from(p, userNicknames.getOrDefault(p.getUserId(), "알 수 없음")))
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminPayoutResponse processPayout(Long id) {
        Payout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("정산을 찾을 수 없습니다."));
        payout.setStatus(Payout.Status.PAID);
        payout.setProcessedAt(LocalDateTime.now());
        Payout saved = payoutRepository.save(payout);

        String nickname = userRepository.findById(saved.getUserId())
                .map(User::getNickname)
                .orElse("알 수 없음");

        return AdminPayoutResponse.from(saved, nickname);
    }
}
