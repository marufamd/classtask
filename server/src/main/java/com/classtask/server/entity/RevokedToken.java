package com.classtask.server.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "revoked_token")
public class RevokedToken {
    @Id
    @Column(name = "jwt_token_digest")
    private String jwtTokenDigest;

    @Column(name = "revocation_date")
    private Timestamp revocationDate;
}
