package com.medtech.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO {
    private String resourceType; // e.g. BLOOD, ICU_BED
    private String subType;      // e.g. A+, O-
    private Integer quantity;
    private Integer minThreshold;
    private String unit;
}
