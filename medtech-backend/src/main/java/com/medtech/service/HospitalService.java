package com.medtech.service;

import com.medtech.model.Hospital;
import com.medtech.repository.HospitalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public List<Hospital> getPendingHospitals() {
        return hospitalRepository.findByApproved(false);
    }

    public List<Hospital> getApprovedHospitals() {
        return hospitalRepository.findByApproved(true);
    }

    public Optional<Hospital> getHospitalById(Long id) {
        return hospitalRepository.findById(id);
    }

    public Optional<Hospital> getHospitalByUserId(Long userId) {
        return hospitalRepository.findByUserId(userId);
    }

    @Transactional
    public Hospital approveHospital(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        hospital.setApproved(true);
        return hospitalRepository.save(hospital);
    }

    @Transactional
    public Hospital updateRating(Long id, BigDecimal newRating) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        hospital.setRating(newRating);
        return hospitalRepository.save(hospital);
    }
}
