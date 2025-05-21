import { FC } from "react";
import { AmenityInfo } from "../../types/FlightSearchResponseTypes";
import { capitalizeWords } from "../../utils/capitalizeWords";
import { Chip } from "@mui/material";

interface AmenityItemProps {
  amenity: AmenityInfo
}
const AmenityItem: FC<AmenityItemProps> = ({ amenity }) => {
  if (!amenity || !amenity.description) return null; // Render nothing if no description
  return (
    <Chip
      label={`${capitalizeWords(amenity.description)}${amenity.isChargeable ? ' (Chargeable)' : ' (Free)'}`}
      size="small"
      variant="outlined"
    />
  )
}
export default AmenityItem
