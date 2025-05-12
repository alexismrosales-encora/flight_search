package com.flightsearch.backend.dto.amadeus;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Currency;
import java.util.List;

public class AmadeusOfferDTO {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmadeusOfferResponse {
        @JsonProperty("data")
        public List<AmadeusOffer> data;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmadeusOffer {
        public String id;
        public String source;
        public Price price;
        public List<Itinerary> itineraries;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Price {
        public String total;
        public Currency currency;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Itinerary {
        public List<Segment> segments;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Segment {
        public String carrierCode;
        public String flightNumber;
        public Departure departure;
        public Arrival arrival;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Departure {
        @JsonProperty("at")
        public String at;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Arrival {
        @JsonProperty("at")
        public String at;
    }
}