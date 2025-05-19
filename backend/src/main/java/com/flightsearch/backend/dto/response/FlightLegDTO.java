package com.flightsearch.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class FlightLegDTO {
    private String id; // Was legId, now refers to Amadeus segment ID
    private String departureAirportCode; // Was departureIata
    private String departureAirportTerminal; // New
    private String departureTime; // Was departureAt
    private String arrivalAirportCode; // Was arrivalIata
    private String arrivalAirportTerminal; // New
    private String arrivalTime; // Was arrivalAt
    private String duration;
    private String flightNumber;
    private String marketingAirlineCode; // Was carrierCode
    private String marketingAirlineName; // New
    private String operatingAirlineCode; // New
    private String operatingAirlineName; // New (shown if different from marketing)
    private String aircraftTypeName; // New
    private int numberOfStops; // New (for this specific segment, usually 0 from Amadeus offers)
    private String layoverDuration; // New: Layover time *after* this segment, null for the last segment in an itinerary
    // boolean nonstop; // This can be inferred from numberOfStops == 0 if needed, or from direct segment mapping
}