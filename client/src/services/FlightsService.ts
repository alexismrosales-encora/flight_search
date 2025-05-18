import axios from 'axios'
import { AirportSearchResponse, CitySearchResponse, FlightSearchRequest, LocationSearchRequest, LocationSearchResponse } from '../types/FlightSearchTypes'
import { FlightSearchResponse } from '../types/FlightSearchResponseTypes'

const API_BASE = import.meta.env.VITE_API_BASEURL

const searchUri = API_BASE + "/search"

// TODO: handle petitions with TryCatchs 

// TODO: ADD NONTSTOPS Property 
export const searchFlights = async (req: FlightSearchRequest): Promise<FlightSearchResponse[]> => {
  const res = await axios.post<FlightSearchResponse[]>(searchUri, req)
  return res.data
}


export const searchLocations = async (req: LocationSearchRequest): Promise<LocationSearchResponse> => {
  console.log("[API request] searching for locations.")
  const res = await axios.get<LocationSearchResponse>(searchUri, { params: req })
  return res.data
}

export const searchAirportName = async (iataCode: string): Promise<AirportSearchResponse> => {
  const res = await axios.get<AirportSearchResponse>(searchUri + "/airport" + `/${iataCode}`)
  return res.data
}


export const searchCityName = async (iataCode: string): Promise<CitySearchResponse> => {
  const res = await axios.get<CitySearchResponse>(searchUri + "/city" + `/${iataCode}`)
  return res.data
}
