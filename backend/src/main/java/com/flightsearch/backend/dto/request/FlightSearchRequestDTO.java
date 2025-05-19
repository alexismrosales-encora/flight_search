package com.flightsearch.backend.dto.request;

import com.flightsearch.backend.enums.SortOptions;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Currency;

@Getter
@Setter
@AllArgsConstructor
public class FlightSearchRequestDTO {
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
    Boolean nonStop;
    SortOptions sortOptions;
}