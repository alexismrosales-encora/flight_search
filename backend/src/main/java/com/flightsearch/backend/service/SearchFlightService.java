package com.flightsearch.backend.service;

import com.flightsearch.backend.cache.LocationsCache;
import com.flightsearch.backend.client.AmadeusClient;
import com.flightsearch.backend.dto.request.AirportSearchByCodeRequestDTO;
import com.flightsearch.backend.dto.request.CitySearchByCodeRequestDTO;
import com.flightsearch.backend.dto.request.FlightSearchRequestDTO;
import com.flightsearch.backend.dto.request.LocationSearchRequestDTO;
import com.flightsearch.backend.dto.response.AirportSearchByCodeResponseDTO;
import com.flightsearch.backend.dto.response.CitySearchByCodeResponseDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;
import com.flightsearch.backend.dto.response.LocationSearchResponseDTO;
import com.flightsearch.backend.entity.request.AirportSearchByCodeRequest;
import com.flightsearch.backend.entity.request.FlightSearchRequest;
import com.flightsearch.backend.entity.request.LocationSearchRequest;
import com.flightsearch.backend.enums.SortOptions;
import com.flightsearch.backend.exceptions.SearchFlightException;
import com.flightsearch.backend.exceptions.SearchLocationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static com.flightsearch.backend.mapper.requests.FlightSearchRequestMapper.mapToFlightRequest;
import static com.flightsearch.backend.mapper.requests.LocationSearchRequestMapper.mapToSearchLocationRequest;
import static com.flightsearch.backend.mapper.requests.AirportSearchByCodeRequestMapper.mapToAirportSearchByCodeRequest;

@Service
@AllArgsConstructor
public class SearchFlightService {
    private final AmadeusClient amadeusClient;
    private final LocationsCache locationsCache;
    private final LocationsCache airportsCache;

    // getFlights: service works to handle the request and request to the API the requested data, also it sorts the flights based on
    // the response
    public Mono<List<FlightSearchResponseDTO>> getFlights(FlightSearchRequestDTO flightSearchRequestDTO) {
        FlightSearchRequest flightSearchRequest = mapToFlightRequest(flightSearchRequestDTO);
        return amadeusClient
                .searchFlights(flightSearchRequest)
                .flatMap(flightList -> {
                    if (flightList == null || flightList.isEmpty()) {
                        return Mono.error(new SearchFlightException("No flights found"));
                    }
                    // Create a mutable copy for sorting
                    List<FlightSearchResponseDTO> mutableList = new ArrayList<>(flightList);
                    // Perform sorting
                    sortFlights(mutableList, flightSearchRequestDTO.getSortOptions());
                    return Mono.just(mutableList);
                });
    }

    // getLocations: given a request returns a response with the name of locations
    public Mono<LocationSearchResponseDTO> getLocations(LocationSearchRequestDTO locationSearchRequestDTO) {
        LocationSearchRequest locationSearchRequest = mapToSearchLocationRequest(locationSearchRequestDTO);

        return amadeusClient
                .searchLocations(locationSearchRequest)
                .flatMap(response -> {
                    // TODO: Handle exception to also throw a 400 status of not found
                    if (response == null || response.locations() == null || response.locations().isEmpty()) {
                        return Mono.error(new SearchLocationException("No locations found"));
                    }
                    return Mono.just(response);
                });
    }

    // getCityByCode: given a request information returns the name of the city if it exists
    public Mono<CitySearchByCodeResponseDTO> getCityByCode(CitySearchByCodeRequestDTO citySearchByCodeRequestDTO){
        LocationSearchRequest locationSearchRequest = new LocationSearchRequest(
                citySearchByCodeRequestDTO.iataCode(), // Get the city of the first airport
                1, // Get only one result
                0
        );
        String existsInCache = locationsCache.getFromCache(citySearchByCodeRequestDTO.iataCode());
        if (existsInCache != null) {
            // If the city name exists in the cache, return it wrapped in Mono.just
            return Mono.just(new CitySearchByCodeResponseDTO(existsInCache));
        }

        return amadeusClient
                .searchLocations(locationSearchRequest)
                .flatMap(response -> {
                    if (response == null || response.locations() == null || response.locations().isEmpty()) {
                        return Mono.error(new SearchLocationException("No locations found"));
                    }
                    // Extract the first location and map it to the CitySearchByCodeResponseDTO
                    LocationSearchResponseDTO.LocationDTO firstLocation = response.locations().get(0);
                    CitySearchByCodeResponseDTO cityResponse = new CitySearchByCodeResponseDTO(firstLocation.cityName());
                    locationsCache.addToCache(citySearchByCodeRequestDTO.iataCode(), cityResponse.cityName());
                    return Mono.just(cityResponse);
                });
    }

    public Mono<AirportSearchByCodeResponseDTO> getAirportByCode(AirportSearchByCodeRequestDTO airportSearchByCodeRequestDTO){
        AirportSearchByCodeRequest airportSearchByCodeRequest = mapToAirportSearchByCodeRequest(airportSearchByCodeRequestDTO);
        String existsInCache = airportsCache.getFromCache(airportSearchByCodeRequest.iataCode());
        if (existsInCache != null) {
            // If the city name exists in the cache, return it wrapped in Mono.just
            return Mono.just(new AirportSearchByCodeResponseDTO(existsInCache));
        }
        return amadeusClient
                .searchAirport(airportSearchByCodeRequest)
                .flatMap( response -> {
                    if (response == null || response.airportName() == null) {
                        return Mono.error(new SearchLocationException("No locations found"));
                    }
                    airportsCache.addToCache(airportSearchByCodeRequestDTO.iataCode(), response.airportName());
                    return Mono.just(response);
                });
    }


    private void sortFlights(List<FlightSearchResponseDTO> flights, SortOptions sortOption) {
        // Default to BY_PRICE if sortOption is null
        SortOptions effectiveSortOption = (sortOption == null) ? SortOptions.sortByPrice : sortOption;

        Comparator<FlightSearchResponseDTO> comparator;
        switch (effectiveSortOption) {
            case sortByTime:
                comparator = Comparator.comparing(this::calculateTotalDurationForOffer);
                break;
            case sortByPrice:
            default: // Defaulting to BY_PRICE
                comparator = Comparator.comparing(this::extractPriceForOffer);
                break;
        }
        flights.sort(comparator);
    }

    /**
     * Extracts the grand total price from a flight offer for sorting.
     * Handles potential NumberFormatExceptions and missing price information.
     *
     * @param offer The FlightSearchResponseDTO from which to extract the price.
     * @return The price as a BigDecimal. Returns BigDecimal.valueOf(Double.MAX_VALUE)
     * if the price is missing or unparseable, placing such offers at the end of an ascending sort.
     */
    private BigDecimal extractPriceForOffer(FlightSearchResponseDTO offer) {
        if (offer.getPriceSummary() != null && offer.getPriceSummary().getGrandTotal() != null) {
            try {
                return new BigDecimal(offer.getPriceSummary().getGrandTotal());
            } catch (NumberFormatException e) {
                // In a real application, use a proper logger (e.g., SLF4J)
                System.err.println("Warning: Could not parse price for offerId " + offer.getOfferId() +
                        ": '" + offer.getPriceSummary().getGrandTotal() + "'. Error: " + e.getMessage());
                // Treat as most expensive to push it to the end of sorted list (ascending)
                return BigDecimal.valueOf(Double.MAX_VALUE);
            }
        }
        // If price information is missing, treat as most expensive
        System.err.println("Warning: Price summary or grand total is null for offerId " + offer.getOfferId());
        return BigDecimal.valueOf(Double.MAX_VALUE);
    }

    /**
     * Calculates the total flight duration for an offer by summing durations of all its itineraries.
     * Handles potential DateTimeParseExceptions and missing duration information.
     *
     * @param offer The FlightSearchResponseDTO from which to calculate total duration.
     * @return The total duration as a java.time.Duration. Returns a maximal duration
     * (Duration.ofSeconds(Long.MAX_VALUE)) if any itinerary duration is unparseable
     * or if critical information is missing, placing such offers at the end of an ascending sort.
     */
    private Duration calculateTotalDurationForOffer(FlightSearchResponseDTO offer) {
        if (offer.getItineraries() == null || offer.getItineraries().isEmpty()) {
            System.err.println("Warning: No itineraries found for offerId " + offer.getOfferId() + " to calculate duration.");
            return Duration.ofSeconds(Long.MAX_VALUE); // Treat as longest duration
        }

        Duration totalDuration = Duration.ZERO;
        for (FlightSearchResponseDTO.ItineraryDTO itinerary : offer.getItineraries()) {
            if (itinerary.getTotalDuration() != null && !itinerary.getTotalDuration().isEmpty()) {
                try {
                    totalDuration = totalDuration.plus(Duration.parse(itinerary.getTotalDuration()));
                } catch (DateTimeParseException e) {
                    System.err.println("Warning: Could not parse duration string '" + itinerary.getTotalDuration() +
                            "' for offerId " + offer.getOfferId() + ". Error: " + e.getMessage());
                    // If any itinerary's duration is unparseable, consider the whole offer's duration maximal
                    return Duration.ofSeconds(Long.MAX_VALUE);
                }
            } else {
                // If an itinerary has null or empty duration, it could be an issue.
                // For now, we'll log it and this might make the total duration shorter than actual if other itineraries are valid.
                // Alternatively, consider it as unparseable for the whole offer too by returning Duration.ofSeconds(Long.MAX_VALUE).
                // For this implementation, if one duration is missing/empty among many, the sum proceeds with available ones.
                // If all are missing/empty, totalDuration remains ZERO.
                // A stricter approach would be to return MAX_VALUE if any duration is missing/empty.
                System.err.println("Warning: Null or empty totalDuration for an itinerary in offerId " + offer.getOfferId());
            }
        }
        return totalDuration;
    }
}
