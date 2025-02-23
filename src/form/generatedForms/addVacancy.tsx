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

type Props = {
  mode: any
  id: any
}

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
  id
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = ['Basic Details', 'Job Location', 'Qualification Needed', 'Salary Details', 'Application Details']
  const formikValuesFromCache = getVacancyManagementAddFormValues()

  const VacancyFormik: any = useFormik({
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
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
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
    if (vacancyTitle && jobType && jobDescription && numberOfOpenings) {
      completedSteps = 1
    }

    // Step 2: Role summary
    if (completedSteps >= 1 && branch && city && stateOrRegion && country) {
      completedSteps = 2
    }

    // Step 3: Key responsibilities
    if (completedSteps >= 2 && educationalQualification && experienceInYears && skillsNeeded) {
      completedSteps = 3
    }

    // Step 4: Key challenges
    if (completedSteps >= 3 && salaryRange && additionalBenefits) {
      completedSteps = 4
    }

    // Step 5: Key decisions
    if (completedSteps >= 4 && vacancyStartDate && vacancyEndDate && contactPerson && vacancyStatus) {
      completedSteps = 5
    }

    setActiveStep(completedSteps)
    setVacancyManagementAddFormValues(VacancyFormik.values)
  }, [VacancyFormik.values])

  return (
    <>
      <Card
        sx={{
          mb: 4,
          pt: 3,
          pb: 3,
          position: 'sticky',
          top: 70, // Sticks the card at the top of the viewport
          zIndex: 10, // Ensures it stays above other elements
          backgroundColor: 'white'

          // height: 'auto'
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
            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='vacancyTitle' className='block text-sm font-medium text-gray-700'>
                  Vacancy Title *
                </label>
                <DynamicTextField
                  id='vacancyTitle'
                  name='vacancyTitle'
                  type='text'
                  value={VacancyFormik.values.vacancyTitle}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('vacancyTitle', true)}
                  error={VacancyFormik.touched.vacancyTitle && Boolean(VacancyFormik.errors.vacancyTitle)}
                  helperText={
                    VacancyFormik.touched.vacancyTitle && VacancyFormik.errors.vacancyTitle
                      ? VacancyFormik.errors.vacancyTitle
                      : undefined
                  }
                />
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='jobType' className='block text-sm font-medium text-gray-700'>
                  Job Type *
                </label>
                <DynamicSelect
                  id='jobType'
                  name='jobType'
                  value={VacancyFormik.values.jobType}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('jobType', true)}
                  error={VacancyFormik.touched.jobType && Boolean(VacancyFormik.errors.jobType)}
                  helperText={
                    VacancyFormik.touched.jobType && VacancyFormik.errors.jobType ? VacancyFormik.errors.jobType : ''
                  }
                >
                  <MenuItem value=''>Select Job Type</MenuItem>
                  <MenuItem value='Full-time'>Full-time</MenuItem>
                  <MenuItem value='Part-time'>Part-time</MenuItem>
                  <MenuItem value='Contract'>Contract</MenuItem>
                  <MenuItem value='Internship'>Internship</MenuItem>
                </DynamicSelect>
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='jobDescription' className='block text-sm font-medium text-gray-700'>
                  Job Description *
                </label>
                <DynamicTextField
                  id='jobDescription'
                  multiline
                  rows={4}
                  name='jobDescription'
                  value={VacancyFormik.values.jobDescription}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('jobDescription', true)}
                  error={VacancyFormik.touched.jobDescription && Boolean(VacancyFormik.errors.jobDescription)}
                  helperText={
                    VacancyFormik.touched.jobDescription && VacancyFormik.errors.jobDescription
                      ? VacancyFormik.errors.jobDescription
                      : undefined
                  }
                />
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='numberOfOpenings' className='block text-sm font-medium text-gray-700'>
                  Number of Openings *
                </label>
                <DynamicTextField
                  id='numberOfOpenings'
                  name='numberOfOpenings'
                  type='number'
                  value={VacancyFormik.values.numberOfOpenings}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('numberOfOpenings', true)}
                  error={VacancyFormik.touched.numberOfOpenings && Boolean(VacancyFormik.errors.numberOfOpenings)}
                  helperText={
                    VacancyFormik.touched.numberOfOpenings && VacancyFormik.errors.numberOfOpenings
                      ? VacancyFormik.errors.numberOfOpenings
                      : undefined
                  }
                />
              </FormControl>
            )}
          </div>
        </fieldset>

        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Job Location</legend>
          <div className='grid grid-cols-2 gap-4'>
            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='branch' className='block text-sm font-medium text-gray-700'>
                  Branch *
                </label>
                <DynamicTextField
                  id='branch'
                  name='branch'
                  type='text'
                  value={VacancyFormik.values.branch}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('branch', true)}
                  error={VacancyFormik.touched.branch && Boolean(VacancyFormik.errors.branch)}
                  helperText={
                    VacancyFormik.touched.branch && VacancyFormik.errors.branch
                      ? VacancyFormik.errors.branch
                      : undefined
                  }
                />
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
                  City *
                </label>
                <DynamicTextField
                  id='city'
                  name='city'
                  type='text'
                  value={VacancyFormik.values.city}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('city', true)}
                  error={VacancyFormik.touched.city && Boolean(VacancyFormik.errors.city)}
                  helperText={
                    VacancyFormik.touched.city && VacancyFormik.errors.city ? VacancyFormik.errors.city : undefined
                  }
                />
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='stateOrRegion' className='block text-sm font-medium text-gray-700'>
                  State/Region *
                </label>
                <DynamicTextField
                  id='stateOrRegion'
                  name='stateOrRegion'
                  type='text'
                  value={VacancyFormik.values.stateOrRegion}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('stateOrRegion', true)}
                  error={VacancyFormik.touched.stateOrRegion && Boolean(VacancyFormik.errors.stateOrRegion)}
                  helperText={
                    VacancyFormik.touched.stateOrRegion && VacancyFormik.errors.stateOrRegion
                      ? VacancyFormik.errors.stateOrRegion
                      : undefined
                  }
                />
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
                  Country *
                </label>
                <DynamicTextField
                  id='country'
                  name='country'
                  type='text'
                  value={VacancyFormik.values.country}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('country', true)}
                  error={VacancyFormik.touched.country && Boolean(VacancyFormik.errors.country)}
                  helperText={
                    VacancyFormik.touched.country && VacancyFormik.errors.country
                      ? VacancyFormik.errors.country
                      : undefined
                  }
                />
              </FormControl>
            )}
          </div>
        </fieldset>

        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Qualification Needed</legend>
          <div className='grid grid-cols-2 gap-4'>
            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='experienceInYears' className='block text-sm font-medium text-gray-700'>
                  Experience (in years) *
                </label>
                <DynamicTextField
                  id='experienceInYears'
                  name='experienceInYears'
                  type='number'
                  value={VacancyFormik.values.experienceInYears}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('experienceInYears', true)}
                  error={VacancyFormik.touched.experienceInYears && Boolean(VacancyFormik.errors.experienceInYears)}
                  helperText={
                    VacancyFormik.touched.experienceInYears && VacancyFormik.errors.experienceInYears
                      ? VacancyFormik.errors.experienceInYears
                      : undefined
                  }
                />
              </FormControl>
            )}
            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='educationalQualification' className='block text-sm font-medium text-gray-700'>
                  Educational Qualification *
                </label>
                <DynamicTextField
                  id='educationalQualification'
                  multiline
                  rows={4}
                  name='educationalQualification'
                  value={VacancyFormik.values.educationalQualification}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('educationalQualification', true)}
                  error={
                    VacancyFormik.touched.educationalQualification &&
                    Boolean(VacancyFormik.errors.educationalQualification)
                  }
                  helperText={
                    VacancyFormik.touched.educationalQualification && VacancyFormik.errors.educationalQualification
                      ? VacancyFormik.errors.educationalQualification
                      : undefined
                  }
                />
              </FormControl>
            )}

            {/* {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='experienceInYears' className='block text-sm font-medium text-gray-700'>
                  Experience (in years) *
                </label>
                <DynamicTextField
                  id='experienceInYears'
                  name='experienceInYears'
                  type='number'
                  value={VacancyFormik.values.experienceInYears}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('experienceInYears', true)}
                  error={VacancyFormik.touched.experienceInYears && Boolean(VacancyFormik.errors.experienceInYears)}
                  helperText={
                    VacancyFormik.touched.experienceInYears && VacancyFormik.errors.experienceInYears
                      ? VacancyFormik.errors.experienceInYears
                      : undefined
                  }
                />
              </FormControl>
            )} */}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='skillsNeeded' className='block text-sm font-medium text-gray-700'>
                  Skills Needed *
                </label>
                <DynamicTextField
                  id='skillsNeeded'
                  multiline
                  rows={4}
                  name='skillsNeeded'
                  value={VacancyFormik.values.skillsNeeded}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('skillsNeeded', true)}
                  error={VacancyFormik.touched.skillsNeeded && Boolean(VacancyFormik.errors.skillsNeeded)}
                  helperText={
                    VacancyFormik.touched.skillsNeeded && VacancyFormik.errors.skillsNeeded
                      ? VacancyFormik.errors.skillsNeeded
                      : undefined
                  }
                />
              </FormControl>
            )}
          </div>
        </fieldset>

        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Salary Details</legend>
          <div className='grid grid-cols-2 gap-4'>
            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='salaryRange' className='block text-sm font-medium text-gray-700'>
                  Salary Range
                </label>
                <DynamicTextField
                  id='salaryRange'
                  name='salaryRange'
                  type='text'
                  value={VacancyFormik.values.salaryRange}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('salaryRange', true)}
                  error={VacancyFormik.touched.salaryRange && Boolean(VacancyFormik.errors.salaryRange)}
                  helperText={
                    VacancyFormik.touched.salaryRange && VacancyFormik.errors.salaryRange
                      ? VacancyFormik.errors.salaryRange
                      : undefined
                  }
                />
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='additionalBenefits' className='block text-sm font-medium text-gray-700'>
                  Additional Benefits
                </label>
                <DynamicTextField
                  id='additionalBenefits'
                  multiline
                  rows={4}
                  name='additionalBenefits'
                  value={VacancyFormik.values.additionalBenefits}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('additionalBenefits', true)}
                  error={VacancyFormik.touched.additionalBenefits && Boolean(VacancyFormik.errors.additionalBenefits)}
                  helperText={
                    VacancyFormik.touched.additionalBenefits && VacancyFormik.errors.additionalBenefits
                      ? VacancyFormik.errors.additionalBenefits
                      : undefined
                  }
                />
              </FormControl>
            )}
          </div>
        </fieldset>

        <fieldset className='border border-gray-300 rounded p-4 mb-6'>
          <legend className='text-lg font-semibold text-gray-700'>Application Details</legend>
          <div className='grid grid-cols-2 gap-4'>
            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='contactPerson' className='block text-sm font-medium text-gray-700'>
                  Contact Person *
                </label>
                <DynamicTextField
                  id='contactPerson'
                  name='contactPerson'
                  type='text'
                  value={VacancyFormik.values.contactPerson}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('contactPerson', true)}
                  error={VacancyFormik.touched.contactPerson && Boolean(VacancyFormik.errors.contactPerson)}
                  helperText={
                    VacancyFormik.touched.contactPerson && VacancyFormik.errors.contactPerson
                      ? VacancyFormik.errors.contactPerson
                      : undefined
                  }
                />
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='vacancyStatus' className='block text-sm font-medium text-gray-700'>
                  Vacancy Status *
                </label>
                <DynamicSelect
                  id='vacancyStatus'
                  name='vacancyStatus'
                  value={VacancyFormik.values.vacancyStatus}
                  onChange={VacancyFormik.handleChange}
                  onFocus={() => VacancyFormik.setFieldTouched('vacancyStatus', true)}
                  error={VacancyFormik.touched.vacancyStatus && Boolean(VacancyFormik.errors.vacancyStatus)}
                  helperText={
                    VacancyFormik.touched.vacancyStatus && VacancyFormik.errors.vacancyStatus
                      ? VacancyFormik.errors.vacancyStatus
                      : ''
                  }
                >
                  <MenuItem value=''>Select Vacancy Status</MenuItem>
                  <MenuItem value='Open'>Open</MenuItem>
                  <MenuItem value='Closed'>Closed</MenuItem>
                  <MenuItem value='On Hold'>On Hold</MenuItem>
                </DynamicSelect>
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='vacancyStartDate' className='block text-sm font-medium text-gray-700'>
                  Vacancy Start Date *
                </label>
                <ReactDatePicker
                  selected={VacancyFormik.values.vacancyStartDate}
                  onChange={(date: Date | null) => VacancyFormik.setFieldValue('vacancyStartDate', date)} // selectsMultiple={false}
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

                {VacancyFormik.touched.vacancyStartDate && VacancyFormik.errors.vacancyStartDate && (
                  <Typography style={{ color: 'red', fontSize: '0.8rem', marginLeft: 15 }}>
                    {VacancyFormik.errors.vacancyStartDate}
                  </Typography>
                )}
              </FormControl>
            )}

            {true && (
              <FormControl fullWidth margin='normal'>
                <label htmlFor='vacancyEndDate' className='block text-sm font-medium text-gray-700'>
                  Vacancy End Date *
                </label>
                <ReactDatePicker
                  selected={VacancyFormik.values.vacancyEndDate}
                  onChange={(date: Date | null) => VacancyFormik.setFieldValue('vacancyEndDate', date)}
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

                {VacancyFormik.touched.vacancyEndDate && VacancyFormik.errors.vacancyEndDate && (
                  <Typography style={{ color: 'red', fontSize: '0.8rem', marginLeft: 15 }}>
                    {VacancyFormik.errors.vacancyEndDate}
                  </Typography>
                )}
              </FormControl>
            )}
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
