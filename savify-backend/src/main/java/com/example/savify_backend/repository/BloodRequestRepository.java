package com.example.savify_backend.repository;

import com.example.savify_backend.entities.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
}
