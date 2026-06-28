package com.medtech.repository;

import com.medtech.model.Booking;
import com.medtech.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByResourceHospitalHospitalIdOrderByCreatedAtDesc(Long hospitalId);
    List<Booking> findByResourceHospitalHospitalIdAndStatusOrderByUrgentDescCreatedAtAsc(
            Long hospitalId, 
            BookingStatus status
    );
}
