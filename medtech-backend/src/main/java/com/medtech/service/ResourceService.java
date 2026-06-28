package com.medtech.service;

import com.medtech.dto.ResourceDTO;
import com.medtech.model.Hospital;
import com.medtech.model.MedicalResource;
import com.medtech.model.ResourceHistory;
import com.medtech.model.User;
import com.medtech.model.enums.ChangeReason;
import com.medtech.model.enums.NotificationType;
import com.medtech.model.enums.ResourceType;
import com.medtech.repository.*;
import com.medtech.websocket.StockUpdateHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final HospitalRepository hospitalRepository;
    private final ResourceHistoryRepository historyRepository;
    private final NotificationService notificationService;
    private final StockUpdateHandler stockUpdateHandler;

    public ResourceService(ResourceRepository resourceRepository,
                           HospitalRepository hospitalRepository,
                           ResourceHistoryRepository historyRepository,
                           NotificationService notificationService,
                           StockUpdateHandler stockUpdateHandler) {
        this.resourceRepository = resourceRepository;
        this.hospitalRepository = hospitalRepository;
        this.historyRepository = historyRepository;
        this.notificationService = notificationService;
        this.stockUpdateHandler = stockUpdateHandler;
    }

    public List<ResourceProjection> getNearbyResources(Double lat, Double lng, Double radius, String type) {
        return resourceRepository.getNearbyResources(lat, lng, radius, type);
    }

    public List<MedicalResource> getHospitalResources(Long hospitalId) {
        return resourceRepository.findByHospitalHospitalId(hospitalId);
    }

    @Transactional
    public MedicalResource addResource(User user, ResourceDTO dto) {
        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Hospital profile not found for user: " + user.getId()));

        ResourceType type = ResourceType.valueOf(dto.getResourceType().toUpperCase());
        String subType = dto.getSubType() != null && !dto.getSubType().trim().isEmpty() 
                ? dto.getSubType().toUpperCase() : null;

        Optional<MedicalResource> existingOpt = resourceRepository
                .findByHospitalHospitalIdAndResourceTypeAndSubType(hospital.getHospitalId(), type, subType);

        MedicalResource resource;
        int oldQty = 0;
        if (existingOpt.isPresent()) {
            resource = existingOpt.get();
            oldQty = resource.getQuantity();
            resource.setQuantity(resource.getQuantity() + dto.getQuantity());
            if (dto.getMinThreshold() != null) resource.setMinThreshold(dto.getMinThreshold());
            if (dto.getUnit() != null) resource.setUnit(dto.getUnit());
            resource.setAvailable(true);
        } else {
            resource = MedicalResource.builder()
                    .hospital(hospital)
                    .resourceType(type)
                    .subType(subType)
                    .quantity(dto.getQuantity())
                    .minThreshold(dto.getMinThreshold() != null ? dto.getMinThreshold() : 5)
                    .unit(dto.getUnit() != null ? dto.getUnit() : "units")
                    .available(true)
                    .build();
        }

        MedicalResource saved = resourceRepository.save(resource);

        // Record history
        historyRepository.save(ResourceHistory.builder()
                .resource(saved)
                .oldQuantity(oldQty)
                .newQuantity(saved.getQuantity())
                .changeReason(ChangeReason.RESTOCK)
                .changedBy(user)
                .build());

        // Broadcast Live WebSocket Stock Update
        stockUpdateHandler.sendStockUpdate(hospital.getHospitalId(), saved.getResourceId(), saved.getQuantity());

        return saved;
    }

    @Transactional
    public MedicalResource updateQuantity(Long resourceId, Integer newQuantity, User user) {
        MedicalResource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));

        int oldQty = resource.getQuantity();
        resource.setQuantity(newQuantity);
        resource.setAvailable(newQuantity > 0);

        MedicalResource saved = resourceRepository.save(resource);

        // Record history
        historyRepository.save(ResourceHistory.builder()
                .resource(saved)
                .oldQuantity(oldQty)
                .newQuantity(newQuantity)
                .changeReason(ChangeReason.MANUAL_UPDATE)
                .changedBy(user)
                .build());

        // Broadcast Live WebSocket Stock Update
        stockUpdateHandler.sendStockUpdate(resource.getHospital().getHospitalId(), resourceId, newQuantity);

        // Threshold notification alert
        if (newQuantity <= resource.getMinThreshold()) {
            notificationService.sendNotification(
                    resource.getHospital().getUser(),
                    "Low Stock Alert",
                    "Resource " + resource.getResourceType().name() + " (" + 
                            (resource.getSubType() != null ? resource.getSubType() : "General") + 
                            ") has dropped to critical level: " + newQuantity + " units remaining.",
                    NotificationType.STOCK_ALERT
            );
        }

        return saved;
    }
}
