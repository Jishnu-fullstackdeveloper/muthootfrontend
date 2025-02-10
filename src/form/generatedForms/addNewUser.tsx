'use client'
import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField } from '@mui/material'
import DynamicButton from '@/components/Button/dynamicButton'
import { useRouter } from 'next/navigation'

type Props = {
  mode: 'add' | 'edit'
  id?: string
}

const AddOrEditUser: React.FC<Props> = ({ mode, id }) => {
  const router = useRouter()

  const userFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required')
    }),

    onSubmit: values => {
      console.log('Form submitted:', { ...values, ...(mode === 'edit' && { id }) })
      router.push('/users')
    }
  })

  const handleCancel = () => {
    router.back()
  }

  return (
    <form onSubmit={userFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit User' : 'Add New User'}</h1>

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
            label='Password *'
            id='password'
            name='password'
            value={userFormik.values.password}
            onChange={userFormik.handleChange}
            onBlur={userFormik.handleBlur}
            error={!!userFormik.errors.password && userFormik.touched.password}
            helperText={userFormik.touched.password && userFormik.errors.password}
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
        >
          Cancel
        </DynamicButton>

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          {mode === 'edit' ? 'Update' : 'Save'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditUser
