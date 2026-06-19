package com.example.savify_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import org.locationtech.jts.geom.Point;
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Builder
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private String address;
    @Enumerated(EnumType.STRING)
    @Column(name = "role",nullable = false)
    private Role role;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point location;
}
