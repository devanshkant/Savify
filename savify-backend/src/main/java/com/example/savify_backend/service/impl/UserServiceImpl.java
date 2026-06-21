package com.example.savify_backend.service.impl;

import com.example.savify_backend.dto.LoginRequest;
import com.example.savify_backend.dto.RegisterRequest;
import com.example.savify_backend.entities.User;
import com.example.savify_backend.repository.UserRepository;
import com.example.savify_backend.service.UserService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final GeometryFactory geometryFactory =
            new GeometryFactory(new org.locationtech.jts.geom.PrecisionModel(), 4326);

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(RegisterRequest request){
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setContact(request.getContact());
        user.setRole(request.getRole());
        user.setAddress(request.getAddress());
        user.setBloodGroup(request.getBloodGroup());
        Coordinate coordinate = new Coordinate(request.getLongitude(), request.getLatitude());
        Point locationPoint = geometryFactory.createPoint(coordinate);
        user.setLocation(locationPoint);

        return userRepository.save(user);
    }

    @Override
    public User loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid e-mail or password")
                );
        if(!user.getPassword().equals(loginRequest.getPassword())){
            throw new RuntimeException("Invalid e-mail or password");
        }
        return user;
    }
}
