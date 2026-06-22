package com.example.savify_backend.repository;

import com.example.savify_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users u WHERE u.role = 'DONOR' AND u.is_available = true " +
            "AND u.blood_group IN (:eligibleBloodGroups) " + // <-- NEW FILTER
            "AND ST_DistanceSphere(u.location, ST_MakePoint(:hospitalLng, :hospitalLat)) <= :distance",
            nativeQuery = true)
    List<User> findNearbyEligibleDonors(
            @Param("hospitalLat") double hospitalLat,
            @Param("hospitalLng") double hospitalLng,
            @Param("distance") double distance,
            @Param("eligibleBloodGroups") List<String> eligibleBloodGroups
    );
}
