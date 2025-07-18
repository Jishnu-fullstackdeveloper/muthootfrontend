'use client'
import React, { useEffect } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  FormControl,
  MenuItem,
  Card,
  Stepper,
  StepLabel,
  Step,
  StepConnector,
  Typography,
  IconButton
} from '@mui/material'
import ReactDatePicker from 'react-datepicker'
import { CalendarToday } from '@mui/icons-material'

import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicButton from '@/components/Button/dynamicButton'
import {
  getVacancyManagementAddFormValues,
  removeVacancyManagementAddFormValues,
  setVacancyManagementAddFormValues
} from '@/utils/functions'
import type { Props, VacancyFormValues } from '@/types/vacancy'

const validationSchema = Yup.object().shape({
  vacancyTitle: Yup.string().required('Vacancy Title is required'),
  jobType: Yup.string().required('Job Type is required'),
  jobDescription: Yup.string().required('Job Description is required'),
  numberOfOpenings: Yup.string().required('Number of Openings is required'),
  branch: Yup.string().required('Branch is required'),
  city: Yup.string().required('City is required'),
  stateOrRegion: Yup.string().required('State/Region is required'),
  country: Yup.string().required('Country is required'),
  educationalQualification: Yup.string().required('Educational Qualification is required'),
  experienceInYears: Yup.string().required('Experience (in years) is required'),
  skillsNeeded: Yup.string().required('Skills Needed is required'),
  salaryRange: Yup.string().required('Salary range is required'),
  additionalBenefits: Yup.string().required('Additional benefits is required'),
  vacancyStartDate: Yup.string().required('Vacancy Start Date is required'),
  vacancyEndDate: Yup.string()
    .required('Vacancy End Date is required')
    .test('is-greater', 'Vacancy End Date must be greater than Vacancy Start Date', function (value) {
      const { vacancyStartDate } = this.parent

      return value && vacancyStartDate && new Date(value) > new Date(vacancyStartDate)
    }),
  contactPerson: Yup.string().required('Contact Person is required'),
  vacancyStatus: Yup.string().required('Vacancy Status is required')
})

const GeneratedAddVacancyForm: React.FC<Props> = ({ mode, id }) => {
  id // eslint-disable-next-line import/no-named-as-default-member

  // eslint-disable-next-line import/no-named-as-default-member
  const [activeStep, setActiveStep] = React.useState(0),
    steps = ['Basic Details', 'Job Location', 'Qualification Needed', 'Salary Details', 'Application Details'],
    formikValuesFromCache = getVacancyManagementAddFormValues()

  const VacancyFormik: any = useFormik<VacancyFormValues>({
    initialValues:
      formikValuesFromCache && mode === 'add'
        ? formikValuesFromCache
        : {
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
          },
    validationSchema,
    onSubmit: values => console.log('Form Submitted:', values)
  })

  const handleResetForm = () => {
    setActiveStep(0)
    removeVacancyManagementAddFormValues()
    VacancyFormik.resetForm({
      values: {
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
    })
  }

  useEffect(() => {
    let completedSteps = 0

    const {
      vacancyTitle,
      jobType,
      jobDescription,
      numberOfOpenings,
      branch,
      city,
      stateOrRegion,
      country,
      educationalQualification,
      experienceInYears,
      skillsNeeded,
      salaryRange,
      additionalBenefits,
      vacancyStartDate,
      vacancyEndDate,
      contactPerson,
      vacancyStatus
    } = VacancyFormik.values

    // Step 1: Basic fields
    if (vacancyTitle && jobType && jobDescription && numberOfOpenings) completedSteps = 1

    // Step 2: Role summary
    if (completedSteps >= 1 && branch && city && stateOrRegion && country) completedSteps = 2

    // Step 3: Key responsibilities
    if (completedSteps >= 2 && educationalQualification && experienceInYears && skillsNeeded) completedSteps = 3

    // Step 4: Key challenges
    if (completedSteps >= 3 && salaryRange && additionalBenefits) completedSteps = 4

    // Step 5: Key decisions
    if (completedSteps >= 4 && vacancyStartDate && vacancyEndDate && contactPerson && vacancyStatus) completedSteps = 5
    setActiveStep(completedSteps)
    setVacancyManagementAddFormValues(VacancyFormik.values)
  }, [VacancyFormik.values])

  const renderField = (
    id: string,
    label: string,
    type = 'text',
    multiline = false,
    rows?: number,
    options?: string[]
  ) => (
    <FormControl fullWidth margin='normal'>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label} *
      </label>
      {options ? (
        <DynamicSelect
          id={id}
          name={id}
          value={VacancyFormik.values[id]}
          onChange={VacancyFormik.handleChange}
          onFocus={() => VacancyFormik.setFieldTouched(id, true)}
          error={VacancyFormik.touched[id] && Boolean(VacancyFormik.errors[id])}
          helperText={VacancyFormik.touched[id] && VacancyFormik.errors[id] ? VacancyFormik.errors[id] : ''}
        >
          {options.map((opt, idx) => (
            <MenuItem key={idx} value={opt || ''}>
              {opt || `Select ${label}`}
            </MenuItem>
          ))}
        </DynamicSelect>
      ) : (
        <DynamicTextField
          id={id}
          name={id}
          type={type}
          multiline={multiline}
          rows={rows}
          value={VacancyFormik.values[id]}
          onChange={VacancyFormik.handleChange}
          onFocus={() => VacancyFormik.setFieldTouched(id, true)}
          error={VacancyFormik.touched[id] && Boolean(VacancyFormik.errors[id])}
          helperText={VacancyFormik.touched[id] && VacancyFormik.errors[id] ? VacancyFormik.errors[id] : undefined}
        />
      )}
    </FormControl>
  )

  const renderDatePicker = (id: string, label: string) => (
    <FormControl fullWidth margin='normal'>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label} *
      </label>
      <ReactDatePicker
        selected={VacancyFormik.values[id]}
        onChange={(date: Date | null) => VacancyFormik.setFieldValue(id, date)}
        dateFormat='dd-MM-yyyy'
        placeholderText='dd-mm-yyyy'
        wrapperClassName='datePickerWrapper'
        customInput={
          <DynamicTextField
            InputProps={{
              endAdornment: (
                <IconButton size='small'>
                  <CalendarToday />
                </IconButton>
              )
            }}
          />
        }
        popperPlacement='bottom-start'
      />
      {VacancyFormik.touched[id] && VacancyFormik.errors[id] && (
        <Typography style={{ color: 'red', fontSize: '0.8rem', marginLeft: 15 }}>{VacancyFormik.errors[id]}</Typography>
      )}
    </FormControl>
  )

  return (
    <>
      <Card
        sx={{
          mb: 4,
          pt: 3,
          pb: 3,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white' /* height: 'auto' */
        }}
      >
        <Stepper alternativeLabel activeStep={activeStep} connector={<StepConnector />}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel onClick={() => setActiveStep(index)} sx={{ cursor: 'pointer' }}>
                <Typography>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {/* Reset Filters */}
      </Card>
      <form onSubmit={VacancyFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>Vacancy Management Form</h1>
        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Basic Details</legend>
          <div className='grid grid-cols-2 gap-4'>
            {renderField('vacancyTitle', 'Vacancy Title')}
            {renderField('jobType', 'Job Type', 'text', false, undefined, [
              '',
              'Full-time',
              'Part-time',
              'Contract',
              'Internship'
            ])}
            {renderField('jobDescription', 'Job Description', 'text', true, 4)}
            {renderField('numberOfOpenings', 'Number of Openings', 'number')}
          </div>
        </fieldset>
        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Job Location</legend>
          <div className='grid grid-cols-2 gap-4'>
            {renderField('branch', 'Branch')}
            {renderField('city', 'City')}
            {renderField('stateOrRegion', 'State/Region')}
            {renderField('country', 'Country')}
          </div>
        </fieldset>
        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Qualification Needed</legend>
          <div className='grid grid-cols-2 gap-4'>
            {renderField('experienceInYears', 'Experience (in years)', 'number')}
            {renderField('educationalQualification', 'Educational Qualification', 'text', true, 4)}
            {/* {renderField('experienceInYears', 'Experience (in years)', 'number')} */}
            {renderField('skillsNeeded', 'Skills Needed', 'text', true, 4)}
          </div>
        </fieldset>
        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Salary Details</legend>
          <div className='grid grid-cols-2 gap-4'>
            {renderField('salaryRange', 'Salary Range')}
            {renderField('additionalBenefits', 'Additional Benefits', 'text', true, 4)}
          </div>
        </fieldset>
        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Application Details</legend>
          <div className='grid grid-cols-2 gap-4'>
            {renderField('contactPerson', 'Contact Person')}
            {renderField('vacancyStatus', 'Vacancy Status', 'text', false, undefined, [
              '',
              'Open',
              'Closed',
              'On Hold'
            ])}
            {renderDatePicker('vacancyStartDate', 'Vacancy Start Date')}
            {renderDatePicker('vacancyEndDate', 'Vacancy End Date')}
          </div>
        </fieldset>
        <div className='flex justify-end space-x-4'>
          <DynamicButton type='button' variant='outlined'>
            Cancel
          </DynamicButton>
          <DynamicButton type='button' variant='outlined' className='' onClick={handleResetForm}>
            Reset Form
          </DynamicButton>
          <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
            {mode === 'add' ? 'Add' : 'Update'}
          </DynamicButton>
        </div>
      </form>
    </>
  )
}

export default GeneratedAddVacancyForm
