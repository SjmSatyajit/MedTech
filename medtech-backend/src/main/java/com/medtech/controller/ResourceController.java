package com.medtech.controller;

import com.medtech.dto.ResourceDTO;
import com.medtech.model.MedicalResource;
import com.medtech.model.User;
import com.medtech.repository.ResourceProjection;
import com.medtech.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ResourceProjection>> getNearbyResources(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double radius,
            @RequestParam(required = false) String type) {
        // If type is empty, set it to null or empty string so procedure doesn't filter
        String parsedType = (type == null || type.trim().isEmpty() || type.equalsIgnoreCase("All")) ? "" : type.toUpperCase();
        return ResponseEntity.ok(resourceService.getNearbyResources(lat, lng, radius, parsedType));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<MedicalResource>> getHospitalResources(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(resourceService.getHospitalResources(hospitalId));
    }

    @PostMapping
    public ResponseEntity<MedicalResource> addResource(
            @AuthenticationPrincipal User user,
            @RequestBody ResourceDTO dto) {
        return ResponseEntity.ok(resourceService.addResource(user, dto));
    }

    @PutMapping("/{resourceId}/quantity")
    public ResponseEntity<MedicalResource> updateQuantity(
            @PathVariable Long resourceId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(resourceService.updateQuantity(resourceId, quantity, user));
    }
}
