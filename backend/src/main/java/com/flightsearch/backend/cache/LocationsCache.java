package com.flightsearch.backend.cache;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class LocationsCache {
    // Cache to store location data with IATA code as the key
    private final ConcurrentHashMap<String, String> locationCache = new ConcurrentHashMap<>();

    // Method to check if the cache contains a location by IATA code
    public String getFromCache(String iataCode) {
        return locationCache.get(iataCode);
    }

    // Method to add location data to the cache
    public void addToCache(String iataCode, String location) {
        locationCache.put(iataCode, location);
    }

    // Clear the cache
    public void clearCache() {
        locationCache.clear();
    }
}