package com.flightsearch.backend.mapper.response;

import com.flightsearch.backend.dto.amadeus.AmadeusAirportCodesDTO;
import com.flightsearch.backend.dto.response.LocationSearchResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class LocationSearchResponseMapper {
    public static LocationSearchResponseDTO mapToLocationSearchResponse(AmadeusAirportCodesDTO.AmadeusAirportCodesResponse airportCodesResponse) {
        Integer count = airportCodesResponse.meta.count;
        List<LocationSearchResponseDTO.LocationDTO> locations = airportCodesResponse.data.stream()
                .map(loc -> new LocationSearchResponseDTO.LocationDTO(
                        loc.iataCode,
                        loc.name,
                        loc.address.cityName,
                        loc.address.countryName
                ))
                .collect(Collectors.toList());

        return new LocationSearchResponseDTO(count, locations);
    }
}
