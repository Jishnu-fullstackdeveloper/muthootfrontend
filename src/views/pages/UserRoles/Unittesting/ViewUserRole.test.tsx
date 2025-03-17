import { useRouter, useSearchParams } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { fetchUserRole } from '@/redux/userRoleSlice'

import ViewUserRole from '../ViewUserRole' // Adjust the import path as needed

// Mock Redux slice
const mockUserRoleSlice = {
  UserRoleReducer: {
    userRoleData: {
      data: [
        {
          id: '1',
          name: 'Admin',
          description: 'Admin role with full access',
          permissions: [
            { name: 'user_read', description: 'Read users' },
            { name: 'user_create', description: 'Create users' },
            { name: 'jd_read', description: 'Read JD' }
          ]
        }
      ]
    },
    isUserRoleLoading: false
  }
}

// Mock store
const createMockStore = initialState =>
  configureStore({
    reducer: {
      UserRoleReducer: (state = initialState.UserRoleReducer) => state
    }
  })

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

// Mock Redux dispatch
const mockDispatch = jest.fn()

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: selector => selector(mockUserRoleSlice)
}))

jest.mock('@/redux/userRoleSlice', () => ({
  fetchUserRole: jest.fn()
}))

describe('ViewUserRole Component', () => {
  let mockPush
  let mockBack
  let mockSearchParams

  beforeEach(() => {
    mockPush = jest.fn()
    mockBack = jest.fn()
    mockSearchParams = new URLSearchParams()

    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack
    })

    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

    ;(fetchUserRole as unknown as jest.Mock).mockResolvedValue({
      payload: {
        id: '2',
        name: 'Editor', 
        description: 'Editor role',
        permissions: [{ name: 'jd_read', description: 'Read JD' }]
      }
    })

    mockDispatch.mockClear()
  })

  // Test 1: Renders loading state
  test('renders loading state when isUserRoleLoading is true', () => {
    const mockStore = createMockStore({
      UserRoleReducer: { ...mockUserRoleSlice.UserRoleReducer, isUserRoleLoading: true }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  // Test 2: Renders "No role data found" when no role matches
  test('renders no role data found when no matching role exists', () => {
    mockSearchParams.set('id', '999') // Non-existent ID
    const mockStore = createMockStore(mockUserRoleSlice)

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    expect(screen.getByText('No role data found for ID: 999')).toBeInTheDocument()
  })

  // Test 3: Renders role details from userRoleData
  test('renders role details from userRoleData when role exists', () => {
    mockSearchParams.set('id', '1')
    const mockStore = createMockStore(mockUserRoleSlice)

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('Admin role with full access')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('JD Management')).toBeInTheDocument()
  })

  // Test 4: Fetches role data when role is not in userRoleData
  test('fetches role data when role is not in userRoleData', async () => {
    mockSearchParams.set('id', '2')
    const mockStore = createMockStore(mockUserRoleSlice)

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchUserRole({ id: '2' }))
      expect(screen.getByText('EDITOR')).toBeInTheDocument()
      expect(screen.getByText('Editor role')).toBeInTheDocument()
    })
  })

  // Test 5: Navigates to edit page on edit button click
  test('navigates to edit page when edit button is clicked', () => {
    mockSearchParams.set('id', '1')
    const mockStore = createMockStore(mockUserRoleSlice)

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/user-role/edit/Admin?id=1&name=Admin&description=Admin%20role%20with%20full%20access')
    )
  })

  // Test 6: Goes back when "Go Back" button is clicked
  test('triggers router.back when Go Back button is clicked', () => {
    mockSearchParams.set('id', '1')
    const mockStore = createMockStore(mockUserRoleSlice)

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: /Go Back/i }))

    expect(mockBack).toHaveBeenCalled()
  })

  // Test 7: Displays permissions table correctly
  test('displays permissions table with correct indicators', () => {
    mockSearchParams.set('id', '1')
    const mockStore = createMockStore(mockUserRoleSlice)

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    // Check User Management permissions
    const userRow = screen.getByText('User Management').closest('tr')

    expect(userRow.querySelectorAll('td')[1]).toHaveTextContent('✅') // read
    expect(userRow.querySelectorAll('td')[2]).toHaveTextContent('✅') // create
    expect(userRow.querySelectorAll('td')[3]).toHaveTextContent('❌') // update
    expect(userRow.querySelectorAll('td')[4]).toHaveTextContent('❌') // delete
  })
})
