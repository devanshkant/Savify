package com.example.savify_backend.dto;

import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
public class AvailabilityRequest {
    private Long id;
    private boolean available;
}
