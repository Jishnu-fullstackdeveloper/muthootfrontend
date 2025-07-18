import { useRouter, useSearchParams } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import ViewUserRole from '../ViewUserRole'
import userRoleSlice, { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

jest.mock('@/redux/UserRoles/userRoleSlice', () => ({
  ...jest.requireActual('@/redux/UserRoles/userRoleSlice'),
  fetchUserRole: jest.fn()
}))

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      UserRoleReducer: userRoleSlice
    },
    preloadedState: initialState
  })
}

describe('ViewUserRole Component', () => {
  let mockRouter
  let mockDispatch

  const mockRoleData = {
    data: [
      {
        id: '1',
        name: 'Admin',
        description: 'Administrator role with full access',
        permissions: [
          { name: 'user_read', description: 'Read user data' },
          { name: 'user_create', description: 'Create user data' },
          { name: 'role_read', description: 'Read role data' }
        ]
      }
    ],
    totalCount: 1
  }

  beforeEach(() => {
    mockRouter = { push: jest.fn(), back: jest.fn() }
    mockDispatch = jest.fn().mockImplementation(() => Promise.resolve({ payload: mockRoleData.data[0] }))
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
    ;(fetchUserRole as jest.Mock).mockReturnValue({ type: 'fetchUserRole/fulfilled', payload: mockRoleData.data[0] })
    jest.clearAllMocks()
  })

  test('renders loading state', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: null,
      isUserRoleLoading: true
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('id=1'))

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: null, isUserRoleLoading: true }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders no data message when no role is found', async () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: { data: [] },
      isUserRoleLoading: false
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('id=999'))

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: { data: [] }, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('No role data found for ID: 999')).toBeInTheDocument()
    })
  })

  test('renders role data from store', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: mockRoleData,
      isUserRoleLoading: false
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('id=1'))

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('Administrator role with full access')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('User Roles')).toBeInTheDocument()
    expect(screen.getAllByText('✅').length).toBeGreaterThan(0)
  })

  test('fetches role data when not in store', async () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: { data: [] },
      isUserRoleLoading: false
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('id=1'))

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: { data: [] }, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchUserRole({ id: '1' }))
      expect(screen.getByText('ADMIN')).toBeInTheDocument()
    })
  })

  test('renders role data from search params when no store data', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: { data: [] },
      isUserRoleLoading: false
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams(
        'id=1&name=Guest&description=Guest role&permissions=[{"name":"user_read","description":"Read user data"}]'
      )
    )

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: { data: [] }, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    expect(screen.getByText('GUEST')).toBeInTheDocument()
    expect(screen.getByText('Guest role')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('✅')).toBeInTheDocument()
  })

  test('handles edit navigation', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: mockRoleData,
      isUserRoleLoading: false
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('id=1'))

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    const editButton = screen.getByRole('button', { name: 'Edit role' })

    fireEvent.click(editButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/user-role/edit/Admin?id=1&name=Admin')
  })

  test('handles go back navigation', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: mockRoleData,
      isUserRoleLoading: false
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('id=1'))

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    const backButton = screen.getByRole('button', { name: 'Go Back' })

    fireEvent.click(backButton)

    expect(mockRouter.back).toHaveBeenCalled()
  })

  test('displays permission tooltips', () => {
    ;(useAppSelector as jest.Mock).mockReturnValue({
      userRoleData: mockRoleData,
      isUserRoleLoading: false
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('id=1'))

    const mockStore = createMockStore({
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <ViewUserRole />
      </Provider>
    )

    const permissionChecks = screen.getAllByText('✅')

    expect(permissionChecks.length).toBeGreaterThan(0)

    const firstCheck = permissionChecks[0]
    const tooltipParent = firstCheck.parentElement 

    expect(tooltipParent).toBeInTheDocument()
  })
})
