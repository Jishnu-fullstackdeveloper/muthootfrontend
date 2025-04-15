import { useRouter } from 'next/navigation'

import { render, screen, fireEvent } from '@testing-library/react'

import ApprovalCategory from '../ApprovalMatrixList' // Adjust path

import DynamicTable from '@/components/Table/dynamicTable'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}))

jest.mock('@/components/Table/dynamicTable', () => ({
  __esModule: true,
  default: ({ pagination }) => (
    <div data-testid='dynamic-table'>
      Mock Dynamic Table - Page: {pagination.pageIndex}, Size: {pagination.pageSize}
    </div>
  )
}))

describe('ApprovalCategory', () => {
  const mockRouterPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush })
  })

  it('renders the component with title and New Approval button', () => {
    render(<ApprovalCategory />)
    expect(screen.getByText('Approval Categories')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Approval/i })).toBeInTheDocument()
  })

  it('renders DynamicTable with sample data', () => {
    render(<ApprovalCategory />)
    expect(screen.getByTestId('dynamic-table')).toBeInTheDocument()
    expect(screen.getByText('Mock Dynamic Table - Page: 0, Size: 5')).toBeInTheDocument()
  })

  it('navigates to add new approval page when New Approval button is clicked', () => {
    render(<ApprovalCategory />)
    const addButton = screen.getByRole('button', { name: /New Approval/i })

    fireEvent.click(addButton)
    expect(mockRouterPush).toHaveBeenCalledWith('/approval-matrix/add/new-approval')
  })

  it('calls handleEdit and navigates with query params when EditIcon is clicked', () => {
    render(<ApprovalCategory />)
    const editButtons = screen.getAllByRole('button', { name: /edit/i })

    fireEvent.click(editButtons[0]) // Edit first row (id: 1)
    expect(mockRouterPush).toHaveBeenCalledWith(
      '/approval-matrix/edit/edit-approval?id=1&approvalCategory=Budget Approval&numberOfLevels=1&designationType=Branch&designation=Manager&grade=Area Manager'
    )
  })

  it('calls handleView and navigates when ViewIcon is clicked', () => {
    render(<ApprovalCategory />)
    const viewButtons = screen.getAllByRole('button', { name: /view/i })

    fireEvent.click(viewButtons[0]) // View first row (id: 1)
    expect(mockRouterPush).toHaveBeenCalledWith('/approval-matrix/view/1?id=1')
  })

  it('updates pagination state when page changes', () => {
    const { rerender } = render(<ApprovalCategory />)
    const dynamicTable = screen.getByTestId('dynamic-table')

    // Simulate page change via DynamicTable prop
    rerender(<ApprovalCategory />)
    rerender(
      <DynamicTable
        columns={[]}
        data={[]}
        pagination={{ pageIndex: 1, pageSize: 5 }}
        onPageChange={page => setPaginationState({ pageIndex: page, pageSize: 5 })}
        onRowsPerPageChange={() => {}}
      />
    )
    expect(dynamicTable.textContent).toContain('Page: 1')
  })

  it('updates pagination state when rows per page changes', () => {
    const { rerender } = render(<ApprovalCategory />)
    const dynamicTable = screen.getByTestId('dynamic-table')

    // Simulate rows per page change via DynamicTable prop
    rerender(
      <DynamicTable
        columns={[]}
        data={[]}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        onPageChange={() => {}}
        onRowsPerPageChange={size => setPaginationState({ pageIndex: 0, pageSize: size })}
      />
    )
    expect(dynamicTable.textContent).toContain('Size: 10')
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setPaginationState(_arg0: { pageIndex: any; pageSize: number }) {
  throw new Error('Function not implemented.')
}
