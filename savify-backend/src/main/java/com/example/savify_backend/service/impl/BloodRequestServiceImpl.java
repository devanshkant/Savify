package com.example.savify_backend.service.impl;

import com.example.savify_backend.dto.BloodRequestDto;
import com.example.savify_backend.entities.BloodGroup;
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
import java.util.List;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {

    private List<String> getEligibleDonorGroups(BloodGroup requestedGroup) {
        return switch (requestedGroup) {
            case O_NEGATIVE -> List.of("O_NEGATIVE");
            case O_POSITIVE -> List.of("O_POSITIVE", "O_NEGATIVE");
            case A_NEGATIVE -> List.of("A_NEGATIVE", "O_NEGATIVE");
            case A_POSITIVE -> List.of("A_POSITIVE", "A_NEGATIVE", "O_POSITIVE", "O_NEGATIVE");
            case B_NEGATIVE -> List.of("B_NEGATIVE", "O_NEGATIVE");
            case B_POSITIVE -> List.of("B_POSITIVE", "B_NEGATIVE", "O_POSITIVE", "O_NEGATIVE");
            case AB_NEGATIVE -> List.of("AB_NEGATIVE", "A_NEGATIVE", "B_NEGATIVE", "O_NEGATIVE");
            case AB_POSITIVE -> List.of("AB_POSITIVE", "AB_NEGATIVE", "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "O_POSITIVE", "O_NEGATIVE");
            default -> List.of();
        };
    }
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

        BloodRequest savedRequest =  bloodRequestRepository.save(bloodRequest);

        // Determine who can actually donate to this specific request
        List<String> eligibleGroups = getEligibleDonorGroups(request.getBloodType());

        // Call the updated repository method
        List<User> matchedDonors = userRepository.findNearbyEligibleDonors(
                request.getLatitude(),
                request.getLongitude(),
                5000.0,
                eligibleGroups
        );
        System.out.println("====== MATCHED DONORS FOR REQUEST ======");
        System.out.println("Total nearby matching donors found: " + matchedDonors.size());
        for(User donor : matchedDonors) {
            System.out.println("Donor Name: " + donor.getName() + " | Email: " + donor.getEmail());
        }
        System.out.println("========================================");
        return savedRequest;
    }
}
