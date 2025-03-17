import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import UserRolesAndPermissionList from '../UserRolesList'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() }))
}))

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

jest.mock('@/redux/userRoleSlice', () => ({
  fetchUserRole: jest.fn()
}))

const mockStore = configureStore([])

describe('UserRolesAndPermissionList', () => {
  let store: any
  let pushMock: jest.Mock
  let dispatchMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    dispatchMock = jest.fn()

    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })

    store = mockStore({
      UserRoleReducer: {
        userRoleData: {
          data: [
            { id: '1', name: 'Admin', permissions: ['user_create', 'user_read'] },
            { id: '2', name: 'Editor', permissions: ['user_read'] }
          ],
          meta: { totalPages: 2 }
        },
        isUserRoleLoading: false
      }
    })

    jest.spyOn(require('@/lib/hooks'), 'useAppDispatch').mockReturnValue(dispatchMock)
    jest
      .spyOn(require('@/lib/hooks'), 'useAppSelector')
      .mockImplementation((selector: any) => selector(store.getState()))

    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <UserRolesAndPermissionList />
      </Provider>
    )
  }

  test('renders component with initial data', () => {
    renderComponent()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('EDITOR')).toBeInTheDocument()
    expect(screen.getByLabelText('Search Roles')).toBeInTheDocument()
    expect(screen.getByText('Add Role')).toBeInTheDocument()
  })

  test('handles search input with debounce', async () => {
    renderComponent()
    const searchInput = screen.getByLabelText('Search Roles')

    fireEvent.change(searchInput, { target: { value: 'test' } })
    expect((searchInput as HTMLInputElement).value).toBe('test')

    jest.advanceTimersByTime(500)

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: `${fetchUserRole}`,
          payload: expect.objectContaining({ search: 'test' })
        })
      )
    })
  })

  test('opens and closes filter drawer', () => {
    renderComponent()
    const filterButton = screen.getByText('Filter')

    fireEvent.click(filterButton)
    expect(screen.getByText('Filter by Permissions')).toBeInTheDocument()

    const closeButton = screen.getByText('Clear')

    fireEvent.click(closeButton)
    expect(screen.queryByText('Filter by Permissions')).not.toBeInTheDocument()
  })

  test('navigates to add role page', () => {
    renderComponent()
    const addButton = screen.getByText('Add Role')

    fireEvent.click(addButton)
    expect(pushMock).toHaveBeenCalledWith('/user-role/add/add-role')
  })

  test('navigates to edit role page', () => {
    renderComponent()
    const editButtons = screen.getAllByRole('button', { name: /edit/i })

    fireEvent.click(editButtons[0])
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('/user-role/edit/Admin'))
  })

  test('handles pagination change', () => {
    renderComponent()
    const nextPageButton = screen.getByLabelText('Go to next page')

    fireEvent.click(nextPageButton)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('displays loading state', () => {
    store = mockStore({
      UserRoleReducer: {
        userRoleData: null,
        isUserRoleLoading: true
      }
    })
    jest
      .spyOn(require('@/lib/hooks'), 'useAppSelector')
      .mockImplementation((selector: any) => selector(store.getState()))

    renderComponent()
    expect(screen.getByText('Loading roles...')).toBeInTheDocument()
  })

  test('displays no roles found when data is empty', () => {
    store = mockStore({
      UserRoleReducer: {
        userRoleData: { data: [], meta: { totalPages: 0 } },
        isUserRoleLoading: false
      }
    })
    jest
      .spyOn(require('@/lib/hooks'), 'useAppSelector')
      .mockImplementation((selector: any) => selector(store.getState()))

    renderComponent()
    expect(screen.getByText('No roles found')).toBeInTheDocument()
  })

  test('applies and removes permission filters', async () => {
    renderComponent()
    fireEvent.click(screen.getByText('Filter'))
    const checkbox = screen.getByLabelText('user_create')

    fireEvent.click(checkbox)
    fireEvent.click(screen.getByText('Apply'))

    await waitFor(() => {
      expect(screen.getByText('user_create')).toBeInTheDocument()
    })

    const chipDelete = screen.getByLabelText('delete permission') // Updated label

    fireEvent.click(chipDelete)

    await waitFor(() => {
      expect(screen.queryByText('user_create')).not.toBeInTheDocument()
    })
  })
})
