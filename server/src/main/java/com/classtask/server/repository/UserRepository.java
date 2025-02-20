package com.classtask.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classtask.server.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findByVerificationToken(String token);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
