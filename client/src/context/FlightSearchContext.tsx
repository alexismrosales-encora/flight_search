import { createContext, ReactNode, useState } from "react";
import { FlightSearchContextType, SearchResultsStateType, DetailsInfoType } from "../types/FlightSearchContextTypes";
import { FlightSearchResponse } from "../types/FlightSearchResponseTypes";

export const FlightSearchContext = createContext<FlightSearchContextType | null>(null)

export const FlighSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchResults, setSearchResults] = useState<FlightSearchResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [flight, setFlight] = useState<FlightSearchResponse | null>(null)

  const [loadingFlight, setLoadingFlight] = useState<boolean>(false)
  const [errorFlight, setErrorFlight] = useState<string | null>(null)
  const [cityMap, setCityMap] = useState(new Map())
  const [searchAttemped, setSearchAttemped] = useState(false)

  const searchResultsState: SearchResultsStateType = {
    searchResults: searchResults,
    setSearchResults: setSearchResults,
    loading: loading,
    setLoading: setLoading,
    error: error,
    setError: setError,
    searchAttemped: searchAttemped,
    setSearchAttemped: setSearchAttemped
  }

  const detailsInfo: DetailsInfoType = {
    flight: flight,
    setFlight: setFlight,
    loadingFlight: loadingFlight,
    setLoadingFlight: setLoadingFlight,
    errorFlight: errorFlight,
    setErrorFlight: setErrorFlight,
    cityMap: cityMap,
    setCityMap: setCityMap
  }

  const flightSearchContextType: FlightSearchContextType = {
    searchResultsState: searchResultsState,
    detailsInfo: detailsInfo
  }

  return <FlightSearchContext.Provider value={flightSearchContextType}>
    {children}
  </FlightSearchContext.Provider >
}

