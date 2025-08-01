'use client'
import React, { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Typography, Button, TextField, Autocomplete, Grid, Divider, Chip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'

// Campus Drive interface
interface CampusDrive {
  id: string
  job_role: string
  drive_date: string
  expected_candidates: number | null
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled'
  college: string
  college_coordinator: string
  invite_status: 'Pending' | 'Sent' | 'Failed'
  response_status: 'Not Responded' | 'Interested' | 'Not Interested'
  spoc_notified_at: string | null
  remarks: string | null
}

interface AddOrEditCampusDriveProps {
  mode: 'add' | 'edit'
  id?: string
}

// Sample options for Autocomplete fields
const jobRoleOptions = ['Software Engineer', 'Data Analyst', 'Product Manager', 'DevOps Engineer']
const statusOptions = ['Planned', 'Ongoing', 'Completed', 'Cancelled']
const inviteStatusOptions = ['Pending', 'Sent', 'Failed']
const responseStatusOptions = ['Not Responded', 'Interested', 'Not Interested']
const collegeOptions = ['ABC College', 'XYZ University', 'PQR Institute']
const spocOptions = ['John Doe', 'Jane Smith', 'Alice Johnson']

// Validation schema
const validationSchema = Yup.object().shape({
  // Campus Drive Section
  job_role: Yup.string().oneOf(jobRoleOptions, 'Invalid job role').required('Job role is required'),
  drive_date: Yup.date()
    .min(new Date(), 'Drive date must be today or in the future')
    .required('Drive date is required'),
  expected_candidates: Yup.number().min(0, 'Must be 0 or greater').nullable().optional(),
  status: Yup.string().oneOf(statusOptions, 'Invalid status').default('Planned'),

  // Campus Drive Colleges Section
  college: Yup.string().oneOf(collegeOptions, 'College must exist in the list').required('College is required'),
  college_coordinator: Yup.string()
    .oneOf(spocOptions, 'Coordinator must exist in the list')
    .required('College coordinator is required'),
  invite_status: Yup.string().oneOf(inviteStatusOptions, 'Invalid invite status').default('Pending'),
  response_status: Yup.string().oneOf(responseStatusOptions, 'Invalid response status').default('Not Responded'),
  spoc_notified_at: Yup.date().nullable().optional(),
  remarks: Yup.string().max(2000, 'Must be 2000 characters or less').nullable().optional()
})

const AddOrEditCampusDrive = ({ mode }: AddOrEditCampusDriveProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1) // 1 for Campus Drive, 2 for Campus Drive Colleges

  // Create initial values from URL params if in edit mode
  const getInitialValues = (): Partial<CampusDrive> => {
    if (mode !== 'edit')
      return {
        job_role: '',
        drive_date: '',
        expected_candidates: null,
        status: 'Planned',
        college: '',
        college_coordinator: '',
        invite_status: 'Pending',
        response_status: 'Not Responded',
        spoc_notified_at: null,
        remarks: null
      }

    return {
      job_role: searchParams.get('job_role') || '',
      drive_date: searchParams.get('drive_date') || '',
      expected_candidates: searchParams.has('expected_candidates')
        ? Number(searchParams.get('expected_candidates'))
        : null,
      status: (searchParams.get('status') as CampusDrive['status']) || 'Planned',
      college: searchParams.get('college') || '',
      college_coordinator: searchParams.get('college_coordinator') || '',
      invite_status: (searchParams.get('invite_status') as CampusDrive['invite_status']) || 'Pending',
      response_status: (searchParams.get('response_status') as CampusDrive['response_status']) || 'Not Responded',
      spoc_notified_at: searchParams.get('spoc_notified_at'),
      remarks: searchParams.get('remarks')
    }
  }

  const initialValues = getInitialValues()

  const handleSubmit = (values: Partial<CampusDrive>) => {
    // Replace with API call to save data
    console.log('Form submitted:', values)
    router.push('/hiring-management/campus-management/campus-drive')
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
            {mode === 'add' ? 'Add New Campus Drive' : 'Edit Campus Drive'}
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
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            {/* Campus Drive Information (Step 1) */}
            <Typography
              variant='h6'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
            >
              Campus Drive Creation
            </Typography>
            <Grid container spacing={4} className='mb-6'>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={jobRoleOptions}
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
                    {/* <Autocomplete
                      options={collegeOptions}
                      value={values.college || ''}
                      onChange={(_, value) => setFieldValue('college', value || '')}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='College'
                          error={touched.college && !!errors.college}
                          helperText={touched.college && errors.college}
                          className="font-['Public_Sans',_Roboto,_sans-serif]"
                        />
                      )}
                    /> */}

                    <Autocomplete
                      multiple
                      options={['Select All', ...collegeOptions]}
                      value={values.college ? (Array.isArray(values.college) ? values.college : [values.college]) : []}
                      onChange={(_, value) => {
                        if (value.includes('Select All')) {
                          setFieldValue('college', collegeOptions)
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={spocOptions}
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
                  {/* <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name='spoc_notified_at'
                      label='SPOC Notified At'
                      type='datetime-local'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.spoc_notified_at && !!errors.spoc_notified_at}
                      helperText={touched.spoc_notified_at && errors.spoc_notified_at}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
                    />
                  </Grid> */}
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
                  >
                    Submit
                  </Button>
                </Box>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AddOrEditCampusDrive
