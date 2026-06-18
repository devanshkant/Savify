package com.example.savify_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;
import com.example.savify_backend.entities.Role;
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Builder
@Component
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String password;
    private String contact;
    private Role role;

}
