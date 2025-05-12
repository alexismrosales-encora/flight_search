package com.flightsearch.backend.service;

import com.flightsearch.backend.client.AmadeusClient;
import com.flightsearch.backend.dto.request.FlightSearchRequestDTO;
import com.flightsearch.backend.dto.request.LocationSearchRequestDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;
import com.flightsearch.backend.dto.response.LocationSearchResponseDTO;
import com.flightsearch.backend.entity.request.FlightSearchRequest;
import com.flightsearch.backend.entity.request.LocationSearchRequest;
import com.flightsearch.backend.exceptions.SearchFlightException;
import com.flightsearch.backend.exceptions.SearchLocationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

import static com.flightsearch.backend.mapper.requests.FlightSearchRequestMapper.mapToFlightRequest;
import static com.flightsearch.backend.mapper.requests.LocationSearchRequestMapper.mapToSearchLocationRequest;

@Service
@AllArgsConstructor
public class SearchFlightService {
    private final AmadeusClient amadeusClient;
    public Mono<List<FlightSearchResponseDTO>> getFlights(FlightSearchRequestDTO flightSearchRequestDTO) {
        FlightSearchRequest flightSearchRequest = mapToFlightRequest(flightSearchRequestDTO);
        return amadeusClient
                .searchFlights(flightSearchRequest)
                .flatMap(list -> {
                    if(list.isEmpty()) {
                        return Mono.error(new SearchFlightException("No flights found"));
                    }
                    return Mono.just(list);
                });
    }

    public Mono<LocationSearchResponseDTO> getLocations(LocationSearchRequestDTO locationSearchRequestDTO) {
        LocationSearchRequest locationSearchRequest = mapToSearchLocationRequest(locationSearchRequestDTO);
        return amadeusClient
                .searchLocations(locationSearchRequest)
                .flatMap(response -> {
                    if (response == null || response.locations() == null || response.locations().isEmpty()) {
                        return Mono.error(new SearchLocationException("No locations found"));
                    }
                    return Mono.just(response);
                });
    }

}
