import { useRouter, useParams } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useFormik } from 'formik'

import AddOrEditUser from '../addNewUser' // Adjust path as needed
import userManagementSlice from '@/redux/UserManagment/userManagementSlice'
import userRoleSlice from '@/redux/UserRoles/userRoleSlice'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn()
}))

jest.mock('formik', () => ({
  useFormik: jest.fn()
}))

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: selector => selector(mockStore.getState())
}))

const mockStore = configureStore({
  reducer: {
    UserManagementReducer: userManagementSlice,
    UserRoleReducer: userRoleSlice
  },
  preloadedState: {
    UserManagementReducer: {
      isAddUserLoading: false,
      addUserSuccess: false,
      addUserFailure: false,
      addUserFailureMessage: null,
      userManagementData: { data: [] }
    },
    UserRoleReducer: {
      userRoleData: { data: [{ name: 'Admin' }, { name: 'User' }] },
      isUserRoleLoading: false
    }
  }
})

describe('AddOrEditUser Component', () => {
  const mockPush = jest.fn()
  const mockDispatch = jest.fn()

  const mockFormik = {
    initialValues: {
      employeeCode: '',
      userId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      designation: '',
      roles: []
    },
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    setFieldValue: jest.fn(),
    setValues: jest.fn(),
    values: {
      employeeCode: '',
      userId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      designation: '',
      roles: []
    }
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: jest.fn() })
    ;(useParams as jest.Mock).mockReturnValue({ id: null })
    ;(useFormik as jest.Mock).mockReturnValue(mockFormik)
    mockDispatch.mockClear()
    mockPush.mockClear()
  })

  const renderComponent = (mode: 'add' | 'edit') =>
    render(
      <Provider store={mockStore}>
        <AddOrEditUser mode={mode} />
      </Provider>
    )

  test('renders Add New User form correctly', () => {
    renderComponent('add')

    expect(screen.getByText('Add New User')).toBeInTheDocument()
    expect(screen.getByLabelText('Employee Code *')).toBeInTheDocument()
    expect(screen.getByLabelText('User ID *')).toBeInTheDocument()
    expect(screen.getByLabelText('Roles *')).toBeInTheDocument()
    expect(screen.getByText('Add User')).toBeInTheDocument()
  })

  test('renders Edit User form correctly', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '123' })
    renderComponent('edit')

    expect(screen.getByText('Edit User')).toBeInTheDocument()
    expect(screen.getByLabelText('Employee Code *')).toBeDisabled()
    expect(screen.getByText('Update User')).toBeInTheDocument()
  })

  test('handles form submission in add mode', async () => {
    renderComponent('add')

    fireEvent.click(screen.getByText('Add User'))

    await waitFor(() => {
      expect(mockFormik.handleSubmit).toHaveBeenCalled()
    })
  })

  test('cancels and navigates back', () => {
    const mockBack = jest.fn()

    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack })
    renderComponent('add')

    fireEvent.click(screen.getByText('Cancel'))

    expect(mockBack).toHaveBeenCalled()
  })

  test('displays API errors', async () => {
    mockStore.getState().UserManagementReducer.addUserFailure = true
    mockStore.getState().UserManagementReducer.addUserFailureMessage = { message: 'Email already exists' }
    renderComponent('add')

    await waitFor(() => {
      expect(screen.getByText('• Email already exists')).toBeInTheDocument()
    })
  })

  test('populates form with existing user data in edit mode', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '123' })
    mockStore.getState().UserManagementReducer.userManagementData = {
      data: [
        {
          userId: '123',
          employeeCode: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          roles: ['Admin']
        }
      ]
    }
    renderComponent('edit')

    await waitFor(() => {
      expect(mockFormik.setValues).toHaveBeenCalledWith({
        employeeCode: 'EMP001',
        userId: '123',
        firstName: 'John',
        middleName: '',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        designation: '',
        roles: ['Admin']
      })
    })
  })

  test('updates roles via Autocomplete', () => {
    renderComponent('add')

    const rolesInput = screen.getByLabelText('Roles *')

    fireEvent.change(rolesInput, { target: { value: 'Admin' } })
    fireEvent.keyDown(rolesInput, { key: 'Enter' })

    expect(mockFormik.setFieldValue).toHaveBeenCalledWith('roles', ['Admin'])
  })
})
