package com.medtech.controller;

import com.medtech.model.SosRequest;
import com.medtech.model.User;
import com.medtech.service.SosService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
public class SosController {

    private final SosService sosService;

    public SosController(SosService sosService) {
        this.sosService = sosService;
    }

    @PostMapping
    public ResponseEntity<SosRequest> createSosRequest(
            @AuthenticationPrincipal User user,
            @RequestBody SosRequest request) {
        return ResponseEntity.ok(sosService.createSosRequest(user, request));
    }

    @GetMapping("/active")
    public ResponseEntity<List<SosRequest>> getActiveSosRequests() {
        return ResponseEntity.ok(sosService.getActiveSosRequests());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<SosRequest> resolveSosRequest(@PathVariable Long id) {
        return ResponseEntity.ok(sosService.resolveSosRequest(id));
    }
}
