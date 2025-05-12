package com.flightsearch.backend.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * This class is a Spring configuration that defines beans related to WebClient.
 */
@Configuration
@AllArgsConstructor
public class WebClientConfig {
    private final AmadeusProperties amadeusProperties;
    /**
     * Defines a Spring Bean for a reactive WebClient that can be used
     * to make HTTP requests, specifically intended for the Amadeus API.
     *
     * @return A configured instance of WebClient.
     */
    @Bean
    public WebClient amadeusWebClient() {
        String baseUrl = amadeusProperties.getHost();

        // Allocating 5mbs of max data to pass
        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                .codecs(clientCodecConfigurer -> clientCodecConfigurer.defaultCodecs().maxInMemorySize(5 * 1024 * 1024))
                .build();
        return WebClient.builder().baseUrl(baseUrl).exchangeStrategies(exchangeStrategies).build();
    }
}
