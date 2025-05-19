import { Box } from "@mui/material"
import { ReactNode } from "react"

type OptionProps = {
  children: ReactNode
}
const Options = ({ children }: OptionProps) => {
  return <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: 2,
      backgroundColor: "white",
      borderRadius: 2,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    {children}
  </Box>
}

export default Options
