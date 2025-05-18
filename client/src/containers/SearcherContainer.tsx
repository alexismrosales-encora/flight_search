import { useState, Dispatch, SetStateAction, useMemo, useEffect, useContext } from "react"


import LabeledButton from "../components/flightSearch/labeledButton"
import { Alert, Box, debounce } from "@mui/material"
import CalendarView from "../components/flightSearch/calendar"
import currencyCodes from "currency-codes";
import Selector from "../components/common/Autocomplete"
import BinaryToggle from "../components/common/BinaryToogle"
import Button from "../components/common/button"
import PassengersSelect from "../components/flightSearch/passengersSelect"
import { FlightSearchRequest, LocationSearchRequest, LocationSearchResponse, PassengerMap } from "../types/FlightSearchTypes"
import { FlightSearchResponse } from "../types/FlightSearchResponseTypes";
import { searchLocations, searchFlights } from "../services/FlightsService";
import { FlightSearchContext } from "../context/FlightSearchContext";
import StyledCheckbox from "../components/common/CheckBox";




const SearcherContainer = () => {
  const context = useContext(FlightSearchContext)
  if (!context) {
    return null
  }

  const { setSearchResults, setLoading, setError } = context.searchResultsState

  const [departureValue, setDepartureValue] = useState("")
  const [arrivalValue, setArrivalValue] = useState("")

  const [departureResults, setDepartureResults] = useState<LocationSearchResponse | null>(null)
  const [departureResultsToString, setDepartureResultsToString] = useState<string[]>([])

  const [arrivalResults, setArrivalResults] = useState<LocationSearchResponse | null>(null)
  const [arrivalResultsToString, setArrivalResultsToString] = useState<string[]>([])

  // For Date Buttons
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date>(new Date());

  const [selectDepartureDate, setSelectedDepartureDate] = useState(false)
  const [selectedReturnDate, setSelectedReturnDate] = useState(false)

  const [selectedPassengers, setSelectedPassengers] = useState(false)
  const [passengers, setPassengers] = useState<PassengerMap>({
    adults: 1,
    children: 0,
    infants: 0
  })

  const [noReturn, setNoReturn] = useState(false)
  const [currency, setCurrency] = useState<string | null>(null)

  const [showWarningMessage, setShowWarningMessage] = useState(false)

  const [withStops, setWithStops] = useState(false)


  const handleAirportSearch = useAirportSearchHandler();

  const handleOnSubmitForm = async () => {
    if (!arrivalValue || !departureValue || !departureDate || !returnDate || !currency) {
      setShowWarningMessage(true)
      return
    } else {
      setShowWarningMessage(false)
    }
    // Handle loading or error operations
    setLoading(true)
    setError(null)

    const req: FlightSearchRequest = {
      originLocationCode: departureValue.split(" | ")[2], // TODO: TEMPORAL solution
      destinationLocationCode: arrivalValue.split(" | ")[2], // TODO: TEMPORAL solution
      departureDate: departureDate.toISOString().split('T')[0],
      returnDate: noReturn ? "" : returnDate.toISOString().split('T')[0],
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      currencyCode: currency,
      max: 10,
      nonStop: withStops,
    }
    try {
      console.log("Sending flight search request:", req)
      const res: FlightSearchResponse[] | null = await searchFlights(req) // Assuming searchFlights can return null or throws error

      if (res) {
        console.log("Flight search result received:", res)
        setSearchResults(res)
      } else {
        // This case handles if searchFlights explicitly returns null without throwing
        console.error("Flight search returned null or undefined response.")
        setError("No flight information was returned from the service.")
        setSearchResults([]) // Clear results if response is null
      }
    } catch (err) {
      console.error("Error during flight search:", err)
      let errorMessage = "An unexpected error occurred while searching for flights."
      if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      setSearchResults([]) // Clear results on error
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (departureResults) {
      const cleanResults = clearAirportResults(departureResults)
      setDepartureResultsToString(cleanResults)
    }
  }, [departureResults])

  useEffect(() => {
    if (arrivalResults) {
      const cleanResults = clearAirportResults(arrivalResults)
      setArrivalResultsToString(cleanResults)
    }
  }, [arrivalResults])

  return <Box
    sx={{
      width: "100%",
      maxWidth: "40rem",
      margin: "0 auto",
      gap: 10,
      flexDirection: "column"
    }}
  >
    <form>
      {
        // Input of search for airports
        // TODO: Check when user clicks an option, when it happens it do a double api request when the options is set
      }
      <Selector
        label="Departure Airport"
        value={departureValue}
        onChange={(val) => {
          console.log(val)
          if (val == null) {
            setDepartureValue("")
          } else {
            setDepartureValue(val) // if val is already an object, handle accordingly
          }
        }}
        onInputChange={(inputVal) => {
          handleAirportSearch(
            { keyword: inputVal, pageLimit: 10, pageOffset: 0 },
            setDepartureResults
          );
        }}
        options={departureResultsToString}
      />
      <Selector
        label="Arrival Airport"
        value={arrivalValue}
        onChange={(val) => {
          if (val == null) {
            setArrivalValue("")
          } else {
            setArrivalValue(val) // if val is already an object, handle accordingly
          }
        }}
        onInputChange={(inputVal) => {
          handleAirportSearch(
            { keyword: inputVal, pageLimit: 10, pageOffset: 0 },
            setArrivalResults
          );
        }}
        options={arrivalResultsToString}
      />
      {
        // Input to select departure Date
      }
      <LabeledButton
        label="Departure"
        value={`${departureDate?.toLocaleDateString() ?? 'Not selected'}`}
        onClick={() => setSelectedDepartureDate(prev => !prev)} />
      {selectDepartureDate && (
        <Box mt={2}>
          <CalendarView
            selectedDate={departureDate}
            onDateChange={(value) => {
              // Check that value is available
              // TODO: Here check the restrictions
              if (value && !Array.isArray(value)) {
                setDepartureDate(value);
                setSelectedDepartureDate(false); // close after selection
              }
            }} />
        </Box>
      )}
      {
        // Input to select return Date
      }
      <LabeledButton
        label="Return"
        value={`${returnDate?.toLocaleDateString() ?? 'Not selected'}`}
        onClick={() => setSelectedReturnDate(prev => !prev)} />
      {selectedReturnDate && (
        <Box mt={2}>
          <CalendarView
            selectedDate={returnDate}
            onDateChange={(value) => {
              // TODO: Here check the restrictions
              if (value && !Array.isArray(value)) {
                setReturnDate(value);
                setSelectedReturnDate(false);
              }
            }}
          />
        </Box>
      )}
      {
        // Input to select number of adults
      }
      <LabeledButton
        label="Adults"
        value={parsePassengersToString(passengers)}
        onClick={() => setSelectedPassengers(prev => !prev)} />
      {selectedPassengers && (
        <PassengersSelect
          value={passengers}
          onChange={(passengersValues) => {
            if (passengersValues) {
              setPassengers(passengersValues)
            }
          }} />)
      }

      {
        // Chechkbox with no return
      }
      <StyledCheckbox label={"No return"} checked={noReturn} setChecked={setNoReturn} />

      {
        // Selector to pick currencies
      }
      <Selector
        label="Currency"
        value={currency}
        onChange={setCurrency}
        options={currencyCodes.codes()} />

      {
        // Switch button to select flights with stops or non-stops
      }
      <BinaryToggle enabledLabel="With stops" disabledLabel="With non-stops" checked={withStops} setChecked={setWithStops} />
      {showWarningMessage && <Alert
        severity="warning"
        sx={{
          justifyContent: "center"
        }}>
        Oops! It looks like some information is missing. Could you please check the form?
      </Alert>}
      <Button onClick={handleOnSubmitForm}>Search</Button>
    </form>
  </Box>
}


const useAirportSearchHandler = () => {
  const handleSearch = useMemo(() => {
    return debounce(
      async (
        data: LocationSearchRequest,
        setResults: Dispatch<SetStateAction<LocationSearchResponse | null>>
      ) => {
        console.log("Keyword written: ", data.keyword)

        if (!data || !data.keyword || data.keyword.length < 3) {
          setResults(null)
          return
        }

        const res = await searchLocations(data);
        setResults(res)
      },
      500
    )
  }, [])

  return handleSearch
}


// Format the results to show it in screen
const clearAirportResults = (results: LocationSearchResponse): string[] => {
  return results.locations.map(loc => loc.name + " | " + loc.cityName + " | " + loc.iataCode)
}



// Parse the result picked for the user into an string
const parsePassengersToString = (passengers: PassengerMap): string => {
  const totalAdults = passengers["adults"]
  const adultsString: string = totalAdults + " " + (totalAdults > 1 ? "Adults" : "Adult")

  const totalChildrens = passengers["children"]
  const childrensString: string = (totalChildrens < 1 ?
    ""
    :
    ", " + totalChildrens + " " + (totalChildrens > 1 ? "Childrens" : "Children"))

  const totalInfants = passengers["infants"]
  const infantsString: string = (totalInfants < 1 ?
    ""
    :
    ", " + totalInfants + " " + (totalInfants > 1 ? "Infants" : "Infant"))

  return adultsString + childrensString + infantsString
}
export default SearcherContainer
