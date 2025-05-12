package com.flightsearch.backend.service;

import com.flightsearch.backend.client.AmadeusClient;
import com.flightsearch.backend.dto.amadeus.AmadeusOfferDTO;
import com.flightsearch.backend.dto.request.FlightSearchRequestDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;
import com.flightsearch.backend.entity.request.FlightSearchRequest;
import com.flightsearch.backend.exceptions.SearchFlightException;
import com.flightsearch.backend.mapper.response.FlightSearchResponseMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

import static com.flightsearch.backend.mapper.requests.FlightSearchRequestMapper.mapToFlightRequest;

@Service
@AllArgsConstructor
public class SearchFlightsService {
    private final AmadeusClient amadeusClient;
    public Mono<List<FlightSearchResponseDTO>> getFlights(FlightSearchRequestDTO flightSearchRequestDTO) {
        FlightSearchRequest flightSearchRequest = mapToFlightRequest(flightSearchRequestDTO);
        Mono<List<AmadeusOfferDTO.AmadeusOfferResponseSimplified>> amadeusResponse = amadeusClient.search(flightSearchRequest);

        return amadeusResponse.flatMap(amadeusOffers -> {
            // Handling exception in case there are not flights found
            if(amadeusOffers.isEmpty()) {
                return Mono.error(new SearchFlightException.NoFlightsFoundException("No flights found"));
            }
            // Converting the amadeusResponse into the internal FlightSearchResponseDTO
            List<FlightSearchResponseDTO> flightSearchResponseDTOS = amadeusOffers
                    .stream()
                    .map(FlightSearchResponseMapper::mapToFlightResponse)
                    .collect(Collectors.toList());
            return Mono.just(flightSearchResponseDTOS);
        });
    }
}