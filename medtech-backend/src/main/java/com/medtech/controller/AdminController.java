package com.medtech.controller;

import com.medtech.model.Hospital;
import com.medtech.model.User;
import com.medtech.repository.UserRepository;
import com.medtech.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final HospitalService hospitalService;
    private final UserRepository userRepository;

    public AdminController(HospitalService hospitalService, UserRepository userRepository) {
        this.hospitalService = hospitalService;
        this.userRepository = userRepository;
    }

    @GetMapping("/hospitals/pending")
    public ResponseEntity<List<Hospital>> getPendingHospitals() {
        return ResponseEntity.ok(hospitalService.getPendingHospitals());
    }

    @PutMapping("/hospitals/{id}/approve")
    public ResponseEntity<Hospital> approveHospital(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.approveHospital(id));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
