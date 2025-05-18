import React, { useContext, useEffect, useState, useCallback, JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button as MuiButton, // Renamed to avoid conflict if you have a custom Button
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports'
import PaymentsIcon from '@mui/icons-material/Payments'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

import { FlightSearchContext, } from '../context/FlightSearchContext' // Adjust path
import { FlightSearchContextType } from '../types/FlightSearchContextTypes'
import {
  FlightSearchResponse,
  Itinerary,
  FlightLeg,
  TravelerPricingInfo,
  FareDetailPerSegment,
  AmenityInfo,
  PriceSummary,
  FeeInfo,
} from '../types/FlightSearchResponseTypes' // Adjust path
import { searchCityName } from '../services/FlightsService' // Adjust path
import { CitySearchResponse } from '../types/FlightSearchTypes'

// Utility to format date and time (can be moved to a utils file)
const formatDateTime = (iso?: string | null, includeDate = true) => {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (!includeDate) return time
  const date = d.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  return `${time}, ${date}`
}

const DetailsContainer: React.FC = () => {
  const context = useContext(FlightSearchContext) as FlightSearchContextType // Assuming context is always provided
  const navigate = useNavigate()

  const [cityMap, setCityMap] = useState<Map<string, string>>(new Map())
  const [loadingCities, setLoadingCities] = useState<boolean>(false)

  if (!context || !context.detailsInfo) {
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error">Flight details context is not available.</Alert>
      </Container>
    )
  }

  const { flight, loadingFlight, errorFlight } = context.detailsInfo

  // Modified getCityName to include on-demand fetching
  const getCityName = useCallback(
    (iataCode?: string | null): string => {
      if (!iataCode) return 'N/A'

      // 1. Check if the city name is already in the local map
      if (cityMap.has(iataCode)) {
        return cityMap.get(iataCode) || iataCode // Return found name or fallback to code
      }

      // 2. If not in the map, initiate an API call (fire-and-forget for this sync function's return)
      // The component will re-render once setCityMap updates the state.
      // Check if we are already fetching this code to prevent multiple calls (optional, simple version here)
      // For a more robust solution, you might want to track pending requests for specific IATA codes.
      searchCityName(iataCode)
        .then((data: CitySearchResponse) => { // Explicitly type data
          const nameToStore = data && data.cityName ? data.cityName : iataCode
          setCityMap(prevMap => {
            if (prevMap.get(iataCode) === nameToStore) return prevMap // Avoid unnecessary update if value is already same
            const newMap = new Map(prevMap)
            newMap.set(iataCode, nameToStore)
            return newMap
          })
        })
        .catch(err => {
          console.error(`On-demand getCityName: Failed to fetch city for ${iataCode}:`, err)
          // On error, store the IATA code itself as a fallback to prevent repeated failed API calls
          // from this on-demand fetch for this specific iataCode.
          setCityMap(prevMap => {
            // Avoid overwriting if another process (like useEffect) already handled it or set a name
            // or if it's already set to the iataCode (meaning a previous fetch for it failed)
            if (prevMap.has(iataCode)) {
              return prevMap;
            }
            const newMap = new Map(prevMap)
            newMap.set(iataCode, iataCode) // Store IATA code as fallback
            return newMap
          })
        })

      // 3. Return the IATA code as an immediate fallback.
      // The UI will initially show this, then update when the API call completes and cityMap changes.
      return iataCode
    },
    [cityMap, setCityMap] // setCityMap is now a dependency
  )

  useEffect(() => {
    if (flight) {
      const fetchAllCityNames = async () => {
        setLoadingCities(true)
        // Start with a fresh map based on current cityMap to preserve on-demand fetches
        // or completely fresh if you want useEffect to be the sole populator initially.
        // For this version, let's allow useEffect to overwrite/confirm on-demand fetches.
        const newCityMapForEffect = new Map<string, string>() // Build this map from scratch based on current flight
        const codesToFetch = new Set<string>()

        flight.itineraries?.forEach(itinerary => {
          itinerary.segments?.forEach(segment => {
            if (segment.departureAirportCode) {
              codesToFetch.add(segment.departureAirportCode)
            }
            if (segment.arrivalAirportCode) {
              codesToFetch.add(segment.arrivalAirportCode)
            }
          })
        })

        // Filter out codes already present in the main cityMap, unless we want to re-verify them.
        // For simplicity here, we'll attempt to fetch all unique codes from the current flight.
        // The getCityName on-demand fetch will also fill the map.

        if (codesToFetch.size > 0) {
          try {
            const promises = Array.from(codesToFetch).map(code =>
              searchCityName(code)
                .then(data => ({ code, name: data.cityName }))
                .catch(err => {
                  console.error(`useEffect: Failed to fetch city for ${code}:`, err)
                  return { code, name: code } // Fallback to code
                })
            )
            const results = await Promise.all(promises)
            results.forEach(result => newCityMapForEffect.set(result.code, result.name))

            // Merge with existing cityMap, giving preference to newly fetched data by useEffect
            // or simply set the new map if useEffect is meant to be authoritative for the current flight.
            setCityMap(prevMap => new Map([...Array.from(prevMap.entries()), ...Array.from(newCityMapForEffect.entries())]));

          } catch (error) {
            console.error("Error fetching city names in details useEffect:", error)
          }
        }
        setLoadingCities(false)
      }
      fetchAllCityNames()
    }
  }, [flight, setCityMap]) // Added setCityMap to dependency array of useEffect

  if (loadingFlight || (flight && loadingCities)) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography ml={2}>{loadingFlight ? "Loading flight details..." : "Loading location names..."}</Typography>
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

  // --- Render Flight Details ---
  const renderAmenity = (amenity: AmenityInfo, index: number) => (
    <Chip
      key={index}
      label={`${amenity.name}${amenity.isChargeable ? ' (Chargeable)' : ' (Free)'}`}
      size="small"
      variant="outlined"
      sx={{ mr: 0.5, mb: 0.5 }}
    />
  )

  const renderFareDetails = (segmentId: string) => {
    const fareDetailsList: JSX.Element[] = []
    flight.travelerPricings?.forEach((tp, travelerIndex) => {
      const fareDetailForSegment = tp.fareDetailsBySegment?.find(
        fd => fd.segmentId === segmentId
      )
      if (fareDetailForSegment) {
        fareDetailsList.push(
          <Box key={`traveler-${travelerIndex}-segment-${segmentId}`} mb={1} pl={2}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Traveler {tp.travelerId} ({tp.travelerType || 'N/A'}):
            </Typography>
            <Chip size="small" label={`Cabin: ${fareDetailForSegment.cabin || 'N/A'}`} sx={{ mr: 1, mb: 0.5 }} />
            <Chip size="small" label={`Class: ${fareDetailForSegment.bookingClass || 'N/A'}`} sx={{ mr: 1, mb: 0.5 }} />
            <Typography variant="caption" display="block" mt={0.5}>
              Bags: {fareDetailForSegment.includedCheckedBagsDescription || 'N/A'}
            </Typography>
            {fareDetailForSegment.amenities && fareDetailForSegment.amenities.length > 0 && (
              <Box mt={0.5}>
                <Typography variant="caption" display="block">Amenities:</Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.5}>
                  {fareDetailForSegment.amenities.map(renderAmenity)}
                </Stack>
              </Box>
            )}
          </Box>
        )
      }
    })
    return fareDetailsList.length > 0 ? <Box mt={1}>{fareDetailsList}</Box> : <Typography variant="caption" pl={2}>Fare details not available for this segment.</Typography>;
  }

  const renderSegment = (segment: FlightLeg, isLastSegment: boolean) => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1" fontWeight="medium">
          {getCityName(segment.departureAirportCode)} ({segment.departureAirportCode}) → {getCityName(segment.arrivalAirportCode)} ({segment.arrivalAirportCode})
        </Typography>
        <Chip label={segment.duration || "N/A"} icon={<ConnectingAirportsIcon />} size="small" />
      </Stack>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="body2" color="text.secondary">Departure</Typography>
          <Typography variant="body1">{formatDateTime(segment.departureTime)}</Typography>
          {segment.departureAirportTerminal && <Typography variant="caption">Terminal: {segment.departureAirportTerminal}</Typography>}
        </Box>
        <Box textAlign="right">
          <Typography variant="body2" color="text.secondary">Arrival</Typography>
          <Typography variant="body1">{formatDateTime(segment.arrivalTime)}</Typography>
          {segment.arrivalAirportTerminal && <Typography variant="caption">Terminal: {segment.arrivalAirportTerminal}</Typography>}
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" display="block" gutterBottom>
        <FlightTakeoffIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
        {segment.marketingAirlineName || segment.marketingAirlineCode} {segment.flightNumber}
        {segment.operatingAirlineCode && segment.operatingAirlineCode !== segment.marketingAirlineCode && (
          ` (Operated by ${segment.operatingAirlineName || segment.operatingAirlineCode})`
        )}
      </Typography>
      <Typography variant="caption" display="block">
        <AirlineSeatReclineNormalIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
        Aircraft: {segment.aircraftTypeName || 'N/A'}
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 1.5, mb: 0.5 }}>Fare Details:</Typography>
      {renderFareDetails(segment.id)}

      {!isLastSegment && segment.layoverDuration && (
        <Chip label={`Layover: ${segment.layoverDuration}`} color="info" sx={{ mt: 1.5 }} />
      )}
    </Paper>
  )

  const renderPriceBreakdown = (summary: PriceSummary, travelerPricings?: TravelerPricingInfo[] | null) => (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, position: { md: 'sticky' }, top: { md: '20px' } }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <PaymentsIcon sx={{ mr: 1 }} /> Price Breakdown
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        Currency: {summary.currencyName || summary.currencyCode} ({summary.currencyCode})
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="Base Price:" secondary={summary.basePrice || 'N/A'} />
        </ListItem>
        {summary.fees?.map((fee, index) => (
          <ListItem key={`fee-${index}`}>
            <ListItemText primary={`${fee.type || 'Fee'}:`} secondary={fee.amount} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} component="li" />
        <ListItem sx={{ py: 2 }}>
          <ListItemText
            primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            secondaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            primary="Total Price:"
            secondary={summary.totalPrice} />
        </ListItem>
      </List>
      {travelerPricings && travelerPricings.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Price per Traveler:</Typography>
          <List dense>
            {travelerPricings.map((tp, index) => (
              <ListItem key={`travelerprice-${index}`}>
                <ListItemIcon sx={{ minWidth: '30px' }}><LocalOfferIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary={`${tp.travelerType || 'Traveler'} ${tp.travelerId}:`} secondary={`${tp.totalPrice || 'N/A'} ${tp.currencyCode || summary.currencyCode}`} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  )

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
                renderSegment(segment, segIndex === (itinerary.segments?.length ?? 0) - 1)
              )}
            </Box>
          ))}
        </Box>

        {/* Sidebar: Price Breakdown */}
        <Box sx={{ flexGrow: 1, flexBasis: { md: '35%' }, minWidth: { md: '300px' } }}>
          {flight.priceSummary && renderPriceBreakdown(flight.priceSummary, flight.travelerPricings)}
        </Box>
      </Box>
    </Container>
  )
}

export default DetailsContainer

