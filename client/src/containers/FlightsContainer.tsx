import { Stack, CircularProgress, Typography, Box, ToggleButtonGroup, ToggleButton, IconButton, Paper, Tooltip } from '@mui/material'
import React, { useContext, useEffect, useState, useCallback, FC, useRef, useMemo } from 'react'
import { FlightSearchContext } from '../context/FlightSearchContext'
import { FlightSearchContextType } from '../types/FlightSearchContextTypes'
import FlightDetailsCard from '../components/flightDetails/FlightCard'
import { searchCityName, } from '../services/FlightsService'
import { CitySearchResponse } from '../types/FlightSearchTypes'
import { FlightSearchResponse } from '../types/FlightSearchResponseTypes'
import { useNavigate } from 'react-router-dom'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import TimerIcon from '@mui/icons-material/Timer'

// Parse ISO 8601 duration (example, "PT14H15M") to total minutes
const parseISODurationToMinutes = (durationStr?: string | null): number => {
  if (!durationStr) return Infinity
  const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!matches) return Infinity
  const hours = parseInt(matches[1] || '0', 10)
  const minutes = parseInt(matches[2] || '0', 10)
  return hours * 60 + minutes
}

const FlightContainer: FC = () => {
  const navigate = useNavigate()
  const context = useContext(FlightSearchContext) as FlightSearchContextType

  const [cityMap, setCityMap] = useState<Map<string, string>>(new Map())
  const inFlightOnDemandRef = useRef<Set<string>>(new Set())

  // Sorting state
  const [sortBy, setSortBy] = useState<'price' | 'duration' | null>(null) // null means API order
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  if (!context || !context.searchResultsState || !context.detailsInfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Flight search context is not properly initialized.</Typography>
      </Box>
    )
  }

  const { searchResultsState, detailsInfo } = context
  const searchResults = searchResultsState.searchResults || []

  const handleOnCardClick = (flight: FlightSearchResponse) => {
    console.log('Flight offer selected:', flight.offerId, flight)
    detailsInfo.setFlight(flight)
    if (detailsInfo.setCityMap) {
      detailsInfo.setCityMap(new Map(cityMap))
    }
    navigate(`/book/options`)
  }

  // Callback for setting the cityMap, doing an API search to find the name of the city 
  const citySearch = useCallback(
    (iataCode: string): string | undefined => {
      if (!iataCode) return undefined
      if (cityMap.has(iataCode)) return cityMap.get(iataCode)
      if (inFlightOnDemandRef.current.has(iataCode)) return iataCode

      inFlightOnDemandRef.current.add(iataCode)
      // Fetching information
      searchCityName(iataCode)
        .then((response: CitySearchResponse) => {
          const nameToStore = response?.cityName || iataCode
          setCityMap(prevMap => new Map(prevMap).set(iataCode, nameToStore))
        })
        .catch(error => {
          // In case there is no code or get error, create a fallback
          console.error(`On-demand citySearch: Failed for ${iataCode}:`, error)
          setCityMap(prevMap => new Map(prevMap).set(iataCode, iataCode))
        })
        .finally(() => {
          inFlightOnDemandRef.current.delete(iataCode)
        })
      return iataCode
    },
    [cityMap, setCityMap]
  )

  useEffect(() => {
    const fetchBulkCityNames = async () => {
      if (!searchResults || searchResults.length === 0) return

      // Checking the codes and see which are repeated to don't do many API petitions 
      const codesToFetch = new Set<string>()
      searchResults.forEach(flight => {
        flight.itineraries?.forEach(itinerary => {
          itinerary.segments?.forEach(segment => {
            if (segment.departureAirportCode && !cityMap.has(segment.departureAirportCode) && !inFlightOnDemandRef.current.has(segment.departureAirportCode)) {
              codesToFetch.add(segment.departureAirportCode)
            }
            if (segment.arrivalAirportCode && !cityMap.has(segment.arrivalAirportCode) && !inFlightOnDemandRef.current.has(segment.arrivalAirportCode)) {
              codesToFetch.add(segment.arrivalAirportCode)
            }
          })
        })
      })

      if (codesToFetch.size === 0) return

      // Fetching city Name
      codesToFetch.forEach(code => inFlightOnDemandRef.current.add(code))
      const promises = Array.from(codesToFetch).map(code =>
        searchCityName(code)
          .then((response: CitySearchResponse) => ({ code, name: response.cityName }))
          .catch(_ => ({ code, name: code }))
      )

      // Setting the map with the fetched results
      try {
        const results = await Promise.all(promises)
        setCityMap(prevMap => {
          const newMap = new Map(prevMap)
          let mapChanged = false
          results.forEach(result => {
            const nameToStore = result.name || result.code
            if (newMap.get(result.code) !== nameToStore) {
              newMap.set(result.code, nameToStore)
              mapChanged = true
            }
          })
          return mapChanged ? newMap : prevMap
        })
      } catch (e) { console.error("Bulk city name fetch error:", e) }
      finally { codesToFetch.forEach(code => inFlightOnDemandRef.current.delete(code)) }
    }
    fetchBulkCityNames()
  }, [searchResults, cityMap, setCityMap])

  // sortedDisplayedFlights: Works for the search city bar, using a memo to save in cache the word searched to avoid extra api calls
  const sortedDisplayedFlights = useMemo(() => {
    if (!sortBy) {
      return searchResults // Return original order if no sort criteria
    }
    const sorted = [...searchResults].sort((a, b) => {
      let valA: number | string = 0
      let valB: number | string = 0

      if (sortBy === 'price') {
        valA = parseFloat(a.priceSummary?.totalPrice || '0')
        valB = parseFloat(b.priceSummary?.totalPrice || '0')
      } else if (sortBy === 'duration') {
        valA = parseISODurationToMinutes(a.itineraries?.[0]?.totalDuration)
        valB = parseISODurationToMinutes(b.itineraries?.[0]?.totalDuration)
      }

      if (valA < valB) return -1
      if (valA > valB) return 1
      return 0
    })

    return sortDirection === 'asc' ? sorted : sorted.reverse()
  }, [searchResults, sortBy, sortDirection])

  const handleSortByChange = (event: React.MouseEvent<HTMLElement>, newSortBy: 'price' | 'duration' | null) => {
    if (newSortBy !== null) { // Allow deselecting sort to go back to API order
      setSortBy(newSortBy)
      // Optional: Reset to 'asc' when changing sort type, or keep current direction
      // setSortDirection('asc') 
    } else {
      setSortBy(null) // Clear sort
    }
  }

  const handleSortDirectionChange = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
  }


  if (searchResultsState.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress /> <Typography ml={2}>Searching for flights...</Typography>
      </Box>
    )
  }
  if (searchResultsState.error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error fetching flights: {searchResultsState.error}</Typography>
      </Box>
    )
  }
  if (context.searchResultsState.searchAttemped && sortedDisplayedFlights.length === 0 && !searchResultsState.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No flights found for your criteria. Try adjusting your search.</Typography>
      </Box>
    )
  }

  return (
    <Stack
      spacing={3}
      sx={{ width: '100%', maxWidth: { xs: '100%', sm: '45rem', md: '50rem' }, margin: '2rem auto', padding: { xs: 1, sm: 2 } }}
    >
      {context.searchResultsState.searchAttemped && <Paper elevation={1} sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', flexWrap: 'wrap', gap: 1 }}>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={handleSortByChange}
          aria-label="Sort by"
          size="small"
        >
          <ToggleButton value="price" aria-label="sort by price">
            <PriceChangeIcon sx={{ mr: 0.5 }} fontSize="small" /> Price
          </ToggleButton>
          <ToggleButton value="duration" aria-label="sort by duration">
            <TimerIcon sx={{ mr: 0.5 }} fontSize="small" /> Duration
          </ToggleButton>
        </ToggleButtonGroup>
        {sortBy && ( // Only show direction toggle if a sort criteria is selected
          <Tooltip title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}>
            <IconButton onClick={handleSortDirectionChange} color="primary">
              {sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Paper>}

      {sortedDisplayedFlights.map(flightResult => (
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

