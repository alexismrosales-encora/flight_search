package com.flightsearch.backend;

import com.flightsearch.backend.dto.amadeus.AmadeusAirportCodesDTO;
import com.flightsearch.backend.dto.response.LocationSearchResponseDTO;
import com.flightsearch.backend.mapper.response.LocationSearchResponseMapper;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class ResponseMapperLocationSearchTests {

    @Test
    void testMapToLocationSearchResponse_WithMultipleLocations() {
        // Arrange
        AmadeusAirportCodesDTO.AmadeusAirportCodesResponse inputResponse = new AmadeusAirportCodesDTO.AmadeusAirportCodesResponse();

        // Setup Meta
        inputResponse.meta = new AmadeusAirportCodesDTO.CollectionMeta();
        inputResponse.meta.count = 2;

        // Setup Data - Location 1
        AmadeusAirportCodesDTO.Location location1 = new AmadeusAirportCodesDTO.Location();
        location1.iataCode = "JFK";
        location1.name = "John F Kennedy International Airport";
        location1.address = new AmadeusAirportCodesDTO.Address();
        location1.address.cityName = "New York";
        location1.address.countryName = "United States";

        // Setup Data - Location 2
        AmadeusAirportCodesDTO.Location location2 = new AmadeusAirportCodesDTO.Location();
        location2.iataCode = "LAX";
        location2.name = "Los Angeles International Airport";
        location2.address = new AmadeusAirportCodesDTO.Address();
        location2.address.cityName = "Los Angeles";
        location2.address.countryName = "United States";

        inputResponse.data = Arrays.asList(location1, location2);

        // Act
        LocationSearchResponseDTO result = LocationSearchResponseMapper.mapToLocationSearchResponse(inputResponse);

        // Assert
        assertNotNull(result, "Result DTO should not be null");
        assertEquals(2, result.count(), "Count should be mapped correctly");
        assertNotNull(result.locations(), "Locations list should not be null");
        assertEquals(2, result.locations().size(), "Should be 2 locations in the list");

        // Assert details of the first location
        LocationSearchResponseDTO.LocationDTO mappedLocation1 = result.locations().get(0);
        assertEquals("JFK", mappedLocation1.iataCode(), "Location 1 IATA code should be mapped");
        assertEquals("John F Kennedy International Airport", mappedLocation1.name(), "Location 1 name should be mapped");
        assertEquals("New York", mappedLocation1.cityName(), "Location 1 city name should be mapped");
        assertEquals("United States", mappedLocation1.countryName(), "Location 1 country name should be mapped");

        // Assert details of the second location
        LocationSearchResponseDTO.LocationDTO mappedLocation2 = result.locations().get(1);
        assertEquals("LAX", mappedLocation2.iataCode(), "Location 2 IATA code should be mapped");
        assertEquals("Los Angeles International Airport", mappedLocation2.name(), "Location 2 name should be mapped");
        assertEquals("Los Angeles", mappedLocation2.cityName(), "Location 2 city name should be mapped");
        assertEquals("United States", mappedLocation2.countryName(), "Location 2 country name should be mapped");
    }

    @Test
    void testMapToLocationSearchResponse_WithEmptyLocationList() {
        // Arrange
        AmadeusAirportCodesDTO.AmadeusAirportCodesResponse inputResponse = new AmadeusAirportCodesDTO.AmadeusAirportCodesResponse();
        inputResponse.meta = new AmadeusAirportCodesDTO.CollectionMeta();
        inputResponse.meta.count = 0;
        inputResponse.data = Collections.emptyList(); // Empty list of locations

        // Act
        LocationSearchResponseDTO result = LocationSearchResponseMapper.mapToLocationSearchResponse(inputResponse);

        // Assert
        assertNotNull(result, "Result DTO should not be null");
        assertEquals(0, result.count(), "Count should be 0");
        assertNotNull(result.locations(), "Locations list should not be null");
        assertTrue(result.locations().isEmpty(), "Locations list should be empty");
    }

    @Test
    void testMapToLocationSearchResponse_WithNullDataList() {
        // Arrange
        AmadeusAirportCodesDTO.AmadeusAirportCodesResponse inputResponse = new AmadeusAirportCodesDTO.AmadeusAirportCodesResponse();
        inputResponse.meta = new AmadeusAirportCodesDTO.CollectionMeta();
        inputResponse.meta.count = 0; // Or some other count, data being null is the focus
        inputResponse.data = null; // Null data list

        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            LocationSearchResponseMapper.mapToLocationSearchResponse(inputResponse);
        }, "Should throw NullPointerException if data list is null and not handled by mapper");

    }

    @Test
    void testMapToLocationSearchResponse_WithNullAddressInLocation() {
        // Arrange
        AmadeusAirportCodesDTO.AmadeusAirportCodesResponse inputResponse = new AmadeusAirportCodesDTO.AmadeusAirportCodesResponse();
        inputResponse.meta = new AmadeusAirportCodesDTO.CollectionMeta();
        inputResponse.meta.count = 1;

        AmadeusAirportCodesDTO.Location locationWithNullAddress = new AmadeusAirportCodesDTO.Location();
        locationWithNullAddress.iataCode = "TES";
        locationWithNullAddress.name = "Test Airport";
        locationWithNullAddress.address = null; // Address is null

        inputResponse.data = Collections.singletonList(locationWithNullAddress);

        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            LocationSearchResponseMapper.mapToLocationSearchResponse(inputResponse);
        }, "Should throw NullPointerException if address is null and not handled by mapper");
    }
}
