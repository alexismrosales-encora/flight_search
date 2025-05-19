import React from "react";
import { Box } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

type CalendarViewProps = {
  selectedDate: Date | null;
  onDateChange: (newDate: Date | null) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateChange }) => {
  // Getting date 
  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <Box
      sx={{
        padding: 1,
        background: "white",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <StaticDatePicker
        value={selectedDate}
        onChange={onDateChange}
        displayStaticWrapperAs="desktop" // ensures desktop layout
        slots={{
          actionBar: () => null
        }}
        shouldDisableDate={(date) => {
          // Disable all dates before tomorrow
          return date < tomorrow
        }}
      />
    </Box>
  )
}

export default CalendarView

