package com.flightsearch.backend.mapper.requests;

import com.flightsearch.backend.dto.request.AirportSearchByCodeRequestDTO;
import com.flightsearch.backend.entity.request.AirportSearchByCodeRequest;

public class AirportSearchByCodeRequestMapper {
    public static AirportSearchByCodeRequest mapToAirportSearchByCodeRequest(AirportSearchByCodeRequestDTO airportSearchByCodeRequestDTO){
        return new AirportSearchByCodeRequest(airportSearchByCodeRequestDTO.iataCode());
    }

    public static AirportSearchByCodeRequestDTO mapToAirportSearchByCodeRequestDTO(AirportSearchByCodeRequest airportSearchByCodeRequest){
        return new AirportSearchByCodeRequestDTO(airportSearchByCodeRequest.iataCode());
    }
}
