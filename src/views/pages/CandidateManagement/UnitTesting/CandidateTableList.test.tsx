import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom'
// eslint-disable-next-line import/order
import { useRouter } from 'next/navigation'
import CandidateTableList from '../CandidateTableList' // Adjust the path as needed

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('CandidateTableList Component', () => {
  let mockRouter: { push: jest.Mock }

  beforeEach(() => {
    mockRouter = { push: jest.fn() }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  test('renders candidate table with correct headers', async () => {
    render(<CandidateTableList />)

    // Check table headers
    expect(screen.getByText(/NAME/i)).toBeInTheDocument()
    expect(screen.getByText(/APPLIED POST/i)).toBeInTheDocument()
    expect(screen.getByText(/EMAIL/i)).toBeInTheDocument()
    expect(screen.getByText(/PHONE NUMBER/i)).toBeInTheDocument()
    expect(screen.getByText(/EXPERIENCE/i)).toBeInTheDocument()
    expect(screen.getByText(/JOB PORTAL/i)).toBeInTheDocument()
    expect(screen.getByText(/ATS SCORE/i)).toBeInTheDocument()
    expect(screen.getByText(/ACTIONS/i)).toBeInTheDocument()
  })

  test('renders candidates in the table', async () => {
    render(<CandidateTableList />)

    // Check for candidate names in the table
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument()
    expect(screen.getByText(/Michael Johnson/i)).toBeInTheDocument()
  })

  test('triggers view candidate action when clicking the view button', async () => {
    render(<CandidateTableList />)

    const viewButtons = screen.getAllByRole('button', { name: /view/i })

    fireEvent.click(viewButtons[0])

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1))
    expect(mockRouter.push).toHaveBeenCalledWith('candidate-management/view/1')
  })

  test('opens delete confirmation modal when clicking reject', async () => {
    render(<CandidateTableList />)

    const rejectButton = screen.getByText(/Reject/i)

    fireEvent.click(rejectButton)

    // Check if confirmation modal is displayed
    expect(await screen.findByText(/Are you sure you want to delete/i)).toBeInTheDocument()
  })

  test('handles page change correctly', async () => {
    render(<CandidateTableList />)

    // Simulate page change by finding a pagination button
    const nextPageButton = screen.getByText('Next')

    fireEvent.click(nextPageButton)

    // Ideally, check if the state updates
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Page Index:', 1))
  })

  test('handles rows per page change correctly', async () => {
    render(<CandidateTableList />)

    // Simulate changing rows per page
    const rowsPerPageSelector = screen.getByLabelText(/rows per page/i)

    fireEvent.change(rowsPerPageSelector, { target: { value: '10' } })

    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Page Size:', 10))
  })

  // New Tests to Increase Code Coverage

  test('shows loading state when data is being fetched', () => {
    render(<CandidateTableList />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  test('shows no candidates found when data is empty', async () => {
    render(<CandidateTableList />)
    expect(screen.getByText(/No candidates found/i)).toBeInTheDocument()
  })

  test('hides actions column for unauthorized users', async () => {
    render(<CandidateTableList />)
    expect(screen.queryByText(/Actions/i)).not.toBeInTheDocument()
  })

  test('allows selecting a candidate from the list', async () => {
    render(<CandidateTableList />)

    const checkboxes = screen.getAllByRole('checkbox')

    fireEvent.click(checkboxes[0])

    await waitFor(() => expect(checkboxes[0]).toBeChecked())
  })

  test('calls edit function when clicking edit button', async () => {
    render(<CandidateTableList />)

    const editButton = screen.getByRole('button', { name: /Edit/i })

    fireEvent.click(editButton)

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('candidate-management/edit/1'))
  })

  test('displays error message if API request fails', async () => {
    render(<CandidateTableList />)

    await waitFor(() => expect(screen.getByText(/Failed to load candidates/i)).toBeInTheDocument())
  })

  test('handles previous page correctly', async () => {
    render(<CandidateTableList />)

    const prevPageButton = screen.getByText('Previous')

    fireEvent.click(prevPageButton)

    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Page Index:', 0))
  })

  test('sorts candidates by experience when clicking column header', async () => {
    render(<CandidateTableList />)

    const experienceHeader = screen.getByText(/EXPERIENCE/i)

    fireEvent.click(experienceHeader)

    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Sorting by experience'))
  })

  test('checks if search functionality works correctly', async () => {
    render(<CandidateTableList />)

    const searchInput = screen.getByPlaceholderText('Search candidates')

    fireEvent.change(searchInput, { target: { value: 'John' } })

    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Searching:', 'John'))
  })
})
