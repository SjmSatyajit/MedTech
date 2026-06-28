package com.medtech.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long resourceId;
    private Integer quantity;
    private String notes;
    private boolean urgent;
}
