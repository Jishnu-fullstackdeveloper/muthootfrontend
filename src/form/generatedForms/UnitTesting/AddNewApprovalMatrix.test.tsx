import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { render, screen, waitFor, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import AddNewApprovalMatrixGenerated from '../AddNewApprovalMatrix'
import approvalMatrixReducer from '@/redux/approvalMatrixSlice'
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() }
}))
jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))
jest.mock('@/redux/approvalMatrixSlice', () => ({
  createNewApprovalMatrix: jest.fn(),
  updateApprovalMatrix: jest.fn(),
  fetchApprovalCategories: jest.fn(),
  fetchApprovalCategoryById: jest.fn(),
  updateApprovalCategory: jest.fn(),
  fetchDesignations: jest.fn(),
  fetchGrades: jest.fn()
}))
jest.mock('@/@core/components/dialogs/Delete_confirmation_Dialog', () => {
  return jest.fn(({ open, onClose, onConfirm, title, description, id }) =>
    open ? (
      <div data-testid='confirm-modal'>
        <h1>{title}</h1>
        <p>{description}</p>
        <button onClick={() => onConfirm(id)}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null
  )
})

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      approvalMatrixReducer: approvalMatrixReducer
    },
    preloadedState: {
      approvalMatrixReducer: {
        designations: [
          { id: '1', name: 'Manager' },
          { id: '2', name: 'Director' }
        ],
        grades: [
          { id: '1', name: 'Grade A' },
          { id: '2', name: 'Grade B' }
        ],
        approvalCategories: [
          { id: '1', name: 'Category 1', description: 'Description 1' },
          { id: '2', name: 'Category 2', description: 'Description 2' }
        ],
        ...initialState
      }
    }
  })
}

describe('AddNewApprovalMatrixGenerated', () => {
  let mockDispatch: jest.Mock
  let mockRouter: { back: jest.Mock }
  let mockSearchParams: jest.Mock
  const mockUseAppDispatch = require('@/lib/hooks').useAppDispatch
  const mockUseAppSelector = require('@/lib/hooks').useAppSelector

  beforeEach(() => {
    mockDispatch = jest.fn()
    mockRouter = { back: jest.fn() }
    mockSearchParams = jest.fn(() => new URLSearchParams())
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    mockUseAppDispatch.mockReturnValue(mockDispatch)
    mockUseAppSelector.mockImplementation(selector => selector(createMockStore().getState()))

    // Mock Redux thunks
    ;(require('@/redux/approvalMatrixSlice').fetchApprovalCategories as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(undefined)
    })
    ;(require('@/redux/approvalMatrixSlice').fetchDesignations as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(undefined)
    })
    ;(require('@/redux/approvalMatrixSlice').fetchGrades as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(undefined)
    })
    ;(require('@/redux/approvalMatrixSlice').fetchApprovalCategoryById as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ id: '1', name: 'Category 1', description: 'Description 1' })
    })
    ;(require('@/redux/approvalMatrixSlice').createNewApprovalMatrix as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true })
    })
    ;(require('@/redux/approvalMatrixSlice').updateApprovalCategory as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true })
    })
    ;(require('@/redux/approvalMatrixSlice').updateApprovalMatrix as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true })
    })

    jest.clearAllMocks()
  })

  const renderComponent = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <AddNewApprovalMatrixGenerated />
      </Provider>
    )
  }

  it('renders the form correctly', async () => {
    await act(async () => {
      renderComponent()
    })
    expect(screen.getByText('Approval Matrix Form')).toBeInTheDocument()
    expect(screen.getByLabelText('Approval Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Levels')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('validates form fields on submission', async () => {
    await act(async () => {
      renderComponent()
    })
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }))
    })

    await waitFor(() => {
      expect(screen.getByText('Approval Category is required')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })
  })

  it('displays sections after clicking Next with valid category and description', async () => {
    await act(async () => {
      renderComponent()
    })

    // Select Approval Category
    const approvalCategoryInput = screen.getByLabelText('Approval Category')

    await act(async () => {
      await userEvent.click(approvalCategoryInput)
    })
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument()
    })
    await act(async () => {
      await userEvent.click(screen.getByText('Category 1'))
    })

    // Fill Description
    await act(async () => {
      await userEvent.type(screen.getByLabelText('Description'), 'This is a valid description')
    })

    // Set Number of Levels
    await act(async () => {
      await userEvent.clear(screen.getByLabelText('Number of Levels'))
      await userEvent.type(screen.getByLabelText('Number of Levels'), '2')
    })

    // Click Next
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }))
    })

    await waitFor(() => {
      expect(screen.getByText('Level 1:')).toBeInTheDocument()
      expect(screen.getByText('Level 2:')).toBeInTheDocument()
    })
  })

  it('adds designation and grade to sections', async () => {
    await act(async () => {
      renderComponent()
    })

    // Fill initial form
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Approval Category'))
      await userEvent.click(screen.getByText('Category 1'))
      await userEvent.type(screen.getByLabelText('Description'), 'This is a valid description')
      await userEvent.clear(screen.getByLabelText('Number of Levels'))
      await userEvent.type(screen.getByLabelText('Number of Levels'), '1')
      await userEvent.click(screen.getByRole('button', { name: /Next/i }))
    })

    // Select Designation and Grade
    await waitFor(() => {
      expect(screen.getByText('Level 1:')).toBeInTheDocument()
    })
    const section = screen.getByText('Level 1:').closest('div')!

    await act(async () => {
      await userEvent.click(within(section).getByPlaceholderText('Designations'))
      await userEvent.click(screen.getByText('Manager'))
      await userEvent.click(within(section).getByPlaceholderText('Grade'))
      await userEvent.click(screen.getByText('Grade A'))
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
    })
  })

  it('submits the form successfully in create mode', async () => {
    await act(async () => {
      renderComponent()
    })

    // Fill form
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Approval Category'))
      await userEvent.click(screen.getByText('Category 1'))
      await userEvent.type(screen.getByLabelText('Description'), 'This is a valid description')
      await userEvent.clear(screen.getByLabelText('Number of Levels'))
      await userEvent.type(screen.getByLabelText('Number of Levels'), '1')
      await userEvent.click(screen.getByRole('button', { name: /Next/i }))
    })

    // Fill section
    const section = screen.getByText('Level 1:').closest('div')!

    await act(async () => {
      await userEvent.click(within(section).getByPlaceholderText('Designations'))
      await userEvent.click(screen.getByText('Manager'))
      await userEvent.click(within(section).getByPlaceholderText('Grade'))
      await userEvent.click(screen.getByText('Grade A'))
    })

    // Submit
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Create/i }))
    })

    await waitFor(() => {
      expect(require('@/redux/approvalMatrixSlice').createNewApprovalMatrix).toHaveBeenCalledWith({
        approvalMatrix: [
          {
            approvalCategoryId: '1',
            designation: 'Manager',
            grade: 'Grade A',
            level: 1
          }
        ]
      })
      expect(toast.success).toHaveBeenCalledWith('Approval Matrix created successfully!', expect.any(Object))
      expect(mockRouter.back).toHaveBeenCalled()
    })
  })

  it('handles form submission error in create mode', async () => {
    ;(require('@/redux/approvalMatrixSlice').createNewApprovalMatrix as jest.Mock).mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error('API Error'))
    })

    await act(async () => {
      renderComponent()
    })

    // Fill form
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Approval Category'))
      await userEvent.click(screen.getByText('Category 1'))
      await userEvent.type(screen.getByLabelText('Description'), 'This is a valid description')
      await userEvent.clear(screen.getByLabelText('Number of Levels'))
      await userEvent.type(screen.getByLabelText('Number of Levels'), '1')
      await userEvent.click(screen.getByRole('button', { name: /Next/i }))
    })

    // Fill section
    const section = screen.getByText('Level 1:').closest('div')!

    await act(async () => {
      await userEvent.click(within(section).getByPlaceholderText('Designations'))
      await userEvent.click(screen.getByText('Manager'))
      await userEvent.click(within(section).getByPlaceholderText('Grade'))
      await userEvent.click(screen.getByText('Grade A'))
    })

    // Submit
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Create/i }))
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to create approval matrix. Please try again.',
        expect.any(Object)
      )
    })
  })

  it('renders in edit mode with pre-filled data', async () => {
    mockSearchParams.mockReturnValue(
      new URLSearchParams({
        id: 'matrix1',
        approvalCategory: 'Category 1',
        approvalCategoryId: '1',
        numberOfLevels: '1',
        description: 'Pre-filled description',
        designationName: JSON.stringify([{ id: '1', name: 'Manager' }]),
        grade: JSON.stringify([{ id: '1', name: 'Grade A' }])
      })
    )

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Category 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Number of Levels')).toHaveValue('1')
      expect(screen.getByLabelText('Description')).toHaveValue('Pre-filled description')
      expect(screen.getByText('Level 1:')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Manager')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Grade A')).toBeInTheDocument()
    })
  })

  it('submits the form successfully in edit mode', async () => {
    mockSearchParams.mockReturnValue(
      new URLSearchParams({
        id: 'matrix1',
        approvalCategory: 'Category 1',
        approvalCategoryId: '1',
        numberOfLevels: '1',
        description: 'Pre-filled description',
        designationName: JSON.stringify([{ id: '1', name: 'Manager' }]),
        grade: JSON.stringify([{ id: '1', name: 'Grade A' }])
      })
    )

    await act(async () => {
      renderComponent()
    })

    // Submit
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Update/i }))
    })

    await waitFor(() => {
      expect(require('@/redux/approvalMatrixSlice').updateApprovalCategory).toHaveBeenCalledWith({
        id: '1',
        name: 'Category 1',
        description: 'Pre-filled description'
      })
      expect(require('@/redux/approvalMatrixSlice').updateApprovalMatrix).toHaveBeenCalledWith({
        id: 'matrix1',
        approvalMatrix: {
          approvalCategoryId: '1',
          designation: 'Manager',
          grade: 'Grade A',
          level: 1
        }
      })
      expect(toast.success).toHaveBeenCalledWith('Approval Matrix updated successfully!', expect.any(Object))
      expect(mockRouter.back).toHaveBeenCalled()
    })
  })

  it('deletes a section using ConfirmModal', async () => {
    await act(async () => {
      renderComponent()
    })

    // Fill form
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Approval Category'))
      await userEvent.click(screen.getByText('Category 1'))
      await userEvent.type(screen.getByLabelText('Description'), 'This is a valid description')
      await userEvent.clear(screen.getByLabelText('Number of Levels'))
      await userEvent.type(screen.getByLabelText('Number of Levels'), '2')
      await userEvent.click(screen.getByRole('button', { name: /Next/i }))
    })

    // Click delete button
    await waitFor(() => {
      expect(screen.getAllByTestId('DeleteIcon')).toHaveLength(2)
    })
    const deleteButton = screen.getAllByTestId('DeleteIcon')[0]

    await act(async () => {
      await userEvent.click(deleteButton)
    })

    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
    })
    await act(async () => {
      await userEvent.click(within(screen.getByTestId('confirm-modal')).getByText('Confirm'))
    })

    await waitFor(() => {
      expect(screen.queryAllByText(/Level [1-2]:/)).toHaveLength(1)
    })
  })

  it('clears the form when Clear button is clicked', async () => {
    await act(async () => {
      renderComponent()
    })

    // Fill form
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Approval Category'))
      await userEvent.click(screen.getByText('Category 1'))
      await userEvent.type(screen.getByLabelText('Description'), 'This is a valid description')
    })

    // Click Clear
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Clear/i }))
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Approval Category')).toHaveValue('')
      expect(screen.getByLabelText('Description')).toHaveValue('')
      expect(screen.getByLabelText('Number of Levels')).toHaveValue('1')
    })
  })

  it('handles drag and drop of sections', async () => {
    await act(async () => {
      renderComponent()
    })

    // Fill form
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Approval Category'))
      await userEvent.click(screen.getByText('Category 1'))
      await userEvent.type(screen.getByLabelText('Description'), 'This is a valid description')
      await userEvent.clear(screen.getByLabelText('Number of Levels'))
      await userEvent.type(screen.getByLabelText('Number of Levels'), '2')
      await userEvent.click(screen.getByRole('button', { name: /Next/i }))
    })

    // Fill sections
    const sections = screen.getAllByText(/Level [1-2]:/)

    await act(async () => {
      await userEvent.click(within(sections[0].closest('div')!).getByPlaceholderText('Designations'))
      await userEvent.click(screen.getByText('Manager'))
      await userEvent.click(within(sections[1].closest('div')!).getByPlaceholderText('Designations'))
      await userEvent.click(screen.getByText('Director'))
    })

    // Simulate drag and drop
    const section1 = sections[0].closest('div')!
    const section2 = sections[1].closest('div')!

    await act(async () => {
      fireEvent.dragStart(section1)
      fireEvent.dragOver(section2)
      fireEvent.drop(section2)
    })

    await waitFor(() => {
      const updatedSections = screen.getAllByText(/Level [1-2]:/)

      expect(within(updatedSections[0].closest('div')!).getByDisplayValue('Director')).toBeInTheDocument()
      expect(within(updatedSections[1].closest('div')!).getByDisplayValue('Manager')).toBeInTheDocument()
    })
  })

  it('fetches more approval categories on scroll', async () => {
    await act(async () => {
      renderComponent()
    })

    // Open Autocomplete
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Approval Category'))
    })

    // Simulate scroll
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    const listbox = screen.getByRole('listbox')

    await act(async () => {
      fireEvent.scroll(listbox, { target: { scrollTop: 1000, scrollHeight: 1010, clientHeight: 200 } })
    })

    await waitFor(() => {
      expect(require('@/redux/approvalMatrixSlice').fetchApprovalCategories).toHaveBeenCalledWith({
        page: 1,
        limit: 20
      })
    })
  })
})
