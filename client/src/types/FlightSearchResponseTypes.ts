// flightTypes.ts

export type AmenityInfo = {
  name: string
  isChargeable: boolean | null
  description: string | null
}

export type FareDetailPerSegment = {
  segmentId: string
  cabin: string | null
  bookingClass: string | null
  fareBasis: string | null
  includedCheckedBagsDescription: string | null
  amenities: AmenityInfo[] | null
}

export type TravelerPricingInfo = {
  travelerId: string
  travelerType: string | null
  fareOption: string | null
  totalPrice: string | null
  basePrice: string | null
  currencyCode: string | null
  fareDetailsBySegment: FareDetailPerSegment[] | null
}

export type FeeInfo = {
  amount: string
  type: string | null
}

export type PriceSummary = {
  currencyCode: string
  currencyName: string | null
  basePrice: string | null
  totalPrice: string
  grandTotal: string | null
  fees: FeeInfo[] | null
}

export type FlightLeg = {
  id: string
  flightNumber: string
  duration: string
  departureAirportCode: string
  departureTime: string
  departureAirportTerminal: string | null
  arrivalAirportCode: string
  arrivalTime: string
  arrivalAirportTerminal: string | null
  marketingAirlineCode: string
  marketingAirlineName: string | null
  operatingAirlineCode: string | null
  operatingAirlineName: string | null
  aircraftTypeName: string | null
  numberOfStops: number
  layoverDuration: string | null
}

export type Itinerary = {
  totalDuration: string | null
  segments: FlightLeg[]
}

export type FlightSearchResponse = {
  offerId: string
  numberOfBookableSeats: number
  lastTicketingDate: string | null
  validatingAirlineCodes: string[] | null
  priceSummary: PriceSummary
  itineraries: Itinerary[]
  travelerPricings: TravelerPricingInfo[] | null
}
