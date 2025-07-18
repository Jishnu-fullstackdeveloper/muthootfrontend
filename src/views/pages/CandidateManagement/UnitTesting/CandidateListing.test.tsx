import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import CandidateListing from '../CandidateListing' // Adjust path if needed
import '@testing-library/jest-dom'
import * as utils from '@/utils/functions'

// Mock functions
jest.mock('@/utils/functions', () => ({
  getVacancyManagementFiltersFromCookie: jest.fn(() => ({})), // Ensure it returns an object
  setVacancyManagementFiltersToCookie: jest.fn(),
  removeVacancyManagementFiltersFromCookie: jest.fn()
}))

describe('CandidateListing Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders Candidate Listing component properly', () => {
    render(<CandidateListing />)

    expect(screen.getByText(/Candidate List/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search by Name or skill...')).toBeInTheDocument()
    expect(screen.getByText(/Add more filters/i)).toBeInTheDocument()
  })

  test('opens and closes filters modal when clicking the Add More Filters button', async () => {
    render(<CandidateListing />)

    const addMoreFiltersButton = screen.getByText(/Add more filters/i)

    fireEvent.click(addMoreFiltersButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Close the modal (if there's a close button)
    const closeButton = screen.getByText(/Close/i) || screen.getByLabelText(/close/i)

    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  test('updates filters when selected', async () => {
    const mockSetFilters = jest.spyOn(utils, 'setVacancyManagementFiltersToCookie')

    render(<CandidateListing />)

    fireEvent.click(screen.getByText(/Add more filters/i))

    // Simulate selecting a filter (modify this based on how filters are selected)
    const filterDropdown = screen.getByLabelText(/Select Filter/i)

    fireEvent.change(filterDropdown, { target: { value: 'JavaScript' } })

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith(expect.objectContaining({ filter: 'JavaScript' }))
    })
  })

  test('resets filters when clicking Reset button', async () => {
    const mockRemoveFilters = jest.spyOn(utils, 'removeVacancyManagementFiltersFromCookie')

    render(<CandidateListing />)

    fireEvent.click(screen.getByText(/Add more filters/i))

    const resetButton = screen.getByText(/Reset Filters/i)

    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(mockRemoveFilters).toHaveBeenCalled()
    })
  })

  test('debounced input updates correctly', async () => {
    render(<CandidateListing />)

    const searchInput = screen.getByPlaceholderText('Search by Name or skill...') as HTMLInputElement

    fireEvent.change(searchInput, { target: { value: 'React Developer' } })

    await waitFor(() => {
      expect(searchInput.value).toBe('React Developer')
    })
  })
})
