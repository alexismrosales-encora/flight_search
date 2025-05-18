// FlightContainer.tsx
import { Stack, CircularProgress, Typography, Box } from '@mui/material'
import { useContext, useEffect, useState, useCallback, FC } from 'react'
import { FlightSearchContext } from '../context/FlightSearchContext'
import FlightDetailsCard from '../components/flightDetails/FlightCard' // Assuming FlightCard is the correct, refactored name
import { searchCityName } from '../services/FlightsService' // Assuming this service is available
import { FlightSearchResponse } from '../types/FlightSearchResponseTypes' // Updated import path
import { useNavigate } from 'react-router-dom'


const FlightContainer: FC = () => {
  const navigate = useNavigate()

  const context = useContext(FlightSearchContext)

  // State for loading city names and potential errors
  const [cityMap, setCityMap] = useState<Map<string, string>>(new Map())

  if (!context) {
    // This can be a more user-friendly message or a specific loading/error component
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Flight search context is not available.</Typography>
      </Box>
    )
  }

  const { searchResultsState, detailsInfo } = context
  const searchResults = searchResultsState.searchResults || [] // Default to empty array

  const handleOnCardClick = (flight: FlightSearchResponse) => {
    console.log('Flight offer selected:', flight.offerId, flight)
    detailsInfo.setFlight(flight)
    detailsInfo.setCityMap(cityMap)
    navigate(`/book/options`)
  }

  // useCallback for citySearch to stabilize the prop passed to FlightDetailsCard
  const citySearch = useCallback(
    (iataCode: string): string | undefined => {
      if (!iataCode) {
        return undefined; // Or handle as an empty string if preferred
      }

      // 1. Check if the city name is already in the local map
      if (cityMap.has(iataCode)) {
        return cityMap.get(iataCode);
      }

      searchCityName(iataCode)
        .then(response => {
          const nameToStore = response && response.cityName ? response.cityName : iataCode;

          setCityMap(prevMap => {
            // Create a new map to ensure state update and re-render
            const newMap = new Map(prevMap);
            newMap.set(iataCode, nameToStore);
            return newMap;
          });
        })
        .catch(error => {
          console.error(`On-demand citySearch: Failed to fetch city name for ${iataCode}:`, error);
          // On error, store the IATA code itself as a fallback.
          // This also prevents repeated failed API calls for the same code from this on-demand fetch.
          setCityMap(prevMap => {
            if (prevMap.has(iataCode)) {
              return prevMap;
            }
            const newMap = new Map(prevMap);
            newMap.set(iataCode, iataCode);
            return newMap;
          });
        });

      return iataCode;
    },
    [cityMap, setCityMap] // Include setCityMap in the dependency array
  );

  useEffect(() => {
    const fetchCityNames = async () => {
      if (!searchResults || searchResults.length === 0) {
        setCityMap(new Map()) // Clear map if no results
        return
      }

      const newCityMap = new Map(cityMap) // Start with existing map to avoid re-fetching
      const codesToFetch = new Set<string>()

      searchResults.forEach(flight => {
        flight.itineraries?.forEach(itinerary => {
          itinerary.segments?.forEach(segment => {
            if (segment.departureAirportCode && !newCityMap.has(segment.departureAirportCode)) {
              codesToFetch.add(segment.departureAirportCode)
            }
            if (segment.arrivalAirportCode && !newCityMap.has(segment.arrivalAirportCode)) {
              codesToFetch.add(segment.arrivalAirportCode)
            }
          })
        })
      })

      if (codesToFetch.size === 0) {
        return // All needed city names are already fetched
      }

      try {
        // Batch requests or fetch one by one
        // For simplicity, fetching one by one here. In a real app, consider Promise.all
        for (const code of codesToFetch) {
          // Check again in case another effect run already fetched it (less likely with current setup)
          if (!newCityMap.has(code)) {
            const { cityName } = await searchCityName(code) // Assuming searchCityName returns { cityName: string }
            if (cityName) {
              newCityMap.set(code, cityName)
            } else {
              newCityMap.set(code, code) // Fallback to IATA code if name not found
            }
          }
        }
        setCityMap(newCityMap)
      } catch (e) {
        codesToFetch.forEach(code => {
          if (!newCityMap.has(code)) {
            newCityMap.set(code, code) // Fallback for failed fetches
          }
        })
        setCityMap(newCityMap)
      }
    }

    fetchCityNames()
    // cityMap is included in dependency array to potentially re-evaluate if map changes externally,
    // though current logic primarily builds upon it.
    // searchResults is the main trigger.
  }, [searchResults]) // Removed cityMap from deps to avoid potential loops if not careful

  if (searchResultsState.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography ml={2}>Searching for flights...</Typography>
      </Box>
    )
  }

  if (searchResultsState.error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">
          Error fetching flights: {searchResultsState.error}
        </Typography>
      </Box>
    )
  }

  if (searchResults.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No flights found for your criteria. Try adjusting your search.</Typography>
      </Box>
    )
  }

  return (
    <Stack
      spacing={3} // Increased spacing a bit for better visual separation
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '45rem', md: '50rem' }, // Responsive max width
        margin: '2rem auto', // Added top/bottom margin
        padding: { xs: 1, sm: 2 }, // Padding for smaller screens
      }}
    >
      {searchResults.map(flightResult => (
        <FlightDetailsCard
          key={flightResult.offerId}
          flight={flightResult}
          citySearch={citySearch}
          handleOnClick={handleOnCardClick}
        />
      ))}
    </Stack>
  )
}

export default FlightContainer

