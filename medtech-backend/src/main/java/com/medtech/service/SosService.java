package com.medtech.service;

import com.medtech.model.Hospital;
import com.medtech.model.SosRequest;
import com.medtech.model.User;
import com.medtech.model.enums.NotificationType;
import com.medtech.repository.HospitalRepository;
import com.medtech.repository.SosRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SosService {

    private final SosRequestRepository sosRequestRepository;
    private final HospitalRepository hospitalRepository;
    private final NotificationService notificationService;

    public SosService(SosRequestRepository sosRequestRepository,
                      HospitalRepository hospitalRepository,
                      NotificationService notificationService) {
        this.sosRequestRepository = sosRequestRepository;
        this.hospitalRepository = hospitalRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public SosRequest createSosRequest(User user, SosRequest sosRequest) {
        sosRequest.setUser(user);
        sosRequest.setResolved(false);
        SosRequest saved = sosRequestRepository.save(sosRequest);

        // Notify nearby hospitals within the radius
        List<Hospital> hospitals = hospitalRepository.findByApproved(true);
        double requestLat = sosRequest.getLatitude().doubleValue();
        double requestLng = sosRequest.getLongitude().doubleValue();
        double radius = sosRequest.getRadiusKm();

        for (Hospital h : hospitals) {
            double hLat = h.getLatitude().doubleValue();
            double hLng = h.getLongitude().doubleValue();
            double distance = calculateDistance(requestLat, requestLng, hLat, hLng);
            
            if (distance <= radius) {
                notificationService.sendNotification(
                        h.getUser(),
                        "EMERGENCY SOS BROADCAST",
                        "Patient " + user.getName() + " initiated a nearby SOS broadcast for " + 
                                sosRequest.getResourceType().name() + " (" + 
                                (sosRequest.getSubType() != null ? sosRequest.getSubType() : "General") + 
                                ") within " + radius + " km. Message: " + sosRequest.getMessage(),
                        NotificationType.SOS_ALERT
                );
            }
        }

        return saved;
    }

    public List<SosRequest> getActiveSosRequests() {
        return sosRequestRepository.findByResolvedFalseOrderByCreatedAtDesc();
    }

    @Transactional
    public SosRequest resolveSosRequest(Long sosId) {
        SosRequest sosRequest = sosRequestRepository.findById(sosId)
                .orElseThrow(() -> new IllegalArgumentException("SOS request not found"));
        sosRequest.setResolved(true);
        return sosRequestRepository.save(sosRequest);
    }

    // Haversine Distance Formula in Java (Returns distance in kilometers)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
