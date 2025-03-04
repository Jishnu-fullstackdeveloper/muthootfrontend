import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import CandidateListing from '../CandidateListing'
import { getVacancyManagementFiltersFromCookie } from '@/utils/functions'

// Mock functions
jest.mock('@/utils/functions', () => ({
  getVacancyManagementFiltersFromCookie: jest.fn(),
  setVacancyManagementFiltersToCookie: jest.fn(),
  removeVacancyManagementFiltersFromCookie: jest.fn()
}))

jest.mock('@/@core/components/dialogs/vacancy-listing-filters', () => () => <div data-testid='vacancy-filters' />)
jest.mock('../CandidateTableList', () => () => <div data-testid='candidate-table-list' />)

describe('CandidateListing Component', () => {
  beforeEach(() => {
    ;(getVacancyManagementFiltersFromCookie as jest.Mock).mockReturnValue({
      selectedFilters: { location: [], department: [], jobRole: '' },
      appliedFilters: { location: [], department: [], jobRole: '' }
    })
  })

  test('renders CandidateListing component correctly', () => {
    render(<CandidateListing />)

    expect(screen.getByText('Candidate List')).toBeInTheDocument()
    expect(screen.getByText('Add more filters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search by Name or skill...')).toBeInTheDocument()
  })

  test('opens the VacancyManagementFilters dialog when "Add more filters" button is clicked', () => {
    render(<CandidateListing />)
    fireEvent.click(screen.getByText('Add more filters'))

    expect(screen.getByTestId('vacancy-filters')).toBeInTheDocument()
  })

  test('resets filters when reset button is clicked', async () => {
    render(<CandidateListing />)

    fireEvent.click(screen.getByText('Add more filters'))
    fireEvent.click(screen.getByText('Reset Filters'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search by Name or skill...')).toHaveValue('')
    })
  })

  test('debounced search input updates value after delay', async () => {
    render(<CandidateListing />)

    const searchInput = screen.getByPlaceholderText('Search by Name or skill...')

    fireEvent.change(searchInput, { target: { value: 'React Developer' } })

    await waitFor(() => {
      expect(searchInput).toHaveValue('React Developer')
    })
  })

  test('renders CandidateTableList component', () => {
    render(<CandidateListing />)

    expect(screen.getByTestId('candidate-table-list')).toBeInTheDocument()
  })
})
