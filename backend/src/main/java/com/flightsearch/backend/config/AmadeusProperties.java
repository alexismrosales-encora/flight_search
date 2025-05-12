package com.flightsearch.backend.config;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration class for Amadeus API properties.
 *
 * This class is used to map properties from configuration files
 * from environment variables to Java fields.
 * The 'amadeus' prefix is used to group related properties.
 */
@Validated
@Setter
@Getter
@AllArgsConstructor
@ConfigurationProperties(prefix = "amadeus")
public class AmadeusProperties {
    private final String host;
    private final String apiKey;
    private final String apiSecret;
}
