import React from 'react'

import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useFormik } from 'formik'

import AddNewJdSample from '../addNewJdSample' // Adjust path as needed

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('formik', () => ({
  useFormik: jest.fn()
}))

jest.mock('react-quill', () => {
  const MockQuill = ({ value, onChange }) => (
    <textarea value={value} onChange={e => onChange(e.target.value)} data-testid='react-quill' />
  )

  return MockQuill
})

jest.mock('@/utils/functions', () => ({
  getJDManagementAddFormValues: jest.fn(() => null),
  removeJDManagementAddFormValues: jest.fn(),
  setJDManagementAddFormValues: jest.fn()
}))

describe('AddNewJdSample', () => {
  const mockPush = jest.fn()
  const mockHandleSubmit = jest.fn()
  const mockHandleChange = jest.fn()
  const mockSetFieldValue = jest.fn()
  const mockResetForm = jest.fn()

  const mockFormik = {
    initialValues: {
      roleTitle: '',
      reportingTo: '',
      companyName: '',
      functionOrDepartment: '',
      writtenBy: '',
      roleSummary: '',
      keyResponsibilities: [{ title: '', description: '' }],
      keyChallenges: '',
      keyDecisions: '',
      internalStakeholders: '',
      externalStakeholders: '',
      skillsAndAttributesType: 'description_only',
      skillsAndAttributesDetails: [
        {
          factor: '',
          competency: [{ value: '' }],
          definition: [{ value: '' }],
          behavioural_attributes: [{ value: '' }]
        }
      ],
      minimumQualification: '',
      experienceDescription: '',
      portfolioSize: '',
      geographicalCoverage: '',
      teamSize: '',
      totalTeamSize: '',
      skillsAndAttributesTypeDescriptionOnly: ''
    },
    values: {
      roleTitle: '',
      reportingTo: '',
      companyName: '',
      functionOrDepartment: '',
      writtenBy: '',
      roleSummary: '',
      keyResponsibilities: [{ title: '', description: '' }],
      keyChallenges: '',
      keyDecisions: '',
      internalStakeholders: '',
      externalStakeholders: '',
      skillsAndAttributesType: 'description_only',
      skillsAndAttributesDetails: [
        {
          factor: '',
          competency: [{ value: '' }],
          definition: [{ value: '' }],
          behavioural_attributes: [{ value: '' }]
        }
      ],
      minimumQualification: '',
      experienceDescription: '',
      portfolioSize: '',
      geographicalCoverage: '',
      teamSize: '',
      totalTeamSize: '',
      skillsAndAttributesTypeDescriptionOnly: ''
    },
    touched: {},
    errors: {},
    handleSubmit: mockHandleSubmit,
    handleChange: mockHandleChange,
    setFieldValue: mockSetFieldValue,
    resetForm: mockResetForm
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useFormik as jest.Mock).mockReturnValue(mockFormik)
    jest.clearAllMocks()
  })

  it('renders the form correctly', () => {
    render(<AddNewJdSample mode='add' id={null} />)
    expect(screen.getByText('Add Job Description')).toBeInTheDocument()
    expect(screen.getByText('Job Roles')).toBeInTheDocument()
    expect(screen.getByLabelText('Role Title *')).toBeInTheDocument()
  })

  it('displays validation errors when fields are touched and invalid', async () => {
    const errors = {
      roleTitle: 'Role Title is required',
      reportingTo: 'Reporting To is required'
    }

    ;(useFormik as jest.Mock).mockReturnValue({
      ...mockFormik,
      touched: { roleTitle: true, reportingTo: true },
      errors
    })

    render(<AddNewJdSample mode='add' id={null} />)
    expect(screen.getByText('Role Title is required')).toBeInTheDocument()
    expect(screen.getByText('Reporting To is required')).toBeInTheDocument()
  })

  it('adds a new key responsibility', () => {
    render(<AddNewJdSample mode='add' id={null} />)
    const addButton = screen.getByText('Add More')

    fireEvent.click(addButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('keyResponsibilities', [
      { title: '', description: '' },
      { title: '', description: '' }
    ])
  })

  it('removes a key responsibility', () => {
    ;(useFormik as jest.Mock).mockReturnValue({
      ...mockFormik,
      values: {
        ...mockFormik.values,
        keyResponsibilities: [
          { title: 'Title 1', description: 'Desc 1' },
          { title: 'Title 2', description: 'Desc 2' }
        ]
      }
    })

    render(<AddNewJdSample mode='add' id={null} />)
    const deleteButtons = screen.getAllByLabelText('delete')

    fireEvent.click(deleteButtons[0])
    expect(mockSetFieldValue).toHaveBeenCalledWith('keyResponsibilities', [{ title: 'Title 2', description: 'Desc 2' }])
  })

  it('updates stepper based on form completion', async () => {
    ;(useFormik as jest.Mock).mockReturnValue({
      ...mockFormik,
      values: {
        ...mockFormik.values,
        roleTitle: 'Manager',
        reportingTo: 'CEO',
        companyName: 'Corp',
        functionOrDepartment: 'HR',
        writtenBy: 'John',
        roleSummary: 'Summary'
      }
    })

    render(<AddNewJdSample mode='add' id={null} />)
    await waitFor(() => {
      expect(screen.getByText('Summary')).toHaveAttribute('aria-current', 'step')
    })
  })

  it('handles form submission', () => {
    render(<AddNewJdSample mode='add' id={null} />)
    const submitButton = screen.getByText('Create Request')

    fireEvent.click(submitButton)
    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it('resets the form', () => {
    render(<AddNewJdSample mode='add' id={null} />)
    const resetButton = screen.getByText('Reset Form')

    fireEvent.click(resetButton)
    expect(mockResetForm).toHaveBeenCalled()
  })

  it('navigates back to jd-management', () => {
    render(<AddNewJdSample mode='add' id={null} />)
    const backButton = screen.getByText('Back to jd List')

    fireEvent.click(backButton)
    expect(mockPush).toHaveBeenCalledWith('/jd-management')
  })

  it('toggles between skills and attributes types', () => {
    render(<AddNewJdSample mode='add' id={null} />)
    const select = screen.getByLabelText('Select type')

    fireEvent.change(select, { target: { value: 'in_detail' } })
    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('adds a new skills and attributes section', () => {
    ;(useFormik as jest.Mock).mockReturnValue({
      ...mockFormik,
      values: { ...mockFormik.values, skillsAndAttributesType: 'in_detail' }
    })

    render(<AddNewJdSample mode='add' id={null} />)
    const addSectionButton = screen.getByText('Add Section')

    fireEvent.click(addSectionButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('skillsAndAttributesDetails', expect.any(Array))
  })
})
