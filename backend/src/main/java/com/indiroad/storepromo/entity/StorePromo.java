package com.indiroad.storepromo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "store_promos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorePromo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;
    private String hours;
    private String mood;
    private String currentTrack;
    private String currentArtist;
}
