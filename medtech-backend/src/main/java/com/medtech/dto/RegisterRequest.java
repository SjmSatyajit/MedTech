package com.medtech.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    // User fields
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role; // PATIENT or HOSPITAL

    // Hospital fields (optional, only if role is HOSPITAL)
    private String hospitalName;
    private String hospitalAddress;
    private String hospitalCity;
    private String hospitalType; // HOSPITAL, BLOOD_BANK, etc.
    private BigDecimal latitude;
    private BigDecimal longitude;
}
