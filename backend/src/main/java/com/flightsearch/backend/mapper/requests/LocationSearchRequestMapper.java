package com.flightsearch.backend.mapper.requests;

import com.flightsearch.backend.dto.request.LocationSearchRequestDTO;
import com.flightsearch.backend.entity.request.LocationSearchRequest;

/**
*
* LocationSearchMapper provides utility methods for converting between
*
*/
public class LocationSearchRequestMapper {
    public static LocationSearchRequest mapToSearchLocationRequest(LocationSearchRequestDTO locationSearchRequestDTO) {
        return new LocationSearchRequest(
                locationSearchRequestDTO.getKeyword(),
                locationSearchRequestDTO.getPageLimit(),
                locationSearchRequestDTO.getPageOffset()
        );
    }

    public static LocationSearchRequestDTO mapToSearchLocationRequestDTO(LocationSearchRequest locationSearchRequest) {
        return new LocationSearchRequestDTO(
                locationSearchRequest.getKeyword(),
                locationSearchRequest.getPageLimit(),
                locationSearchRequest.getPageOffset()
        );
    }
}
