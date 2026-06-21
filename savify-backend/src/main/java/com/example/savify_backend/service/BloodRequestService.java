package com.example.savify_backend.service;

import com.example.savify_backend.dto.BloodRequestDto;
import com.example.savify_backend.entities.BloodRequest;

public interface BloodRequestService {
    BloodRequest createBloodRequest(BloodRequestDto request);
}
