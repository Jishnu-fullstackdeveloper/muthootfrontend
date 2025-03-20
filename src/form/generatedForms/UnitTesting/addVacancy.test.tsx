import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useFormik } from 'formik'

import GeneratedAddVacancyForm from '../addVacancy' // Adjust the import path
import {
  setVacancyManagementAddFormValues,
  getVacancyManagementAddFormValues,
  removeVacancyManagementAddFormValues
} from '@/utils/functions'

// Mock dependencies
jest.mock('formik', () => ({
  useFormik: jest.fn()
}))
jest.mock('@/utils/functions', () => ({
  getVacancyManagementAddFormValues: jest.fn(),
  setVacancyManagementAddFormValues: jest.fn(),
  removeVacancyManagementAddFormValues: jest.fn()
}))
jest.mock('react-datepicker', () => ({ date, onChange, ...props }) => (
  <input
    data-testid={props['data-testid'] || 'datepicker'} // Use provided data-testid or default
    value={date ? date.toISOString() : ''}
    onChange={e => onChange(new Date(e.target.value))}
  />
))

describe('GeneratedAddVacancyForm', () => {
  const mockSubmit = jest.fn()

  const initialValues = {
    vacancyTitle: '',
    jobType: '',
    jobDescription: '',
    numberOfOpenings: '',
    branch: '',
    city: '',
    stateOrRegion: '',
    country: '',
    educationalQualification: '',
    experienceInYears: '',
    skillsNeeded: '',
    salaryRange: '',
    additionalBenefits: '',
    vacancyStartDate: '',
    vacancyEndDate: '',
    contactPerson: '',
    vacancyStatus: ''
  }

  beforeEach(() => {
    ;(useFormik as jest.Mock).mockReturnValue({
      values: initialValues,
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: jest.fn()
    })
    ;(getVacancyManagementAddFormValues as jest.Mock).mockReturnValue(null)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the form with stepper and fields', () => {
    render(<GeneratedAddVacancyForm mode='add' id={undefined} />)
    expect(screen.getByText('Vacancy Management Form')).toBeInTheDocument()

    // Use getAllByText and check the first occurrence or adjust based on context
    const basicDetailsElements = screen.getAllByText('Basic Details')

    expect(basicDetailsElements[0]).toBeInTheDocument() // Check the first "Basic Details"
    expect(screen.getByLabelText('Vacancy Title *')).toBeInTheDocument()
    const jobLocationElements = screen.getAllByText('Job Location')

    expect(jobLocationElements[0]).toBeInTheDocument()
    const qualificationElements = screen.getAllByText('Qualification Needed')

    expect(qualificationElements[0]).toBeInTheDocument()
    const salaryDetailsElements = screen.getAllByText('Salary Details')

    expect(salaryDetailsElements[0]).toBeInTheDocument()
    const applicationDetailsElements = screen.getAllByText('Application Details')

    expect(applicationDetailsElements[0]).toBeInTheDocument()
  })

  it('displays validation errors when fields are touched and empty', async () => {
    const mockFormik = {
      values: initialValues,
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: { vacancyTitle: true },
      errors: { vacancyTitle: 'Vacancy Title is required' },
      resetForm: jest.fn()
    }

    ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

    render(<GeneratedAddVacancyForm mode='add' id={undefined} />)
    fireEvent.focus(screen.getByLabelText('Vacancy Title *'))
    fireEvent.blur(screen.getByLabelText('Vacancy Title *'))

    await waitFor(() => {
      expect(screen.getByText('Vacancy Title is required')).toBeInTheDocument()
    })
  })

  it('updates stepper based on filled fields', async () => {
    const filledValues = {
      ...initialValues,
      vacancyTitle: 'Software Engineer',
      jobType: 'Full-time',
      jobDescription: 'Develop software',
      numberOfOpenings: '2'
    }

    ;(useFormik as jest.Mock).mockReturnValue({
      values: filledValues,
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: jest.fn()
    })

    render(<GeneratedAddVacancyForm mode='add' id={undefined} />)
    await waitFor(() => {
      // Find the stepper step for "Basic Details" and check if it has the "Mui-completed" class
      const basicDetailsStep = screen.getAllByText('Basic Details')[0].closest('.MuiStep-root')

      expect(basicDetailsStep).toHaveClass('Mui-completed') // Step 1 completed
    })
  })

  it('resets the form when reset button is clicked', () => {
    const mockResetForm = jest.fn()

    ;(useFormik as jest.Mock).mockReturnValue({
      values: { ...initialValues, vacancyTitle: 'Test' },
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: mockResetForm
    })

    render(<GeneratedAddVacancyForm mode='add' id={undefined} />)
    fireEvent.click(screen.getByText('Reset Form'))

    expect(mockResetForm).toHaveBeenCalledWith({
      values: initialValues
    })
    expect(removeVacancyManagementAddFormValues).toHaveBeenCalled()
  })

  it('submits the form with valid data', async () => {
    const validValues = {
      vacancyTitle: 'Software Engineer',
      jobType: 'Full-time',
      jobDescription: 'Develop software',
      numberOfOpenings: '2',
      branch: 'Tech',
      city: 'New York',
      stateOrRegion: 'NY',
      country: 'USA',
      educationalQualification: 'Bachelor’s',
      experienceInYears: '3',
      skillsNeeded: 'React, Node',
      salaryRange: '$80k-$100k',
      additionalBenefits: 'Health insurance',
      vacancyStartDate: new Date('2025-04-01'),
      vacancyEndDate: new Date('2025-06-01'),
      contactPerson: 'John Doe',
      vacancyStatus: 'Open'
    }

    ;(useFormik as jest.Mock).mockReturnValue({
      values: validValues,
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: jest.fn()
    })

    render(<GeneratedAddVacancyForm mode='add' id={undefined} />)
    fireEvent.click(screen.getByText('Add'))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
      expect(setVacancyManagementAddFormValues).toHaveBeenCalledWith(validValues)
    })
  })

  it('loads cached values in add mode', () => {
    const cachedValues = { vacancyTitle: 'Cached Title' }

    ;(getVacancyManagementAddFormValues as jest.Mock).mockReturnValue(cachedValues)

    // Override the default mock to use cached values
    ;(useFormik as jest.Mock).mockReturnValue({
      values: { ...initialValues, ...cachedValues }, // Merge cached values with initialValues
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: jest.fn()
    })

    render(<GeneratedAddVacancyForm mode='add' id={undefined} />)
    expect(screen.getByLabelText('Vacancy Title *')).toHaveValue('Cached Title')
  })

  it('handles date picker input correctly', async () => {
    const mockSetFieldValue = jest.fn()

    ;(useFormik as jest.Mock).mockReturnValue({
      values: initialValues,
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: mockSetFieldValue,
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: jest.fn()
    })

    render(<GeneratedAddVacancyForm mode='add' id={undefined} />)

    // Use getAllByTestId and select the first datepicker (assuming it's for start date)
    const datePickers = screen.getAllByTestId('datepicker')
    const startDateInput = datePickers[0] // Target the first datepicker for vacancyStartDate

    fireEvent.change(startDateInput, { target: { value: '2025-04-01T00:00:00Z' } })

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledWith('vacancyStartDate', expect.any(Date))
    })
  })
})
