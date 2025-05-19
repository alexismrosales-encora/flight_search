import { useState, useMemo, useEffect, useContext } from "react"
import {
  Alert,
  Box,
  TextField,
  CircularProgress,
  Paper,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Button as MuiButton
} from "@mui/material"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import GroupIcon from '@mui/icons-material/Group'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import Autocomplete from '@mui/material/Autocomplete'

import CalendarView from "../components/flightSearch/calendar"
import PassengersSelect from "../components/flightSearch/passengersSelect"
import StyledCheckbox from "../components/common/CheckBox"
import BinaryToggle from "../components/common/BinaryToogle"

import currencyCodes from "currency-codes"
import { FlightSearchRequest, LocationSearchResponse, PassengerMap } from "../types/FlightSearchTypes"
import { FlightSearchResponse } from "../types/FlightSearchResponseTypes"
import { searchFlights } from "../services/FlightsService"
import { FlightSearchContext } from "../context/FlightSearchContext"
import { FlightSearchContextType } from "../types/FlightSearchContextTypes"
import { useAirportSearchHandler, clearAirportResults, parsePassengersToString } from "../utils/airportUtils"

const SearcherContainer = () => {
  const context = useContext(FlightSearchContext)
  const typedContext = context as FlightSearchContextType

  if (!typedContext || !typedContext.searchResultsState) {
    return <Box sx={{ p: 2, textAlign: 'center' }}><Alert severity="error">Search functionality is currently unavailable.</Alert></Box>
  }

  const { setSearchResults, loading, setLoading, error, setError, setSearchAttemped } = typedContext.searchResultsState

  const [departureValue, setDepartureValue] = useState<string | null>(null)
  const [arrivalValue, setArrivalValue] = useState<string | null>(null)

  const [departureRawResults, setDepartureRawResults] = useState<LocationSearchResponse | null>(null)
  const [arrivalRawResults, setArrivalRawResults] = useState<LocationSearchResponse | null>(null)


  const [departureOptions, setDepartureOptions] = useState<string[]>([])
  const [arrivalOptions, setArrivalOptions] = useState<string[]>([])
  const [departureLoading, setDepartureLoading] = useState(false)
  const [arrivalLoading, setArrivalLoading] = useState(false)

  const [departureDate, setDepartureDate] = useState<Date | null>(new Date())
  const [returnDate, setReturnDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() + 7)))

  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false)
  const [showReturnCalendar, setShowReturnCalendar] = useState(false)
  const [showPassengersSelect, setShowPassengersSelect] = useState(false)

  const [passengers, setPassengers] = useState<PassengerMap>({ adults: 1, children: 0, infants: 0 })
  const [noReturn, setNoReturn] = useState(false)
  const [currency, setCurrency] = useState<string | null>("USD") // Default to USD
  const [showWarningMessage, setShowWarningMessage] = useState(false)
  const [withStops, setWithStops] = useState(false) // if true, nonStop is false

  const handleAirportSearch = useAirportSearchHandler()

  const handleOnSubmitForm = async () => {
    if (!arrivalValue || !departureValue || !departureDate || (!noReturn && !returnDate) || !currency) {
      setShowWarningMessage(true)
      setError("Please fill in all required search fields.")
      return
    } else {
      setShowWarningMessage(false)
      if (error === "Please fill in all required search fields.") setError(null)
    }

    setLoading(true)
    setSearchAttemped(true)
    setError(null)

    const originIata = departureValue?.split(" | ")[1]?.trim()
    const destinationIata = arrivalValue?.split(" | ")[1]?.trim()

    if (!originIata || !destinationIata) {
      setError("Invalid airport selection. Please select from the list.")
      setLoading(false)
      return
    }

    const req: FlightSearchRequest = {
      originLocationCode: originIata,
      destinationLocationCode: destinationIata,
      departureDate: departureDate.toISOString().split('T')[0],
      returnDate: noReturn || !returnDate ? "" : returnDate.toISOString().split('T')[0],
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      currencyCode: currency,
      max: 10,
      nonStop: withStops,
    }

    // Trying to fetch Flights for then display them in the flights component
    try {
      console.log("Req of SearchFlights", req)
      const res: FlightSearchResponse[] | null = await searchFlights(req)
      setSearchResults(res || [])
      if (!res) setError("No flight information was returned.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const currencyOptions = useMemo(() => currencyCodes.codes().map(code => ({ label: `${code} - ${currencyCodes.code(code)?.currency || ''}`, value: code })), [])

  useEffect(() => {
    setDepartureOptions(clearAirportResults(departureRawResults))
  }, [departureRawResults])

  useEffect(() => {
    setArrivalOptions(clearAirportResults(arrivalRawResults))
  }, [arrivalRawResults])

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" p={{ xs: 1, sm: 2, md: 3 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '50rem', borderRadius: '12px' }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="medium">
          Search Flights
        </Typography>

        <form onSubmit={(e) => { e.preventDefault(); handleOnSubmitForm() }}>
          <Stack spacing={3}>
            {/* Departure and Arrival Airports */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <Autocomplete
                fullWidth
                options={departureOptions}
                loading={departureLoading}
                value={departureValue}
                onInputChange={(_, newInputValue) => {
                  // Pass the setter for the raw results to handleAirportSearch
                  handleAirportSearch(
                    { keyword: newInputValue, pageLimit: 7, pageOffset: 0 },
                    setDepartureRawResults, // Corrected: Pass the raw results setter
                    setDepartureLoading
                  )
                }}
                onChange={(_, newValue) => setDepartureValue(newValue)}
                getOptionLabel={(option) => typeof option === 'string' ? option : ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Departure Airport"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {departureLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', p: 1 }}>
                <IconButton disabled><SwapHorizIcon /></IconButton> {/* Visual separator */}
              </Box>
              <Autocomplete
                fullWidth
                options={arrivalOptions}
                loading={arrivalLoading}
                value={arrivalValue}
                onInputChange={(_, newInputValue) => {
                  // Pass the setter for the raw results to handleAirportSearch
                  handleAirportSearch(
                    { keyword: newInputValue, pageLimit: 7, pageOffset: 0 },
                    setArrivalRawResults, // Corrected: Pass the raw results setter
                    setArrivalLoading
                  )
                }}
                onChange={(_, newValue) => setArrivalValue(newValue)}
                getOptionLabel={(option) => typeof option === 'string' ? option : ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Arrival Airport"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {arrivalLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Stack>

            {/* Dates */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Departure Date"
                value={departureDate ? departureDate.toLocaleDateString() : 'Select Date'}
                onClick={() => setShowDepartureCalendar(!showDepartureCalendar)}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowDepartureCalendar(!showDepartureCalendar)} edge="end">
                        <CalendarTodayIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Return Date"
                value={noReturn ? 'One Way' : (returnDate ? returnDate.toLocaleDateString() : 'Select Date')}
                onClick={() => !noReturn && setShowReturnCalendar(!showReturnCalendar)}
                disabled={noReturn}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => !noReturn && setShowReturnCalendar(!showReturnCalendar)} edge="end" disabled={noReturn}>
                        <CalendarTodayIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Stack>

            {/* Calendar Views - Conditionally Rendered */}
            {showDepartureCalendar && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <CalendarView
                  selectedDate={departureDate}
                  onDateChange={(value) => {
                    if (value && !Array.isArray(value)) {
                      setDepartureDate(value)
                      setShowDepartureCalendar(false)
                      if (returnDate && value > returnDate) setReturnDate(value) // Ensure return is after departure
                    }
                  }}
                />
              </Box>
            )}
            {showReturnCalendar && !noReturn && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <CalendarView
                  selectedDate={returnDate}
                  onDateChange={(value) => {
                    if (value && !Array.isArray(value)) {
                      setReturnDate(value)
                      setShowReturnCalendar(false)
                    }
                  }}
                />
              </Box>
            )}

            {/* Passengers and Currency */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Passengers"
                value={parsePassengersToString(passengers)}
                onClick={() => setShowPassengersSelect(!showPassengersSelect)}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassengersSelect(!showPassengersSelect)} edge="end">
                        <GroupIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <Autocomplete
                fullWidth
                options={currencyOptions}
                value={currencyOptions.find(c => c.value === currency) || null}
                onChange={(_, newValue) => setCurrency(newValue ? newValue.value : null)}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} label="Currency" variant="outlined" />}
              />
            </Stack>

            {/* Passengers Select - Conditionally Rendered */}
            {showPassengersSelect && (
              <Box sx={{ my: 1, p: 2, border: '1px solid lightgray', borderRadius: 1 }}>
                <PassengersSelect
                  value={passengers}
                  onChange={(passengerValues) => setPassengers(passengerValues)}
                />
                <MuiButton onClick={() => setShowPassengersSelect(false)} size="small" sx={{ mt: 1 }}>Done</MuiButton>
              </Box>
            )}

            {/* Options: No Return & Stops */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-around" alignItems="center">
              <StyledCheckbox label={"One Way (No Return)"} checked={noReturn} setChecked={setNoReturn} />
              <BinaryToggle enabledLabel="With Stops" disabledLabel="Direct Flights Only" checked={withStops} setChecked={setWithStops} />
            </Stack>

            {showWarningMessage && (
              <Alert severity="warning" sx={{ justifyContent: "center", mt: 2 }}>
                Oops! It looks like some information is missing. Could you please check the form?
              </Alert>
            )}
            {error && error !== "Please fill in all required search fields." && (
              <Alert severity="error" sx={{ justifyContent: "center", mt: 2 }}>
                {error}
              </Alert>
            )}

            <MuiButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              fullWidth
              sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Search Flights'}
            </MuiButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default SearcherContainer
