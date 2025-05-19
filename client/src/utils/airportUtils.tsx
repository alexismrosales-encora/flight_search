import { debounce } from "@mui/material"
import { Dispatch, SetStateAction, useMemo } from "react"
import { LocationSearchRequest, LocationSearchResponse, PassengerMap } from "../types/FlightSearchTypes"
import { searchLocations } from "../services/FlightsService"

// Fetching data search from API, these work for search names fetching the api data
export const useAirportSearchHandler = () => {
  const handleSearch = useMemo(() => {
    return debounce(
      async (
        data: LocationSearchRequest,
        setResults: Dispatch<SetStateAction<LocationSearchResponse | null>>,
        setLoadingCallback?: Dispatch<SetStateAction<boolean>>
      ) => {
        if (setLoadingCallback) setLoadingCallback(true)
        if (!data || !data.keyword || data.keyword.length < 2) {
          setResults(null)
          if (setLoadingCallback) setLoadingCallback(false)
          return
        }
        try {
          console.log("REQ: ", data)
          const res = await searchLocations(data)
          setResults(res)
        } catch (error) {
          console.error("Error searching locations:", error)
          setResults(null)
        } finally {
          if (setLoadingCallback) setLoadingCallback(false)
        }
      },
      500
    )
  }, [])
  return handleSearch
}

// Formating airportResults to show them in the search
export const clearAirportResults = (results: LocationSearchResponse | null): string[] => {
  if (!results) return []
  return results.locations.map(loc => `${loc.name} (${loc.iataCode}) - ${loc.cityName} | ${loc.iataCode}`)
}

// Formating name to display the quantity of passengers
export const parsePassengersToString = (passengers: PassengerMap): string => {
  const totalAdults = passengers["adults"]
  const adultsString: string = totalAdults + " " + (totalAdults > 1 ? "Adults" : "Adult")
  const totalChildren = passengers["children"]
  const childrenString: string = totalChildren < 1 ? "" : `, ${totalChildren} Children`
  const totalInfants = passengers["infants"]
  const infantsString: string = totalInfants < 1 ? "" : `, ${totalInfants} Infants`
  return adultsString + childrenString + infantsString
}


