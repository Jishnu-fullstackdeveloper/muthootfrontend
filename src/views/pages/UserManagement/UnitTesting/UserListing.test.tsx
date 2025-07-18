import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import UserListing from '../UserListing'
import userManagementSlice from '@/redux/UserManagment/userManagementSlice'
import userRoleSlice from '@/redux/UserRoles/userRoleSlice'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock the redux hooks
jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

// Mock UserTable component (assuming it’s a separate component)
jest.mock('../UserListingTable.tsx', () => ({ data }) => (
  <table>
    <tbody>
      {data.map(user => (
        <tr key={user.userId}>
          <td>
            {user.firstName} {user.lastName}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
))

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      UserManagementReducer: userManagementSlice,
      UserRoleReducer: userRoleSlice
    },
    preloadedState: initialState
  })
}

describe('UserListing Component', () => {
  let mockRouter
  let mockDispatch

  const mockUserData = {
    data: [
      {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        status: 'Active',
        source: 'AD_USER',
        roles: ['Admin'],
        designation: 'Developer',
        employeeCode: 'EMP001'
      }
    ],
    totalCount: 1
  }

  const mockRoleData = {
    data: [
      {
        id: '1',
        name: 'Admin',
        permissions: [{ id: 'p1', name: 'read', description: 'Read access' }]
      }
    ],
    totalCount: 1
  }

  beforeEach(() => {
    mockRouter = { push: jest.fn() }
    mockDispatch = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
    jest.clearAllMocks()
  })

  test('renders loading state', () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({ isUserManagementLoading: true, userManagementData: null })
      .mockReturnValueOnce({ isUserRoleLoading: false, userRoleData: null })

    const mockStore = createMockStore({
      UserManagementReducer: { isUserManagementLoading: true },
      UserRoleReducer: { isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  test('renders no data message when data is empty', () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({
        userManagementData: { data: [], totalCount: 0 },
        isUserManagementLoading: false
      })
      .mockReturnValueOnce({ userRoleData: { data: [] }, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: { data: [], totalCount: 0 }, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: { data: [] }, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  test('renders user data in grid view', () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({ userManagementData: mockUserData, isUserManagementLoading: false })
      .mockReturnValueOnce({ userRoleData: mockRoleData, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: mockUserData, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    expect(screen.getByText(/John\s+Doe/)).toBeInTheDocument()
    expect(screen.getByText(content => content.includes('john.doe@example.com'))).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  test('handles search input', async () => {
    ;(useAppSelector as jest.Mock).mockImplementation(selector => {
      if (selector.toString().includes('UserManagementReducer')) {
        return { userManagementData: mockUserData, isUserManagementLoading: false }
      }

      if (selector.toString().includes('UserRoleReducer')) {
        return { userRoleData: mockRoleData, isUserRoleLoading: false }
      }
    })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: mockUserData, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    const searchInput = screen.getByPlaceholderText('Search users...')

    fireEvent.change(searchInput, { target: { value: 'John' } })

    await waitFor(() => {
      expect(searchInput).toHaveValue('John')
    })
  })

  test('toggles between grid and table view', async () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({ userManagementData: mockUserData, isUserManagementLoading: false })
      .mockReturnValueOnce({ userRoleData: mockRoleData, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: mockUserData, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    expect(screen.getByText(/John\s+Doe/)).toBeInTheDocument() // Grid view by default

    const tableViewButton = screen.getByTestId('TableViewIcon').parentElement

    if (!tableViewButton) throw new Error('Table view button not found')
    fireEvent.click(tableViewButton)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument() // Table view (mocked UserTable)
    })
  })

  test('opens and closes filter drawer', async () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({ userManagementData: mockUserData, isUserManagementLoading: false })
      .mockReturnValueOnce({ userRoleData: mockRoleData, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: mockUserData, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    const filterButton = screen.getByRole('button', { name: /Filter/i })

    fireEvent.click(filterButton)

    expect(screen.getByText('Filters')).toBeInTheDocument()

    const closeButton = screen
      .getByRole('button', { name: '' })
      .closest('.MuiIconButton-root')
      ?.querySelector('.tabler-x')?.parentElement

    if (!closeButton) throw new Error('Close button not found')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Filters')).not.toBeInTheDocument()
    })
  })

  test('handles filter changes', () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({ userManagementData: mockUserData, isUserManagementLoading: false })
      .mockReturnValueOnce({ userRoleData: mockRoleData, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: mockUserData, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }))
    const activeCheckbox = screen.getByLabelText('Active')

    fireEvent.click(activeCheckbox)

    expect(screen.getByText('active')).toBeInTheDocument()
  })

  test('handles edit navigation', () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({ userManagementData: mockUserData, isUserManagementLoading: false })
      .mockReturnValueOnce({ userRoleData: mockRoleData, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: mockUserData, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    const editButton = screen.getAllByRole('button', { name: '' }).find(btn => btn.querySelector('.tabler-edit'))

    if (!editButton) throw new Error('Edit button not found')
    fireEvent.click(editButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/user-management/edit/1')
  })

  test('handles view role navigation', () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({ userManagementData: mockUserData, isUserManagementLoading: false })
      .mockReturnValueOnce({ userRoleData: mockRoleData, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: { userManagementData: mockUserData, isUserManagementLoading: false },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    const roleLink = screen.getByText('Admin')

    fireEvent.click(roleLink)

    expect(mockRouter.push).toHaveBeenCalledWith('/user-role/view/Admin?id=1&name=Admin')
  })

  test('handles pagination', async () => {
    ;(useAppSelector as jest.Mock)
      .mockReturnValueOnce({
        userManagementData: { ...mockUserData, totalCount: 20 },
        isUserManagementLoading: false
      })
      .mockReturnValueOnce({ userRoleData: mockRoleData, isUserRoleLoading: false })

    const mockStore = createMockStore({
      UserManagementReducer: {
        userManagementData: { ...mockUserData, totalCount: 20 },
        isUserManagementLoading: false
      },
      UserRoleReducer: { userRoleData: mockRoleData, isUserRoleLoading: false }
    })

    render(
      <Provider store={mockStore}>
        <UserListing />
      </Provider>
    )

    // Wait for pagination to render if it’s conditional or async
    await waitFor(() => {
      const pagination = screen.getByRole('navigation', { name: 'pagination navigation' })

      expect(pagination).toBeInTheDocument()
    })

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' })

    fireEvent.click(page2Button)

    // Optionally verify state change or dispatch if applicable
    // e.g., expect(mockDispatch).toHaveBeenCalledWith(...);
  })
})
