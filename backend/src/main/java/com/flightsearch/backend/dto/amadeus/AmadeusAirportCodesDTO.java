package com.flightsearch.backend.dto.amadeus;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class AmadeusAirportCodesDTO {
    public static class AirportCitySearchResponse {
        @JsonProperty("meta")
        public CollectionMeta meta;
        @JsonProperty("data")
        public List<Location> data;
    }

    public static class CollectionMeta {
        public int count;
        public CollectionLinks links;
    }

    public static class CollectionLinks {
        public String self;
        public String first;
        public String next;
        public String previous;
        public String last;
        public String up;
    }

    public static class Location {
        public String type;
        public String subType;
        public String name;
        public String detailedName;
        public String id;
        @JsonProperty("self")
        public LocationLink selfLink;
        public String timeZoneOffset;
        public String iataCode;
        public GeoCode geoCode;
        public Address address;
        public Analytics analytics;
        public Double relevance;
        public String category;
        public List<String> tags;
        public String rank;
    }

    public static class LocationLink {
        public String href;
        public List<String> methods;
    }

    public static class GeoCode {
        public double latitude;
        public double longitude;
    }

    public static class Address {
        public String cityName;
        public String cityCode;
        public String countryName;
        public String countryCode;
        public String regionCode;
        public String stateCode;
    }

    public static class Analytics {
        public Travelers travelers;
    }

    public static class Travelers {
        public int score;
    }

    public static class AmadeusAirportCodesSimplified {

    }
}
