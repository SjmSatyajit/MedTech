package com.medtech.repository;

import com.medtech.model.SosRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosRequestRepository extends JpaRepository<SosRequest, Long> {
    List<SosRequest> findByResolvedFalseOrderByCreatedAtDesc();
}
