import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import BucketListing from '../BucketListing'
import { useRouter } from 'next/navigation'
import '@testing-library/jest-dom'

// Mock MUI components to avoid DOM nesting warnings
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  TablePagination: ({ count, page, rowsPerPage, onPageChange }) => (
    <div data-testid='table-pagination'>
      <button onClick={e => onPageChange(e, page + 1)}>next page</button>
    </div>
  )
}))

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Create a mock reducer
const mockReducer = {
  bucket: (state = { bucketListData: [], loading: false }, action) => state
}

// Mock the redux hooks
jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(() => ({
    bucketListData: {
      data: [
        {
          id: 1,
          name: 'Test Bucket',
          turnoverCode: 'TEST123',
          positionCategories: [
            { name: 'Position 1', count: 2 },
            { name: 'Position 2', count: 3 }
          ]
        }
      ],
      totalCount: 1
    },
    deleteBucketListSuccess: false,
    updateBucketListSuccess: false
  }))
}))

describe('BucketListing Component', () => {
  const mockRouter = {
    push: jest.fn()
  }
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    require('@/lib/hooks').useAppDispatch.mockReturnValue(mockDispatch)
  })

  const renderWithProvider = (component: React.ReactNode) => {
    return render(
      <Provider
        store={configureStore({
          reducer: mockReducer,
          middleware: getDefaultMiddleware => getDefaultMiddleware()
        })}
      >
        {component}
      </Provider>
    )
  }

  it('renders the component with initial grid view', () => {
    renderWithProvider(<BucketListing />)
    expect(screen.getByText('Bucket List')).toBeInTheDocument()
    expect(screen.getByLabelText('Search Designation')).toBeInTheDocument()
    expect(screen.getByText('New Bucket')).toBeInTheDocument()
  })

  it('switches between grid and table view', async () => {
    renderWithProvider(<BucketListing />)

    // Find the Grid View button by aria-label
    const gridViewButton = screen.getByRole('button', { name: 'Grid View' })
    expect(gridViewButton).toBeInTheDocument()
    fireEvent.click(gridViewButton)

    // Find the Table View button by aria-label
    const tableViewButton = screen.getByRole('button', { name: 'Table View' })
    expect(tableViewButton).toBeInTheDocument()
    fireEvent.click(tableViewButton)

    // Verify the content is visible
    expect(screen.getByText('TEST123')).toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    renderWithProvider(<BucketListing />)

    const searchInput = screen.getByLabelText('Search Designation')
    fireEvent.change(searchInput, { target: { value: 'Test' } })

    await waitFor(() => {
      expect(searchInput).toHaveValue('Test')
      expect(mockDispatch).toHaveBeenCalled()
    })
  })

  it('handles add new bucket navigation', () => {
    renderWithProvider(<BucketListing />)

    const addButton = screen.getByText('New Bucket')
    fireEvent.click(addButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/bucket-management/add/new-bucket')
  })

  it('handles delete bucket confirmation', async () => {
    renderWithProvider(<BucketListing />)

    const deleteButton = screen.getByLabelText('Delete Bucket')
    fireEvent.click(deleteButton)

    const confirmButton = await screen.findByText('Confirm')
    fireEvent.click(confirmButton)

    expect(mockDispatch).toHaveBeenCalled()
  })

  it('handles pagination', () => {
    renderWithProvider(<BucketListing />)

    // Find pagination buttons by role instead of title
    const nextPageButton = screen.getByRole('button', { name: /next page/i })
    fireEvent.click(nextPageButton)

    expect(mockDispatch).toHaveBeenCalled()
  })
})
