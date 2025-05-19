package com.flightsearch.backend.auth;

import com.flightsearch.backend.config.AmadeusProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
@RequiredArgsConstructor
public class AmadeusTokenService {
    private final WebClient amadeusWebClient;
    private final AmadeusProperties amadeusProperties;
    private final AtomicReference<Token> cache = new AtomicReference<>();

    // getBearerToken: if token is expired or is not already created, a new token is generated
    public String getBearerToken() {
        Token token = cache.get();
        // When token is expired or invalid
        if (token == null || token.isExpired()) {
            token = fetchNewToken();
            cache.set(token);
        }
        log.info("Expires In Bearer Token: {}", token.expiresAt);
        return token.value;
    }

    // Ask for a response to the Amadeus Auth API service
    private Token fetchNewToken() {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        // Requested body by Amadeus to get access token
        // Source: https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/API-Keys/authorization/#requesting-an-access-token
        body.add("grant_type", "client_credentials");
        body.add("client_id", amadeusProperties.getApiKey());
        body.add("client_secret", amadeusProperties.getApiSecret());

        // HTTP Request with credential as a body
        TokenResponse tokenResponse = amadeusWebClient.post()
                .uri( "/v1/security/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(body))
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .block();
        Instant expiresAt = Instant.now()
                .plusSeconds(tokenResponse.expiresIn() - 30);
        return new Token(tokenResponse.accessToken(), expiresAt);
    }

    // Record for the token and now if it is valid
    private record Token(String value, Instant expiresAt) {
        boolean isExpired() { return Instant.now().isAfter(expiresAt); }
    }

    // Record for the Token response to access data
    private record TokenResponse(String access_token, String token_type, int expires_in, String state) {
        String accessToken() { return access_token; }
        int    expiresIn()  { return expires_in;  }
    }
}
