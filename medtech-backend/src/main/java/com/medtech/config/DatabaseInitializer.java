package com.medtech.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create Stored Procedure (get_nearby_resources)
        jdbcTemplate.execute("DROP PROCEDURE IF EXISTS get_nearby_resources");
        jdbcTemplate.execute(
            "CREATE PROCEDURE get_nearby_resources(\n" +
            "  IN p_lat       DOUBLE,\n" +
            "  IN p_lng       DOUBLE,\n" +
            "  IN p_radius_km DOUBLE,\n" +
            "  IN p_type      VARCHAR(30)\n" +
            ")\n" +
            "BEGIN\n" +
            "  SELECT\n" +
            "    r.resource_id,\n" +
            "    r.resource_type,\n" +
            "    r.sub_type,\n" +
            "    r.quantity,\n" +
            "    r.unit,\n" +
            "    h.name       AS hospital_name,\n" +
            "    h.contact    AS hospital_contact,\n" +
            "    h.type       AS hospital_type,\n" +
            "    h.latitude,\n" +
            "    h.longitude,\n" +
            "    ROUND(\n" +
            "      6371 * ACOS(\n" +
            "        COS(RADIANS(p_lat)) * COS(RADIANS(h.latitude)) *\n" +
            "        COS(RADIANS(h.longitude) - RADIANS(p_lng)) +\n" +
            "        SIN(RADIANS(p_lat)) * SIN(RADIANS(h.latitude))\n" +
            "      ), 2\n" +
            "    ) AS distance_km\n" +
            "  FROM resources r\n" +
            "  JOIN hospitals h ON r.hospital_id = h.hospital_id\n" +
            "  WHERE\n" +
            "    h.approved = TRUE\n" +
            "    AND r.available = TRUE\n" +
            "    AND r.quantity > 0\n" +
            "    AND (p_type IS NULL OR p_type = '' OR r.resource_type = p_type)\n" +
            "    AND (\n" +
            "      6371 * ACOS(\n" +
            "        COS(RADIANS(p_lat)) * COS(RADIANS(h.latitude)) *\n" +
            "        COS(RADIANS(h.longitude) - RADIANS(p_lng)) +\n" +
            "        SIN(RADIANS(p_lat)) * SIN(RADIANS(h.latitude))\n" +
            "      ) <= p_radius_km\n" +
            "    )\n" +
            "  ORDER BY distance_km ASC;\n" +
            "END"
        );

        // Create Trigger (after_booking_confirmed)
        jdbcTemplate.execute("DROP TRIGGER IF EXISTS after_booking_confirmed");
        jdbcTemplate.execute(
            "CREATE TRIGGER after_booking_confirmed\n" +
            "AFTER UPDATE ON bookings\n" +
            "FOR EACH ROW\n" +
            "BEGIN\n" +
            "  IF NEW.status = 'CONFIRMED' AND OLD.status = 'PENDING' THEN\n" +
            "    UPDATE resources\n" +
            "    SET quantity = quantity - NEW.quantity\n" +
            "    WHERE resource_id = NEW.resource_id\n" +
            "      AND quantity >= NEW.quantity;\n" +
            "\n" +
            "    INSERT INTO resource_history (resource_id, old_quantity, new_quantity, change_reason, changed_at)\n" +
            "    SELECT NEW.resource_id,\n" +
            "           quantity + NEW.quantity,\n" +
            "           quantity,\n" +
            "           'BOOKING',\n" +
            "           NOW()\n" +
            "    FROM resources\n" +
            "    WHERE resource_id = NEW.resource_id;\n" +
            "  END IF;\n" +
            "END"
        );
    }
}
