package com.classtask.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classtask.server.entity.RevokedToken;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {
    boolean existsByJwtTokenDigest(String jwtTokenDigest);
}
