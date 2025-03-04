import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import CandidateListingTableView from '../VacancyCandidateTable' // Adjust path

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}))

jest.mock('@/components/Table/dynamicTable', () => ({
  __esModule: true,
  default: ({ columns, data, pagination, onPageChange, onRowsPerPageChange }) => (
    <div data-testid='dynamic-table'>
      {data.map(candidate => (
        <div key={candidate.id}>
          <span>{candidate.name}</span>
          <span>{candidate.appliedPost}</span>
          <span>{candidate.email}</span>
          <span>{candidate.phoneNumber}</span>
          <span>{candidate.experience} years</span>
          <span>{candidate.atsScore}%</span>
          <button
            data-testid={`view-${candidate.id}`}
            onClick={() =>
              columns
                .find(col => col.id === 'action')
                ?.cell({ row: { original: candidate } })
                .props.children[0].props.onClick()
            }
          >
            View
          </button>
          <button
            data-testid={`shortlist-${candidate.id}`}
            onClick={() =>
              columns
                .find(col => col.id === 'action')
                ?.cell({ row: { original: candidate } })
                .props.children[1].props.onClick()
            }
          >
            Shortlist
          </button>
          <button
            data-testid={`reject-${candidate.id}`}
            onClick={() =>
              columns
                .find(col => col.id === 'action')
                ?.cell({ row: { original: candidate } })
                .props.children[2].props.onClick()
            }
          >
            Reject
          </button>
        </div>
      ))}
      <button data-testid='next-page' onClick={() => onPageChange(pagination.pageIndex + 1)}>
        Next
      </button>
      <button data-testid='change-size' onClick={() => onRowsPerPageChange(10)}>
        Change Size
      </button>
    </div>
  )
}))

jest.mock('@/@core/components/dialogs/Delete_confirmation_Dialog', () => ({
  __esModule: true,
  default: ({ open, onClose, onConfirm, id }) =>
    open ? (
      <div data-testid='confirm-modal'>
        <button data-testid='modal-close' onClick={onClose}>
          Close
        </button>
        <button data-testid='modal-confirm' onClick={() => onConfirm(id)}>
          Confirm
        </button>
      </div>
    ) : null
}))

// Mock console.log
global.console.log = jest.fn()

describe('CandidateListingTableView', () => {
  const mockRouterPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush })
  })

  it('renders initial UI with DynamicTable', () => {
    const { container } = render(<CandidateListingTableView />)

    expect(container).toBeInTheDocument()
    expect(screen.getByTestId('dynamic-table')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument() // Sample data renders
  })

  it('displays candidate data in table', () => {
    render(<CandidateListingTableView />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('123-456-7890')).toBeInTheDocument()
    expect(screen.getByText('3 years')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('navigates to view candidate page when View button is clicked', () => {
    render(<CandidateListingTableView />)
    const viewButton = screen.getByTestId('view-1')

    fireEvent.click(viewButton)
    expect(mockRouterPush).toHaveBeenCalledWith('/candidate/view/1')
  })

  it('logs shortlist action when Shortlist button is clicked', () => {
    render(<CandidateListingTableView />)
    const shortlistButton = screen.getByTestId('shortlist-1')

    fireEvent.click(shortlistButton)
    expect(console.log).toHaveBeenCalledWith('Shortlisting candidate:', 1)
  })

  it('opens ConfirmModal when Reject button is clicked', () => {
    render(<CandidateListingTableView />)
    const rejectButton = screen.getByTestId('reject-1')

    fireEvent.click(rejectButton)
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
  })

  it('closes ConfirmModal when Close button is clicked', () => {
    render(<CandidateListingTableView />)
    const rejectButton = screen.getByTestId('reject-1')

    fireEvent.click(rejectButton)
    const closeButton = screen.getByTestId('modal-close')

    fireEvent.click(closeButton)
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
  })

  it('confirms deletion and logs rejection when Confirm button is clicked', () => {
    render(<CandidateListingTableView />)
    const rejectButton = screen.getByTestId('reject-1')

    fireEvent.click(rejectButton)
    const confirmButton = screen.getByTestId('modal-confirm')

    fireEvent.click(confirmButton)
    expect(console.log).toHaveBeenCalledWith('Rejecting candidate with ID:', 1)
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
  })

  it('updates pagination state when page changes', async () => {
    render(<CandidateListingTableView />)
    const nextPageButton = screen.getByTestId('next-page')

    fireEvent.click(nextPageButton)
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Page Index:', 1)
      expect(console.log).toHaveBeenCalledWith('Page Size:', 5)
    })
  })

  it('updates pagination state when rows per page changes', async () => {
    render(<CandidateListingTableView />)
    const changeSizeButton = screen.getByTestId('change-size')

    fireEvent.click(changeSizeButton)
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Page Index:', 0)
      expect(console.log).toHaveBeenCalledWith('Page Size:', 10)
    })
  })
})
