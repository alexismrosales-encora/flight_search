import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider } from "@emotion/react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { FlighSearchProvider } from "./context/FlightSearchContext"
import CustomTheme from "./themes/theme"
import SearchPage from "./pages/SearchPage"
import DetailsPage from "./pages/DetailsPage";

// Principal function where are all components, including routing
// You have two routes:
// "/": SearchPage
// "/book/options": options to see dates
function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FlighSearchProvider>
        <ThemeProvider theme={CustomTheme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/book/options" element={<DetailsPage />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </FlighSearchProvider>
    </LocalizationProvider>
  )
}

export default App
