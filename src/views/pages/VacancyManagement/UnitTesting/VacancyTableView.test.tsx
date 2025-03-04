import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
// eslint-disable-next-line import/no-named-as-default
import configureStore from 'redux-mock-store'

import VacancyListingTableView from '../VacancyTableView' // Adjust the path
import { fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'

// Mock Redux store
const mockStore = configureStore([])

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock fetchVacancies action
jest.mock('@/redux/VacancyManagementAPI/vacancyManagementSlice', () => ({
  fetchVacancies: jest.fn()
}))

describe('VacancyListingTableView', () => {
  let store: any
  let push: jest.Mock

  // Sample vacancy data
  const mockVacancies = [
    {
      id: 1,
      designationName: 'Software Engineer',
      employeeCategoryType: 'Full-Time',
      branchesName: 'Main Branch',
      gradeName: 'A',
      bandName: 'Senior',
      businessUnitName: 'Engineering',
      districtName: 'New York',
      createdAt: '2023-01-01',
      updatedAt: '2023-12-31'
    }
  ]

  const mockTotalCount = 1

  beforeEach(() => {
    // Mock store with initial state
    store = mockStore({
      vacancyManagementReducer: {
        vacancies: mockVacancies,
        totalCount: mockTotalCount
      }
    })

    // Mock dispatch
    store.dispatch = jest.fn()

    // Mock router push
    push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })

    // Mock fetchVacancies
    ;(fetchVacancies as unknown as jest.Mock).mockReturnValue({ type: 'FETCH_VACANCIES' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the table with vacancy data', () => {
    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    expect(screen.getByText('DESIGNATION')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('EMPLOYEE CATEGORY')).toBeInTheDocument()
    expect(screen.getByText('Full-Time')).toBeInTheDocument()
    expect(screen.getByText('BRANCH')).toBeInTheDocument()
    expect(screen.getByText('Main Branch')).toBeInTheDocument()
    expect(screen.getByText('GRADE')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('BAND')).toBeInTheDocument()
    expect(screen.getByText('Senior')).toBeInTheDocument()
    expect(screen.getByText('BUSINESS UNIT')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('CITY')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('START DATE')).toBeInTheDocument()
    expect(screen.getByText('2023-01-01')).toBeInTheDocument()
    expect(screen.getByText('END DATE')).toBeInTheDocument()
    expect(screen.getByText('2023-12-31')).toBeInTheDocument()
    expect(screen.getByText('ACTION')).toBeInTheDocument()
  })

  it('fetches vacancies on mount with initial pagination', () => {
    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    expect(store.dispatch).toHaveBeenCalledWith(fetchVacancies({ page: 1, limit: 5 }))
  })

  it('updates pagination and fetches vacancies on page change', async () => {
    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    // Simulate page change (assuming DynamicTable has a button or prop to trigger this)
    fireEvent.click(screen.getByRole('button', { name: /next/i })) // Adjust based on DynamicTable implementation

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(fetchVacancies({ page: 2, limit: 5 }))
    })
  })

  it('resets to page 1 and updates limit on rows per page change', async () => {
    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    // Simulate rows per page change (adjust based on DynamicTable implementation)
    fireEvent.change(screen.getByLabelText(/rows per page/i), { target: { value: '10' } })

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(fetchVacancies({ page: 1, limit: 10 }))
    })
  })

  it('navigates to view page on view button click', () => {
    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    const viewButton = screen.getByLabelText('View')

    fireEvent.click(viewButton)

    expect(push).toHaveBeenCalledWith('/vacancy-management/view/1')
  })

  it('navigates to edit page on edit button click', () => {
    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    const editButton = screen.getByLabelText('Edit')

    fireEvent.click(editButton)

    expect(push).toHaveBeenCalledWith('/vacancy-management/edit/1')
  })

  it('handles empty vacancy data gracefully', () => {
    store = mockStore({
      vacancyManagementReducer: {
        vacancies: [],
        totalCount: 0
      }
    })

    render(
      <Provider store={store}>
        <VacancyListingTableView />
      </Provider>
    )

    expect(screen.getByText('DESIGNATION')).toBeInTheDocument() // Headers still render
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument() // No data
  })
})
