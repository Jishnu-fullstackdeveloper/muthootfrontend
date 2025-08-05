/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useRef } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Typography, Button, TextField, Autocomplete, Chip, Grid, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchCollegeList,
  fetchCollegeById,
  fetchCollegeCoordinatorById,
  updateCollege,
  updateCollegeCoordinator
} from '@/redux/CampusManagement/collegeAndSpocSlice'

// College interface
interface College {
  collegeName: string
  id: string
  name: string
  college_code: string
  university_affiliation: string
  college_type: string
  location: string
  district: string
  pin_code: string
  full_address: string
  website_url: string
  college_name: string
  spoc_name: string
  spoc_designation: string
  spoc_email: string
  spoc_alt_email: string
  spoc_mobile: string
  spoc_alt_phone: string
  spoc_linkedin: string
  spoc_whatsapp: string
  last_visited_date: string
  last_engagement_type: string
  last_feedback: string
  preferred_drive_months: string[]
  remarks: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
  status: 'Active' | 'Inactive' | 'Blocked'
}

interface EditCollegeProps {
  mode: 'edit'
  id: string
}

const collegeTypeOptions = ['Private', 'Public', 'Government']
const engagementTypeOptions = ['Webinar', 'Drive', 'Talk', 'None']

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .required('Name is required')
    .test('unique', 'Name must be unique', async (value, context) => {
      if (!value) return false
      const { id } = context.parent

      return true
    }),
  college_code: Yup.string()
    .max(50, 'Must be 50 characters or less')
    .matches(/^[A-Z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens allowed')
    .required('College code is required')
    .test('unique', 'College code must be unique', async (value, context) => {
      if (!value) return false
      const { id } = context.parent

      return true
    }),
  university_affiliation: Yup.string().max(255, 'Must be 255 characters or less'),
  college_type: Yup.string().oneOf(collegeTypeOptions, 'Invalid college type').required('College type is required'),
  location: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .matches(/^[A-Za-z, ]+$/, 'Only letters, commas, and spaces allowed')
    .required('Location is required'),
  district: Yup.string()
    .max(100, 'Must be 100 characters or less')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces allowed'),
  pin_code: Yup.string()
    .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
    .required('Pin code is required'),
  full_address: Yup.string().max(1000, 'Must be 1000 characters or less'),
  website_url: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .matches(/^https?:\/\/[a-zA-Z0-9-./]+$/, 'Invalid URL format')
    .url('Must be a valid URL'),
  college_name: Yup.string().required('College name is required'),
  spoc_name: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces allowed'),
  spoc_designation: Yup.string().max(100, 'Must be 100 characters or less'),
  spoc_email: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
    .email('Must be a valid email')
    .required('SPOC email is required'),
  spoc_alt_email: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
    .email('Must be a valid email')
    .optional(),
  spoc_mobile: Yup.string()
    .matches(/^\+[1-9][0-9]{0,2}[0-9]{10}$/, 'Must be a valid phone number (e.g., +919876543210)')
    .required('SPOC mobile is required'),
  spoc_alt_phone: Yup.string()
    .matches(/^\+[1-9][0-9]{0,2}[0-9]{10}$/, 'Must be a valid phone number (e.g., +919876543210)')
    .optional(),
  spoc_linkedin: Yup.string()
    .max(255, 'Must be 255 characters or less')
    .matches(/^https:\/\/[w]{0,3}\.?linkedin\.com\/in\/[a-zA-Z0-9-]+$/, 'Invalid LinkedIn URL')
    .url('Must be a valid URL')
    .optional(),
  spoc_whatsapp: Yup.string()
    .matches(/^\+[1-9][0-9]{0,2}[0-9]{10}$/, 'Must be a valid phone number (e.g., +919876543210)')
    .optional(),
  last_visited_date: Yup.date().max(new Date(), 'Date cannot be in the future').nullable().optional(),
  last_engagement_type: Yup.string().oneOf(engagementTypeOptions, 'Invalid engagement type').optional(),
  last_feedback: Yup.string().max(2000, 'Must be 2000 characters or less').optional(),
  preferred_drive_months: Yup.array().of(Yup.string().oneOf(monthOptions, 'Invalid month')).optional(),
  remarks: Yup.string().max(2000, 'Must be 2000 characters or less').optional()
})

const CollegeAndSpocEditForm = ({ mode, id }: EditCollegeProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [step, setStep] = useState(1)
  const [collegeId, setCollegeId] = useState<string | null>(searchParams.get('collegeId') || id)
  const [coordinatorId, setCoordinatorId] = useState<string | null>(searchParams.get('coordinatorId'))
  const colleges = useAppSelector(state => state.collegeAndSpocReducer.collegeList)

  const [initialValues, setInitialValues] = useState<Partial<College>>({
    id: '',
    name: '',
    college_code: '',
    university_affiliation: '',
    college_type: '',
    location: '',
    district: '',
    pin_code: '',
    full_address: '',
    website_url: '',
    college_name: '',
    spoc_name: '',
    spoc_designation: '',
    spoc_email: '',
    spoc_alt_email: '',
    spoc_mobile: '',
    spoc_alt_phone: '',
    spoc_linkedin: '',
    spoc_whatsapp: '',
    last_visited_date: '',
    last_engagement_type: '',
    last_feedback: '',
    preferred_drive_months: [],
    remarks: '',
    status: 'Active'
  })

  const formKey = useRef(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let newValues: Partial<College> = { ...initialValues }

        if (collegeId) {
          const collegeResponse = await dispatch(fetchCollegeById(collegeId)).unwrap()

          newValues = {
            ...newValues,
            id: collegeResponse.id || '',
            name: collegeResponse.collegeName || '',
            college_code: collegeResponse.collegeCode || '',
            university_affiliation: collegeResponse.universityAffiliation || '',
            college_type: collegeResponse.collegeType || '',
            location: collegeResponse.location || '',
            district: collegeResponse.district || '',
            pin_code: collegeResponse.pinCode || '',
            full_address: collegeResponse.fullAddress || '',
            website_url: collegeResponse.websiteUrl || '',
            college_name: collegeResponse.collegeName || '',
            preferred_drive_months: collegeResponse.prefferedDriveMonths || [],
            status: collegeResponse.status || 'Active'
          }
        }

        if (coordinatorId) {
          const coordinatorResponse = await dispatch(fetchCollegeCoordinatorById(coordinatorId)).unwrap()

          newValues = {
            ...newValues,
            id: coordinatorResponse.id || newValues.id,
            name: coordinatorResponse.name || newValues.name,
            college_code: coordinatorResponse.college_code || newValues.college_code,
            university_affiliation: coordinatorResponse.university_affiliation || newValues.university_affiliation,
            college_type: coordinatorResponse.college_type || newValues.college_type,
            location: coordinatorResponse.location || newValues.location,
            district: coordinatorResponse.district || newValues.district,
            pin_code: coordinatorResponse.pin_code || newValues.pin_code,
            full_address: coordinatorResponse.full_address || newValues.full_address,
            website_url: coordinatorResponse.website_url || newValues.website_url,
            college_name: coordinatorResponse.name || newValues.college_name,
            spoc_name: coordinatorResponse.spoc_name || '',
            spoc_designation: coordinatorResponse.spoc_designation || '',
            spoc_email: coordinatorResponse.spoc_email || '',
            spoc_alt_email: coordinatorResponse.spoc_alt_email || '',
            spoc_mobile: coordinatorResponse.spoc_mobile || '',
            spoc_alt_phone: coordinatorResponse.spoc_alt_phone || '',
            spoc_linkedin: coordinatorResponse.spoc_linkedin || '',
            spoc_whatsapp: coordinatorResponse.spoc_whatsapp || '',
            last_visited_date: coordinatorResponse.last_visited_date || '',
            last_engagement_type: coordinatorResponse.last_engagement_type || '',
            last_feedback: coordinatorResponse.last_feedback || '',
            preferred_drive_months: coordinatorResponse.preferred_drive_months || newValues.preferred_drive_months,
            remarks: coordinatorResponse.remarks || '',
            status: coordinatorResponse.status || newValues.status
          }
        }

        if (step === 2) {
          await dispatch(fetchCollegeList({ page: 1, limit: 100 })).unwrap()
        }

        setInitialValues(newValues)
        formKey.current += 1 // Increment to force Formik re-render
      } catch (error: any) {
        toast.error(error || 'Failed to fetch data')
      }
    }

    fetchData()
  }, [collegeId, coordinatorId, step, dispatch])

  const handleNext = async (values: Partial<College>, setErrors: any) => {
    try {
      const collegePayload = {
        collegeName: values.name || '',
        collegeCode: values.college_code || '',
        universityAffiliation: values.university_affiliation || '',
        collegeType: values.college_type || '',
        location: values.location || '',
        district: values.district || '',
        pinCode: values.pin_code || '',
        fullAddress: values.full_address || '',
        websiteUrl: values.website_url || '',
        prefferedDriveMonths: values.preferred_drive_months || []
      }

      const response = await dispatch(updateCollege({ id: collegeId || id, data: collegePayload })).unwrap()

      setCollegeId(response.id || collegeId || id)
      setStep(2)
    } catch (error: any) {
      toast.error(error || 'Failed to update college data')
      setErrors({ name: error || 'Failed to update college data' })
    }
  }

  const handleSubmit = async (values: Partial<College>, { setErrors }: any) => {
    try {
      const coordinatorPayload = {
        collegeId: collegeId || id,
        name: values.spoc_name || '',
        designation: values.spoc_designation || '',
        email: values.spoc_email || '',
        alternateEmail: values.spoc_alt_email || '',
        mobile: values.spoc_mobile || '',
        alternateMobile: values.spoc_alt_phone || '',
        linkdin: values.spoc_linkedin || '',
        whatsAppNumber: values.spoc_whatsapp || '',
        lastVisitedDate: values.last_visited_date || '',
        isPrimary: true,
        lastEngagementType: values.last_engagement_type || '',
        lastFeedback: values.last_feedback || '',
        remarks: values.remarks || '',
        status: values.status || 'Active'
      }

      await dispatch(updateCollegeCoordinator({ id: coordinatorId || '', data: coordinatorPayload })).unwrap()
      toast.success('College coordinator updated successfully')
      router.push('/hiring-management/campus-management/college')
    } catch (error: any) {
      toast.error(error || 'Failed to update coordinator data')
      setErrors({ spoc_name: error || 'Failed to update coordinator data' })
    }
  }

  return (
    <Box className="p-4 md:p-8 max-w-5xl mx-auto bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[14px] font-['Public_Sans',_Roboto,_sans-serif]">
      <Box className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <Box className='flex flex-row items-center gap-3'>
          <Box className='flex justify-center items-center w-[48px] h-[48px] bg-[#F2F3FF] rounded-full'>
            <SchoolOutlinedIcon className='w-8 h-8 text-[#23262F]' />
          </Box>
          <Typography
            variant='h5'
            className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[20px] leading-[26px] text-[#23262F]"
          >
            Edit College & Co-ordinator
          </Typography>
        </Box>
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
          aria-label='Back to college list'
        >
          Back to List
        </Button>
      </Box>

      <Divider className='mb-6 border-[#eee]' />

      <Formik
        key={formKey.current}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values, setErrors }) => (
          <Form>
            <Typography
              variant='h6'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
            >
              College Information
            </Typography>
            <Grid container spacing={4} className='mb-6'>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='name'
                  label='College Name'
                  fullWidth
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='college_code'
                  label='College Code'
                  fullWidth
                  error={touched.college_code && !!errors.college_code}
                  helperText={touched.college_code && errors.college_code}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='university_affiliation'
                  label='University Affiliation'
                  fullWidth
                  error={touched.university_affiliation && !!errors.university_affiliation}
                  helperText={touched.university_affiliation && errors.university_affiliation}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={collegeTypeOptions}
                  value={values.college_type || ''}
                  onChange={(_, value) => setFieldValue('college_type', value || '')}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='College Type'
                      error={touched.college_type && !!errors.college_type}
                      helperText={touched.college_type && errors.college_type}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='location'
                  label='Location'
                  fullWidth
                  error={touched.location && !!errors.location}
                  helperText={touched.location && errors.location}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='district'
                  label='District'
                  fullWidth
                  error={touched.district && !!errors.district}
                  helperText={touched.district && errors.district}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='pin_code'
                  label='Pin Code'
                  fullWidth
                  error={touched.pin_code && !!errors.pin_code}
                  helperText={touched.pin_code && errors.pin_code}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name='website_url'
                  label='Website URL'
                  fullWidth
                  error={touched.website_url && !!errors.website_url}
                  helperText={touched.website_url && errors.website_url}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={monthOptions}
                  value={values.preferred_drive_months || []}
                  onChange={(_, value) => setFieldValue('preferred_drive_months', value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Preferred Drive Months'
                      error={touched.preferred_drive_months && !!errors.preferred_drive_months}
                      helperText={touched.preferred_drive_months && errors.preferred_drive_months}
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
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name='full_address'
                  label='Full Address'
                  fullWidth
                  multiline
                  rows={3}
                  error={touched.full_address && !!errors.full_address}
                  helperText={touched.full_address && errors.full_address}
                  className="font-['Public_Sans',_Roboto,_sans-serif]"
                />
              </Grid>
            </Grid>

            {step === 1 && (
              <Box className='flex justify-end'>
                <Button
                  variant='contained'
                  onClick={() => handleNext(values, setErrors)}
                  className="bg-[#0096DA] hover:bg-[#007BB8] text-white font-['Public_Sans',_Roboto,_sans-serif]"
                >
                  Next
                </Button>
              </Box>
            )}

            {step === 2 && (
              <>
                <Divider className='my-6 border-[#eee]' />
                <Typography
                  variant='h6'
                  className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
                >
                  SPOC Information
                </Typography>
                <Grid container spacing={4} className='mb-6'>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={colleges}
                      getOptionLabel={option => option.collegeName}
                      value={colleges.find(college => college.collegeName === values.college_name) || null}
                      onChange={(_, value) => {
                        setFieldValue('college_name', value ? value.collegeName : '')
                        setCollegeId(value ? value.id : collegeId)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='College Name'
                          error={touched.college_name && !!errors.college_name}
                          helperText={touched.college_name && errors.college_name}
                          className="font-['Public_Sans',_Roboto,_sans-serif]"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className='flex items-center gap-2'>
                      <Field
                        as={TextField}
                        name='spoc_name'
                        label='SPOC Name'
                        fullWidth
                        error={touched.spoc_name && !!errors.spoc_name}
                        helperText={touched.spoc_name && errors.spoc_name}
                        className="font-['Public_Sans',_Roboto,_sans-serif]"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name='spoc_designation'
                      label='SPOC Designation'
                      fullWidth
                      error={touched.spoc_designation && !!errors.spoc_designation}
                      helperText={touched.spoc_designation && errors.spoc_designation}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className='flex items-center gap-2'>
                      <Field
                        as={TextField}
                        name='spoc_email'
                        label='SPOC Email'
                        fullWidth
                        error={touched.spoc_email && !!errors.spoc_email}
                        helperText={touched.spoc_email && errors.spoc_email}
                        className="font-['Public_Sans',_Roboto,_sans-serif]"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className='flex items-center gap-2'>
                      <Field
                        as={TextField}
                        name='spoc_alt_email'
                        label='SPOC Alternate Email'
                        fullWidth
                        error={touched.spoc_alt_email && !!errors.spoc_alt_email}
                        helperText={touched.spoc_alt_email && errors.spoc_alt_email}
                        className="font-['Public_Sans',_Roboto,_sans-serif]"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className='flex items-center gap-2'>
                      <Field
                        as={TextField}
                        name='spoc_mobile'
                        label='SPOC Mobile'
                        fullWidth
                        error={touched.spoc_mobile && !!errors.spoc_mobile}
                        helperText={touched.spoc_mobile && errors.spoc_mobile}
                        className="font-['Public_Sans',_Roboto,_sans-serif]"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className='flex items-center gap-2'>
                      <Field
                        as={TextField}
                        name='spoc_alt_phone'
                        label='SPOC Alternate Phone'
                        fullWidth
                        error={touched.spoc_alt_phone && !!errors.spoc_alt_phone}
                        helperText={touched.spoc_alt_phone && errors.spoc_alt_phone}
                        className="font-['Public_Sans',_Roboto,_sans-serif]"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className='flex items-center gap-2'>
                      <Field
                        as={TextField}
                        name='spoc_linkedin'
                        label='SPOC LinkedIn'
                        fullWidth
                        error={touched.spoc_linkedin && !!errors.spoc_linkedin}
                        helperText={touched.spoc_linkedin && errors.spoc_linkedin}
                        className="font-['Public_Sans',_Roboto,_sans-serif]"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className='flex items-center gap-2'>
                      <Field
                        as={TextField}
                        name='spoc_whatsapp'
                        label='SPOC WhatsApp'
                        fullWidth
                        error={touched.spoc_whatsapp && !!errors.spoc_whatsapp}
                        helperText={touched.spoc_whatsapp && errors.spoc_whatsapp}
                        className="font-['Public_Sans',_Roboto,_sans-serif]"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name='last_visited_date'
                      label='Last Visited Date'
                      type='date'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.last_visited_date && !!errors.last_visited_date}
                      helperText={touched.last_visited_date && errors.last_visited_date}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={engagementTypeOptions}
                      value={values.last_engagement_type || ''}
                      onChange={(_, value) => setFieldValue('last_engagement_type', value || '')}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Last Engagement Type'
                          error={touched.last_engagement_type && !!errors.last_engagement_type}
                          helperText={touched.last_engagement_type && errors.last_engagement_type}
                          className="font-['Public_Sans',_Roboto,_sans-serif]"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='last_feedback'
                      label='Last Feedback'
                      fullWidth
                      multiline
                      rows={3}
                      error={touched.last_feedback && !!errors.last_feedback}
                      helperText={touched.last_feedback && errors.last_feedback}
                      className="font-['Public_Sans',_Roboto,_sans-serif]"
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

export default CollegeAndSpocEditForm
