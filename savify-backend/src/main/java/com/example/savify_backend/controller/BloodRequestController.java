package com.example.savify_backend.controller;

import com.example.savify_backend.dto.BloodRequestDto;
import com.example.savify_backend.entities.BloodRequest;
import com.example.savify_backend.service.BloodRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {
    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    @PostMapping("/create")
    public ResponseEntity<BloodRequest> createBloodRequest(@RequestBody BloodRequestDto request){
        BloodRequest savedBloodRequest = bloodRequestService.createBloodRequest(request);
        return new ResponseEntity<>(savedBloodRequest, HttpStatus.CREATED);
    }
}
