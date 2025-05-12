package com.flightsearch.backend.dto.amadeus;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class AmadeusAirportCodesDTO {
    public static class AmadeusAirportCodesResponse {
        @JsonProperty("meta")
        public CollectionMeta meta;
        @JsonProperty("data")
        public List<Location> data;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CollectionMeta {
        public int count;
        public CollectionLinks links;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CollectionLinks {
        public String self;
        public String first;
        public String next;
        public String previous;
        public String last;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Location {
        public String type;
        public String subType;
        public String name;
        public String iataCode;
        public Address address;
    }

    public static class Address {
        public String cityName;
        public String countryName;
    }
}
