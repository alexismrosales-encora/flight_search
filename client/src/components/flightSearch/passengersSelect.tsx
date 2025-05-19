import { FC } from "react";
import { PassengerMap } from "../../types/FlightSearchTypes";
import Options from "../common/Options";
import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"


const categories = [
  { key: "adults", label: "Adults", description: "+18 years" },
  { key: "children", label: "Children", description: "-18 years" },
  { key: "infants", label: "Infants", description: "- 2 years" },
];

type PassengersSelectProps = {
  value: PassengerMap
  onChange: (value: PassengerMap) => void
}

const PassengersSelect: FC<PassengersSelectProps> = ({ value, onChange }) => {
  const handleChange = (key: keyof PassengerMap, delta: number) => {
    let newCount = value[key] + delta;

    if (key === "adults") {
      newCount = Math.max(1, newCount);
    } else {
      newCount = Math.max(0, newCount);
    }

    if (newCount !== value[key]) {
      const newValue = {
        ...value,
        [key]: newCount,
      };
      onChange(newValue);
    }
  }

  return <Options>
    {categories.map(({ key, label, description }) => (
      <Box key={key} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography fontWeight={600}>{label}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            aria-label={`remove ${key}`}
            size="small"
            onClick={() => handleChange(key as keyof PassengerMap, -1)}
            disabled={value[key as keyof PassengerMap] === 0}
            sx={{ backgroundColor: value[key as keyof PassengerMap] === 0 ? "#ddd" : "#c4f000", color: "black" }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography>{value[key as keyof PassengerMap]}</Typography>

          <IconButton
            aria-label={`add ${key}`}
            size="small"
            onClick={() => handleChange(key as keyof PassengerMap, 1)}
            sx={{ backgroundColor: "#005c1e", color: "white" }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    ))}
  </Options>
}
export default PassengersSelect
