export type FlightSearchRequest = {
  originLocationCode: string
  destinationLocationCode: string
  departureDate?: string
  returnDate?: string   //  TODO: Assuming ISO 8601 format YYYY-MM-DD, made optional
  adults: number
  children?: number
  infants?: number
  currencyCode: string
  max: number
  nonStop: boolean
  sortOptions: SortOptions
}

export enum SortOptions {
  sortByTime,
  sortByPrice
}

export type LocationSearchRequest = {
  keyword: string,
  pageLimit: number,
  pageOffset: number,
}

export type LocationSearchResponse = {
  count: number
  locations: Location[]
}

export type Location = {
  id: string
  iataCode: string
  name: string
  cityName: string
  countryName: string
}

export type AirportSearchResponse = {
  airportName: string
}

export type CitySearchResponse = {
  cityName: string
}

export type PassengerMap = {
  adults: number;
  children: number;
  infants: number;
};
