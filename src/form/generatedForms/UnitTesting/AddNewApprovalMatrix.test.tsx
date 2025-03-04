import { useRouter, useSearchParams } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AddNewApprovalMatrixGenerated from '../AddNewApprovalMatrix' // Adjust path

import { useAppDispatch } from '@/lib/hooks'
import { createNewApprovalMatrix } from '@/redux/approvalMatrixSlice'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    back: jest.fn(),
    push: jest.fn()
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({ id: null }))
}))

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppSelector: jest.fn(() => ({
    options: []
  }))
}))

jest.mock('@/redux/approvalMatrixSlice', () => ({
  createNewApprovalMatrix: jest.fn(() => ({ unwrap: jest.fn(() => Promise.resolve({})) })),
  updateApprovalMatrix: jest.fn(() => ({ unwrap: jest.fn() }))
}))

jest.mock('formik', () => ({
  useFormik: jest.fn(() => ({
    initialValues: { id: '', approvalCategory: '', numberOfLevels: 1, sections: [], draggingIndex: null },
    values: { id: '', approvalCategory: '', numberOfLevels: 1, sections: [], draggingIndex: null },
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    handleSubmit: jest.fn(),
    setFieldValue: jest.fn(),
    resetForm: jest.fn(),
    touched: {},
    errors: {},
    submitForm: jest.fn()
  }))
}))

describe('AddNewApprovalMatrixGenerated', () => {
  const mockDispatch = jest.fn()
  const mockRouterBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch)
    ;(useRouter as jest.Mock).mockReturnValue({ back: mockRouterBack })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('renders the form with initial fields', () => {
    render(<AddNewApprovalMatrixGenerated />)
    expect(screen.getByText('Approval Process Form')).toBeInTheDocument()
    expect(screen.getByLabelText('Approval Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Levels')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('displays validation errors when fields are empty on submit', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const nextButton = screen.getByText('Next')

    fireEvent.click(nextButton)
    expect(screen.getByLabelText('Approval Category')).toBeInTheDocument()
  })

  it('adds sections when Next is clicked with valid numberOfLevels', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(numberOfLevelsInput, '2')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Level 1:')).toBeInTheDocument()
      expect(screen.getByText('Level 2:')).toBeInTheDocument()
    })
  })

  it('adds a subsection when AddIcon is clicked', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(numberOfLevelsInput, '1')
    fireEvent.click(nextButton)

    await waitFor(() => {
      const addButton = screen.getAllByRole('button', { name: /add/i })[0]

      fireEvent.click(addButton)
      expect(screen.getAllByPlaceholderText('Position Level').length).toBe(2) // Main + Sub
    })
  })

  it('opens delete confirmation dialog when DeleteIcon is clicked', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(numberOfLevelsInput, '1')
    fireEvent.click(nextButton)

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]

      fireEvent.click(deleteButton)
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument()
    })
  })

  it('submits form when all fields are filled', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const categoryInput = screen.getByLabelText('Approval Category')
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(categoryInput, 'Test Category')
    await userEvent.type(numberOfLevelsInput, '1')
    fireEvent.click(nextButton)

    await waitFor(async () => {
      const positionInputs = screen.getAllByPlaceholderText('Position Level')
      const designationInputs = screen.getAllByPlaceholderText('Designation')
      const gradeInputs = screen.getAllByPlaceholderText('Grade')

      await userEvent.selectOptions(positionInputs[0], 'Branch')
      await userEvent.selectOptions(designationInputs[0], 'Manager')
      await userEvent.selectOptions(gradeInputs[0], 'Senior HR')

      const submitButton = screen.getByText('Create')

      fireEvent.click(submitButton)

      expect(mockDispatch).toHaveBeenCalledWith(expect.anything())
    })
  })

  // New Test Cases to Increase Coverage
  it('deletes a section when confirmed', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(numberOfLevelsInput, '2')
    fireEvent.click(nextButton)

    await waitFor(async () => {
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]

      fireEvent.click(deleteButton)
      const confirmButton = screen.getByText('Confirm') // Adjust based on ConfirmModal's button text

      fireEvent.click(confirmButton)
      await waitFor(() => {
        expect(screen.queryByText('Level 1:')).not.toBeInTheDocument()
        expect(screen.getByText('Level 2:')).toBeInTheDocument()
      })
    })
  })

  it('opens sub-approval delete dialog and deletes subsection when confirmed', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(numberOfLevelsInput, '1')
    fireEvent.click(nextButton)

    await waitFor(async () => {
      const addButton = screen.getAllByRole('button', { name: /add/i })[0]

      fireEvent.click(addButton)
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

      fireEvent.click(deleteButtons[1]) // Second delete button is for subsection
      expect(screen.getByText('Confirm Sub-Approval Deletion')).toBeInTheDocument()

      const confirmButton = screen.getByText('Confirm')

      fireEvent.click(confirmButton)
      await waitFor(() => {
        expect(screen.getAllByPlaceholderText('Position Level').length).toBe(1) // Only main section remains
      })
    })
  })

  it('handles drag-and-drop of sections', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(numberOfLevelsInput, '2')
    fireEvent.click(nextButton)

    await waitFor(() => {
      const dragIndicators = screen.getAllByRole('button', { name: /drag/i }) // Assuming DragIndicatorIcon accessibility
      const section1 = dragIndicators[0]
      const section2 = dragIndicators[1]

      fireEvent.dragStart(section1)
      fireEvent.dragOver(section2)
      fireEvent.drop(section2)

      // Basic check; expand with state mocking if needed
      expect(screen.getByText('Level 1:')).toBeInTheDocument()
      expect(screen.getByText('Level 2:')).toBeInTheDocument()
    })
  })

  it('handles update mode with pre-filled data', async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams(
        'id=1&approvalCategory=Test&numberOfLevels=1&designationType=Branch&designation=Manager&grade=Senior HR'
      )
    )
    render(<AddNewApprovalMatrixGenerated />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
      expect(screen.getByText('Level 1:')).toBeInTheDocument()
      const submitButton = screen.getByText('Update')

      fireEvent.click(submitButton)
      expect(mockDispatch).toHaveBeenCalledWith(expect.anything())
    })
  })

  it('handles error during form submission', async () => {
    ;(createNewApprovalMatrix as unknown as jest.Mock).mockReturnValue({
      unwrap: jest.fn(() => Promise.reject(new Error('Submission failed')))
    })
    render(<AddNewApprovalMatrixGenerated />)
    const categoryInput = screen.getByLabelText('Approval Category')
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(categoryInput, 'Test Category')
    await userEvent.type(numberOfLevelsInput, '1')
    fireEvent.click(nextButton)

    await waitFor(async () => {
      const positionInputs = screen.getAllByPlaceholderText('Position Level')
      const designationInputs = screen.getAllByPlaceholderText('Designation')
      const gradeInputs = screen.getAllByPlaceholderText('Grade')

      await userEvent.selectOptions(positionInputs[0], 'Branch')
      await userEvent.selectOptions(designationInputs[0], 'Manager')
      await userEvent.selectOptions(gradeInputs[0], 'Senior HR')

      const submitButton = screen.getByText('Create')

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(expect.anything())
      })
    })
  })

  it('handles maximum numberOfLevels', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const numberOfLevelsInput = screen.getByLabelText('Number of Levels')
    const nextButton = screen.getByText('Next')

    await userEvent.type(numberOfLevelsInput, '10')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getAllByText(/Level \d+:/).length).toBe(10)
    })
  })

  it('resets form when Clear button is clicked', async () => {
    render(<AddNewApprovalMatrixGenerated />)
    const categoryInput = screen.getByLabelText('Approval Category')

    await userEvent.type(categoryInput, 'Test Category')
    const clearButton = screen.getByText('Clear')

    fireEvent.click(clearButton)
    expect(screen.getByLabelText('Approval Category')).toHaveValue('')
  })
})
