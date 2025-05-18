package com.flightsearch.backend.cache;

import com.flightsearch.backend.dto.response.LocationSearchResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LocationsCache {
    // Cache to store location data with IATA code as the key
    private final ConcurrentHashMap<String, LocationSearchResponseDTO.LocationDTO> locationCache = new ConcurrentHashMap<>();

    // Method to check if the cache contains a location by IATA code
    public LocationSearchResponseDTO.LocationDTO getFromCache(String iataCode) {
        return locationCache.get(iataCode);
    }

    // Method to add location data to the cache
    public void addToCache(String iataCode, LocationSearchResponseDTO.LocationDTO locationDTO) {
        locationCache.put(iataCode, locationDTO);
    }

    // Optional: Clear the cache (you can use this if needed for cache invalidation)
    public void clearCache() {
        locationCache.clear();
    }
}