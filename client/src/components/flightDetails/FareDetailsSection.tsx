import { FC, JSX } from "react"
import { TravelerPricingInfo } from "../../types/FlightSearchResponseTypes"
import { Box, Chip, Typography } from "@mui/material"
import AmenityItem from "./AmenityItem"

interface FareDetailsSectionProps {
  segmentId: string
  travelerPricings?: TravelerPricingInfo[] | null
}
const FareDetailsSection: FC<FareDetailsSectionProps> = ({ segmentId, travelerPricings }) => {
  const fareDetailsList: JSX.Element[] = []
  travelerPricings?.forEach((tp, travelerIndex) => {
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
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Amenities:</Typography>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                alignItems="flex-start"
                gap={0.5}
              >
                {fareDetailForSegment.amenities.map((amenity, index) => (
                  // Key should be here when mapping
                  <AmenityItem key={`${segmentId}-amenity-${index}`} amenity={amenity} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )
    }
  })
  return fareDetailsList.length > 0 ? <Box mt={1}>{fareDetailsList}</Box> : <Typography variant="caption" pl={2}>Fare details not available for this segment.</Typography>
}

export default FareDetailsSection
