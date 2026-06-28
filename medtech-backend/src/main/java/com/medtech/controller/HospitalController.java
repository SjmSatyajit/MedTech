package com.medtech.controller;

import com.medtech.model.Hospital;
import com.medtech.model.User;
import com.medtech.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<Hospital>> getHospitals(@RequestParam(required = false) Boolean approved) {
        if (approved != null) {
            return ResponseEntity.ok(approved ? hospitalService.getApprovedHospitals() : hospitalService.getPendingHospitals());
        }
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/my")
    public ResponseEntity<Hospital> getMyHospital(@AuthenticationPrincipal User user) {
        return hospitalService.getHospitalByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        return hospitalService.getHospitalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
