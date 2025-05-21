import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material"
import { FlightLeg, TravelerPricingInfo } from "../../types/FlightSearchResponseTypes"
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'

import { formatDateTime } from "../../utils/formatDateTime"
import FareDetailsSection from "./FareDetailsSection"
import { FC } from "react"


interface SegmentCardProps {
  segment: FlightLeg
  isLastSegment: boolean
  getCityName: (iataCode?: string | null) => string
  travelerPricings?: TravelerPricingInfo[] | null
}

const SegmentCard: FC<SegmentCardProps> = ({ segment, isLastSegment, getCityName, travelerPricings }) => {
  return (
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
      <FareDetailsSection segmentId={segment.id} travelerPricings={travelerPricings} />

      {!isLastSegment && segment.layoverDuration && (
        <Chip
          label={`Layover: ${segment.layoverDuration}`} color="secondary"
          sx={{ mt: 1.5 }} />
      )}
    </Paper>
  )
}

export default SegmentCard
