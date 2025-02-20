package com.classtask.server.service;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.classtask.server.entity.User;
import com.classtask.server.repository.UserRepository;
import com.classtask.server.request.RegisterRequest;
import com.classtask.server.util.Constants;
import com.classtask.server.util.Util;
import com.resend.core.exception.ResendException;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private EmailService emailService;

    @Value("${classtask.app.url}")
    private String baseUrl;

    @Value("${classtask.app.icon}")
    private String iconUrl;

    @Value("classpath:templates/email.html")
    private Resource emailTemplate;

    public User register(RegisterRequest registerRequest) throws Exception {
        registerRequest.setUsername(registerRequest.getUsername().toLowerCase());

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already taken.");
        }

        User user = new User();

        user.setId(Util.randomId());
        user.setDisplayName(registerRequest.getDisplayName());
        user.setCreatedTime(Timestamp.from(Instant.now()));
        user.setUsername(registerRequest.getUsername().toLowerCase());
        user.setEmail(registerRequest.getEmail().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        generateVerificationToken(user);

        User registered = userRepository.save(user);
        sendVerificationEmail(registered);

        return registered;
    }

    public User verify(String token) {
        User user = userRepository.findByVerificationToken(token);

        if (user != null && user.getTokenExpiryTime().after(new Timestamp(System.currentTimeMillis()))) {
            user.setVerified(true);
            user.setVerificationToken(null);
            user.setTokenExpiryTime(null);
            return userRepository.save(user);
        }

        throw new IllegalArgumentException("Invalid or expired token");
    }


    public void generateVerificationToken(User user) {
        String token = Util.randomId();
        Timestamp expiry = Timestamp.from(Instant.now().plusSeconds(Constants.VERIFICATION_EXPIRY_TIME));

        user.setVerificationToken(token);
        user.setTokenExpiryTime(expiry);
    }

    public void sendVerificationEmail(User user) throws ResendException {
        String verificationLink = String.format("%s/verify?token=%s", baseUrl, user.getVerificationToken());
        String content;

        try {
            content = new String(emailTemplate.getInputStream().readAllBytes());
            content = content
                    .replaceAll(Pattern.quote("{USERNAME}"), user.getDisplayName())
                    .replaceAll(Pattern.quote("{IMAGE_URL}"), iconUrl)
                    .replaceAll(Pattern.quote("{VERIFICATION_URL}"), verificationLink)
                    .replaceAll(Pattern.quote("{APP_URL}"), baseUrl);
        } catch (IOException e) {
            content = new StringBuilder()
                    .append("ClassTask Account Verification\n\n")
                    .append("Please verify your email by clicking the link below.\n\n")
                    .append(verificationLink)
                    .append("\n\nClassTask | ")
                    .append(baseUrl)
                    .toString();
        }

        emailService.sendEmail(user.getEmail(), "Verify Your ClassTask Email", content);
    }

    public void refreshVerificationToken(String email) throws ResendException {
        User user = userRepository.findByEmail(email);

        if (user.isVerified()) {
            throw new RuntimeException("User is already verified");
        }

        generateVerificationToken(user);

        userRepository.save(user);
        sendVerificationEmail(user);
    }
}
