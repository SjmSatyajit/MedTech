package com.medtech.controller;

import com.medtech.dto.BookingRequest;
import com.medtech.model.Booking;
import com.medtech.model.User;
import com.medtech.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @AuthenticationPrincipal User user,
            @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(user, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getMyBookings(user.getId()));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Booking>> getHospitalBookings(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(bookingService.getHospitalBookings(hospitalId));
    }

    @GetMapping("/hospital/pending/{hospitalId}")
    public ResponseEntity<List<Booking>> getPendingHospitalBookings(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(bookingService.getPendingHospitalBookings(hospitalId));
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status, user));
    }
}
