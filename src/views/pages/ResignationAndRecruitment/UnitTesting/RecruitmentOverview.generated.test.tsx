// import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import RecruitmentRequestOverview from '../RecruitmentOverview'
import recruitmentResignationReducer, { fetchResignationOverviewList } from '@/redux/RecruitmentResignationSlice'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

const renderWithProviders = (ui: React.ReactElement, { store }: { store: any }) => {
  return render(<Provider store={store}>{ui}</Provider>)
}

// jest.mock('/RecruitmentResignationSlice', () => ({
//   ...jest.requireActual('../../../../redux/RecruitmentResignationSlice'),
//   fetchResignationOverviewList: jest.fn()
// }))

describe('RecruitmentRequestOverview Component', () => {
  let store: any

  beforeEach(() => {
    const initialState = {
      recruitmentResignation: {
        fetchResignationOverviewListLoading: false,
        fetchResignationOverviewListSuccess: false,
        fetchResignationOverviewListData: [],
        fetchResignationOverviewListFailure: false,
        fetchResignationOverviewListFailureMessage: ''
      }
    }

    store = configureStore({
      reducer: {
        recruitmentResignation: recruitmentResignationReducer
      },
      preloadedState: initialState
    })
  })
  it('renders with the correct label', () => {
    renderWithProviders(<RecruitmentRequestOverview />, { store })
    expect(screen.getByText(`Recruitment Request Overview`)).toBeInTheDocument()
  })

  test('renders the component correctly', async () => {
    renderWithProviders(<RecruitmentRequestOverview />, { store })

    // Check if the necessary elements are rendered
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/Operations Manager/i)).toBeInTheDocument()
  })

  test('fetches and displays data correctly on mount', async () => {
    // fetchResignationOverviewList.mockResolvedValueOnce(initialState.recruitmentResignationReducer.data)
    renderWithProviders(<RecruitmentRequestOverview />, { store })
    await waitFor(() => screen.getByText(/Software Engineer/i))
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/Resignation/i)).toBeInTheDocument()
    expect(screen.getByText(/2 requests remaining of 10/i)).toBeInTheDocument()
  })

  test('displays warning badge correctly', async () => {
    renderWithProviders(<RecruitmentRequestOverview />, { store })
    expect(screen.getByText(/2 requests remaining of 10/i)).toBeInTheDocument()
  })

  test('handles pagination correctly', async () => {
    renderWithProviders(<RecruitmentRequestOverview />, { store })
    const pagination = screen.getByRole('navigation')

    expect(pagination).toBeInTheDocument()
    fireEvent.click(screen.getByText(/2/i)) // Simulate clicking on page 2

    await waitFor(() => expect(fetchResignationOverviewList).toHaveBeenCalled())
  })

  test('opens warning dialog on button click', async () => {
    renderWithProviders(<RecruitmentRequestOverview />, { store })

    const button = screen.getByRole('button', { name: /View/i })

    fireEvent.click(button)

    await waitFor(() => expect(screen.getByText(/Warning Dialog Title/i)).toBeInTheDocument())
  })

  test('displays X-factor dialog correctly', async () => {
    renderWithProviders(<RecruitmentRequestOverview />, { store })

    const button = screen.getByRole('button', { name: /Settings/i })

    fireEvent.click(button)

    await waitFor(() => expect(screen.getByText(/X-factor Dialog Title/i)).toBeInTheDocument())
  })
})
