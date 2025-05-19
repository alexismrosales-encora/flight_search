// Selector.spec.tsx
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Selector from './Autocomplete'

describe('Selector (basic Autocomplete tests)', () => {
  const options = ['Apple', 'Banana', 'Cherry']

  it('renders with the correct label and empty value', () => {
    const onChange = vi.fn()
    const onInputChange = vi.fn()
    render(
      <Selector
        label="Fruit"
        value={null}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
      />
    )

    // The combobox input should be in the document, with no value
    const input = screen.getByRole('combobox', { name: 'Fruit' })
    expect(input).toBeInTheDocument()
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('calls onInputChange when typing in the field', async () => {
    const onChange = vi.fn()
    const onInputChange = vi.fn()
    render(
      <Selector
        label="Fruit"
        value={null}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
      />
    )

    const input = screen.getByRole('combobox', { name: 'Fruit' })
    await userEvent.type(input, 'Ap')

    // Should fire twice: 'A' then 'Ap'
    expect(onInputChange).toHaveBeenCalledTimes(2)
    expect(onInputChange).toHaveBeenCalledWith('A')
    expect(onInputChange).toHaveBeenCalledWith('Ap')
  })

  it('opens the list, shows options, and calls onChange when one is clicked', async () => {
    const onChange = vi.fn()
    render(
      <Selector
        label="Fruit"
        value={null}
        onChange={onChange}
        options={options}
      />
    )

    const input = screen.getByRole('combobox', { name: 'Fruit' })
    // Open the dropdown
    fireEvent.mouseDown(input)

    // Wait for the listbox to appear
    const listbox = await screen.findByRole('listbox')
    // Find and click "Banana"
    const bananaOption = within(listbox).getByText('Banana')
    fireEvent.click(bananaOption)

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('Banana')
  })

  it('displays the controlled value when provided', () => {
    const onChange = vi.fn()
    render(
      <Selector
        label="Fruit"
        value="Cherry"
        onChange={onChange}
        options={options}
      />
    )

    const input = screen.getByRole('combobox', { name: 'Fruit' })
    expect((input as HTMLInputElement).value).toBe('Cherry')
  })
})
