package com.flightsearch.backend.controller;

import com.flightsearch.backend.dto.request.AirportSearchByCodeRequestDTO;
import com.flightsearch.backend.dto.request.CitySearchByCodeRequestDTO;
import com.flightsearch.backend.dto.request.FlightSearchRequestDTO;
import com.flightsearch.backend.dto.request.LocationSearchRequestDTO;
import com.flightsearch.backend.dto.response.AirportSearchByCodeResponseDTO;
import com.flightsearch.backend.dto.response.CitySearchByCodeResponseDTO;
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

    @PostMapping
    // searchFlights: exposes the endpoint to receive in POST HTTP method the body of the FlightSearchRequestDTO to handle a response
    // with the flights offer information
    public Mono<ResponseEntity<List<FlightSearchResponseDTO>>> searchFlights(@RequestBody FlightSearchRequestDTO flightSearchRequestDTO) {
        Mono<List<FlightSearchResponseDTO>> flightSearchResponseDTO = searchFlightService.getFlights(flightSearchRequestDTO);
        return flightSearchResponseDTO
                .map(ResponseEntity::ok) // Map the list to a 200 OK response
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping
    // searchLocations: exposes the endpoint to receive GET HTTP method to response with the name of the locations based on
    // the keyword
    public Mono<ResponseEntity<LocationSearchResponseDTO>> searchLocations(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer offset
    ) {
        LocationSearchRequestDTO locationSearchRequestDTO = new LocationSearchRequestDTO(keyword, limit, offset);
        Mono<LocationSearchResponseDTO> locationSearchResponseDTO = searchFlightService.getLocations(locationSearchRequestDTO);
        return locationSearchResponseDTO
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{iataCityCode}")
    // searchCityByCode: gives a response for the name of the city if the iata code exists
    public Mono<ResponseEntity<CitySearchByCodeResponseDTO>> searchCityByCode(@PathVariable String iataCityCode) {
        CitySearchByCodeRequestDTO citySearchByCodeRequestDTO = new CitySearchByCodeRequestDTO(iataCityCode);
        Mono<CitySearchByCodeResponseDTO> citySearchByCodeResponseDTO = searchFlightService.getCityByCode(citySearchByCodeRequestDTO);
        return citySearchByCodeResponseDTO
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("airport/{iataAirportCode}")
    public Mono<ResponseEntity<AirportSearchByCodeResponseDTO>> searchAirportByCode(@PathVariable String iataAirportCode) {
        AirportSearchByCodeRequestDTO airportSearchByCodeRequestDTO = new AirportSearchByCodeRequestDTO(iataAirportCode);
        Mono<AirportSearchByCodeResponseDTO> airportSearchByCodeResponseDTOMono = searchFlightService.getAirportByCode(airportSearchByCodeRequestDTO);
        return airportSearchByCodeResponseDTOMono
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
