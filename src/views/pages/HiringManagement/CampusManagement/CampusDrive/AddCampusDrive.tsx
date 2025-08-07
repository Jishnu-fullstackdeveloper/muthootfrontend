'use client'
import React, { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Typography, Button, TextField, Autocomplete, Grid, Divider, Chip, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import {
  fetchJobRoles,
  createCollegeDrive,
  fetchCollegeDriveById,
  updateCollegeDrive
} from '@/redux/CampusManagement/campusDriveSlice'
import { fetchCollegeList, fetchCollegeCoordinators } from '@/redux/CampusManagement/collegeAndSpocSlice'

// Campus Drive interface
interface CampusDrive {
  id: string
  job_role: string
  drive_date: string
  expected_candidates: number | null
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled'
  college: string | string[]
  college_coordinator: string
  invite_status: 'Pending' | 'Sent' | 'Failed'
  response_status: 'Not Responded' | 'Interested' | 'Not Interested'
  spoc_notified_at: string | null
  remarks: string | null
}

// Props interface
interface AddOrEditCampusDriveProps {
  mode: 'add' | 'edit'
}

// Sample options for Autocomplete fields
const statusOptions = ['Planned', 'Ongoing', 'Completed', 'Cancelled']
const inviteStatusOptions = ['Pending', 'Sent', 'Failed']
const responseStatusOptions = ['Not Responded', 'Interested', 'Not Interested']

const AddOrEditCampusDrive = ({ mode }: AddOrEditCampusDriveProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  const {
    jobRoles,
    collegeDrive,
    status: jobStatus,
    error: jobError,
    collegeDriveStatus,
    collegeDriveError
  } = useAppSelector(state => state.campusDriveReducer)

  const {
    collegeList,
    colleges,
    status: collegeStatus,
    error: collegeError
  } = useAppSelector(state => state.collegeAndSpocReducer)

  const [step, setStep] = useState(1) // 1 for Campus Drive, 2 for Campus Drive Colleges
  const [isLoading, setIsLoading] = useState(mode === 'edit') // Loading state for edit mode

  // Derived options from Redux state
  const collegeNames = collegeList.map(college => college.collegeName)
  const coordinatorNames = colleges.map(college => college.spoc_name)

  // Get id from URL in edit mode
  const id = mode === 'edit' ? searchParams.get('id') : null

  // Fetch job roles, colleges, coordinators, and campus drive data (for edit mode) on component mount
  useEffect(() => {
    dispatch(fetchJobRoles({ page: 1, limit: 10 }))

    dispatch(fetchCollegeList({ page: 1, limit: 10 }))
    dispatch(fetchCollegeCoordinators({ page: 1, limit: 10 }))

    if (mode === 'edit' && id && collegeDriveStatus === 'idle') {
      dispatch(fetchCollegeDriveById(id))
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false))
    }
  }, [collegeDriveStatus, dispatch, mode, id])

  // Show toast notifications for errors and validate id in edit mode
  useEffect(() => {
    if (mode === 'edit' && !id) {
      toast.error('Invalid campus drive ID')
      router.push('/hiring-management/campus-management/campus-drive')
    }

    if (jobError) {
      toast.error(jobError)
    }

    if (collegeError) {
      toast.error(collegeError)
    }

    if (collegeDriveError) {
      toast.error(collegeDriveError)
    }

    // Show error if jobRoles is empty after fetch
    // if (jobStatus === 'succeeded' && jobRoles.length === 0) {
    //   toast.error('No job roles available. Please contact the administrator.')
    // }
  }, [jobError, collegeError, collegeDriveError, jobStatus, jobRoles, mode, id, router])

  // Validation schema
  const validationSchema = Yup.object().shape({
    // Campus Drive Section
    job_role: Yup.string().oneOf(jobRoles, 'Invalid job role').required('Job role is required'),
    drive_date: Yup.date()
      .min(
        (() => {
          const today = new Date()

          today.setUTCHours(0, 0, 0, 0)

          return today
        })(),
        'Drive date must be today or in the future'
      )
      .required('Drive date is required')
      .test('is-valid-date', 'Drive date must be a valid date', value => {
        return value instanceof Date && !isNaN(value.getTime())
      }),
    expected_candidates: Yup.number().min(0, 'Must be 0 or greater').nullable().optional(),
    status: Yup.string().oneOf(statusOptions, 'Invalid status').default('Planned'),

    // Campus Drive Colleges Section
    college: Yup.mixed<string | string[]>()
      .test(
        'is-string-or-array',
        'College must be a string or array of strings',
        (value): value is string | string[] => typeof value === 'string' || Array.isArray(value)
      )
      .test('valid-college', 'College must exist in the list', (value: string | string[]) => {
        const validOptions = collegeNames.length > 0 ? collegeNames : ['ABC College', 'XYZ University', 'PQR Institute']

        if (Array.isArray(value)) {
          return value.every(v => validOptions.includes(v))
        }

        return validOptions.includes(value)
      })
      .required('College is required'),
    college_coordinator: Yup.string()
      .oneOf(
        coordinatorNames.length > 0 ? coordinatorNames : ['John Doe', 'Jane Smith', 'Alice Johnson'],
        'Coordinator must exist in the list'
      )
      .required('College coordinator is required'),
    invite_status: Yup.string().oneOf(inviteStatusOptions, 'Invalid invite status').default('Pending'),
    response_status: Yup.string().oneOf(responseStatusOptions, 'Invalid response status').default('Not Responded'),
    spoc_notified_at: Yup.date().nullable().optional(),
    remarks: Yup.string().max(2000, 'Must be 2000 characters or less').nullable().optional()
  })

  // Initial values for add mode or populated from collegeDrive for edit mode
  const initialValues: Partial<CampusDrive> =
    mode === 'edit' && collegeDrive
      ? {
          id: collegeDrive.id,
          job_role: collegeDrive.job_role,
          drive_date: collegeDrive.drive_date,
          expected_candidates: collegeDrive.expected_candidates,
          status: collegeDrive.status, // Remove redundant mapping
          college: collegeDrive.college,
          college_coordinator: collegeDrive.college_coordinator,
          invite_status: collegeDrive.invite_status,
          response_status: collegeDrive.response_status,
          spoc_notified_at: collegeDrive.spoc_notified_at,
          remarks: collegeDrive.remarks
        }
      : {
          job_role: '',
          drive_date: '',
          expected_candidates: null,
          status: 'Planned',
          college: [],
          college_coordinator: '',
          invite_status: 'Pending',
          response_status: 'Not Responded',
          spoc_notified_at: null,
          remarks: null
        }

  const handleSubmit = async (values: Partial<CampusDrive>) => {
    // Map form values to API request body
    const selectedCollege = Array.isArray(values.college) ? values.college[0] : values.college
    const college = collegeList.find(c => c.collegeName === selectedCollege)
    const coordinator = colleges.find(c => c.spoc_name === values.college_coordinator)

    if (!college || !coordinator) {
      toast.error('Please select valid college and coordinator')

      return
    }

    // Convert drive_date (YYYY-MM-DD) to ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
    let driveDate = ''

    if (values.drive_date) {
      const date = new Date(values.drive_date)

      driveDate = date.toISOString() // e.g., "2025-08-07T00:00:00.000Z"
    }

    const driveData = {
      collegeId: college.id,
      collegeCoordinatorId: coordinator.coordinatorId,
      jobId: null, // Set jobId to null
      jobRole: values.job_role || '',
      driveDate,
      expectedCandidates: values.expected_candidates || 0,
      driveStatus: values.status || 'Planned'
    }

    try {
      if (mode === 'edit' && id) {
        // In edit mode, include id in the payload for update
        await dispatch(updateCollegeDrive({ id, data: driveData })).unwrap()
        toast.success('Campus drive updated successfully')
      } else {
        // In add mode, create new campus drive
        await dispatch(createCollegeDrive(driveData)).unwrap()
        toast.success('Campus drive created successfully')
      }

      router.push('/hiring-management/campus-management/campus-drive')
    } catch (error: any) {
      console.error(`${mode === 'edit' ? 'Update' : 'Create'} college drive error:`, error) // Log error for debugging
      toast.error(error || `Failed to ${mode === 'edit' ? 'update' : 'create'} campus drive`)
    }
  }

  // Show loading spinner while fetching data in edit mode
  if (isLoading) {
    return (
      <Box className='flex justify-center items-center h-[50vh]'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="p-4 md:p-8 max-w-5xl mx-auto bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[14px] font-['Public_Sans',_Roboto,_sans-serif]">
      {/* Header Section */}
      <Box className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <Box className='flex flex-row items-center gap-3'>
          <Box className='flex justify-center items-center w-[48px] h-[48px] bg-[#F2F3FF] rounded-full'>
            <WorkOutlineIcon className='w-8 h-8 text-[#23262F]' />
          </Box>
          <Typography
            variant='h5'
            className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[20px] leading-[26px] text-[#23262F]"
          >
            {mode === 'edit' ? 'Edit Campus Drive' : 'Add New Campus Drive'}
          </Typography>
        </Box>
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
          aria-label='Back to campus drive list'
        >
          Back to List
        </Button>
      </Box>

      <Divider className='mb-6 border-[#eee]' />

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, setFieldValue, values, isSubmitting }) => (
          <Form>
            {/* Campus Drive Information (Step 1) */}
            <Typography
              variant='h6'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
            >
              Campus Drive {mode === 'edit' ? 'Update' : 'Creation'}
            </Typography>
            <Grid container spacing={4} className='mb-6'>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={jobRoles}
                  value={values.job_role || ''}
                  onChange={(_, value) => setFieldValue('job_role', value || '')}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Job Role'
                      error={touched.job_role && !!errors.job_role}
                      helperText={touched.job_role && errors.job_role}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
                    />
                  )}
                  loading={jobStatus === 'loading'}
                  disabled={jobStatus === 'loading'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='drive_date'
                  label='Drive Date'
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={touched.drive_date && !!errors.drive_date}
                  helperText={touched.drive_date && errors.drive_date}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='expected_candidates'
                  label='Expected Candidates'
                  type='number'
                  fullWidth
                  error={touched.expected_candidates && !!errors.expected_candidates}
                  helperText={touched.expected_candidates && errors.expected_candidates}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={statusOptions}
                  value={values.status || 'Planned'}
                  onChange={(_, value) => setFieldValue('status', value || 'Planned')}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Status'
                      error={touched.status && !!errors.status}
                      helperText={touched.status && errors.status}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
                    />
                  )}
                />
              </Grid>
            </Grid>
            {step === 1 && (
              <Box className='flex justify-end'>
                <Button
                  variant='contained'
                  onClick={() => setStep(2)}
                  className="bg-[#0096DA] hover:bg-[#007BB8] text-white font-['Public_Sans',_Roboto,_sans-serif]"
                  disabled={jobRoles.length === 0}
                >
                  Next
                </Button>
              </Box>
            )}

            {/* Campus Drive Colleges Information (Step 2) */}
            {step === 2 && (
              <>
                <Divider className='my-6 border-[#eee]' />
                <Typography
                  variant='h6'
                  className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
                >
                  College Information
                </Typography>
                <Grid container spacing={4} className='mb-6'>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={
                        collegeNames.length > 0
                          ? ['Select All', ...collegeNames]
                          : ['Select All', 'ABC College', 'XYZ University', 'PQR Institute']
                      }
                      value={values.college ? (Array.isArray(values.college) ? values.college : [values.college]) : []}
                      onChange={(_, value) => {
                        if (value.includes('Select All')) {
                          const validOptions =
                            collegeNames.length > 0 ? collegeNames : ['ABC College', 'XYZ University', 'PQR Institute']

                          setFieldValue('college', validOptions)
                        } else {
                          setFieldValue('college', value)
                        }
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='College'
                          error={touched.college && !!errors.college}
                          helperText={touched.college && errors.college}
                          className="font-['Public_Sans',_Roboto,_sans-serif]"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option}
                            {...getTagProps({ index })}
                            label={option}
                            size='small'
                            className="font-['Public_Sans',_Roboto,_sans-serif] bg-[#F2F3FF] text-[#23262F]"
                            sx={{ margin: '2px' }}
                          />
                        ))
                      }
                      loading={collegeStatus === 'loading'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={
                        coordinatorNames.length > 0 ? coordinatorNames : ['John Doe', 'Jane Smith', 'Alice Johnson']
                      }
                      value={values.college_coordinator || ''}
                      onChange={(_, value) => setFieldValue('college_coordinator', value || '')}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='College Coordinator'
                          error={touched.college_coordinator && !!errors.college_coordinator}
                          helperText={touched.college_coordinator && errors.college_coordinator}
                          className="font-['Public_Sans',_Roboto,_sans-serif]"
                        />
                      )}
                      loading={collegeStatus === 'loading'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={inviteStatusOptions}
                      value={values.invite_status || 'Pending'}
                      onChange={(_, value) => setFieldValue('invite_status', value || 'Pending')}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Invite Status'
                          error={touched.invite_status && !!errors.invite_status}
                          helperText={touched.invite_status && errors.invite_status}
                          className="font-['Public_Sans',_Roboto,_sans-serif]"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={responseStatusOptions}
                      value={values.response_status || 'Not Responded'}
                      onChange={(_, value) => setFieldValue('response_status', value || 'Not Responded')}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Response Status'
                          error={touched.response_status && !!errors.response_status}
                          helperText={touched.response_status && errors.response_status}
                          className="font-['Public_Sans',_Roboto,_sans-serif]"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='remarks'
                      label='Remarks'
                      fullWidth
                      multiline
                      rows={3}
                      error={touched.remarks && !!errors.remarks}
                      helperText={touched.remarks && errors.remarks}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
                    />
                  </Grid>
                </Grid>
                <Box className='flex justify-between'>
                  <Button
                    variant='outlined'
                    onClick={() => setStep(1)}
                    className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
                  >
                    Back
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className="bg-[#0096DA] hover:bg-[#007BB8] text-white font-['Public_Sans',_Roboto,_sans-serif]"
                    disabled={isSubmitting || collegeDriveStatus === 'loading'}
                  >
                    {collegeDriveStatus === 'loading' ? 'Submitting...' : mode === 'edit' ? 'Update' : 'Submit'}
                  </Button>
                </Box>
              </>
            )}
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  )
}

export default AddOrEditCampusDrive
