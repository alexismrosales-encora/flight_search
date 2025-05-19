// tests/mockData/flightData.ts
import { FlightSearchRequest, SortOptions } from '../../src/types/FlightSearchTypes.ts'
import type { FlightSearchResponse } from '../../src/types/FlightSearchResponseTypes.ts'

export const mockSearchRequest: FlightSearchRequest = {
  originLocationCode: 'MEX',
  destinationLocationCode: 'AMS',
  departureDate: '2025-06-20',
  returnDate: '2025-06-27',
  adults: 1,
  children: 0,
  infants: 0,
  currencyCode: 'USD',
  max: 10,
  nonStop: false,
  sortOptions: SortOptions.sortByPrice,
}


export const mockSearchResponse: FlightSearchResponse[] = [
  {
    offerId: "2",
    numberOfBookableSeats: 6,
    lastTicketingDate: "2025-05-19",
    validatingAirlineCodes: ["VS"],
    priceSummary: {
      currencyCode: "USD",
      currencyName: "US DOLLAR",
      basePrice: "1908.00",
      totalPrice: "2411.22",
      grandTotal: "2411.22",
      fees: [
        { amount: "0.00", type: "SUPPLIER" },
        { amount: "0.00", type: "TICKETING" }
      ]
    },
    itineraries: [
      {
        totalDuration: "PT18H5M",
        segments: [
          {
            id: "1",
            departureAirportCode: "MEX",
            departureAirportTerminal: "2",
            departureTime: "2025-06-20T07:05:00",
            arrivalAirportCode: "ATL",
            arrivalAirportTerminal: "I",
            arrivalTime: "2025-06-20T12:38:00",
            duration: "PT3H33M",
            flightNumber: "4964",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: "DL",
            operatingAirlineName: "DELTA AIR LINES",
            aircraftTypeName: "BOEING 737-800",
            numberOfStops: 0,
            layoverDuration: "2H 42M"
          },
          {
            id: "2",
            departureAirportCode: "ATL",
            departureAirportTerminal: "I",
            departureTime: "2025-06-20T15:20:00",
            arrivalAirportCode: "AMS",
            arrivalAirportTerminal: null,
            arrivalTime: "2025-06-21T06:00:00",
            duration: "PT8H40M",
            flightNumber: "4054",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: "DL",
            operatingAirlineName: "DELTA AIR LINES",
            aircraftTypeName: "AIRBUS A330-900NEO PASSENGER",
            numberOfStops: 0,
            layoverDuration: "2H 05M"
          },
          {
            id: "3",
            departureAirportCode: "AMS",
            departureAirportTerminal: null,
            departureTime: "2025-06-21T08:05:00",
            arrivalAirportCode: "LCY",
            arrivalAirportTerminal: null,
            arrivalTime: "2025-06-21T08:10:00",
            duration: "PT1H5M",
            flightNumber: "7042",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: null,
            operatingAirlineName: null,
            aircraftTypeName: "EMBRAER 190",
            numberOfStops: 0,
            layoverDuration: null
          }
        ]
      }
    ],
    travelerPricings: [
      {
        travelerId: "1",
        travelerType: "ADULT",
        fareOption: "STANDARD",
        totalPrice: "2411.22",
        basePrice: "1908.00",
        currencyCode: "USD",
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          },
          {
            segmentId: "3",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          }
        ]
      }
    ]
  },
  {
    offerId: "3",
    numberOfBookableSeats: 6,
    lastTicketingDate: "2025-05-19",
    validatingAirlineCodes: ["VS"],
    priceSummary: {
      currencyCode: "USD",
      currencyName: "US DOLLAR",
      basePrice: "1908.00",
      totalPrice: "2411.22",
      grandTotal: "2411.22",
      fees: [
        { amount: "0.00", type: "SUPPLIER" },
        { amount: "0.00", type: "TICKETING" }
      ]
    },
    itineraries: [
      {
        totalDuration: "PT19H25M",
        segments: [
          {
            id: "6",
            departureAirportCode: "MEX",
            departureAirportTerminal: "2",
            departureTime: "2025-06-20T07:05:00",
            arrivalAirportCode: "ATL",
            arrivalAirportTerminal: "I",
            arrivalTime: "2025-06-20T12:38:00",
            duration: "PT3H33M",
            flightNumber: "4964",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: "DL",
            operatingAirlineName: "DELTA AIR LINES",
            aircraftTypeName: "BOEING 737-800",
            numberOfStops: 0,
            layoverDuration: "4H 52M"
          },
          {
            id: "7",
            departureAirportCode: "ATL",
            departureAirportTerminal: "I",
            departureTime: "2025-06-20T17:30:00",
            arrivalAirportCode: "AMS",
            arrivalAirportTerminal: null,
            arrivalTime: "2025-06-21T08:00:00",
            duration: "PT8H30M",
            flightNumber: "3932",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: "DL",
            operatingAirlineName: "DELTA AIR LINES",
            aircraftTypeName: "AIRBUS INDUSTRIE A350",
            numberOfStops: 0,
            layoverDuration: "1H 30M"
          },
          {
            id: "8",
            departureAirportCode: "AMS",
            departureAirportTerminal: null,
            departureTime: "2025-06-21T09:30:00",
            arrivalAirportCode: "LCY",
            arrivalAirportTerminal: null,
            arrivalTime: "2025-06-21T09:30:00",
            duration: "PT1H",
            flightNumber: "7036",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: null,
            operatingAirlineName: null,
            aircraftTypeName: "EMBRAER 190",
            numberOfStops: 0,
            layoverDuration: null
          }
        ]
      }
    ],
    travelerPricings: [
      {
        travelerId: "1",
        travelerType: "ADULT",
        fareOption: "STANDARD",
        totalPrice: "2411.22",
        basePrice: "1908.00",
        currencyCode: "USD",
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          },
          {
            segmentId: "8",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          }
        ]
      }
    ]
  },
  {
    offerId: "4",
    numberOfBookableSeats: 6,
    lastTicketingDate: "2025-05-19",
    validatingAirlineCodes: ["VS"],
    priceSummary: {
      currencyCode: "USD",
      currencyName: "US DOLLAR",
      basePrice: "1908.00",
      totalPrice: "2411.22",
      grandTotal: "2411.22",
      fees: [
        { amount: "0.00", type: "SUPPLIER" },
        { amount: "0.00", type: "TICKETING" }
      ]
    },
    itineraries: [
      {
        totalDuration: "PT19H25M",
        segments: [
          {
            id: "9",
            departureAirportCode: "MEX",
            departureAirportTerminal: "2",
            departureTime: "2025-06-20T07:05:00",
            arrivalAirportCode: "ATL",
            arrivalAirportTerminal: "I",
            arrivalTime: "2025-06-20T12:38:00",
            duration: "PT3H33M",
            flightNumber: "4964",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: "DL",
            operatingAirlineName: "DELTA AIR LINES",
            aircraftTypeName: "BOEING 737-800",
            numberOfStops: 0,
            layoverDuration: "2H 42M"
          },
          {
            id: "10",
            departureAirportCode: "ATL",
            departureAirportTerminal: "I",
            departureTime: "2025-06-20T15:20:00",
            arrivalAirportCode: "AMS",
            arrivalAirportTerminal: null,
            arrivalTime: "2025-06-21T06:00:00",
            duration: "PT8H40M",
            flightNumber: "4054",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: "DL",
            operatingAirlineName: "DELTA AIR LINES",
            aircraftTypeName: "AIRBUS A330-900NEO PASSENGER",
            numberOfStops: 0,
            layoverDuration: "3H 30M"
          },
          {
            id: "11",
            departureAirportCode: "AMS",
            departureAirportTerminal: null,
            departureTime: "2025-06-21T09:30:00",
            arrivalAirportCode: "LCY",
            arrivalAirportTerminal: null,
            arrivalTime: "2025-06-21T09:30:00",
            duration: "PT1H",
            flightNumber: "7036",
            marketingAirlineCode: "VS",
            marketingAirlineName: "VIRGIN ATLANTIC",
            operatingAirlineCode: null,
            operatingAirlineName: null,
            aircraftTypeName: "EMBRAER 190",
            numberOfStops: 0,
            layoverDuration: null
          }
        ]
      }
    ],
    travelerPricings: [
      {
        travelerId: "1",
        travelerType: "ADULT",
        fareOption: "STANDARD",
        totalPrice: "2411.22",
        basePrice: "1908.00",
        currencyCode: "USD",
        fareDetailsBySegment: [
          {
            segmentId: "9",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          },
          {
            segmentId: "10",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          },
          {
            segmentId: "11",
            cabin: "ECONOMY",
            bookingClass: "B",
            fareBasis: "BKN01NML",
            includedCheckedBagsDescription: "1 piece(s)",
            amenities: [
              { name: "", isChargeable: false, description: "ADVANCED SEAT SELECTION" },
              { name: "", isChargeable: false, description: "MEALS AND DRINKS" },
              { name: "", isChargeable: false, description: "EARN MILES" },
              { name: "", isChargeable: true, description: "UPGRADES" },
              { name: "", isChargeable: false, description: "CHANGES" },
              { name: "", isChargeable: true, description: "WIFI" }
            ]
          }
        ]
      }
    ]
  }
]

