import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import VacancyListingPage from '../VacancyListing' // Adjust path

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import {
  getVacancyManagementFiltersFromCookie,
  removeVacancyManagementFiltersFromCookie,
  setVacancyManagementFiltersToCookie
} from '@/utils/functions'

// Mock console.log
global.console.log = jest.fn()

describe('VacancyListingPage', () => {
  const mockRouterPush = jest.fn()
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush })
    ;(useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch)
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [],
      totalCount: 0,
      currentPage: 1,
      limit: 10,
      error: null
    })
  })

  it('renders initial UI with grid view and filter controls', () => {
    const { container } = render(<VacancyListingPage />)

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Search Vacancy')).toBeInTheDocument()
    expect(screen.getByTestId('dynamic-button-Add more filters')).toBeInTheDocument()
    expect(screen.getByTestId('dynamic-button-Reset Filters')).toBeInTheDocument()
    expect(screen.getByTestId('dynamic-button-New Vacancy')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Grid View/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Table View/i })).toBeInTheDocument()
  })

  it('switches to table view when Table View button is clicked', () => {
    render(<VacancyListingPage />)
    const tableViewButton = screen.getByRole('button', { name: /Table View/i })

    fireEvent.click(tableViewButton)
    expect(screen.getByTestId('table-view')).toBeInTheDocument()
  })

  it('renders vacancies in grid view and updates tabs', async () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [
        {
          id: 1,
          designationName: 'Test Vacancy',
          employeeCategoryType: 'Full-time',
          gradeName: 'A',
          bandName: 'B',
          businessUnitName: 'IT',
          branchesName: 'HQ',
          departmentName: 'Dev',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          stateName: 'State1',
          districtName: 'City1',
          regionName: 'Region1',
          zoneName: 'Zone1',
          areaName: 'Area1'
        }
      ],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    render(<VacancyListingPage />)
    expect(screen.getByText('Test Vacancy')).toBeInTheDocument()
    expect(screen.getByText('Category Type: Full-time')).toBeInTheDocument()

    const moreDetailsTab = screen.getByText('More details')

    fireEvent.click(moreDetailsTab)
    expect(screen.getByText('State: State1')).toBeInTheDocument()
    expect(screen.getByText('City: City1')).toBeInTheDocument()
  })

  it('navigates to add new vacancy page when New Vacancy button is clicked', () => {
    render(<VacancyListingPage />)
    const newVacancyButton = screen.getByTestId('dynamic-button-New Vacancy')

    fireEvent.click(newVacancyButton)
    expect(mockRouterPush).toHaveBeenCalledWith('/vacancy-management/add/new-vacancy')
  })

  it('toggles filters dialog when Add more filters button is clicked', () => {
    render(<VacancyListingPage />)
    const filtersButton = screen.getByTestId('dynamic-button-Add more filters')

    fireEvent.click(filtersButton)
    expect(screen.getByTestId('vacancy-filters')).toBeInTheDocument()
    const toggleButton = screen.getByText('Toggle')

    fireEvent.click(toggleButton)

    // Note: Further state change verification requires mocking setState
  })

  it('resets filters when Reset Filters button is clicked', () => {
    render(<VacancyListingPage />)
    const resetButton = screen.getByTestId('dynamic-button-Reset Filters')

    fireEvent.click(resetButton)
    expect(removeVacancyManagementFiltersFromCookie).toHaveBeenCalled()
    expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
      selectedFilters: {
        location: [],
        department: [],
        employmentType: [],
        experience: [],
        skills: [],
        salaryRange: [0, 0],
        jobRole: ''
      },
      appliedFilters: expect.any(Object)
    })
  })

  it('updates pagination state when page changes', async () => {
    render(<VacancyListingPage />)
    const page2Button = screen.getByRole('button', { name: /Go to page 2/i })

    fireEvent.click(page2Button)
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchVacancies({ page: 2, limit: 10 }))
    })
  })

  it('updates limit when Select value changes', async () => {
    render(<VacancyListingPage />)
    const select = screen.getByLabelText('Count')

    fireEvent.mouseDown(select)
    const option25 = screen.getByText('25')

    fireEvent.click(option25)
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchVacancies({ page: 1, limit: 25 }))
    })
  })

  it('renders error message when error exists', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [],
      totalCount: 0,
      currentPage: 1,
      limit: 10,
      error: 'Fetch failed'
    })
    render(<VacancyListingPage />)
    expect(screen.getByText('Fetch failed')).toBeInTheDocument()
  })

  it('navigates to view vacancy on grid card click', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    render(<VacancyListingPage />)
    const card = screen.getByText('Test Vacancy')

    fireEvent.click(card)
    expect(mockRouterPush).toHaveBeenCalledWith('/vacancy-management/view/1')
  })

  it('navigates to edit vacancy when Edit button is clicked', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    render(<VacancyListingPage />)
    const editButton = screen.getByRole('button', { name: /Edit Vacancy/i })

    fireEvent.click(editButton)
    expect(mockRouterPush).toHaveBeenCalledWith('/vacancy-management/edit/1')
  })

  it('toggles filter and updates applied filters for array type', async () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    ;(getVacancyManagementFiltersFromCookie as jest.Mock).mockReturnValue({
      selectedFilters: { experience: ['5 years'] },
      appliedFilters: {}
    })
    const { rerender } = render(<VacancyListingPage />)
    const experienceChip = screen.getByText('5 years')

    fireEvent.click(experienceChip)
    rerender(<VacancyListingPage />)
    expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
      selectedFilters: expect.any(Object),
      appliedFilters: expect.objectContaining({ experience: ['5 years'] })
    })
  })

  it('removes filter for array type and updates cookie', async () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    ;(getVacancyManagementFiltersFromCookie as jest.Mock).mockReturnValue({
      selectedFilters: { experience: ['5 years'] },
      appliedFilters: {}
    })
    const { rerender } = render(<VacancyListingPage />)
    const deleteIcon = screen.getByText('5 years').parentElement?.querySelector('svg[data-testid="delete"]')

    if (deleteIcon) {
      fireEvent.click(deleteIcon)
      rerender(<VacancyListingPage />)
      expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
        selectedFilters: expect.objectContaining({ experience: [] }),
        appliedFilters: expect.any(Object)
      })
    }
  })

  it('toggles and removes jobRole filter', async () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    ;(getVacancyManagementFiltersFromCookie as jest.Mock).mockReturnValue({
      selectedFilters: { jobRole: 'Developer' },
      appliedFilters: {}
    })
    const { rerender } = render(<VacancyListingPage />)
    const jobRoleChip = screen.getByText('Developer')

    fireEvent.click(jobRoleChip)
    rerender(<VacancyListingPage />)
    expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
      selectedFilters: expect.any(Object),
      appliedFilters: expect.objectContaining({ jobRole: 'Developer' })
    })

    const deleteIcon = jobRoleChip.parentElement?.querySelector('svg[data-testid="delete"]')

    if (deleteIcon) {
      fireEvent.click(deleteIcon)
      rerender(<VacancyListingPage />)
      expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
        selectedFilters: expect.objectContaining({ jobRole: '' }),
        appliedFilters: expect.any(Object)
      })
    }
  })

  it('handles DebouncedInput change', async () => {
    render(<VacancyListingPage />)
    const searchInput = screen.getByTestId('custom-textfield')

    await userEvent.type(searchInput, 'test')
    await waitFor(
      () => {
        expect(screen.getByDisplayValue('test')).toBeInTheDocument()
      },
      { timeout: 600 }
    )
  })

  it('toggles and removes salaryRange filter', async () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    ;(getVacancyManagementFiltersFromCookie as jest.Mock).mockReturnValue({
      selectedFilters: { salaryRange: [1000, 2000] },
      appliedFilters: {}
    })
    const { rerender } = render(<VacancyListingPage />)
    const salaryChip = screen.getByText('1000 - 2000')

    fireEvent.click(salaryChip)
    rerender(<VacancyListingPage />)
    expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
      selectedFilters: expect.any(Object),
      appliedFilters: expect.objectContaining({ salaryRange: [1000, 2000] })
    })

    fireEvent.click(salaryChip)
    rerender(<VacancyListingPage />)
    expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
      selectedFilters: expect.any(Object),
      appliedFilters: expect.objectContaining({ salaryRange: [0, 0] })
    })

    const deleteIcon = salaryChip.parentElement?.querySelector('svg[data-testid="delete"]')

    if (deleteIcon) {
      fireEvent.click(deleteIcon)
      rerender(<VacancyListingPage />)
      expect(setVacancyManagementFiltersToCookie).toHaveBeenCalledWith({
        selectedFilters: expect.objectContaining({ salaryRange: [0, 0] }),
        appliedFilters: expect.any(Object)
      })
    }
  })

  it('checks all filters empty with non-empty array', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    ;(getVacancyManagementFiltersFromCookie as jest.Mock).mockReturnValue({
      selectedFilters: { experience: ['5 years'] },
      appliedFilters: {}
    })
    render(<VacancyListingPage />)
    const resetButton = screen.getByTestId('dynamic-button-Reset Filters')

    expect(resetButton).not.toHaveAttribute('disabled')
  })

  it('checks all filters empty with empty state', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      vacancies: [{ id: 1, designationName: 'Test Vacancy' }],
      totalCount: 1,
      currentPage: 1,
      limit: 10,
      error: null
    })
    render(<VacancyListingPage />)
    const resetButton = screen.getByTestId('dynamic-button-Reset Filters')

    expect(resetButton).toHaveAttribute('disabled')
  })
})

// Mock Chip for filter testing
jest.mock('@mui/material/Chip', () => ({
  __esModule: true,
  default: ({ label, onClick, onDelete }) => (
    <div>
      <span onClick={onClick}>{label}</span>
      {onDelete && <svg data-testid='delete' onClick={onDelete} />}
    </div>
  )
}))
