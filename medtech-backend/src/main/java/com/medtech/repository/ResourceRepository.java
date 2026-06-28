package com.medtech.repository;

import com.medtech.model.MedicalResource;
import com.medtech.model.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<MedicalResource, Long> {
    
    List<MedicalResource> findByHospitalHospitalId(Long hospitalId);
    
    Optional<MedicalResource> findByHospitalHospitalIdAndResourceTypeAndSubType(
            Long hospitalId, 
            ResourceType resourceType, 
            String subType
    );
    
    @Query("SELECT r FROM MedicalResource r WHERE r.quantity <= r.minThreshold AND r.available = true")
    List<MedicalResource> findLowStockResources();
    
    @Query(value = "CALL get_nearby_resources(:lat, :lng, :radius, :type)", nativeQuery = true)
    List<ResourceProjection> getNearbyResources(
            @Param("lat") Double lat, 
            @Param("lng") Double lng, 
            @Param("radius") Double radius, 
            @Param("type") String type
    );
}
