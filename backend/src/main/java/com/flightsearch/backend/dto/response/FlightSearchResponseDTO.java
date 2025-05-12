package com.flightsearch.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Currency;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchResponseDTO {
    String id;
    String source;
    String carrierCode;
    String flightNumber;
    String departureTime;
    String arrivalTime;
    double totalPrice;
    Currency currency;
}
