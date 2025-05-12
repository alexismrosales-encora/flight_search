package com.flightsearch.backend.dto.response;

import java.util.List;

public record LocationSearchResponseDTO(
        Integer count,
        List<LocationDTO> locations
) {
    public record LocationDTO(
            String iataCode,
            String name,
            String cityName,
            String countryName) {
    }
}