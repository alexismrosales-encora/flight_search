package com.flightsearch.backend;

import com.flightsearch.backend.dto.amadeus.AmadeusOfferDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;
import com.flightsearch.backend.mapper.response.FlightSearchResponseMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class ResponseMappersFlightSearchTests {

    private AmadeusOfferDTO.AmadeusOffer mockOffer;
    private AmadeusOfferDTO.Dictionaries mockDictionaries;

    // Helper methods from FlightSearchResponseMapper that are not visible here
    // For testing mapToFlightResponse, we assume these helper methods exist within
    // FlightSearchResponseMapper and function as intended.
    // If they were public static, they could be tested separately.
    // For this test, their effects are tested indirectly.
    // - getCurrencyName(String currencyCode, AmadeusOfferDTO.Dictionaries dictionaries)
    // - mapToFeeInfoDTO(AmadeusOfferDTO.Fee fee)
    // - mapSegmentToFlightLegDTO(AmadeusOfferDTO.Segment segment, AmadeusOfferDTO.Dictionaries dictionaries)
    // - calculateLayover(String arrivalTime, String departureTime)
    // - mapToTravelerPricingInfoDTO(AmadeusOfferDTO.TravelerPricing tp, AmadeusOfferDTO.Dictionaries dictionaries)

    @BeforeEach
    void setUp() {
        // Initialize Dictionaries
        mockDictionaries = new AmadeusOfferDTO.Dictionaries();
        mockDictionaries.currencies = new HashMap<>();
        mockDictionaries.currencies.put("USD", "US Dollar");
        mockDictionaries.carriers = new HashMap<>();
        mockDictionaries.carriers.put("AA", "American Airlines");
        mockDictionaries.aircraft = new HashMap<>();
        mockDictionaries.aircraft.put("738", "Boeing 737-800");
        mockDictionaries.locations = new HashMap<>(); // Assuming LocationDetails might be used by mapSegmentToFlightLegDTO
        AmadeusOfferDTO.LocationDetails locDetails = new AmadeusOfferDTO.LocationDetails();
        locDetails.cityCode = "NYC";
        locDetails.countryCode = "US";
        mockDictionaries.locations.put("JFK", locDetails);


        // Initialize a basic AmadeusOffer
        mockOffer = new AmadeusOfferDTO.AmadeusOffer();
        mockOffer.id = "test-offer-1";
        mockOffer.numberOfBookableSeats = 9;
        mockOffer.lastTicketingDate = "2025-12-31";
        mockOffer.validatingAirlineCodes = Arrays.asList("AA", "BA");

        // Price
        AmadeusOfferDTO.Price price = new AmadeusOfferDTO.Price();
        price.currency = "USD";
        price.base = "180.00";
        price.total = "200.00";
        price.grandTotal = "220.00";
        AmadeusOfferDTO.Fee fee1 = new AmadeusOfferDTO.Fee();
        fee1.amount = "20.00";
        fee1.type = "TAX";
        price.fees = Collections.singletonList(fee1);
        mockOffer.price = price;

        // Itineraries and Segments
        AmadeusOfferDTO.Itinerary itinerary1 = new AmadeusOfferDTO.Itinerary();
        itinerary1.duration = "PT5H30M";

        AmadeusOfferDTO.Segment segment1 = new AmadeusOfferDTO.Segment();
        segment1.segmentId = "seg-1";
        segment1.departure = new AmadeusOfferDTO.Departure();
        segment1.departure.iataCode = "JFK";
        segment1.departure.at = "2025-10-20T10:00:00";
        segment1.arrival = new AmadeusOfferDTO.Arrival();
        segment1.arrival.iataCode = "LAX";
        segment1.arrival.at = "2025-10-20T12:30:00"; // 2.5 hour flight
        segment1.carrierCode = "AA";
        segment1.flightNumber = "123";
        segment1.aircraft = new AmadeusOfferDTO.AircraftInfo();
        segment1.aircraft.code = "738";
        segment1.duration = "PT2H30M";
        segment1.numberOfStops = 0;

        AmadeusOfferDTO.Segment segment2 = new AmadeusOfferDTO.Segment();
        segment2.segmentId = "seg-2";
        segment2.departure = new AmadeusOfferDTO.Departure();
        segment2.departure.iataCode = "LAX"; // For layover calculation
        segment2.departure.at = "2025-10-20T13:30:00"; // 1 hour layover
        segment2.arrival = new AmadeusOfferDTO.Arrival();
        segment2.arrival.iataCode = "SFO";
        segment2.arrival.at = "2025-10-20T14:30:00"; // 1 hour flight
        segment2.carrierCode = "AA";
        segment2.flightNumber = "456";
        segment2.aircraft = new AmadeusOfferDTO.AircraftInfo();
        segment2.aircraft.code = "738";
        segment2.duration = "PT1H0M"; // Corrected to 1H
        segment2.numberOfStops = 0;


        itinerary1.segments = Arrays.asList(segment1, segment2);
        mockOffer.itineraries = Collections.singletonList(itinerary1);

        // Traveler Pricings
        AmadeusOfferDTO.TravelerPricing travelerPricing1 = new AmadeusOfferDTO.TravelerPricing();
        travelerPricing1.travelerId = "1";
        travelerPricing1.travelerType = "ADULT";
        travelerPricing1.fareOption = "STANDARD";
        AmadeusOfferDTO.TravelerPrice travelerPrice1 = new AmadeusOfferDTO.TravelerPrice();
        travelerPrice1.currency = "USD";
        travelerPrice1.total = "220.00";
        travelerPrice1.base = "180.00";
        travelerPricing1.price = travelerPrice1;

        AmadeusOfferDTO.FareDetailsBySegment fareDetails1 = new AmadeusOfferDTO.FareDetailsBySegment();
        fareDetails1.segmentId = "seg-1";
        fareDetails1.cabin = "ECONOMY";
        fareDetails1.bookingClass = "Y";
        fareDetails1.includedCheckedBags = new AmadeusOfferDTO.IncludedCheckedBags();
        fareDetails1.includedCheckedBags.quantity = 1;
        travelerPricing1.fareDetailsBySegment = Collections.singletonList(fareDetails1);
        mockOffer.travelerPricings = Collections.singletonList(travelerPricing1);
    }

    @Test
    void testMapToFlightResponse_NullOffer() {
        FlightSearchResponseDTO result = FlightSearchResponseMapper.mapToFlightResponse(null, mockDictionaries);
        assertNull(result, "Result should be null if the offer is null");
    }

    @Test
    void testMapToFlightResponse_BasicOfferMapping() {
        // Act
        FlightSearchResponseDTO result = FlightSearchResponseMapper.mapToFlightResponse(mockOffer, mockDictionaries);

        // Assert
        assertNotNull(result, "Result should not be null for a valid offer");
        assertEquals("test-offer-1", result.getOfferId(), "Offer ID should be mapped");
        assertEquals(9, result.getNumberOfBookableSeats(), "Number of bookable seats should be mapped");
        assertEquals("2025-12-31", result.getLastTicketingDate(), "Last ticketing date should be mapped");
        assertEquals(Arrays.asList("AA", "BA"), result.getValidatingAirlineCodes(), "Validating airline codes should be mapped");

        // Assert Price Summary
        assertNotNull(result.getPriceSummary(), "Price summary should be mapped");
        assertEquals("USD", result.getPriceSummary().getCurrencyCode(), "Currency code should be mapped");
        assertEquals("US Dollar", result.getPriceSummary().getCurrencyName(), "Currency name should be looked up and mapped");
        assertEquals("180.00", result.getPriceSummary().getBasePrice(), "Base price should be mapped");
        assertEquals("200.00", result.getPriceSummary().getTotalPrice(), "Total price should be mapped");
        assertEquals("220.00", result.getPriceSummary().getGrandTotal(), "Grand total should be mapped");
        assertNotNull(result.getPriceSummary().getFees(), "Fees list should not be null");
        assertEquals(1, result.getPriceSummary().getFees().size(), "Should be 1 fee mapped");
        assertEquals("20.00", result.getPriceSummary().getFees().get(0).getAmount(), "Fee amount should be mapped");
        assertEquals("TAX", result.getPriceSummary().getFees().get(0).getType(), "Fee type should be mapped");

        // Assert Itineraries
        assertNotNull(result.getItineraries(), "Itineraries list should not be null");
        assertEquals(1, result.getItineraries().size(), "Should be 1 itinerary mapped");
        FlightSearchResponseDTO.ItineraryDTO mappedItinerary = result.getItineraries().get(0);
        assertEquals("PT5H30M", mappedItinerary.getTotalDuration(), "Itinerary duration should be mapped");
        assertNotNull(mappedItinerary.getSegments(), "Segments list should not be null");
        assertEquals(2, mappedItinerary.getSegments().size(), "Should be 2 segments mapped");

        // Assert First Segment Details (assuming mapSegmentToFlightLegDTO works as intended)
        FlightSearchResponseDTO.FlightLegDTO leg1 = mappedItinerary.getSegments().get(0);
        assertEquals("JFK", leg1.getDepartureAirportCode(), "Segment 1 departure airport code");
        assertEquals("2025-10-20T10:00:00", leg1.getDepartureTime(), "Segment 1 departure time");
        assertEquals("LAX", leg1.getArrivalAirportCode(), "Segment 1 arrival airport code");
        assertEquals("2025-10-20T12:30:00", leg1.getArrivalTime(), "Segment 1 arrival time");
        assertEquals("AA", leg1.getMarketingAirlineCode(), "Segment 1 marketing airline");
        // Layover for segment 1 should be calculated and set
        assertNotNull(leg1.getLayoverDuration(), "Layover duration for segment 1 should be calculated (assuming calculateLayover works)");

        // Assert Second Segment Details
        FlightSearchResponseDTO.FlightLegDTO leg2 = mappedItinerary.getSegments().get(1);
        assertEquals("LAX", leg2.getDepartureAirportCode(), "Segment 2 departure airport code");
        assertNull(leg2.getLayoverDuration(), "Layover duration for the last segment in itinerary should be null");


        // Assert Traveler Pricings
        assertNotNull(result.getTravelerPricings(), "Traveler pricings list should not be null");
        assertEquals(1, result.getTravelerPricings().size(), "Should be 1 traveler pricing mapped");
        FlightSearchResponseDTO.TravelerPricingInfoDTO mappedTravelerPricing = result.getTravelerPricings().get(0);
        assertEquals("1", mappedTravelerPricing.getTravelerId(), "Traveler ID should be mapped");
        assertEquals("ADULT", mappedTravelerPricing.getTravelerType(), "Traveler type should be mapped");
        assertEquals("220.00", mappedTravelerPricing.getTotalPrice(), "Traveler total price should be mapped");
        assertNotNull(mappedTravelerPricing.getFareDetailsBySegment(), "Fare details by segment should not be null");
        assertEquals(1, mappedTravelerPricing.getFareDetailsBySegment().size(), "Should be 1 fare detail mapped");
        assertEquals("ECONOMY", mappedTravelerPricing.getFareDetailsBySegment().get(0).getCabin(), "Cabin should be mapped");
    }

    @Test
    void testMapToFlightResponse_OfferWithEmptyCollections() {
        // Arrange
        mockOffer.validatingAirlineCodes = null; // or Collections.emptyList();
        mockOffer.price.fees = new ArrayList<>(); // Empty fees
        mockOffer.itineraries.get(0).segments = new ArrayList<>(); // Empty segments
        mockOffer.travelerPricings = new ArrayList<>(); // Empty traveler pricings

        // Act
        FlightSearchResponseDTO result = FlightSearchResponseMapper.mapToFlightResponse(mockOffer, mockDictionaries);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertTrue(result.getValidatingAirlineCodes().isEmpty(), "Validating airline codes should be empty");
        assertNotNull(result.getPriceSummary(), "Price summary should still exist");
        assertTrue(result.getPriceSummary().getFees().isEmpty(), "Fees should be empty");
        assertNotNull(result.getItineraries(), "Itineraries should exist");
        assertTrue(result.getItineraries().get(0).getSegments().isEmpty(), "Segments in itinerary should be empty");
        assertTrue(result.getTravelerPricings().isEmpty(), "Traveler pricings should be empty");
    }
}
