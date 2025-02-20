package com.classtask.server.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User implements Serializable {
    @Id
    private String id;
    
    @Column(name = "display_name")
    private String displayName;

    @Column(name = "username")
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "email")
    private String email;

    @Column(name = "created_time")
    private Timestamp createdTime;

    @Column(name = "verified")
    private boolean verified;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "token_expiry_time")
    private Timestamp tokenExpiryTime;
}
