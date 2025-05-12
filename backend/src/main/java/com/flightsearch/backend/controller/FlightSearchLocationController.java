package com.flightsearch.backend.controller;

import com.flightsearch.backend.dto.request.FlightSearchRequestDTO;
import com.flightsearch.backend.dto.request.LocationSearchRequestDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;
import com.flightsearch.backend.dto.response.LocationSearchResponseDTO;
import com.flightsearch.backend.service.SearchFlightService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@CrossOrigin("*") // IMPORTANT: configure this in after going prod
@AllArgsConstructor
@RestController
@RequestMapping(value="/api/search")
public class FlightSearchLocationController {
    private SearchFlightService searchFlightService;

    @GetMapping
    public Mono<ResponseEntity<List<FlightSearchResponseDTO>>> searchFlights(@RequestBody FlightSearchRequestDTO flightSearchRequestDTO) {
        Mono<List<FlightSearchResponseDTO>> flightSearchResponseDTO = searchFlightService.getFlights(flightSearchRequestDTO);
        return flightSearchResponseDTO
                .map(ResponseEntity::ok) // Map the list to a 200 OK response
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<LocationSearchResponseDTO>> searchLocations(@RequestBody LocationSearchRequestDTO locationSearchRequestDTO) {
        Mono<LocationSearchResponseDTO> locationSearchResponseDTO = searchFlightService.getLocations(locationSearchRequestDTO);
        return locationSearchResponseDTO
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()); // Disable CSRF protection
        //  authorizeRequests configurations.
        return http.build();
    }
}
