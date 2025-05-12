package com.flightsearch.backend.mapper.response;

import com.flightsearch.backend.dto.amadeus.AmadeusOfferDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;

public class FlightSearchResponseMapper {
    public static FlightSearchResponseDTO mapToFlightResponse(AmadeusOfferDTO.AmadeusOfferResponseSimplified s) {
        return new FlightSearchResponseDTO(
                s.id,
                s.source,
                s.carrierCode,
                s.flightNumber,
                s.departureTime,
                s.arrivalTime,
                s.totalPrice,
                s.currency
        );
    }
}
