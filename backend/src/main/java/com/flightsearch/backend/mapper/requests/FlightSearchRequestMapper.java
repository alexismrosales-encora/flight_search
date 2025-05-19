package com.flightsearch.backend.mapper.requests;

import com.flightsearch.backend.dto.request.FlightSearchRequestDTO;
import com.flightsearch.backend.entity.request.FlightSearchRequest;

/**
 *
 * FlightSearchMapper provides utility methods for converting between
 *
 * */
public class FlightSearchRequestMapper {
    public static FlightSearchRequest mapToFlightRequest(FlightSearchRequestDTO flightSearchRequestDTO) {
        return new FlightSearchRequest(
                flightSearchRequestDTO.getOriginLocationCode(),
                flightSearchRequestDTO.getDestinationLocationCode(),
                flightSearchRequestDTO.getDepartureDate(),
                flightSearchRequestDTO.getReturnDate(),
                flightSearchRequestDTO.getAdults(),
                flightSearchRequestDTO.getChildren(),
                flightSearchRequestDTO.getInfants(),
                flightSearchRequestDTO.getCurrencyCode(),
                flightSearchRequestDTO.getMax(),
                flightSearchRequestDTO.getNonStop(),
                flightSearchRequestDTO.getSortOptions()
        );
    }

    public static FlightSearchRequestDTO mapToFlightRequestDTO(FlightSearchRequest flightSearchRequest) {
        return new FlightSearchRequestDTO(
                flightSearchRequest.getOriginLocationCode(),
                flightSearchRequest.getDestinationLocationCode(),
                flightSearchRequest.getDepartureDate(),
                flightSearchRequest.getReturnDate(),
                flightSearchRequest.getAdults(),
                flightSearchRequest.getChildren(),
                flightSearchRequest.getInfants(),
                flightSearchRequest.getCurrencyCode(),
                flightSearchRequest.getMax(),
                flightSearchRequest.getNonStop(),
                flightSearchRequest.getSortOptions()
        );
    }
}