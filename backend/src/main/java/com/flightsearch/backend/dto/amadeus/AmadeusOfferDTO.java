package com.flightsearch.backend.dto.amadeus;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import java.util.Currency;
import java.util.List;

public class AmadeusOfferDTO {

    // For now METADATA is not requested
    public static class AmadeusOfferResponse {
        @JsonProperty("data")
        public List<AmadeusOffer> data;
    }

    public static class AmadeusOffer {
        public String id;
        public String source;
        public Price price;
        public List<Itinerary> itineraries;

        public static class Price {
            public String total;
            public Currency currency;
        }

        public static class Itinerary {
            public List<Segment> segments;
        }

        public static class Segment {
            public String carrierCode;
            public String flightNumber;
            public Departure departure;
            public Arrival arrival;
        }

        public static class Departure {
            public String at;
        }

        public static class Arrival {
            public String at;
        }
    }
    @AllArgsConstructor
    public static class AmadeusOfferResponseSimplified {
        public String id;
        public String source;
        public String carrierCode;
        public String flightNumber;
        public String departureTime;
        public String arrivalTime;
        public Double totalPrice;
        public Currency currency;
    }

}