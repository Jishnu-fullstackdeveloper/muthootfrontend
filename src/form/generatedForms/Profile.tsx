'use client'
import React from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, MenuItem } from '@mui/material'

import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicButton from '@/components/Button/dynamicButton'

// import DynamicCheckbox from '@/components/Checkbox/dynamicCheckbox'

// import DynamicDatepicker from '@/components/Datepicker/dynamicDatepicker'

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  firstName: Yup.string().required('First Name is required'),
  middleName: Yup.string(),
  lastName: Yup.string().required('Last Name is required'),
  dateOfBirth: Yup.string().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string()
    .email()
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is invalid'),
  phone: Yup.string()
    .required('Phone Number is required')
    .matches(/^[0-9]{10}$/, 'Phone Number is invalid'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .required('Zip Code is required')
    .matches(/^[0-9]{5}$/, 'Zip Code is invalid'),
  employmentStatus: Yup.string().required('Employment Status is required'),
  companyName: Yup.string(),
  jobTitle: Yup.string(),
  startDate: Yup.string(),
  income: Yup.string(),
  hobbies: Yup.string(),
  notes: Yup.string()
})

const GeneratedForm: React.FC = () => {
  const formik: any = useFormik({
    initialValues: {
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      employmentStatus: '',
      companyName: '',
      jobTitle: '',
      startDate: '',
      income: '',
      hobbies: '',
      notes: ''
    },
    validationSchema,
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Profile Form</h1>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Personal Information</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                Title *
              </label>
              <DynamicSelect
                id='title'
                name='title'
                value={formik.values.title}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('title', true)}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title ? formik.errors.title : ''}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Mr.'>Mr.</MenuItem>
                <MenuItem value='Ms.'>Ms.</MenuItem>
                <MenuItem value='Mrs.'>Mrs.</MenuItem>
                <MenuItem value='Dr.'>Dr.</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
                First Name *
              </label>
              <DynamicTextField
                id='firstName'
                name='firstName'
                type='text'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('firstName', true)}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='middleName' className='block text-sm font-medium text-gray-700'>
                Middle Name
              </label>
              <DynamicTextField
                id='middleName'
                name='middleName'
                type='text'
                value={formik.values.middleName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('middleName', true)}
                error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                helperText={
                  formik.touched.middleName && formik.errors.middleName ? formik.errors.middleName : undefined
                }
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
                Last Name *
              </label>
              <DynamicTextField
                id='lastName'
                name='lastName'
                type='text'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('lastName', true)}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700'>
                Date of Birth *
              </label>
              {/* <DynamicDatepicker /> */}
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='gender' className='block text-sm font-medium text-gray-700'>
                Gender *
              </label>
              <DynamicSelect
                id='gender'
                name='gender'
                value={formik.values.gender}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('gender', true)}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender ? formik.errors.gender : ''}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
                <MenuItem value='Other'>Other</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Contact Information</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email *
              </label>
              <DynamicTextField
                id='email'
                name='email'
                type='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('email', true)}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                Phone Number *
              </label>
              <DynamicTextField
                id='phone'
                name='phone'
                type='tel'
                value={formik.values.phone}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('phone', true)}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                Address *
              </label>
              <DynamicTextField
                id='address'
                multiline
                rows={4}
                name='address'
                value={formik.values.address}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('address', true)}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address ? formik.errors.address : undefined}
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
                value={formik.values.city}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('city', true)}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city ? formik.errors.city : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='state' className='block text-sm font-medium text-gray-700'>
                State *
              </label>
              <DynamicTextField
                id='state'
                name='state'
                type='text'
                value={formik.values.state}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('state', true)}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state ? formik.errors.state : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='zipCode' className='block text-sm font-medium text-gray-700'>
                Zip Code *
              </label>
              <DynamicTextField
                id='zipCode'
                name='zipCode'
                type='text'
                value={formik.values.zipCode}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('zipCode', true)}
                error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                helperText={formik.touched.zipCode && formik.errors.zipCode ? formik.errors.zipCode : undefined}
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Employment Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='employmentStatus' className='block text-sm font-medium text-gray-700'>
                Employment Status *
              </label>
              <DynamicSelect
                id='employmentStatus'
                name='employmentStatus'
                value={formik.values.employmentStatus}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('employmentStatus', true)}
                error={formik.touched.employmentStatus && Boolean(formik.errors.employmentStatus)}
                helperText={
                  formik.touched.employmentStatus && formik.errors.employmentStatus
                    ? formik.errors.employmentStatus
                    : ''
                }
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Employed'>Employed</MenuItem>
                <MenuItem value='Self-Employed'>Self-Employed</MenuItem>
                <MenuItem value='Unemployed'>Unemployed</MenuItem>
                <MenuItem value='Student'>Student</MenuItem>
                <MenuItem value='Retired'>Retired</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {formik.values['employmentStatus'] === 'Employed' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                Company Name
              </label>
              <DynamicTextField
                id='companyName'
                name='companyName'
                type='text'
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('companyName', true)}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={
                  formik.touched.companyName && formik.errors.companyName ? formik.errors.companyName : undefined
                }
              />
            </FormControl>
          )}

          {formik.values['employmentStatus'] === 'Employed' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='jobTitle' className='block text-sm font-medium text-gray-700'>
                Job Title
              </label>
              <DynamicTextField
                id='jobTitle'
                name='jobTitle'
                type='text'
                value={formik.values.jobTitle}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('jobTitle', true)}
                error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                helperText={formik.touched.jobTitle && formik.errors.jobTitle ? formik.errors.jobTitle : undefined}
              />
            </FormControl>
          )}

          {formik.values['employmentStatus'] === 'Employed' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
                Start Date
              </label>
              {/* <DynamicDatepicker /> */}
            </FormControl>
          )}

          {formik.values['employmentStatus'] === 'Employed' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='income' className='block text-sm font-medium text-gray-700'>
                Annual Income
              </label>
              <DynamicTextField
                id='income'
                name='income'
                type='number'
                value={formik.values.income}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('income', true)}
                error={formik.touched.income && Boolean(formik.errors.income)}
                helperText={formik.touched.income && formik.errors.income ? formik.errors.income : undefined}
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Additional Information</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='hobbies' className='block text-sm font-medium text-gray-700'>
                Hobbies/Interests
              </label>
              <DynamicTextField
                id='hobbies'
                multiline
                rows={4}
                name='hobbies'
                value={formik.values.hobbies}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('hobbies', true)}
                error={formik.touched.hobbies && Boolean(formik.errors.hobbies)}
                helperText={formik.touched.hobbies && formik.errors.hobbies ? formik.errors.hobbies : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='notes' className='block text-sm font-medium text-gray-700'>
                Additional Notes
              </label>
              <DynamicTextField
                id='notes'
                multiline
                rows={4}
                name='notes'
                value={formik.values.notes}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('notes', true)}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes ? formik.errors.notes : undefined}
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton type='button' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Cancel
        </DynamicButton>

        <DynamicButton type='button' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Save Profile
        </DynamicButton>

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Submit Profile
        </DynamicButton>
      </div>
    </form>
  )
}

export default GeneratedForm
