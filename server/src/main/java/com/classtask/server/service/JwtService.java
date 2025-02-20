package com.classtask.server.service;

import java.security.MessageDigest;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.classtask.server.entity.RevokedToken;
import com.classtask.server.repository.RevokedTokenRepository;
import com.classtask.server.util.Constants;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.xml.bind.DatatypeConverter;

@Service
public class JwtService {
    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Value("${classtask.jwt.secret}")
    private String SECRET_KEY;

    private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60;
    private final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 30;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));
    } 

    public Map<String, Object> generateTokenPair(String username) {
        String accessToken = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(getKey())
                .compact();

        String refreshToken = Jwts.builder()
                .setSubject(username)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(getKey())
                .compact();

        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
    }

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(Constants.JWT_TOKEN_HEADER);
        if (bearerToken != null && bearerToken.startsWith(Constants.JWT_TOKEN_PREFIX)) {
            return bearerToken.substring(Constants.JWT_TOKEN_PREFIX.length());
        }
        return null;
    }

    public String validateToken(String token) throws Exception {
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(getKey()).build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            throw new Exception("Invalid or expired token");
        }
    }

    public boolean isTokenRevoked(String jwt) throws Exception {
        if (jwt == null || jwt.trim().isEmpty()) {
            return false;
        }

        String jwtTokenDigestInHex = hashToken(jwt);
        return revokedTokenRepository.existsByJwtTokenDigest(jwtTokenDigestInHex);
    }

    @Transactional
    public void revokeToken(String jwt) throws Exception {
        if (jwt == null || jwt.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }

        String jwtTokenDigestInHex = hashToken(jwt);

        if (!isTokenRevoked(jwt)) {
            RevokedToken revokedToken = new RevokedToken();
            revokedToken.setJwtTokenDigest(jwtTokenDigestInHex);
            revokedTokenRepository.save(revokedToken);
        }
    }

    private String hashToken(String jwt) throws Exception {
        byte[] cipheredToken = jwt.getBytes();

        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] cipheredTokenDigest = digest.digest(cipheredToken);

        return DatatypeConverter.printHexBinary(cipheredTokenDigest);
    }

    public String refreshAccessToken(String refreshToken) throws Exception {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(refreshToken)
                    .getBody();

            if (isTokenRevoked(refreshToken)) {
                throw new Exception("Refresh token is revoked");
            }

            return Jwts.builder()
                    .setSubject(claims.getSubject())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                    .signWith(getKey())
                    .compact();
        } catch (JwtException | IllegalArgumentException e) {
            throw new Exception("Invalid or expired refresh token");
        }
    }
}
