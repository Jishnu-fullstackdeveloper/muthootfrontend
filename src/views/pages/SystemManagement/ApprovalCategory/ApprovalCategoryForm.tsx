'use client'
import React from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Button, Typography, Box } from '@mui/material'

import { toast, ToastContainer } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { createApprovalCategory } from '@/redux/approvalMatrixSlice'
import 'react-toastify/dist/ReactToastify.css'

const validationSchema = Yup.object({
  approvalCategory: Yup.string()
    .trim('Approval Category cannot be only spaces')
    .required('This field is required')
    .min(3, 'Approval Category must be at least 3 characters')
    .matches(/^\S.*\S$|^\S$/, 'Approval Category cannot start or end with spaces'),
  description: Yup.string()
    .trim('Description cannot be only spaces')
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters long')
    .matches(/^\S.*\S$|^\S$/, 'Description cannot start or end with spaces')
})

const ApprovalCategoryForm = () => {
  const dispatch = useAppDispatch()

  const { status, error, createApprovalCategoryResponse } = useAppSelector(state => state.approvalMatrixReducer)

  const formik = useFormik({
    initialValues: {
      approvalCategory: '',
      description: ''
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await dispatch(
          createApprovalCategory({ name: values.approvalCategory, description: values.description })
        ).unwrap()

        console.log('Approval Category Created:', result, createApprovalCategoryResponse, error, status)
        toast.success('Approval Category created successfully!', {
          position: 'top-right', // Changed to top-right
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
        resetForm()
      } catch (error) {
        console.error('Failed to create approval category:', error)
        toast.error(error, {
          position: 'top-right', // Changed to top-right
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
    }

    // Update onSubmit in formik
    // onSubmit: (values, { resetForm }) => {
    //   dispatch(createApprovalCategory({ name: values.approvalCategory, description: values.description }))
    //     .then(action => {
    //       if (createApprovalCategory.fulfilled.match(action)) {
    //         console.log('Approval Category Created:', action.payload) // Log the response directly
    //         toast.success('Approval Category created successfully!', {
    //           position: 'top-right',
    //           autoClose: 5000,
    //           hideProgressBar: false,
    //           closeOnClick: true,
    //           pauseOnHover: true,
    //           draggable: true,
    //           progress: undefined
    //         })
    //         resetForm()
    //       } else {
    //         const errorMessage = action.payload || 'Failed to create approval category'

    //         console.error('Failed to create approval category:', errorMessage)
    //         toast.error(errorMessage, {
    //           position: 'top-right',
    //           autoClose: 5000,
    //           hideProgressBar: false,
    //           closeOnClick: true,
    //           pauseOnHover: true,
    //           draggable: true,
    //           progress: undefined
    //         })
    //       }
    //     })
    //     .catch(error => {
    //       console.error('Unexpected error:', error)
    //       toast.error('An unexpected error occurred. Please try again.', {
    //         position: 'top-right',
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined
    //       })
    //     })
    // }
  })

  const handleClear = () => {
    formik.resetForm()
  }

  console.log('Approval Category Created:', createApprovalCategoryResponse, error, status)

  return (
    <>
      <form onSubmit={formik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
        <Typography variant='h5' sx={{ fontSize: 'bold' }}>
          Approval Category Form
        </Typography>

        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 6, mb: 4, mt: 4 }}>
          <FormControl fullWidth>
            <TextField
              label='Approval Category'
              variant='outlined'
              size='small'
              id='approvalCategory'
              name='approvalCategory'
              value={formik.values.approvalCategory}
              onChange={e => {
                const value = e.target.value

                // Prevent leading spaces and replace multiple spaces with a single space
                const sanitizedValue = value.replace(/^\s+/, '').replace(/\s+/g, ' ')

                formik.setFieldValue('approvalCategory', sanitizedValue)
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.approvalCategory && Boolean(formik.errors.approvalCategory)}
              helperText={formik.touched.approvalCategory && formik.errors.approvalCategory}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <TextField
              label='Description'
              variant='outlined'
              size='small'
              id='description'
              name='description'
              value={formik.values.description}
              onChange={e => {
                const value = e.target.value

                // Prevent leading spaces and replace multiple spaces with a single space
                const sanitizedValue = value.replace(/^\s+/, '').replace(/\s+/g, ' ')

                formik.setFieldValue('description', sanitizedValue)
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              multiline
              rows={4}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={handleClear}
            sx={{ minWidth: '60px', textTransform: 'none' }}
            size='small'
            type='button'
          >
            Clear
          </Button>
          <Button
            variant='contained'
            color='primary'
            sx={{ minWidth: '60px', textTransform: 'none' }}
            size='small'
            type='submit'
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Submit
          </Button>
        </Box>
      </form>

      <ToastContainer
        position='top-right' // Changed to top-right
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default ApprovalCategoryForm
