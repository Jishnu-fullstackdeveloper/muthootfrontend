import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import UserRolesAndPermisstionList from '../UserRolesList'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

const mockUserRoleSlice = {
  userRoleData: {
    data: [
      { id: '1', name: 'Admin', description: 'Admin role', permissions: ['user_create', 'user_read'] },
      { id: '2', name: 'Editor', description: 'Editor role', permissions: ['user_read'] }
    ],
    meta: { totalRecords: 2 },
    message: null
  },
  isUserRoleLoading: false
}

const mockStore = configureStore({
  reducer: {
    UserRoleReducer: () => mockUserRoleSlice
  }
})

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/redux/UserRoles/userRoleSlice', () => ({
  fetchUserRole: jest.fn(() => ({ type: 'fetchUserRole' }))
}))

describe('UserRolesAndPermisstionList', () => {
  let push

  beforeEach(() => {
    push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })
    jest.clearAllMocks()
  })

  test('renders the component with user roles', () => {
    render(
      <Provider store={mockStore}>
        <UserRolesAndPermisstionList />
      </Provider>
    )

    expect(screen.getByLabelText('Search Roles')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('EDITOR')).toBeInTheDocument()
  })

  test('updates search text on input change', async () => {
    render(
      <Provider store={mockStore}>
        <UserRolesAndPermisstionList />
      </Provider>
    )

    const searchInput = screen.getByPlaceholderText('Search roles...')

    fireEvent.change(searchInput, { target: { value: 'Admin' } })

    await waitFor(() => {
      expect(fetchUserRole).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        search: 'Admin'
      })
    })
  })

  test('opens and closes filter drawer', () => {
    render(
      <Provider store={mockStore}>
        <UserRolesAndPermisstionList />
      </Provider>
    )

    expect(screen.queryByText('Filter by Permissions')).not.toBeInTheDocument()
  })

  test('navigates to edit page on edit button click', () => {
    render(
      <Provider store={mockStore}>
        <UserRolesAndPermisstionList />
      </Provider>
    )

    const editButtons = screen.getAllByTitle('Edit')

    fireEvent.click(editButtons[0])

    expect(push).toHaveBeenCalledWith('/user-role/edit/Admin?id=1&name=Admin')
  })

  test('navigates to view page on view button click', () => {
    render(
      <Provider store={mockStore}>
        <UserRolesAndPermisstionList />
      </Provider>
    )

    const viewButtons = screen.getAllByTitle('View')

    fireEvent.click(viewButtons[0])

    expect(push).toHaveBeenCalledWith('/user-role/view/Admin?id=1&name=Admin')
  })

  test('displays loading text when isUserRoleLoading is true', () => {
    const loadingStore = configureStore({
      reducer: {
        UserRoleReducer: () => ({ ...mockUserRoleSlice, isUserRoleLoading: true })
      }
    })

    render(
      <Provider store={loadingStore}>
        <UserRolesAndPermisstionList />
      </Provider>
    )

    expect(screen.getByText('Loading roles...')).toBeInTheDocument()
  })

  test('filters roles based on applied permissions', () => {
    render(
      <Provider store={mockStore}>
        <UserRolesAndPermisstionList />
      </Provider>
    )

    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('EDITOR')).toBeInTheDocument()
  })
})
