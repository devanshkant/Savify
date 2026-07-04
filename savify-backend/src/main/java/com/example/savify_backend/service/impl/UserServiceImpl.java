package com.example.savify_backend.service.impl;

import com.example.savify_backend.dto.AvailabilityRequest;
import com.example.savify_backend.dto.LoginRequest;
import com.example.savify_backend.dto.LoginResponse;
import com.example.savify_backend.dto.RegisterRequest;
import com.example.savify_backend.entities.User;
import com.example.savify_backend.repository.UserRepository;
import com.example.savify_backend.security.JwtTokenProvider;
import com.example.savify_backend.service.UserService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.example.savify_backend.entities.Role.*;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public UserServiceImpl(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public User registerUser(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setContact(request.getContact());
        user.setRole(request.getRole());
        user.setAddress(request.getAddress());
        if (request.getRole() == DONOR)
            user.setBloodGroup(request.getBloodGroup());
        else
            user.setBloodGroup(null);
        // set availability: hospitals should have null
        if (request.getRole() == DONOR)
            user.setIsAvailable(false);
        else if (request.getRole() == HOSPITAL)
            user.setIsAvailable(null);
        else
            user.setIsAvailable(false);
        Coordinate coordinate = new Coordinate(request.getLongitude(), request.getLatitude());
        Point locationPoint = geometryFactory.createPoint(coordinate);
        user.setLocation(locationPoint);

        return userRepository.save(user);
    }

    @Override
    public LoginResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid e-mail or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid e-mail or password");
        }

        // Build a Spring Security UserDetails to generate the token
        org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);

        LoginResponse response = new LoginResponse();
        response.setJwt(token);
        response.setId(user.getId());
        response.setRole(user.getRole().name());
        return response;
    }

    @Override
    public User updateAvailability(AvailabilityRequest request) {
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsAvailable(request.getAvailable());
        return userRepository.save(user);
    }
}
