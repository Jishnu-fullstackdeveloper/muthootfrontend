import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { useFormik } from 'formik'

import GeneratedAddVacancyForm from '../addVacancy'

// Mock useFormik
jest.mock('formik', () => ({
  useFormik: jest.fn()
}))

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
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders form with all sections', () => {
    render(<GeneratedAddVacancyForm mode='add' id='1' />)

    expect(screen.getByText('Vacancy Management Form')).toBeInTheDocument()
    expect(screen.getByText('Basic Details')).toBeInTheDocument()
    expect(screen.getByText('Job Location')).toBeInTheDocument()
    expect(screen.getByText('Qualification Needed')).toBeInTheDocument()
    expect(screen.getByText('Salary Details')).toBeInTheDocument()
    expect(screen.getByText('Application Details')).toBeInTheDocument()
  })

  it('displays stepper with all steps', () => {
    render(<GeneratedAddVacancyForm mode='add' id='1' />)

    expect(screen.getByText('Basic Details')).toBeInTheDocument()
    expect(screen.getByText('Job Location')).toBeInTheDocument()
    expect(screen.getByText('Qualification Needed')).toBeInTheDocument()
    expect(screen.getByText('Salary Details')).toBeInTheDocument()
    expect(screen.getByText('Application Details')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    render(<GeneratedAddVacancyForm mode='add' id='1' />)
    const submitButton = screen.getByText('Add')

    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it('resets form when reset button is clicked', () => {
    const mockResetForm = jest.fn()

    ;(useFormik as jest.Mock).mockReturnValue({
      ...initialValues,
      values: { ...initialValues, vacancyTitle: 'Test' },
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: mockResetForm
    })

    render(<GeneratedAddVacancyForm mode='add' id='1' />)
    const resetButton = screen.getByText('Reset Form')

    fireEvent.click(resetButton)
    expect(mockResetForm).toHaveBeenCalledWith({
      values: initialValues
    })
  })

  it('updates step based on form values', async () => {
    ;(useFormik as jest.Mock).mockReturnValue({
      values: {
        ...initialValues,
        vacancyTitle: 'Test',
        jobType: 'Full-time',
        jobDescription: 'Test desc',
        numberOfOpenings: '2',
        branch: 'Main',
        city: 'NY',
        stateOrRegion: 'NY',
        country: 'USA',
        educationalQualification: 'BS',
        experienceInYears: '2',
        skillsNeeded: 'React',
        salaryRange: '50k-60k',
        additionalBenefits: 'Health',
        vacancyStartDate: new Date('2025-01-01'),
        vacancyEndDate: new Date('2025-12-31'),
        contactPerson: 'John',
        vacancyStatus: 'Open'
      },
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: jest.fn()
    })

    render(<GeneratedAddVacancyForm mode='add' id='1' />)
    await waitFor(() => {
      expect(screen.getByText('Application Details')).toBeInTheDocument()
    })
  })

  it('handles date picker changes', () => {
    const mockSetFieldValue = jest.fn()

    ;(useFormik as jest.Mock).mockReturnValue({
      ...initialValues,
      values: initialValues,
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: mockSetFieldValue,
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      resetForm: jest.fn()
    })

    render(<GeneratedAddVacancyForm mode='add' id='1' />)
    const startDateInput = screen.getAllByPlaceholderText('dd-mm-yyyy')[0]

    fireEvent.change(startDateInput, { target: { value: '2025-01-01T00:00:00.000Z' } })
    expect(mockSetFieldValue).toHaveBeenCalledWith('vacancyStartDate', expect.any(Date))
  })

  it('displays validation errors', async () => {
    ;(useFormik as jest.Mock).mockReturnValue({
      ...initialValues,
      values: initialValues,
      handleChange: jest.fn(),
      handleSubmit: mockSubmit,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: { vacancyTitle: true },
      errors: { vacancyTitle: 'Vacancy Title is required' },
      resetForm: jest.fn()
    })

    render(<GeneratedAddVacancyForm mode='add' id='1' />)
    expect(screen.getByText('Vacancy Title is required')).toBeInTheDocument()
  })
})
