package com.flightsearch.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchResponseDTO {

    private String offerId;
    private int numberOfBookableSeats;
    private String lastTicketingDate;
    private List<String> validatingAirlineCodes;
    private PriceSummaryDTO priceSummary;
    private List<ItineraryDTO> itineraries;
    private List<TravelerPricingInfoDTO> travelerPricings;

    // Inner static class for Price Summary
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceSummaryDTO {
        private String currencyCode;
        private String currencyName;
        private String basePrice;
        private String totalPrice;
        private String grandTotal;
        private List<FeeInfoDTO> fees;
    }

    // Inner static class for Fee Information
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeeInfoDTO {
        private String amount;
        private String type;
    }

    // Inner static class for Itinerary Information
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItineraryDTO {
        private String totalDuration;
        private List<FlightLegDTO> segments; // Uses the refactored FlightLegDTO
    }

    // Inner static class for Flight Leg (Segment) Information
    // Original name: FlightLegDTO
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlightLegDTO {
        private String id; // Amadeus segment ID
        private String departureAirportCode;
        private String departureAirportTerminal;
        private String departureTime;
        private String arrivalAirportCode;
        private String arrivalAirportTerminal;
        private String arrivalTime;
        private String duration;
        private String flightNumber;
        private String marketingAirlineCode;
        private String marketingAirlineName;
        private String operatingAirlineCode;
        private String operatingAirlineName;
        private String aircraftTypeName;
        private int numberOfStops;
        private String layoverDuration;
    }

    // Inner static class for Traveler Pricing Information
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TravelerPricingInfoDTO {
        private String travelerId;
        private String travelerType;
        private String fareOption;
        private String totalPrice;
        private String basePrice;
        private String currencyCode;
        // private String currencyName; // Can be added if traveler price currency can differ and needs resolving
        private List<FareDetailPerSegmentDTO> fareDetailsBySegment;
    }

    // Inner static class for Fare Details per Segment
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FareDetailPerSegmentDTO {
        private String segmentId;
        private String cabin;
        private String bookingClass;
        private String fareBasis;
        private String includedCheckedBagsDescription;
        private List<AmenityInfoDTO> amenities;
    }

    // Inner static class for Amenity Information
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AmenityInfoDTO {
        private String name;
        private Boolean isChargeable;
        private String description;
    }
}

