import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import BucketView from '../BucketView'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

// Create mock store with initial state
const mockStore = configureStore([])
const store = mockStore({
  bucket: {
    bucket: {
      id: '1',
      name: 'Test Bucket',
      turnoverCode: 'TC123',
      notes: 'Test Notes',
      positionCategories: [
        { name: 'Developer', count: 5 },
        { name: 'Designer', count: 3 }
      ]
    },
    loading: false
  }
})

describe('BucketView Component', () => {
  // Setup common mocks
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn()
  }

  const mockSearchParams = new Map([
    ['name', 'Test Bucket'],
    ['turnoverCode', 'TC123'],
    ['notes', 'Test Notes'],
    [
      'positionCategories',
      encodeURIComponent(
        JSON.stringify([
          { name: 'Developer', count: 5 },
          { name: 'Designer', count: 3 }
        ])
      )
    ]
  ])

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>)
  }

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: (param: string) => mockSearchParams.get(param)
    })
  })



  it('renders bucket details correctly', async () => {
    renderWithProvider(<BucketView mode='view' id='1' />)

    await waitFor(() => {
      expect(screen.getByText('TEST BUCKET')).toBeInTheDocument()
      expect(screen.getByText(/TC123/)).toBeInTheDocument()
      expect(screen.getByText('Test Notes')).toBeInTheDocument()
      expect(screen.getByText(/Developer/)).toBeInTheDocument()
      expect(screen.getByText(/Designer/)).toBeInTheDocument()
    })
  })

  it('handles edit button click correctly', async () => {
    renderWithProvider(<BucketView mode='view' id='1' />)

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-button')
      fireEvent.click(editButton)
      expect(mockRouter.push).toHaveBeenCalledWith('/bucket-management/edit/1')
    })
  })

  it('handles go back button click correctly', async () => {
    renderWithProvider(<BucketView mode='view' id='1' />)

    const backButton = await screen.findByRole('button', { name: /go back/i })
    fireEvent.click(backButton)

    expect(mockRouter.back).toHaveBeenCalled()
  })

  it('handles delete confirmation modal', async () => {
    renderWithProvider(<BucketView mode='view' id='1' />)

    const deleteButton = await screen.findByTestId('delete-button')
    fireEvent.click(deleteButton)

    // Check if modal is displayed
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to delete this item? This action cannot be undone.')
    ).toBeInTheDocument()

    // Test cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText('Delete Item')).not.toBeInTheDocument()
    })
  })

  it('handles error in parsing positionCategories', () => {
    const invalidSearchParams = new Map([
      ['name', 'Test Bucket'],
      ['turnoverCode', 'TC123'],
      ['notes', 'Test Notes'],
      ['positionCategories', 'invalid-json']
    ])

    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: (param: string) => invalidSearchParams.get(param)
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    renderWithProvider(<BucketView mode='view' id='1' />)

    expect(consoleSpy).toHaveBeenCalledWith('Failed to parse positionCategories:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})
