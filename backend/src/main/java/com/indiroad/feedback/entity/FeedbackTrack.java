package com.indiroad.feedback.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "feedback_tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    private String genre;
    private String mood;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer reward;
    private String duration;

    @Builder.Default
    private Integer applicants = 0;

    private Integer maxApplicants;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.OPEN;

    private Integer bpm;
    private Long userId;

    public enum Status {
        OPEN, CLOSED
    }
}
