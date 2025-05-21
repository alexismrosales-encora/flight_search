import { useContext, useEffect, useState, useCallback, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button as MuiButton, // Renamed to avoid conflict if you have a custom Button
  CircularProgress,
  Alert
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { FlightSearchContext, } from '../context/FlightSearchContext'
import { FlightSearchContextType } from '../types/FlightSearchContextTypes'
import { searchCityName } from '../services/FlightsService'
import { CitySearchResponse } from '../types/FlightSearchTypes'
import SegmentCard from '../components/flightDetails/SegmentCard'
import PriceBreakdownCard from '../components/flightDetails/PriceBreakdownCard'

const DetailsContainer: FC = () => {
  const context = useContext(FlightSearchContext) as FlightSearchContextType
  const navigate = useNavigate()

  const [loadingOnDemandCity, setLoadingOnDemandCity] = useState<Record<string, boolean>>({})

  if (!context || !context.detailsInfo) {
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error">Flight details context is not available.</Alert>
      </Container>
    )
  }

  const { flight, loadingFlight, errorFlight, cityMap, setCityMap } = context.detailsInfo

  useEffect(() => {
    if (flight && setCityMap) {
      const fetchMissingCityNames = async () => {
        const codesToFetch = new Set<string>()
        flight.itineraries?.forEach(itinerary => {
          itinerary.segments?.forEach(segment => {
            if (segment.departureAirportCode && !cityMap.has(segment.departureAirportCode)) {
              codesToFetch.add(segment.departureAirportCode)
            }
            if (segment.arrivalAirportCode && !cityMap.has(segment.arrivalAirportCode)) {
              codesToFetch.add(segment.arrivalAirportCode)
            }
          })
        })

        if (codesToFetch.size > 0) {
          try {
            const promises = Array.from(codesToFetch).map(code =>
              searchCityName(code)
                .then((data: CitySearchResponse) => ({ code, name: data.cityName }))
                .catch(err => {
                  console.error(`useEffect (Details): Failed to fetch city for ${code}:`, err)
                  return { code, name: code }
                })
            )
            const results = await Promise.all(promises)

            setCityMap(prevMap => {
              const newMap = new Map(prevMap)
              results.forEach(result => newMap.set(result.code, result.name))
              if (Array.from(newMap.entries()).some(([key, value]) => prevMap.get(key) !== value) || newMap.size !== prevMap.size) {
                return newMap
              }
              return prevMap
            })
          } catch (error) {
            console.error("Error batch fetching city names in details useEffect:", error)
          }
        }
      }
      fetchMissingCityNames()
    }
  }, [flight, cityMap, setCityMap])

  const getCityName = useCallback(
    (iataCode?: string | null): string => {
      if (!iataCode) return 'N/A'
      if (cityMap.has(iataCode)) {
        return cityMap.get(iataCode) || iataCode
      }

      if (setCityMap && !loadingOnDemandCity[iataCode]) {
        setLoadingOnDemandCity(prev => ({ ...prev, [iataCode]: true }))
        searchCityName(iataCode)
          .then((data: CitySearchResponse) => {
            const nameToStore = data && data.cityName ? data.cityName : iataCode
            setCityMap(prevMap => {
              if (prevMap.get(iataCode) === nameToStore) return prevMap
              const newMap = new Map(prevMap)
              newMap.set(iataCode, nameToStore)
              return newMap
            })
          })
          .catch(err => {
            console.error(`On-demand getCityName (Details): Failed to fetch city for ${iataCode}:`, err)
            setCityMap(prevMap => {
              if (prevMap.has(iataCode)) return prevMap
              const newMap = new Map(prevMap)
              newMap.set(iataCode, iataCode)
              return newMap
            })
          })
          .finally(() => {
            setLoadingOnDemandCity(prev => ({ ...prev, [iataCode]: false }))
          })
      }
      return loadingOnDemandCity[iataCode] ? "Loading..." : iataCode
    },
    [cityMap, setCityMap, loadingOnDemandCity]
  )


  if (loadingFlight) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography ml={2}>Loading flight details...</Typography>
      </Container>
    )
  }

  if (errorFlight) {
    return (
      <Container sx={{ py: 3 }}>
        <MuiButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Search
        </MuiButton>
        <Alert severity="error">Error loading flight details: {errorFlight}</Alert>
      </Container>
    )
  }

  if (!flight) {
    return (
      <Container sx={{ py: 3 }}>
        <MuiButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Search
        </MuiButton>
        <Alert severity="info">No flight details to display. Please select a flight from the search results.</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <MuiButton
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Search Results
      </MuiButton>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Main Content: Itineraries & Segments */}
        <Box sx={{ flexGrow: 1, flexBasis: { md: '65%' } }}>
          {flight.itineraries?.map((itinerary, index) => (
            <Box key={`itinerary-${index}`} mb={index < (flight.itineraries?.length ?? 0) - 1 ? 4 : 2}>
              <Typography variant="h5" gutterBottom component="h2" sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 2 }}>
                {index === 0 ? 'Departure Journey' : 'Return Journey'}
                {itinerary.totalDuration && ` (Total duration: ${itinerary.totalDuration})`}
              </Typography>
              {itinerary.segments?.map((segment, segIndex) =>
                <SegmentCard
                  key={segment.id}
                  segment={segment}
                  isLastSegment={segIndex === (itinerary.segments?.length ?? 0) - 1}
                  getCityName={getCityName}
                  travelerPricings={flight.travelerPricings}
                />
              )}
            </Box>
          ))}
        </Box>

        {/* Sidebar: Price Breakdown */}
        <Box sx={{ flexGrow: 1, flexBasis: { md: '35%' }, minWidth: { md: '300px' } }}>
          {flight.priceSummary &&
            <PriceBreakdownCard
              summary={flight.priceSummary}
              travelerPricings={flight.travelerPricings}
            />
          }
        </Box>
      </Box>
    </Container>
  )
}
export default DetailsContainer
