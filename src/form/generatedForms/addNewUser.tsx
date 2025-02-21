'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField } from '@mui/material'

import DynamicButton from '@/components/Button/dynamicButton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addNewUser, resetAddUserStatus } from '@/redux/userManagementSlice'

type Props = {
  mode: 'add' | 'edit'
  id?: string
}

const AddOrEditUser: React.FC<Props> = ({ mode, id }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage } = useAppSelector(
    (state: any) => state.UserManagementReducer
  )

  // Add state for error message
  const [apiErrors, setApiErrors] = useState<string[]>([])

  // Update effect to handle API errors
  useEffect(() => {
    if (addUserFailure && addUserFailureMessage) {
      const messages = Array.isArray(addUserFailureMessage) ? addUserFailureMessage : [addUserFailureMessage]

      setApiErrors(messages)
    } else {
      setApiErrors([])
    }
  }, [addUserFailure, addUserFailureMessage])

  // Add effect to handle successful user creation
  useEffect(() => {
    if (addUserSuccess) {
      router.push('/users-management')
    }
  }, [addUserSuccess])

  // Cleanup on unmount or when leaving the page
  useEffect(() => {
    return () => {
      dispatch(resetAddUserStatus())
    }
  }, [])

  const userFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      tempPassword: ''
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      tempPassword: Yup.string()
        .required('Temporary password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(255, 'Password must be less than 255 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
    }),

    onSubmit: values => {
      const params = {
        ...values,
        ...(mode === 'edit' && { id })
      }

      dispatch(addNewUser(params))
    }
  })

  const handleCancel = () => {
    dispatch(resetAddUserStatus())
    router.back()
  }

  return (
    <form onSubmit={userFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit User' : 'Add New User'}</h1>

      {/* Display API Errors */}
      {apiErrors.length > 0 && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
          {apiErrors.map((error, index) => (
            <div key={index} className='text-red-600'>
              • {error}
            </div>
          ))}
        </div>
      )}

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>User Details</legend>

        <div className='grid grid-cols-2 gap-4'>
          <FormControl fullWidth margin='normal'>
            <TextField
              label='First Name *'
              id='firstName'
              name='firstName'
              value={userFormik.values.firstName}
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              error={!!userFormik.errors.firstName && userFormik.touched.firstName}
              helperText={userFormik.touched.firstName && userFormik.errors.firstName}
            />
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <TextField
              label='Last Name *'
              id='lastName'
              name='lastName'
              value={userFormik.values.lastName}
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              error={!!userFormik.errors.lastName && userFormik.touched.lastName}
              helperText={userFormik.touched.lastName && userFormik.errors.lastName}
            />
          </FormControl>
        </div>

        <FormControl fullWidth margin='normal'>
          <TextField
            label='Email *'
            id='email'
            name='email'
            value={userFormik.values.email}
            onChange={userFormik.handleChange}
            onBlur={userFormik.handleBlur}
            error={!!userFormik.errors.email && userFormik.touched.email}
            helperText={userFormik.touched.email && userFormik.errors.email}
          />
        </FormControl>

        <FormControl fullWidth margin='normal'>
          <TextField
            label='Temporary Password *'
            id='tempPassword'
            name='tempPassword'
            type='password'
            value={userFormik.values.tempPassword}
            onChange={userFormik.handleChange}
            onBlur={userFormik.handleBlur}
            error={!!userFormik.errors.tempPassword && userFormik.touched.tempPassword}
            helperText={userFormik.touched.tempPassword && userFormik.errors.tempPassword}
          />
        </FormControl>
      </fieldset>

      {/* Submit and Cancel Buttons */}
      <div className='flex justify-end space-x-4'>
        <DynamicButton
          type='button'
          variant='contained'
          className='bg-gray-500 text-white hover:bg-gray-700'
          onClick={handleCancel}
          disabled={isAddUserLoading}
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type='submit'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          disabled={isAddUserLoading}
        >
          {isAddUserLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Save'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditUser
