package com.example.savify_backend.entities;
import jakarta.persistence.*;

import java.time.OffsetDateTime;

public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Long hospitalId;

    private BloodGroup bloodType;
    private Integer unitsRequired;
    private Urgency urgency;
    private OffsetDateTime timeStamp;
}
