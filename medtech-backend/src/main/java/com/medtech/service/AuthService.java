package com.medtech.service;

import com.medtech.dto.LoginRequest;
import com.medtech.dto.LoginResponse;
import com.medtech.dto.RegisterRequest;
import com.medtech.model.Hospital;
import com.medtech.model.User;
import com.medtech.model.enums.HospitalType;
import com.medtech.model.enums.Role;
import com.medtech.repository.HospitalRepository;
import com.medtech.repository.UserRepository;
import com.medtech.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    // In-memory store for reset codes (for demo purposes)
    private final Map<String, ResetCodeData> resetCodes = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository, HospitalRepository hospitalRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already taken");
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .role(role)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        if (role == Role.HOSPITAL) {
            HospitalType type = HospitalType.valueOf(request.getHospitalType().toUpperCase());
            Hospital hospital = Hospital.builder()
                    .user(savedUser)
                    .name(request.getHospitalName())
                    .address(request.getHospitalAddress())
                    .city(request.getHospitalCity())
                    .contact(request.getPhone())
                    .email(request.getEmail())
                    .type(type)
                    .latitude(request.getLatitude() != null ? request.getLatitude() : new BigDecimal("20.2961"))
                    .longitude(request.getLongitude() != null ? request.getLongitude() : new BigDecimal("85.8189"))
                    .approved(false)
                    .rating(BigDecimal.ZERO)
                    .build();
            hospitalRepository.save(hospital);
        }

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new LoginResponse(token, user);
    }

    @Transactional
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        String resetCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDateTime expiry = LocalDateTime.now().plusHours(1);

        user.setResetToken(resetCode);
        user.setResetTokenExpiry(expiry);
        userRepository.save(user);

        // In a production system, send this via email. For demo, we store it in memory too.
        resetCodes.put(email, new ResetCodeData(resetCode, expiry));

        return resetCode;
    }

    @Transactional
    public void resetPassword(String email, String code, String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        ResetCodeData stored = resetCodes.get(email);

        if (stored == null) {
            throw new IllegalArgumentException("No reset code requested for this email");
        }

        if (!stored.code.equals(code.toUpperCase())) {
            throw new IllegalArgumentException("Invalid reset code");
        }

        if (stored.expiry.isBefore(LocalDateTime.now())) {
            resetCodes.remove(email);
            throw new IllegalArgumentException("Reset code has expired. Please request a new one.");
        }

        user.setPassword(newPassword);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        resetCodes.remove(email);
    }

    private record ResetCodeData(String code, LocalDateTime expiry) {}
}
