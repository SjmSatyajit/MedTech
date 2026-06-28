-- ============================================================
-- SEED DATA (Safe for multiple runs)
-- ============================================================

-- 1. Insert Users
INSERT INTO users (id, name, email, password, phone, role, enabled)
SELECT 1, 'Admin', 'admin@medtech.com', 'admin@123', '1234567890', 'ADMIN', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);

INSERT INTO users (id, name, email, password, phone, role, enabled)
SELECT 2, 'Dr. Meena Nair', 'apollo@medtech.com', 'apollo@123', '9876543210', 'HOSPITAL', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 2);

INSERT INTO users (id, name, email, password, phone, role, enabled)
SELECT 3, 'Dr. Ravi Sharma', 'fortis@medtech.com', 'fortis@123', '9876543211', 'HOSPITAL', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 3);

INSERT INTO users (id, name, email, password, phone, role, enabled)
SELECT 4, 'City Amb Manager', 'cityamb@medtech.com', 'cityamb@123', '9876543212', 'HOSPITAL', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 4);

INSERT INTO users (id, name, email, password, phone, role, enabled)
SELECT 5, 'Rajesh Kumar', 'rajesh@example.com', 'rajesh@123', '9988776655', 'PATIENT', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 5);


-- 2. Insert Hospitals
INSERT INTO hospitals (hospital_id, user_id, name, address, city, state, contact, email, type, latitude, longitude, approved, rating)
SELECT 1, 2, 'Apollo Hospital Bhubaneswar', 'Plot No 251, Sainik School Rd', 'Bhubaneswar', 'Odisha', '0674-6660102', 'apollo@medtech.com', 'HOSPITAL', 20.2961000, 85.8149000, TRUE, 4.5
FROM dual WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE hospital_id = 1);

INSERT INTO hospitals (hospital_id, user_id, name, address, city, state, contact, email, type, latitude, longitude, approved, rating)
SELECT 2, 3, 'Fortis Blood Bank', 'Nayapalli, Bhubaneswar', 'Bhubaneswar', 'Odisha', '0674-3456789', 'fortis@medtech.com', 'BLOOD_BANK', 20.2816000, 85.8358000, TRUE, 4.7
FROM dual WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE hospital_id = 2);

INSERT INTO hospitals (hospital_id, user_id, name, address, city, state, contact, email, type, latitude, longitude, approved, rating)
SELECT 3, 4, 'City Ambulance Services', 'Saheed Nagar', 'Bhubaneswar', 'Odisha', '0674-5678901', 'cityamb@medtech.com', 'AMBULANCE_SERVICE', 20.2867000, 85.8374000, TRUE, 4.3
FROM dual WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE hospital_id = 3);


-- 3. Insert Resources
-- Apollo Hospital (hospital_id = 1)
INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 1, 1, 'BLOOD', 'A+', 15, 5, 'units', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 1);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 2, 1, 'BLOOD', 'O-', 4, 3, 'units', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 2);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 3, 1, 'BLOOD', 'B+', 11, 5, 'units', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 3);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 4, 1, 'BLOOD', 'AB+', 6, 3, 'units', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 4);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 5, 1, 'ICU_BED', NULL, 5, 2, 'beds', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 5);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 6, 1, 'OXYGEN_CYLINDER', NULL, 12, 4, 'cylinders', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 6);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 7, 1, 'AMBULANCE', NULL, 3, 1, 'vehicles', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 7);

-- Fortis Blood Bank (hospital_id = 2)
INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 8, 2, 'BLOOD', 'A+', 8, 5, 'units', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 8);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 9, 2, 'BLOOD', 'O-', 2, 3, 'units', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 9);

INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 10, 2, 'BLOOD', 'AB-', 3, 2, 'units', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 10);

-- City Ambulance (hospital_id = 3)
INSERT INTO resources (resource_id, hospital_id, resource_type, sub_type, quantity, min_threshold, unit, available)
SELECT 11, 3, 'AMBULANCE', NULL, 6, 2, 'vehicles', TRUE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM resources WHERE resource_id = 11);
