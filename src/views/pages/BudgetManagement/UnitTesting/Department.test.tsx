import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Department from '../Department'
import { fetchBudgetDepartment } from '@/redux/BudgetManagement/BudgetManagementSlice'
import type { BudgetDepartment } from '@/types/budget'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock DynamicTable component
jest.mock('@/components/Table/dynamicTable', () => {
  return function MockDynamicTable({
    columns,
    data,
    totalCount,
    pagination,
    onPageChange,
    onRowsPerPageChange,
    tableName
  }: any) {
    return (
      <div data-testid='dynamic-table'>
        <h1>{tableName}</h1>
        <div>Total Count: {totalCount}</div>
        <div>Page: {pagination.pageIndex + 1}</div>
        <div>Page Size: {pagination.pageSize}</div>
        <div>
          {data.map((item: BudgetDepartment, index: number) => (
            <div key={item.id} data-testid={`row-${index}`}>
              <span>{item.name}</span>
              <span>{item.positionCategories.map(pos => `${pos.designationName} (${pos.count})`).join(', ')}</span>
              <button
                data-testid={`action-button-${item.id}`}
                onClick={() => columns.find((col: any) => col.id === 'action').cell({ row: { original: item } })}
              >
                Action
              </button>
            </div>
          ))}
        </div>
        <button data-testid='next-page' onClick={() => onPageChange(pagination.pageIndex + 1)}>
          Next Page
        </button>
        <button data-testid='change-page-size' onClick={() => onRowsPerPageChange(20)}>
          Change Page Size
        </button>
      </div>
    )
  }
})

// Mock @tanstack/react-table
jest.mock('@tanstack/react-table', () => ({
  createColumnHelper: () => ({
    accessor: (key: string, config: any) => ({ ...config, accessorKey: key })
  })
}))

// Create mock store
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

// Sample data
const mockBudgetDepartmentData: BudgetDepartment[] = [
  {
    id: '1',
    name: 'Engineering',
    positionCategories: [
      { designationName: 'Software Engineer', count: 5 },
      { designationName: 'Senior Engineer', count: 2 }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    deletedBy: null,
    createdAt: '2025-05-01T00:00:00.000Z',
    updatedAt: '2025-05-01T00:00:00.000Z',
    deletedAt: null
  },
  {
    id: '2',
    name: 'Marketing',
    positionCategories: [{ designationName: 'Marketing Manager', count: 3 }],
    createdBy: 'admin',
    updatedBy: 'admin',
    deletedBy: null,
    createdAt: '2025-05-01T00:00:00.000Z',
    updatedAt: '2025-05-01T00:00:00.000Z',
    deletedAt: null
  }
]

const initialState = {
  budgetManagementReducer: {
    fetchBudgetDepartmentData: { data: mockBudgetDepartmentData, totalCount: 2 },
    fetchBudgetDepartmentTotal: 2,
    fetchBudgetDepartmentLoading: false,
    fetchBudgetDepartmentFailureMessage: ''
  }
}

describe('Department Component', () => {
  let store: any
  let push: jest.Mock

  beforeEach(() => {
    store = mockStore(initialState)
    store.clearActions()
    push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })
  })

  it('renders loading state correctly', () => {
    store = mockStore({
      budgetManagementReducer: {
        ...initialState.budgetManagementReducer,
        fetchBudgetDepartmentLoading: true
      }
    })

    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch departments'

    store = mockStore({
      budgetManagementReducer: {
        ...initialState.budgetManagementReducer,
        fetchBudgetDepartmentFailureMessage: errorMessage
      }
    })

    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('renders DynamicTable with data correctly', () => {
    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    const table = screen.getByTestId('dynamic-table')

    expect(table).toBeInTheDocument()
    expect(screen.getByText('Department Budget List')).toBeInTheDocument()
    expect(screen.getByText('Total Count: 2')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer (5), Senior Engineer (2)')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
    expect(screen.getByText('Marketing Manager (3)')).toBeInTheDocument()
  })

  it('dispatches fetchBudgetDepartment on mount', async () => {
    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    await waitFor(() => {
      const actions = store.getActions()

      expect(actions).toContainEqual(
        fetchBudgetDepartment({
          page: 1,
          limit: 10
        })
      )
    })
  })

  it('dispatches fetchBudgetDepartment when pagination changes', async () => {
    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    fireEvent.click(screen.getByTestId('next-page'))

    await waitFor(() => {
      const actions = store.getActions()

      expect(actions).toContainEqual(
        fetchBudgetDepartment({
          page: 2,
          limit: 10
        })
      )
    })
  })

  it('dispatches fetchBudgetDepartment when page size changes', async () => {
    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    fireEvent.click(screen.getByTestId('change-page-size'))

    await waitFor(() => {
      const actions = store.getActions()

      expect(actions).toContainEqual(
        fetchBudgetDepartment({
          page: 1,
          limit: 20
        })
      )
    })
  })

  it('navigates to department details on action button click', () => {
    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    const actionButton = screen.getByTestId('action-button-1')

    fireEvent.click(actionButton)

    expect(push).toHaveBeenCalledWith('/budget-management/department/1')
  })

  it('defines columns correctly', () => {
    render(
      <Provider store={store}>
        <Department />
      </Provider>
    )

    const row = screen.getByTestId('row-0')

    expect(row).toHaveTextContent('Engineering')
    expect(row).toHaveTextContent('Software Engineer (5), Senior Engineer (2)')
  })
})
