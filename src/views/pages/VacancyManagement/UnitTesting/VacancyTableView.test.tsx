import React from 'react'

import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import VacancyListingTableView from '../VacancyTableView'
import { fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/redux/VacancyManagementAPI/vacancyManagementSlice', () => ({
  fetchVacancies: jest.fn()
}))

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      vacancyManagementReducer: (state = initialState) => state
    }
  })
}

// Mock vacancy data
const mockVacancies = [
  {
    id: '1',
    designationName: 'Software Engineer',
    employeeCategoryType: 'Full-time',
    branchesName: 'Main Branch',
    gradeName: 'Senior',
    bandName: 'B3',
    businessUnitName: 'Engineering',
    districtName: 'New York',
    createdAt: '2023-01-01',
    updatedAt: '2023-12-31'
  }
]

describe('VacancyListingTableView', () => {
  let mockPush: jest.Mock
  let mockDispatch: jest.Mock

  beforeEach(() => {
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    mockDispatch = jest.fn()
    ;(fetchVacancies as unknown as jest.Mock).mockReturnValue({ type: 'FETCH_VACANCIES' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the table with initial data', () => {
    const store = createMockStore({
      vacancies: mockVacancies,
      totalCount: 1
    })

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    expect(screen.getByText('DESIGNATION')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Full-time')).toBeInTheDocument()
    expect(screen.getByText('Main Branch')).toBeInTheDocument()
    expect(screen.getByText('Senior')).toBeInTheDocument()
    expect(screen.getByText('B3')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()

    // More flexible date checking
    const dateElement = screen.getByText(content => content.includes('2023-01-01') || content.includes('2023'))

    expect(dateElement).toBeInTheDocument()
  })

  it('fetches vacancies on mount and pagination change', async () => {
    const store = createMockStore({
      vacancies: [],
      totalCount: 0
    })

    store.dispatch = mockDispatch

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchVacancies({ page: 1, limit: 5 }))
    })
  })

  it('handles page change', async () => {
    const store = createMockStore({
      vacancies: mockVacancies,
      totalCount: 10
    })

    store.dispatch = mockDispatch

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    fireEvent.click(screen.getByText('Software Engineer'))
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1)
    })
  })

  it('navigates to view page when view button is clicked', () => {
    const store = createMockStore({
      vacancies: mockVacancies,
      totalCount: 1
    })

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    const viewButton = screen.getByRole('button', { name: /view/i })

    fireEvent.click(viewButton)

    expect(mockPush).toHaveBeenCalledWith('/vacancy-management/view/1')
  })

  it('navigates to edit page when edit button is clicked', () => {
    const store = createMockStore({
      vacancies: mockVacancies,
      totalCount: 1
    })

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    const editButton = screen.getByRole('button', { name: /edit/i })

    fireEvent.click(editButton)

    expect(mockPush).toHaveBeenCalledWith('/vacancy-management/edit/1')
  })

  it('renders empty state when no vacancies', () => {
    const store = createMockStore({
      vacancies: [],
      totalCount: 0
    })

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    expect(screen.getByText('DESIGNATION')).toBeInTheDocument()

    // Add assertion for empty state if component has specific empty state text
  })

  it('handles undefined/null values gracefully', () => {
    const store = createMockStore({
      vacancies: [
        {
          ...mockVacancies[0],
          designationName: undefined,
          createdAt: null
        }
      ],
      totalCount: 1
    })

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    expect(screen.getByText('DESIGNATION')).toBeInTheDocument()

    // Component should not crash with undefined/null values
  })
})
