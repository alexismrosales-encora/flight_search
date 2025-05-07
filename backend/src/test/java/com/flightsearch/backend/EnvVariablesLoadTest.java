package com.flightsearch.backend;

import com.flightsearch.backend.config.AmadeusProperties;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Verifies that Gradle really passed the .env.dev variables
 * to the JVM running the tests.
 */

public class EnvVariablesLoadTest {
    private static final Logger log = LoggerFactory.getLogger(EnvVariablesLoadTest.class);
    // Try the test with this properties
    private final AmadeusProperties amadeusProperties = new AmadeusProperties();

    @Test
    void testApiPresent(){
        String host = System.getenv("AMADEUS_HOST");
        log.info("Host API is: {}", host);
        assertNotNull(host, "TEST_API should be in the environment");
    }

    @Test
    void apiKeyPresent(){
        String apiKey = System.getenv("AMADEUS_API_KEY");
        assertNotNull(apiKey, "API_KEY should be in the environment");
    }

    @Test
    void secretKeyPresent(){
        String secretKey = System.getenv("AMADEUS_SECRET_KEY");
        assertNotNull(secretKey, "SECRET_KEY should be in the environment");
    }
}
