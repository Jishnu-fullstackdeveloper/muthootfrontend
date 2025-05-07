import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import userEvent from '@testing-library/user-event'

import { toast } from 'react-toastify'

import AddNewApprovalMatrixGenerated from '@/form/generatedForms/AddNewApprovalMatrix'
import {
  createNewApprovalMatrix,
  updateApprovalMatrix,
  fetchApprovalCategories,
  fetchApprovalCategoryById,
  updateApprovalCategory,
  fetchDesignations,
  fetchGrades
} from '@/redux/approvalMatrixSlice'

// Mock Redux store
const mockStore = configureStore([])

const initialState = {
  approvalMatrixReducer: {
    approvalCategories: [
      { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
      { id: 'cat2', name: 'Category 2', description: 'Desc 2' }
    ],
    designations: [
      { id: 'des1', name: 'Manager' },
      { id: 'des2', name: 'Director' }
    ],
    grades: [
      { id: 'gr1', name: 'A' },
      { id: 'gr2', name: 'B' }
    ]
  }
}

let store

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

// Mock Redux hooks
jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

// Mock Redux actions
jest.mock('@/redux/approvalMatrixSlice', () => ({
  createNewApprovalMatrix: jest.fn(),
  updateApprovalMatrix: jest.fn(),
  fetchApprovalCategories: jest.fn(),
  fetchApprovalCategoryById: jest.fn(),
  updateApprovalCategory: jest.fn(),
  fetchDesignations: jest.fn(),
  fetchGrades: jest.fn()
}))

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => <div data-testid='toast-container' />
}))

// Mock Material-UI Autocomplete
jest.mock(
  '@mui/material/Autocomplete',
  () =>
    ({
      value,
      onChange,
      options,
      getOptionLabel,
      isOptionEqualToValue,
      renderInput,
      ListboxProps,
      sx,
      disabled,
      loading,
      onOpen
    }) => (
      <div data-testid='autocomplete'>
        <input
          data-testid={renderInput().props.label.toLowerCase().replace(' ', '-') + '-input'}
          value={value ? getOptionLabel(value) : ''}
          onChange={e => {
            const selected = options.find(opt => getOptionLabel(opt) === e.target.value)

            onChange({}, selected || null)
          }}
          disabled={disabled}
        />
        <ul data-testid='autocomplete-options' onScroll={ListboxProps?.onScroll}>
          {options.map((option, idx) => (
            <li key={idx}>{getOptionLabel(option)}</li>
          ))}
        </ul>
        {loading && <div data-testid='loading' />}
        <button data-testid='open-autocomplete' onClick={onOpen} />
      </div>
    )
)

// Mock ConfirmModal
jest.mock(
  '@/@core/components/dialogs/Delete_confirmation_Dialog',
  () =>
    ({ open, onClose, onConfirm, id, title, description }) =>
      open ? (
        <div data-testid='confirm-modal'>
          <div>{title}</div>
          <div>{description}</div>
          <button data-testid='confirm-delete' onClick={() => onConfirm(id)}>
            Confirm
          </button>
          <button data-testid='cancel-delete' onClick={onClose}>
            Cancel
          </button>
        </div>
      ) : null
)

// Mock Material-UI Icons
jest.mock('@mui/icons-material/Delete', () => () => <span data-testid='delete-icon' />)
jest.mock('@mui/icons-material/DragIndicator', () => () => <span data-testid='drag-indicator' />)

describe('AddNewApprovalMatrixGenerated', () => {
  let push, dispatch

  beforeEach(() => {
    store = mockStore(initialState)
    store.dispatch = jest.fn()
    push = jest.fn()
    dispatch = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementation(effect => effect())
    ;(useRouter as jest.Mock).mockReturnValue({ push, back: jest.fn() })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    require('@/lib/hooks').useAppDispatch.mockReturnValue(dispatch)
    require('@/lib/hooks').useAppSelector.mockImplementation(selector => selector(initialState))
    jest.clearAllMocks()
  })

  // Test 1: Renders without crashing
  it('renders the form with title and input fields', () => {
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    expect(screen.getByText('Approval Matrix Form')).toBeInTheDocument()
    expect(screen.getByTestId('autocomplete')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Levels')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument()
  })

  // Test 2: Fetches initial data on mount
  it('fetches designations, grades, and approval categories on mount', () => {
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    expect(dispatch).toHaveBeenCalledWith(fetchDesignations({ limit: 10 }))
    expect(dispatch).toHaveBeenCalledWith(fetchGrades({ limit: 10 }))
    expect(dispatch).toHaveBeenCalledWith(fetchApprovalCategories({ page: 1, limit: 10 }))
  })

  // Test 3: Updates approval category and fetches description
  it('updates approval category and fetches description', async () => {
    dispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ description: 'Desc 1' }) })
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const categoryInput = screen.getByTestId('approval-category-input')

    await userEvent.type(categoryInput, 'Category 1')
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } })

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(fetchApprovalCategoryById('cat1'))
      expect(screen.getByLabelText('Description')).toHaveValue('Desc 1')
    })
  })

  // Test 4: Shows validation errors when Next is clicked without filling fields
  it('shows validation errors when Next is clicked without filling fields', async () => {
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    await waitFor(() => {
      expect(screen.getByText('Approval Category is required')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })
  })

  // Test 5: Shows sections when Next is clicked with valid data
  it('shows sections when Next is clicked with valid data', async () => {
    dispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ description: 'Desc 1' }) })
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const categoryInput = screen.getByTestId('approval-category-input')

    await userEvent.type(categoryInput, 'Category 1')
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } })

    const numberInput = screen.getByLabelText('Number of Levels')

    fireEvent.change(numberInput, { target: { value: '2' } })

    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    await waitFor(() => {
      expect(screen.getAllByText(/Level \d:/)).toHaveLength(2)
      expect(screen.getAllByTestId('autocomplete')).toHaveLength(5) // 1 for category, 2x2 for sections
    })
  })

  // Test 6: Updates designations and grades in sections
  it('updates designations and grades in sections', async () => {
    dispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ description: 'Desc 1' }) })
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const categoryInput = screen.getByTestId('approval-category-input')

    await userEvent.type(categoryInput, 'Category 1')
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } })

    fireEvent.change(screen.getByLabelText('Number of Levels'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    const designationInput = screen.getByTestId('designations-input')

    await userEvent.type(designationInput, 'Manager')
    fireEvent.change(designationInput, { target: { value: 'Manager' } })

    const gradeInput = screen.getByTestId('grade-input')

    await userEvent.type(gradeInput, 'A')
    fireEvent.change(gradeInput, { target: { value: 'A' } })

    await waitFor(() => {
      expect(designationInput).toHaveValue('Manager')
      expect(gradeInput).toHaveValue('A')
    })

    fireEvent.click(screen.getByRole('button', { name: /Create/i }))

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        createNewApprovalMatrix({
          approvalMatrix: [
            {
              approvalCategoryId: 'cat1',
              designation: 'Manager',
              grade: 'A',
              level: 1
            }
          ]
        })
      )
      expect(toast.success).toHaveBeenCalledWith('Approval Matrix created successfully!', expect.any(Object))
    })
  })

  // Test 7: Resets form when Clear is clicked
  it('resets form and hides sections when Clear is clicked', async () => {
    dispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ description: 'Desc 1' }) })
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const categoryInput = screen.getByTestId('approval-category-input')

    await userEvent.type(categoryInput, 'Category 1')
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } })

    fireEvent.change(screen.getByLabelText('Number of Levels'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    fireEvent.click(screen.getByRole('button', { name: /Clear/i }))

    await waitFor(() => {
      expect(categoryInput).toHaveValue('')
      expect(screen.getByLabelText('Number of Levels')).toHaveValue('1')
      expect(screen.getByLabelText('Description')).toHaveValue('')
      expect(screen.queryByText('Level 1:')).not.toBeInTheDocument()
    })
  })

  // Test 8: Deletes a section after confirmation
  it('opens delete modal and removes section on confirm', async () => {
    dispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ description: 'Desc 1' }) })
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const categoryInput = screen.getByTestId('approval-category-input')

    await userEvent.type(categoryInput, 'Category 1')
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } })

    fireEvent.change(screen.getByLabelText('Number of Levels'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    const deleteButtons = screen.getAllByTestId('delete-icon')

    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('confirm-delete'))

    await waitFor(() => {
      expect(screen.getAllByText(/Level \d:/)).toHaveLength(1)
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
    })
  })

  // Test 9: Pre-fills form in edit mode
  it('pre-fills form fields in edit mode', async () => {
    const searchParams = new URLSearchParams({
      id: '1',
      approvalCategoryId: 'cat1',
      approvalCategory: 'Category 1',
      numberOfLevels: '2',
      description: 'Desc 1',
      designationName: JSON.stringify([
        { id: '1-0', name: 'Manager' },
        { id: '1-1', name: 'Director' }
      ]),
      grade: JSON.stringify([
        { id: '1-0', name: 'A' },
        { id: '1-1', name: 'B' }
      ])
    })

    ;(useSearchParams as jest.Mock).mockReturnValue(searchParams)

    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('approval-category-input')).toHaveValue('Category 1')
      expect(screen.getByLabelText('Number of Levels')).toHaveValue('2')
      expect(screen.getByLabelText('Description')).toHaveValue('Desc 1')
      expect(screen.getAllByText(/Level \d:/)).toHaveLength(2)
      expect(screen.getAllByTestId('designations-input')[0]).toHaveValue('Manager')
      expect(screen.getAllByTestId('grade-input')[0]).toHaveValue('A')
      expect(screen.getAllByTestId('designations-input')[1]).toHaveValue('Director')
      expect(screen.getAllByTestId('grade-input')[1]).toHaveValue('B')
    })
  })

  // Test 10: Submits form in update mode
  it('submits form in update mode', async () => {
    const searchParams = new URLSearchParams({
      id: '1',
      approvalCategoryId: 'cat1',
      approvalCategory: 'Category 1',
      numberOfLevels: '1',
      description: 'Desc 1',
      designationName: JSON.stringify([{ id: '1-0', name: 'Manager' }]),
      grade: JSON.stringify([{ id: '1-0', name: 'A' }])
    })

    ;(useSearchParams as jest.Mock).mockReturnValue(searchParams)
    dispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) })

    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const designationInput = screen.getByTestId('designations-input')

    await userEvent.type(designationInput, 'Manager')
    fireEvent.change(designationInput, { target: { value: 'Manager' } })

    const gradeInput = screen.getByTestId('grade-input')

    await userEvent.type(gradeInput, 'A')
    fireEvent.change(gradeInput, { target: { value: 'A' } })

    fireEvent.click(screen.getByRole('button', { name: /Update/i }))

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        updateApprovalCategory({
          id: 'cat1',
          name: 'Category 1',
          description: 'Desc 1'
        })
      )
      expect(dispatch).toHaveBeenCalledWith(
        updateApprovalMatrix({
          id: '1',
          approvalMatrix: {
            approvalCategoryId: 'cat1',
            designation: 'Manager',
            grade: 'A',
            level: 1
          }
        })
      )
      expect(toast.success).toHaveBeenCalledWith('Approval Matrix updated successfully!', expect.any(Object))
    })
  })

  // Test 11: Handles API errors during submission
  it('shows error toast on submission failure', async () => {
    dispatch.mockReturnValue({ unwrap: jest.fn().mockRejectedValue(new Error('API Error')) })
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const categoryInput = screen.getByTestId('approval-category-input')

    await userEvent.type(categoryInput, 'Category 1')
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } })

    fireEvent.change(screen.getByLabelText('Number of Levels'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    const designationInput = screen.getByTestId('designations-input')

    await userEvent.type(designationInput, 'Manager')
    fireEvent.change(designationInput, { target: { value: 'Manager' } })

    const gradeInput = screen.getByTestId('grade-input')

    await userEvent.type(gradeInput, 'A')
    fireEvent.change(gradeInput, { target: { value: 'A' } })

    fireEvent.click(screen.getByRole('button', { name: /Create/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to create approval matrix. Please try again.',
        expect.any(Object)
      )
    })
  })

  // Test 12: Triggers infinite scroll in approval category autocomplete
  it('triggers infinite scroll in approval category autocomplete', async () => {
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const optionsList = screen.getByTestId('autocomplete-options')

    fireEvent.scroll(optionsList, { target: { scrollTop: 1000, scrollHeight: 1010, clientHeight: 10 } })

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(fetchApprovalCategories({ page: 1, limit: 20 }))
    })
  })

  // Test 13: Drags and drops sections to reorder
  it('reorders sections via drag and drop', async () => {
    dispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ description: 'Desc 1' }) })
    render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )

    const categoryInput = screen.getByTestId('approval-category-input')

    await userEvent.type(categoryInput, 'Category 1')
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } })

    fireEvent.change(screen.getByLabelText('Number of Levels'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    const dragIndicators = screen.getAllByTestId('drag-indicator')
    const section1 = dragIndicators[0].parentElement
    const section2 = dragIndicators[1].parentElement

    fireEvent.dragStart(dragIndicators[0])
    fireEvent.dragOver(section2)
    fireEvent.drop(section2)

    await waitFor(() => {
      const updatedSections = screen.getAllByText(/Level \d:/)

      expect(updatedSections[0]).toHaveTextContent('Level 2:')
      expect(updatedSections[1]).toHaveTextContent('Level 1:')
    })
  })
})
