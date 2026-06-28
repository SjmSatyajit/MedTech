package com.medtech.service;

import com.medtech.dto.BookingRequest;
import com.medtech.model.Booking;
import com.medtech.model.Hospital;
import com.medtech.model.MedicalResource;
import com.medtech.model.User;
import com.medtech.model.enums.BookingStatus;
import com.medtech.model.enums.NotificationType;
import com.medtech.repository.BookingRepository;
import com.medtech.repository.HospitalRepository;
import com.medtech.repository.ResourceRepository;
import com.medtech.websocket.StockUpdateHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final HospitalRepository hospitalRepository;
    private final NotificationService notificationService;
    private final StockUpdateHandler stockUpdateHandler;

    public BookingService(BookingRepository bookingRepository,
                          ResourceRepository resourceRepository,
                          HospitalRepository hospitalRepository,
                          NotificationService notificationService,
                          StockUpdateHandler stockUpdateHandler) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.hospitalRepository = hospitalRepository;
        this.notificationService = notificationService;
        this.stockUpdateHandler = stockUpdateHandler;
    }

    @Transactional
    public Booking createBooking(User user, BookingRequest request) {
        MedicalResource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));

        if (resource.getQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock");
        }

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .quantity(request.getQuantity())
                .status(BookingStatus.PENDING)
                .urgent(request.isUrgent())
                .notes(request.getNotes())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Notify Hospital Manager of incoming booking
        notificationService.sendNotification(
                resource.getHospital().getUser(),
                "New Booking Request",
                "New booking request for " + resource.getResourceType().name() + " (" + 
                        (resource.getSubType() != null ? resource.getSubType() : "General") + 
                        ") - Qty: " + request.getQuantity() + ". Urgency: " + (request.isUrgent() ? "URGENT" : "Normal"),
                NotificationType.SYSTEM
        );

        return savedBooking;
    }

    public List<Booking> getMyBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Booking> getHospitalBookings(Long hospitalId) {
        return bookingRepository.findByResourceHospitalHospitalIdOrderByCreatedAtDesc(hospitalId);
    }

    public List<Booking> getPendingHospitalBookings(Long hospitalId) {
        return bookingRepository.findByResourceHospitalHospitalIdAndStatusOrderByUrgentDescCreatedAtAsc(
                hospitalId, BookingStatus.PENDING
        );
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, String statusStr, User actor) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        BookingStatus newStatus = BookingStatus.valueOf(statusStr.toUpperCase());
        BookingStatus oldStatus = booking.getStatus();

        if (oldStatus == newStatus) {
            return booking;
        }

        MedicalResource resource = booking.getResource();
        Hospital hospital = resource.getHospital();

        // Security check: Only patient can cancel. Only hospital manager/admin can confirm/reject.
        if (newStatus == BookingStatus.CANCELLED) {
            if (!booking.getUser().getId().equals(actor.getId())) {
                throw new SecurityException("You are not authorized to cancel this booking");
            }
        } else {
            // Confirm/Reject
            if (!hospital.getUser().getId().equals(actor.getId()) && actor.getRole() != com.medtech.model.enums.Role.ADMIN) {
                throw new SecurityException("You are not authorized to manage this booking");
            }
        }

        if (newStatus == BookingStatus.CONFIRMED) {
            if (resource.getQuantity() < booking.getQuantity()) {
                throw new IllegalArgumentException("Cannot confirm booking: Insufficient resource stock");
            }
        }

        booking.setStatus(newStatus);
        Booking saved = bookingRepository.saveAndFlush(booking);

        // Process triggers & notify
        if (newStatus == BookingStatus.CONFIRMED) {
            // Refresh resource from database to get the post-trigger quantity
            MedicalResource updatedResource = resourceRepository.findById(resource.getResourceId())
                    .orElseThrow(() -> new IllegalStateException("Resource disappeared"));

            // Broadcast the new quantity to WebSocket clients
            stockUpdateHandler.sendStockUpdate(hospital.getHospitalId(), resource.getResourceId(), updatedResource.getQuantity());

            // Notify patient
            notificationService.sendNotification(
                    booking.getUser(),
                    "Booking Confirmed",
                    "Your booking request for " + resource.getResourceType().name() + " has been CONFIRMED by " + hospital.getName(),
                    NotificationType.BOOKING_CONFIRMED
            );
        } else if (newStatus == BookingStatus.REJECTED) {
            notificationService.sendNotification(
                    booking.getUser(),
                    "Booking Rejected",
                    "Your booking request for " + resource.getResourceType().name() + " was REJECTED by " + hospital.getName(),
                    NotificationType.BOOKING_REJECTED
            );
        }

        return saved;
    }
}
