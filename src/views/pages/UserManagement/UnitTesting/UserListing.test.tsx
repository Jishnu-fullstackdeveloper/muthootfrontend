import React from 'react'

import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import UserListing from '../UserListing'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock the router
const mockRouter = {
  push: jest.fn()
}

;(useRouter as jest.Mock).mockReturnValue(mockRouter)

describe('UserListing Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with initial elements', () => {
    render(<UserListing />)

    // Check if main elements are present
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByText('Add User')).toBeInTheDocument()

    // Check if sample data is rendered
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    render(<UserListing />)

    const searchInput = screen.getByLabelText('Search')

    // Type in search box
    await userEvent.type(searchInput, 'John')

    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.queryByText('Jane')).not.toBeInTheDocument()
    })
  })

  it('navigates to add user page when Add User button is clicked', () => {
    render(<UserListing />)

    const addButton = screen.getByText('Add User')

    fireEvent.click(addButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/user-management/add/add-new-user')
  })

  it('handles view action', () => {
    render(<UserListing />)

    // Find view button by finding button with eye icon
    const viewButtons = screen.getAllByRole('button').filter(button => button.querySelector('.tabler-eye'))

    fireEvent.click(viewButtons[0])

    expect(mockRouter.push).toHaveBeenCalled()
  })

  it('handles edit action', () => {
    render(<UserListing />)

    // Find edit button by finding button with edit icon
    const editButtons = screen.getAllByRole('button').filter(button => button.querySelector('.tabler-edit'))

    fireEvent.click(editButtons[0])

    expect(mockRouter.push).toHaveBeenCalled()
  })

  it('shows delete confirmation modal when delete button is clicked', () => {
    render(<UserListing />)

    // Find delete button by finding button with trash icon
    const deleteButtons = screen.getAllByRole('button').filter(button => button.querySelector('.tabler-trash'))

    fireEvent.click(deleteButtons[0])

    // Check if modal content is visible
    expect(screen.getByText('Delete User')).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to delete this user? This action cannot be undone.')
    ).toBeInTheDocument()

    // Find and click the Confirm button in the modal
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })

    fireEvent.click(confirmButton)

    // Modal should be closed
    expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
  })

  it('handles delete cancellation', () => {
    render(<UserListing />)

    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button').filter(button => button.querySelector('.tabler-trash'))

    fireEvent.click(deleteButtons[0])

    // Find and click Cancel button
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })

    fireEvent.click(cancelButton)

    // Modal should be closed
    expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
  })
})
