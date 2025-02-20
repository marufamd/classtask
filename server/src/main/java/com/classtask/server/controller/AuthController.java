package com.classtask.server.controller;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.classtask.server.entity.User;
import com.classtask.server.request.LoginRequest;
import com.classtask.server.request.RegisterRequest;
import com.classtask.server.security.ServerUserDetails;
import com.classtask.server.service.JwtService;
import com.classtask.server.service.UserService;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/me")
        public ResponseEntity<User> me(@AuthenticationPrincipal User user) {
            return ResponseEntity.ok(user);
        }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest registerRequest) throws Exception {
        userService.register(registerRequest);
        return ResponseEntity.ok(Map.of("message", "Registration successful."));
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestParam String token) {
        userService.verify(token);
        return ResponseEntity.ok(Map.of("message", "Verification successful."));
    }

    @GetMapping("/refresh-verification")
    public ResponseEntity<Map<String, String>> refreshVerification(@RequestParam String email) throws Exception {
        userService.refreshVerificationToken(email);
        return ResponseEntity.ok(Map.of("message", "Verification token refreshed. Please check your email."));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername().toLowerCase(), loginRequest.getPassword()));

            ServerUserDetails userDetails = (ServerUserDetails)authentication.getPrincipal();
            User user = userDetails.getUser();

            if (!user.isVerified()) {
                return ResponseEntity.status(403).body(Map.of("message", "Account is not verified. Please check your email."));
            }

            Map<String, Object> payload = jwtService.generateTokenPair(user.getUsername());

            payload.put("user", user);

            return ResponseEntity.ok(payload);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        String jwtToken = jwtService.resolveToken(request);

        if (jwtToken != null) {
            try {
                jwtService.revokeToken(jwtToken);
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Failed to revoke token."));
            }
        }

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logout Successful."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> requestBody) {
        String refreshToken = requestBody.get("refreshToken");

        try {
            String newAccessToken = jwtService.refreshAccessToken(refreshToken);

            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

}
