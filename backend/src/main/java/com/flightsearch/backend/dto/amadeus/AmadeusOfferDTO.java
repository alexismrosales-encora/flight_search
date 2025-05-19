package com.flightsearch.backend.dto.amadeus;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

// AmadeusOfferDTO works to transfer the received request and structure information
public class AmadeusOfferDTO {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmadeusOfferResponse {
        @JsonProperty("meta")
        public Meta meta;

        @JsonProperty("data")
        public List<AmadeusOffer> data;

        @JsonProperty("dictionaries")
        public Dictionaries dictionaries;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Meta {
        @JsonProperty("count")
        public int count;

        @JsonProperty("links")
        public Map<String, String> links;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Dictionaries {
        @JsonProperty("locations")
        public Map<String, LocationDetails> locations;

        @JsonProperty("aircraft")
        public Map<String, String> aircraft; // Maps aircraft code to name

        @JsonProperty("currencies")
        public Map<String, String> currencies; // Maps currency code to name

        @JsonProperty("carriers")
        public Map<String, String> carriers; // Maps carrier code to name
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LocationDetails {
        @JsonProperty("cityCode")
        public String cityCode;

        @JsonProperty("countryCode")
        public String countryCode;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmadeusOffer {
        @JsonProperty("type")
        public String type;

        @JsonProperty("id")
        public String id;

        @JsonProperty("source")
        public String source;

        @JsonProperty("instantTicketingRequired")
        public boolean instantTicketingRequired;

        @JsonProperty("nonHomogeneous")
        public boolean nonHomogeneous;

        @JsonProperty("oneWay")
        public boolean oneWay;

        @JsonProperty("lastTicketingDate")
        public String lastTicketingDate;

        @JsonProperty("numberOfBookableSeats")
        public int numberOfBookableSeats;

        @JsonProperty("itineraries")
        public List<Itinerary> itineraries;

        @JsonProperty("price")
        public Price price;

        @JsonProperty("pricingOptions")
        public PricingOptions pricingOptions;

        @JsonProperty("validatingAirlineCodes")
        public List<String> validatingAirlineCodes;

        @JsonProperty("travelerPricings")
        public List<TravelerPricing> travelerPricings;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Itinerary {
        @JsonProperty("duration")
        public String duration;

        @JsonProperty("segments")
        public List<Segment> segments;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Segment {
        @JsonProperty("id")
        public String segmentId; // Renamed to avoid confusion with AmadeusOffer.id

        @JsonProperty("departure")
        public Departure departure;

        @JsonProperty("arrival")
        public Arrival arrival;

        @JsonProperty("carrierCode")
        public String carrierCode; // Airline code

        @JsonProperty("number")
        public String flightNumber;

        @JsonProperty("aircraft")
        public AircraftInfo aircraft;

        @JsonProperty("operating")
        public OperatingCarrierInfo operating;

        @JsonProperty("duration")
        public String duration;

        @JsonProperty("numberOfStops")
        public int numberOfStops;

        @JsonProperty("blacklistedInEU")
        public boolean blacklistedInEU;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Departure {
        @JsonProperty("iataCode")
        public String iataCode;

        @JsonProperty("terminal")
        public String terminal;

        @JsonProperty("at")
        public String at; // Departure time
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Arrival {
        @JsonProperty("iataCode")
        public String iataCode;

        @JsonProperty("terminal")
        public String terminal;

        @JsonProperty("at")
        public String at; // Arrival time
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AircraftInfo {
        @JsonProperty("code")
        public String code; // Aircraft type code
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OperatingCarrierInfo {
        @JsonProperty("carrierCode")
        public String carrierCode; // Operating carrier code
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Price {
        @JsonProperty("currency")
        public String currency; // Currency code (e.g., "EUR")

        @JsonProperty("total")
        public String total;

        @JsonProperty("base")
        public String base;

        @JsonProperty("fees")
        public List<Fee> fees;

        @JsonProperty("grandTotal")
        public String grandTotal;

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Fee {
        @JsonProperty("amount")
        public String amount;

        @JsonProperty("type")
        public String type;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PricingOptions {
        @JsonProperty("fareType")
        public List<String> fareType;

        @JsonProperty("includedCheckedBagsOnly")
        public boolean includedCheckedBagsOnly;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TravelerPricing {
        @JsonProperty("travelerId")
        public String travelerId;

        @JsonProperty("fareOption")
        public String fareOption;

        @JsonProperty("travelerType")
        public String travelerType;

        @JsonProperty("price")
        public TravelerPrice price; // Price per traveler

        @JsonProperty("fareDetailsBySegment")
        public List<FareDetailsBySegment> fareDetailsBySegment;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TravelerPrice {
        @JsonProperty("currency")
        public String currency;

        @JsonProperty("total")
        public String total;

        @JsonProperty("base")
        public String base;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FareDetailsBySegment {
        @JsonProperty("segmentId")
        public String segmentId;

        @JsonProperty("cabin")
        public String cabin; // e.g., ECONOMY, BUSINESS

        @JsonProperty("fareBasis")
        public String fareBasis;

        @JsonProperty("class")
        public String bookingClass; // Booking class, (e.g., E, Y, J)

        @JsonProperty("includedCheckedBags")
        public IncludedCheckedBags includedCheckedBags;

        @JsonProperty("amenities")
        public List<Amenity> amenities;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IncludedCheckedBags {
        @JsonProperty("quantity")
        public Integer quantity; // Number of bags

        @JsonProperty("weight")
        public Integer weight; // Weight per bag

        @JsonProperty("weightUnit")
        public String weightUnit; // e.g., KG, LB
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Amenity {
        @JsonProperty("name")
        public String name;

        @JsonProperty("isChargeable")
        public Boolean isChargeable;

        @JsonProperty("description")
        public String description;

        @JsonProperty("amenityProvider")
        public Object amenityProvider;
    }
}