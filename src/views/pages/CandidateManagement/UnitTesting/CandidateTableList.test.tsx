import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom'
import CandidateTableList from '@/views/pages/CandidateManagement/CandidateTableList'

// eslint-disable-next-line import/order
import { useRouter } from 'next/navigation'

// Mocking the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('CandidateTableList Component', () => {
  let mockRouterPush: jest.Mock

  beforeEach(() => {
    mockRouterPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush })
  })

  test('renders the table with candidate data', async () => {
    render(<CandidateTableList />)

    // Check if candidate names are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Michael Johnson')).toBeInTheDocument()

    // Check if headers exist
    expect(screen.getByText('NAME')).toBeInTheDocument()
    expect(screen.getByText('APPLIED POST')).toBeInTheDocument()
    expect(screen.getByText('EMAIL')).toBeInTheDocument()
    expect(screen.getByText('PHONE NUMBER')).toBeInTheDocument()
  })

  test('navigates to view candidate page on clicking view button', async () => {
    render(<CandidateTableList />)

    const viewButtons = screen.getAllByRole('button', { name: /view/i })

    fireEvent.click(viewButtons[0])

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('candidate-management/view/1')
    })
  })

  test('opens delete confirmation modal when rejecting a candidate', async () => {
    render(<CandidateTableList />)

    const rejectButtons = screen.getAllByRole('button', { name: /reject/i })

    fireEvent.click(rejectButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to delete?')).toBeInTheDocument()
    })
  })

  test('changes pagination page when page number changes', async () => {
    render(<CandidateTableList />)

    const nextPageButton = screen.getByRole('button', { name: /next page/i })

    fireEvent.click(nextPageButton)

    await waitFor(() => {
      expect(screen.getByText('Page Index: 1')).toBeInTheDocument()
    })
  })

  test('changes rows per page correctly', async () => {
    render(<CandidateTableList />)

    const rowsPerPageDropdown = screen.getByLabelText(/rows per page/i)

    fireEvent.change(rowsPerPageDropdown, { target: { value: 10 } })

    await waitFor(() => {
      expect(screen.getByText('Page Size: 10')).toBeInTheDocument()
    })
  })
})
