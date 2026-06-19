package com.jobportal.repository;

import com.jobportal.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT DATE(u.createdAt), COUNT(u) FROM User u GROUP BY DATE(u.createdAt) ORDER BY DATE(u.createdAt) ASC")
    List<Object[]> getRegistrationStats();
}
