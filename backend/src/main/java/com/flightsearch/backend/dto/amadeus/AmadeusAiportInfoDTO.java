package com.flightsearch.backend.dto.amadeus;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

// AmadeusAirportInfoDTO: works to transfer the received request and structure information
public class AmadeusAiportInfoDTO {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmadeusAirportInfoResponse {
        @JsonProperty("data")
        public List<AmadeusAiportInfoDTO.AirportInfoData> data;
    }
    public static class AirportInfoData {
        public String commonName;
    }
}
