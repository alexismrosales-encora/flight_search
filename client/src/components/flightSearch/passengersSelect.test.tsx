import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PassengersSelect from './passengersSelect'
import { PassengerMap } from '../../types/FlightSearchTypes'

describe('PassengersSelect', () => {
  it('renders labels and initial values', () => {
    const initial: PassengerMap = { adults: 2, children: 1, infants: 0 }
    render(<PassengersSelect value={initial} onChange={vi.fn()} />)

    // labels
    expect(screen.getByText('Adults')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('Infants')).toBeInTheDocument()

    // values
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('calls onChange with +1 when clicking "add adults"', () => {
    const initial: PassengerMap = { adults: 1, children: 0, infants: 0 }
    const onChange = vi.fn()
    render(<PassengersSelect value={initial} onChange={onChange} />)

    const addAdults = screen.getByLabelText('add adults')
    fireEvent.click(addAdults)

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({ adults: 2, children: 0, infants: 0 })
  })

  it('does not decrement adults below 1', () => {
    const initial: PassengerMap = { adults: 1, children: 2, infants: 2 }
    const onChange = vi.fn()
    render(<PassengersSelect value={initial} onChange={onChange} />)

    const removeAdults = screen.getByLabelText('remove adults')
    // button remains enabled, but clicking should not emit onChange
    expect(removeAdults).not.toBeDisabled()
    fireEvent.click(removeAdults)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables remove for zero-value non-adults and does not call onChange', () => {
    const initial: PassengerMap = { adults: 2, children: 0, infants: 0 }
    const onChange = vi.fn()
    render(<PassengersSelect value={initial} onChange={onChange} />)

    const removeChildren = screen.getByLabelText('remove children')
    const removeInfants = screen.getByLabelText('remove infants')

    expect(removeChildren).toBeDisabled()
    expect(removeInfants).toBeDisabled()

    fireEvent.click(removeChildren)
    fireEvent.click(removeInfants)
    expect(onChange).not.toHaveBeenCalled()
  })
})

