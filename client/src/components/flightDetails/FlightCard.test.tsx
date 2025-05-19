// FlightDetailsCard.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FlightDetailsCard from './FlightCard'
import { FlightSearchResponse } from '../../types/FlightSearchResponseTypes'

describe('FlightDetailsCard (basic smoke tests)', () => {
  const sampleFlight: FlightSearchResponse = {
    offerId: 'OFFER123',
    numberOfBookableSeats: 5,
    lastTicketingDate: null,
    validatingAirlineCodes: null,
    priceSummary: {
      currencyCode: 'USD',
      currencyName: 'USD',
      basePrice: null,
      totalPrice: '500',
      grandTotal: null,
      fees: null,
    },
    travelerPricings: [
      {
        travelerId: 'T1',
        travelerType: 'adult',
        fareOption: 'STANDARD',
        totalPrice: '250',
        basePrice: '200',
        currencyCode: 'USD',
        fareDetailsBySegment: null,
      },
    ],
    itineraries: [
      {
        totalDuration: '2h',
        segments: [
          {
            id: 'leg1',
            flightNumber: '123',
            duration: '2h',
            departureAirportCode: 'AAA',
            departureTime: '2025-06-01T10:00:00Z',
            departureAirportTerminal: '1',
            arrivalAirportCode: 'BBB',
            arrivalTime: '2025-06-01T12:00:00Z',
            arrivalAirportTerminal: '2',
            marketingAirlineCode: 'AT',
            marketingAirlineName: 'AirTest',
            operatingAirlineCode: 'AO',
            operatingAirlineName: 'AirOp',
            aircraftTypeName: 'A320',
            numberOfStops: 0,
            layoverDuration: null,
          },
        ],
      },
    ],
  }

  const citySearch = (code: string) => {
    if (code === 'AAA') return 'CityA'
    if (code === 'BBB') return 'CityB'
    return undefined
  }

  it('renders header with departure → arrival and offer ID', () => {
    render(
      <FlightDetailsCard
        flight={sampleFlight}
        citySearch={citySearch}
        handleOnClick={vi.fn()}
      />
    )

    expect(screen.getByText('CityA → CityB')).toBeInTheDocument()
    expect(screen.getByText('Offer ID: OFFER123')).toBeInTheDocument()
  })

  it('shows price summary and seats left', () => {
    render(
      <FlightDetailsCard
        flight={sampleFlight}
        citySearch={citySearch}
        handleOnClick={vi.fn()}
      />
    )

    expect(
      screen.getByText(/USD 500 \(from 250 per traveler\)/)
    ).toBeInTheDocument()

    expect(screen.getByText('5 seat(s) left')).toBeInTheDocument()
  })

  it('calls handleOnClick with the flight when clicking View Details', () => {
    const onClick = vi.fn()
    render(
      <FlightDetailsCard
        flight={sampleFlight}
        citySearch={citySearch}
        handleOnClick={onClick}
      />
    )

    const btn = screen.getByRole('button', { name: /view details/i })
    fireEvent.click(btn)

    expect(onClick).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledWith(sampleFlight)
  })
})
