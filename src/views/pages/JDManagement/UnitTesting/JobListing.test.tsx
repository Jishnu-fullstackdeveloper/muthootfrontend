import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import JobListing from '../JobListing'

import * as cookieUtils from '@/utils/functions' // Adjust path as needed
import { jobs } from '@/utils/sampleData/JobListingData'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock utility functions
jest.mock('@/utils/functions', () => ({
  getJDManagementFiltersFromCookie: jest.fn(),
  setJDManagementFiltersToCookie: jest.fn(),
  removeJDManagementFiltersFromCookie: jest.fn()
}))

describe('JobListing Component', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(cookieUtils.getJDManagementFiltersFromCookie as jest.Mock).mockReturnValue({})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Test 1: Renders without crashing
  test('renders JobListing component', () => {
    render(<JobListing />)
    expect(screen.getByText('Add more filters')).toBeInTheDocument()
    expect(screen.getByText('New JD')).toBeInTheDocument()
  })

  // Test 2: Switches between view modes
  test('switches view mode from grid to table', () => {
    render(<JobListing />)

    // Initially in grid mode
    expect(screen.getByTestId('grid-view')).toBeInTheDocument()

    // Switch to table mode
    fireEvent.click(screen.getByLabelText('Table View'))
    expect(screen.getByTestId('table-view')).toBeInTheDocument()
  })

  // Test 3: Navigates to new JD page on button click
  test('navigates to new JD page when "New JD" button is clicked', () => {
    render(<JobListing />)
    fireEvent.click(screen.getByText('New JD'))
    expect(mockPush).toHaveBeenCalledWith('/jd-management/add/jd')
  })

  // Test 4: Opens file upload dialog
  test('opens file upload dialog when "Upload JD" button is clicked', () => {
    render(<JobListing />)
    fireEvent.click(screen.getByText('Upload JD'))
    expect(screen.getByRole('dialog')).toBeInTheDocument() // Assuming dialog has role="dialog"
  })

  // Test 5: Resets filters
  test('resets filters when "Reset Filters" button is clicked', async () => {
    ;(cookieUtils.getJDManagementFiltersFromCookie as jest.Mock).mockReturnValue({
      selectedFilters: { jobType: ['Full-time'], experience: ['1-3 years'] },
      appliedFilters: { jobType: ['Full-time'], experience: ['1-3 years'] }
    })

    render(<JobListing />)
    fireEvent.click(screen.getByText('Reset Filters'))

    await waitFor(() => {
      expect(cookieUtils.removeJDManagementFiltersFromCookie).toHaveBeenCalled()
    })
  })

  // Test 6: Displays job cards in grid mode
  test('displays job cards in grid mode', () => {
    render(<JobListing />)
    expect(screen.getByText(jobs[0].title)).toBeInTheDocument()
    expect(screen.getByText(jobs[1].title)).toBeInTheDocument()
  })

  // Test 7: Pagination changes page
  test('changes page when pagination is clicked', () => {
    render(<JobListing />)
    const page2Button = screen.getByText('2')

    fireEvent.click(page2Button)
    expect(screen.getByText('2')).toHaveAttribute('aria-current', 'true')
  })
})
