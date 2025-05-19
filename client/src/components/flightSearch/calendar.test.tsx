import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import CalendarView from './calendar'

describe('CalendarView', () => {
  beforeAll(() => {
    // Freeze time at 2025-05-19 so tomorrow is always the 20th
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-05-19T00:00:00'))
  })
  afterAll(() => {
    vi.useRealTimers()
  })

  it('disables all dates before tomorrow', () => {
    const onDateChange = vi.fn()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CalendarView selectedDate={null} onDateChange={onDateChange} />
      </LocalizationProvider>
    )

    // The 19th should be disabled
    const yesterdayBtn = screen.getByText('19').closest('button')
    expect(yesterdayBtn).toBeDisabled()

    // The 20th should be enabled
    const tomorrowBtn = screen.getByText('20').closest('button')
    expect(tomorrowBtn).not.toBeDisabled()
  })

  it('calls onDateChange when clicking an enabled date', () => {
    const onDateChange = vi.fn()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CalendarView selectedDate={null} onDateChange={onDateChange} />
      </LocalizationProvider>
    )

    const tomorrowBtn = screen.getByText('20').closest('button')!
    fireEvent.click(tomorrowBtn)

    expect(onDateChange).toHaveBeenCalledTimes(1)
  })
})
