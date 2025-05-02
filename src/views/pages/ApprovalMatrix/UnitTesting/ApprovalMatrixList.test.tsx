import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { act } from 'react-dom/test-utils'

import ApprovalMatrixList from '../ApprovalMatrixList'
import { fetchApprovalCategories, fetchApprovalMatrices } from '@/redux/approvalMatrixSlice'

// Mock Redux store
const mockStore = configureStore([])

const initialState = {
  approvalMatrixReducer: {
    approvalMatrixData: [],
    status: 'idle'
  }
}

let store

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

// Mock Redux actions
jest.mock('@/redux/approvalMatrixSlice', () => ({
  fetchApprovalMatrices: jest.fn(),
  fetchApprovalCategories: jest.fn(),
  deleteApprovalMatrix: jest.fn()
}))

// Mock DynamicTable component
jest.mock(
  '@/components/Table/dynamicTable',
  () =>
    ({ data, pagination, onPageChange, onRowsPerPageChange, totalCount, tableName, onEdit, onDelete }) => (
      <div data-testid='dynamic-table'>
        {tableName}
        {data.map((item, index) => (
          <div key={index} data-testid='table-row'>
            <span>{item.approvalCategories.name}</span>
            <span>{item.approvalCategories.description}</span>
            <span>{item.level === 0 ? 1 : item.level}</span>
            <ul>
              {item.designations.map((designation, idx) => (
                <li key={idx}>{designation}</li>
              ))}
            </ul>
            <ul>
              {item.grades.map((grade, idx) => (
                <li key={idx}>{grade}</li>
              ))}
            </ul>
            <button data-testid={`edit-button-${index}`} onClick={() => onEdit?.(item)}>
              Edit
            </button>
            <button data-testid={`delete-button-${index}`} onClick={() => onDelete?.(item)}>
              Delete
            </button>
          </div>
        ))}
        <button data-testid='page-change' onClick={() => onPageChange(pagination.pageIndex + 1)}>
          Next Page
        </button>
        <button data-testid='rows-per-page' onClick={() => onRowsPerPageChange(10)}>
          Change Rows
        </button>
        <span data-testid='total-count'>{totalCount}</span>
      </div>
    )
)

// Mock ConfirmModal component
jest.mock(
  '@/@core/components/dialogs/Delete_confirmation_Dialog',
  () =>
    ({ open, onClose, onConfirm, id }) =>
      open ? (
        <div data-testid='confirm-modal'>
          <button data-testid='confirm-delete' onClick={() => onConfirm(id)}>
            Confirm
          </button>
          <button data-testid='cancel-delete' onClick={onClose}>
            Cancel
          </button>
        </div>
      ) : null
)

describe('ApprovalMatrixList', () => {
  let push

  beforeEach(() => {
    store = mockStore(initialState)
    store.dispatch = jest.fn()
    push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    jest.clearAllMocks()
  })

  // Test 1: Renders correctly
  it('renders the component with title, search bar, and add button', () => {
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    expect(screen.getByText('Approvals Listing')).toBeInTheDocument()
    expect(screen.getByLabelText('Search by approval categories')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Approval/i })).toBeInTheDocument()
  })

  // Test 2: Displays loading state
  it('displays loading state when status is loading', () => {
    store = mockStore({
      approvalMatrixReducer: {
        approvalMatrixData: [],
        status: 'loading'
      }
    })
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  // Test 3: Displays no data found when search yields no results
  it('displays no data found message when search query returns empty results', () => {
    store = mockStore({
      approvalMatrixReducer: {
        approvalMatrixData: [],
        status: 'idle'
      }
    })
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    fireEvent.change(screen.getByLabelText('Search by approval categories'), { target: { value: 'test' } })
    expect(screen.getByText('No data found')).toBeInTheDocument()
  })

  // Test 4: Renders grouped data in DynamicTable
  it('renders grouped data in DynamicTable', () => {
    store = mockStore({
      approvalMatrixReducer: {
        approvalMatrixData: [
          {
            id: '1',
            approvalCategoryId: 'cat1',
            approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
            designation: 'Manager',
            grade: 'A',
            level: 1
          },
          {
            id: '2',
            approvalCategoryId: 'cat1',
            approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
            designation: 'Director',
            grade: 'B',
            level: 2
          }
        ],
        status: 'idle'
      }
    })
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    expect(screen.getByTestId('dynamic-table')).toBeInTheDocument()
    expect(screen.getByText('Category 1')).toBeInTheDocument()
    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
    expect(screen.getByText('Director')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  // Test 5: Handles search input and dispatches fetchApprovalCategories
  it('handles search input and dispatches fetchApprovalCategories with debounce', async () => {
    jest.useFakeTimers()
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    fireEvent.change(screen.getByLabelText('Search by approval categories'), { target: { value: 'test' } })
    expect(fetchApprovalCategories).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchApprovalCategories({
          page: 1,
          limit: 1000,
          search: 'test'
        })
      )
    })

    jest.useRealTimers()
  })

  // Test 6: Clears search and dispatches fetchApprovalMatrices
  it('clears search and dispatches fetchApprovalMatrices', async () => {
    jest.useFakeTimers()
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    fireEvent.change(screen.getByLabelText('Search by approval categories'), { target: { value: 'test' } })
    fireEvent.change(screen.getByLabelText('Search by approval categories'), { target: { value: '' } })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchApprovalMatrices({
          page: 1,
          limit: 1000
        })
      )
    })

    jest.useRealTimers()
  })

  // Test 7: Navigates to add approval page
  it('navigates to add approval page when New Approval button is clicked', () => {
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: /New Approval/i }))
    expect(push).toHaveBeenCalledWith('/approval-matrix/add/new-approval')
  })

  // Test 8: Handles edit action
  // it('navigates to edit page with correct query params', () => {
  //   store = mockStore({
  //     approvalMatrixReducer: {
  //       approvalMatrixData: [
  //         {
  //           id: '1',
  //           approvalCategoryId: 'cat1',
  //           approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
  //           designation: 'Manager',
  //           grade: 'A',
  //           level: 1
  //         }
  //       ],
  //       status: 'idle'
  //     }
  //   })
  //   render(
  //     <Provider store={store}>
  //       <ApprovalMatrixList />
  //     </Provider>
  //   )

  //   fireEvent.click(screen.getByTestId('edit-button-0'))
  //   expect(push).toHaveBeenCalledWith(
  //     expect.stringContaining(
  //       '/approval-matrix/edit/edit-approval?id=1&approvalCategoryId=cat1&approvalCategory=Category%201&numberOfLevels=1&description=Desc%201&designationName=[{"id":"1-0","name":"Manager"}]&grade=[{"id":"1-0","name":"A"}]'
  //     )
  //   )
  // })

  // Test 9: Opens delete confirmation modal
  // it('opens delete confirmation modal when delete button is clicked', () => {
  //   store = mockStore({
  //     approvalMatrixReducer: {
  //       approvalMatrixData: [
  //         {
  //           id: '1',
  //           approvalCategoryId: 'cat1',
  //           approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
  //           designation: 'Manager',
  //           grade: 'A',
  //           level: 1
  //         }
  //       ],
  //       status: 'idle'
  //     }
  //   })
  //   render(
  //     <Provider store={store}>
  //       <ApprovalMatrixList />
  //     </Provider>
  //   )

  //   fireEvent.click(screen.getByTestId('delete-button-0'))
  //   expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
  // })

  // Test 10: Confirms delete and dispatches deleteApprovalMatrix
  // it('confirms delete and dispatches deleteApprovalMatrix', async () => {
  //   store = mockStore({
  //     approvalMatrixReducer: {
  //       approvalMatrixData: [
  //         {
  //           id: '1',
  //           approvalCategoryId: 'cat1',
  //           approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
  //           designation: 'Manager',
  //           grade: 'A',
  //           level: 1
  //         }
  //       ],
  //       status: 'idle'
  //     }
  //   })
  //   render(
  //     <Provider store={store}>
  //       <ApprovalMatrixList />
  //     </Provider>
  //   )

  //   fireEvent.click(screen.getByTestId('delete-button-0'))
  //   fireEvent.click(screen.getByTestId('confirm-delete'))

  //   await waitFor(() => {
  //     expect(store.dispatch).toHaveBeenCalledWith(deleteApprovalMatrix('1'))
  //   })
  //   expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
  // })

  // Test 11: Cancels delete
  // it('cancels delete and closes modal', () => {
  //   store = mockStore({
  //     approvalMatrixReducer: {
  //       approvalMatrixData: [
  //         {
  //           id: '1',
  //           approvalCategoryId: 'cat1',
  //           approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
  //           designation: 'Manager',
  //           grade: 'A',
  //           level: 1
  //         }
  //       ],
  //       status: 'idle'
  //     }
  //   })
  //   render(
  //     <Provider store={store}>
  //       <ApprovalMatrixList />
  //     </Provider>
  //   )

  //   fireEvent.click(screen.getByTestId('delete-button-0'))
  //   fireEvent.click(screen.getByTestId('cancel-delete'))
  //   expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
  // })

  // Test 12: Handles pagination page change
  it('handles pagination page change', () => {
    store = mockStore({
      approvalMatrixReducer: {
        approvalMatrixData: Array(10).fill({
          id: '1',
          approvalCategoryId: 'cat1',
          approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
          designation: 'Manager',
          grade: 'A',
          level: 1
        }),
        status: 'idle'
      }
    })
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    fireEvent.click(screen.getByTestId('page-change'))
    expect(screen.getByTestId('dynamic-table')).toBeInTheDocument()
  })

  // Test 13: Handles rows per page change
  it('handles rows per page change', () => {
    store = mockStore({
      approvalMatrixReducer: {
        approvalMatrixData: Array(10).fill({
          id: '1',
          approvalCategoryId: 'cat1',
          approvalCategories: { id: 'cat1', name: 'Category 1', description: 'Desc 1' },
          designation: 'Manager',
          grade: 'A',
          level: 1
        }),
        status: 'idle'
      }
    })
    render(
      <Provider store={store}>
        <ApprovalMatrixList />
      </Provider>
    )

    fireEvent.click(screen.getByTestId('rows-per-page'))
    expect(screen.getByTestId('dynamic-table')).toBeInTheDocument()
  })
})
