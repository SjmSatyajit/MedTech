package com.medtech.repository;

import com.medtech.model.ResourceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceHistoryRepository extends JpaRepository<ResourceHistory, Long> {
    List<ResourceHistory> findByResourceResourceIdOrderByChangedAtDesc(Long resourceId);
}
