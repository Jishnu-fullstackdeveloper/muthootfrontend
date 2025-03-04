import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import JobListingTableView from '../JobListingTable'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/components/Table/dynamicTable', () => ({
  __esModule: true,
  default: jest.fn(({ columns, data, onPageChange, onRowsPerPageChange }) => (
    <div data-testid='dynamic-table'>
      <table>
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.header}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id}>
              {columns.map((col: any) => (
                <td key={col.header}>{col.cell({ row })}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => onPageChange(1)}>Next Page</button>
      <button onClick={() => onRowsPerPageChange(10)}>Change Rows</button>
    </div>
  ))
}))

jest.mock('@/@core/components/dialogs/Delete_confirmation_Dialog', () => ({
  __esModule: true,
  default: jest.fn(({ open, onClose, onConfirm, id }) =>
    open ? (
      <div data-testid='confirm-modal'>
        <button onClick={() => onClose()}>Cancel</button>
        <button onClick={() => onConfirm(id)}>Confirm</button>
      </div>
    ) : null
  )
}))

describe('JobListingTableView Component', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  const sampleJobs = [
    {
      id: '1',
      title: 'Software Engineer',
      job_type: 'Full-time',
      job_role: 'Developer',
      experience: '1-3 years',
      education: "Bachelor's",
      skills: ['React', 'TypeScript'],
      salary_range: '$80k-$100k'
    },
    {
      id: '2',
      title: 'Product Manager',
      job_type: 'Part-time',
      job_role: 'Manager',
      experience: '5+ years',
      education: "Master's",
      skills: ['Agile', 'Leadership'],
      salary_range: '$120k-$150k'
    }
  ]

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.spyOn(console, 'log').mockImplementation(() => {}) // Suppress console.log
  })

  afterEach(() => {
    jest.clearAllMocks()
    ;(console.log as jest.Mock).mockRestore()
  })

  // Test 1: Renders the table with columns and data
  test('renders table with jobs data', () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    expect(screen.getByTestId('dynamic-table')).toBeInTheDocument()
    expect(screen.getByText('JOB TITLE')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('SALARY RANGE')).toBeInTheDocument()
    expect(screen.getByText('$80k-$100k')).toBeInTheDocument()
  })

  // Test 2: Handles page change
  test('updates pagination state on page change', () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    fireEvent.click(screen.getByText('Next Page'))
    expect(console.log).toHaveBeenCalledWith('Page Index:', 1)
    expect(console.log).toHaveBeenCalledWith('Page Size:', 5)
  })

  // Test 3: Handles rows per page change
  test('updates pagination state on rows per page change', () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    fireEvent.click(screen.getByText('Change Rows'))
    expect(console.log).toHaveBeenCalledWith('Page Index:', 0)
    expect(console.log).toHaveBeenCalledWith('Page Size:', 10)
  })

  // Test 4: Opens delete modal on delete button click
  test('opens delete modal when delete button is clicked', () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    const deleteButtons = screen.getAllByTitle('Delete')

    fireEvent.click(deleteButtons[0])
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
  })

  // Test 5: Confirms deletion
  test('confirms deletion and closes modal', async () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    fireEvent.click(screen.getAllByTitle('Delete')[0])
    fireEvent.click(screen.getByText('Confirm'))
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Deleting job with ID:', '1')
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
    })
  })

  // Test 6: Cancels deletion
  test('closes delete modal on cancel', async () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    fireEvent.click(screen.getAllByTitle('Delete')[0])
    fireEvent.click(screen.getByText('Cancel'))
    await waitFor(() => {
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
    })
  })

  // Test 7: Navigates to view page
  test('navigates to view page on view button click', () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    fireEvent.click(screen.getAllByTitle('View')[0])
    expect(mockPush).toHaveBeenCalledWith('/jd-management/view/1')
  })

  // Test 8: Navigates to edit page
  test('navigates to edit page on edit button click', () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    fireEvent.click(screen.getAllByTitle('Edit')[0])
    expect(mockPush).toHaveBeenCalledWith('/jd-management/edit/1')
  })

  // Test 9: Renders with empty jobs array
  test('renders table with no data when jobs array is empty', () => {
    render(<JobListingTableView jobs={[]} />)
    expect(screen.getByTestId('dynamic-table')).toBeInTheDocument()
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument()
  })

  // Test 10: Ensures all columns are rendered
  test('renders all column headers', () => {
    render(<JobListingTableView jobs={sampleJobs} />)
    const headers = ['JOB TITLE', 'JOB TYPE', 'JOB ROLE', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'SALARY RANGE', 'ACTION']

    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })
})
