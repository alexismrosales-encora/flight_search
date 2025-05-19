import { Dispatch, SetStateAction } from "react"
import { FlightSearchResponse } from "./FlightSearchResponseTypes"

// Hook to retrieve data from search bar and pass it to the cards below
export type SearchResultsStateType = {
  searchResults: FlightSearchResponse[]
  setSearchResults: Dispatch<SetStateAction<FlightSearchResponse[]>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
  searchAttemped: boolean
  setSearchAttemped: Dispatch<SetStateAction<boolean>>
}

export type DetailsInfoType = {
  flight: FlightSearchResponse | null
  setFlight: Dispatch<SetStateAction<FlightSearchResponse | null>>
  loadingFlight: boolean
  setLoadingFlight: Dispatch<SetStateAction<boolean>>
  errorFlight: string | null
  setErrorFlight: Dispatch<SetStateAction<string | null>>
  cityMap: Map<string, string>
  setCityMap: Dispatch<SetStateAction<Map<string, string>>>
}

// General context type 
export type FlightSearchContextType = {
  searchResultsState: SearchResultsStateType
  detailsInfo: DetailsInfoType
}
