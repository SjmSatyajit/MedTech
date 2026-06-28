package com.medtech.model;

import com.medtech.model.enums.ResourceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources", uniqueConstraints = {
    @UniqueConstraint(name = "uq_hospital_resource", columnNames = {"hospital_id", "resource_type", "sub_type"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_id")
    private Long resourceId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false)
    private ResourceType resourceType;

    @Column(name = "sub_type", length = 50)
    private String subType;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Column(name = "min_threshold")
    @Builder.Default
    private Integer minThreshold = 5;

    @Column(length = 30)
    @Builder.Default
    private String unit = "units";

    @Column(nullable = false)
    @Builder.Default
    private boolean available = true;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
