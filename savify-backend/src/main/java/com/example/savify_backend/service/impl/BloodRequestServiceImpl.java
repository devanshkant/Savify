package com.example.savify_backend.service.impl;

import com.example.savify_backend.dto.BloodRequestDto;
import com.example.savify_backend.entities.BloodRequest;
import com.example.savify_backend.entities.User;
import com.example.savify_backend.repository.BloodRequestRepository;
import com.example.savify_backend.repository.UserRepository;
import com.example.savify_backend.service.BloodRequestService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {
    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final GeometryFactory geometryFactory =
            new GeometryFactory(new PrecisionModel(), 4326);

    public BloodRequestServiceImpl(BloodRequestRepository bloodRequestRepository, UserRepository userRepository) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.userRepository = userRepository;
    }
    @Override
    public BloodRequest createBloodRequest(BloodRequestDto request) {
        User hospital = userRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        if(hospital.getRole().toString().equals("DONOR"))
            throw new RuntimeException("Only hospitals can make blood requests");

        BloodRequest bloodRequest = new BloodRequest();
        bloodRequest.setHospital(hospital);
        bloodRequest.setBloodType(request.getBloodType());
        bloodRequest.setUnitsRequired(request.getUnitsRequired());
        bloodRequest.setUrgency(request.getUrgency());
        bloodRequest.setAddress(request.getAddress());
        Coordinate coordinate = new Coordinate(request.getLongitude(), request.getLatitude());
        Point locationPoint = geometryFactory.createPoint(coordinate);
        bloodRequest.setLocation(locationPoint);
        return bloodRequestRepository.save(bloodRequest);
    }
}
