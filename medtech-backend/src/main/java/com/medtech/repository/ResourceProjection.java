package com.medtech.repository;

public interface ResourceProjection {
    Long getResourceId();
    String getResourceType();
    String getSubType();
    Integer getQuantity();
    String getUnit();
    String getHospitalName();
    String getHospitalContact();
    String getHospitalType();
    Double getLatitude();
    Double getLongitude();
    Double getDistanceKm();
}
