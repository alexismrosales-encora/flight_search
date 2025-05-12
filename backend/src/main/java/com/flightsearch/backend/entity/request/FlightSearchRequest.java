package com.flightsearch.backend.entity.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Currency;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchRequest {
    String originLocationCode;
    String destinationLocationCode;
    // IMPORTANT: Convert LocalDate with dates with the format
    //  ISO 8601 YYYY-MM-DD
    LocalDate departureDate;
    LocalDate returnDate;
    Integer adults;
    Integer children;
    Integer infants;
    Currency currencyCode;
    Integer max;
}
