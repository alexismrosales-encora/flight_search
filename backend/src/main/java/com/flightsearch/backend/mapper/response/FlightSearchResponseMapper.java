package com.flightsearch.backend.mapper.response;

import com.flightsearch.backend.dto.amadeus.AmadeusOfferDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;

public class FlightSearchResponseMapper {
    public static FlightSearchResponseDTO mapToFlightResponse(AmadeusOfferDTO.AmadeusOffer offer) {
        var segment = offer.itineraries.get(0).segments.get(0);
        return new FlightSearchResponseDTO(
                offer.id,
                offer.source,
                segment.carrierCode,                           // airline code
                segment.flightNumber,                          // flight number
                segment.departure.at,                          // departure timestamp
                segment.arrival.at,                            // arrival timestamp
                Double.parseDouble(offer.price.total),         // price total
                offer.price.currency
        );
    }
}
