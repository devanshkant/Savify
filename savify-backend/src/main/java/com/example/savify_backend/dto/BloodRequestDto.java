package com.example.savify_backend.dto;

import com.example.savify_backend.entities.BloodGroup;
import com.example.savify_backend.entities.Urgency;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BloodRequestDto {
    private Long hospitalId;
    private BloodGroup bloodType;
    private Integer unitsRequired;
    private Urgency urgency;
    private String address;
    private double latitude;
    private double longitude;
}
