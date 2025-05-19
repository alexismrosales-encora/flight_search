import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
} from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import FlightIcon from '@mui/icons-material/Flight'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward' // Using ArrowForward for better visual alignment
// Updated import path for types
import {
  FlightSearchResponse,
  FlightLeg,
  Itinerary,
} from '../../types/FlightSearchResponseTypes'
import Button from '../common/button' // Assuming this is your custom button

interface Props {
  flight: FlightSearchResponse
  citySearch: (iataCode: string) => string | undefined // citySearch might return undefined
  handleOnClick: (flight: FlightSearchResponse) => void
}

const formatDateTime = (iso?: string | null) => {
  if (!iso) return { time: 'N/A', date: 'N/A' }
  const d = new Date(iso)
  return {
    time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: d.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  }
}

const FlightDetailsCard: React.FC<Props> = ({
  flight,
  citySearch,
  handleOnClick,
}) => {
  // Destructure for easier access and null safety
  const { itineraries, priceSummary, numberOfBookableSeats, offerId } = flight

  const firstItinerary: Itinerary | undefined = itineraries?.[0]
  const secondItinerary: Itinerary | undefined = itineraries?.[1] // For inbound/return

  const firstSegmentOfFirstItinerary: FlightLeg | undefined =
    firstItinerary?.segments?.[0]

  // For the header display, the "overall arrival" should be the destination of the outbound (first) journey.
  const lastSegmentOfFirstItinerary: FlightLeg | undefined =
    firstItinerary?.segments?.[firstItinerary.segments.length - 1]


  const renderLeg = (leg: FlightLeg, itineraryIndex: number, legIndex: number) => {
    const { time: depTime, date: depDate } = formatDateTime(leg.departureTime)
    const { time: arrTime, date: arrDate } = formatDateTime(leg.arrivalTime)

    const depCityName =
      citySearch(leg.departureAirportCode) || leg.departureAirportCode
    const arrCityName =
      citySearch(leg.arrivalAirportCode) || leg.arrivalAirportCode

    const airlineName = leg.marketingAirlineName || leg.marketingAirlineCode
    const operatingAirlineName =
      leg.operatingAirlineName || leg.operatingAirlineCode

    const isOperatedByDifferent =
      leg.operatingAirlineCode &&
      leg.operatingAirlineCode !== leg.marketingAirlineCode

    return (
      <Box key={`${leg.id}-${itineraryIndex}-${legIndex}`} mb={3} pl={0.5}>
        {/* Departure and Arrival Info Side-by-Side */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          {/* Departure Info */}
          <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 0 }} flexBasis={{ sm: '45%' }} flexGrow={1}>
            <PlaceIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {depCityName} ({leg.departureAirportCode})
              </Typography>
              {leg.departureAirportTerminal && (
                <Typography
                  variant="caption"
                  display="block"
                  color="textSecondary"
                >
                  Terminal: {leg.departureAirportTerminal}
                </Typography>
              )}
              <Typography variant="caption" color="textSecondary">
                {depTime} – {depDate}
              </Typography>
            </Box>
          </Box>

          {/* Arrow Separator */}
          <Box display="flex" justifyContent="center" alignItems="center" mx={1} my={{ xs: 1, sm: 0 }} flexBasis={{ sm: '10%' }} >
            <ArrowForwardIcon fontSize="small" color="action" />
          </Box>

          {/* Arrival Info */}
          <Box display="flex" alignItems="center" flexBasis={{ sm: '45%' }} flexGrow={1}>
            <PlaceIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {arrCityName} ({leg.arrivalAirportCode})
              </Typography>
              {leg.arrivalAirportTerminal && (
                <Typography
                  variant="caption"
                  display="block"
                  color="textSecondary"
                >
                  Terminal: {leg.arrivalAirportTerminal}
                </Typography>
              )}
              <Typography variant="caption" color="textSecondary">
                {arrTime} – {arrDate}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Flight Details Stack */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          mt={1.5}
          flexWrap="wrap"
        >
          <FlightIcon fontSize="small" color="action" />
          <Typography variant="caption" color="textSecondary">
            {airlineName} {leg.flightNumber}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            • {leg.duration}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            •{' '}
            {leg.numberOfStops === 0
              ? 'Non-stop'
              : `${leg.numberOfStops} stop(s)`}
          </Typography>
          {leg.aircraftTypeName && (
            <Typography variant="caption" color="textSecondary">
              • {leg.aircraftTypeName}
            </Typography>
          )}
        </Stack>
        {isOperatedByDifferent && (
          <Typography variant="caption" color="textSecondary" display="block" mt={0.5}>
            Operated by: {operatingAirlineName}
          </Typography>
        )}
        {leg.layoverDuration && (
          <Typography variant="caption" color="info.main" display="block" mt={0.5} fontWeight="medium">
            Layover: {leg.layoverDuration}
          </Typography>
        )}
      </Box>
    )
  }

  // Determine overall departure and arrival cities for the header
  const overallDepartureCity = firstSegmentOfFirstItinerary
    ? citySearch(firstSegmentOfFirstItinerary.departureAirportCode) ||
    firstSegmentOfFirstItinerary.departureAirportCode
    : 'N/A'

  const overallArrivalCity = lastSegmentOfFirstItinerary
    ? citySearch(lastSegmentOfFirstItinerary.arrivalAirportCode) ||
    lastSegmentOfFirstItinerary.arrivalAirportCode
    : 'N/A'

  const pricePerTraveler = flight.travelerPricings?.[0]?.totalPrice
  const priceDisplay = pricePerTraveler
    ? `${priceSummary.currencyName || priceSummary.currencyCode} ${priceSummary.totalPrice} (from ${pricePerTraveler} per traveler)`
    : `${priceSummary.currencyName || priceSummary.currencyCode} ${priceSummary.totalPrice}`


  if (!firstItinerary || !firstSegmentOfFirstItinerary || !priceSummary) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
        <CardHeader title="Flight Information Unavailable" />
        <CardContent>
          <Typography>Required flight details are missing for this offer.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
      <CardHeader
        titleTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
        subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
        title={`${overallDepartureCity} → ${overallArrivalCity}`}
        subheader={`Offer ID: ${offerId}`}
        action={
          <Button onClick={() => handleOnClick(flight)}>View Details</Button>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
          <Chip
            icon={<FlightIcon />}
            label={
              firstSegmentOfFirstItinerary.marketingAirlineName ||
              firstSegmentOfFirstItinerary.marketingAirlineCode
            }
            size="small"
            variant="outlined"
            color="info"
          />
          <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
            {priceDisplay}
          </Typography>
          <Box flexGrow={1} />
          <Chip
            label={`${numberOfBookableSeats} seat(s) left`}
            size="small"
            color={numberOfBookableSeats < 10 ? 'warning' : 'default'}
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Outbound Itinerary */}
        <Box mt={2}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
            {itineraries.length > 1 ? 'Departure' : 'Journey Details'}
            {firstItinerary.totalDuration && ` (${firstItinerary.totalDuration})`}
          </Typography>
          {firstItinerary.segments.map((leg, index) => renderLeg(leg, 0, index))}
        </Box>

        {/* Inbound/Return Itinerary (if exists) */}
        {secondItinerary && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                Return
                {secondItinerary.totalDuration && ` (${secondItinerary.totalDuration})`}
              </Typography>
              {secondItinerary.segments.map((leg, index) => renderLeg(leg, 1, index))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default FlightDetailsCard

