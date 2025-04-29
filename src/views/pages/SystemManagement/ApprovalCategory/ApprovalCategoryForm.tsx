'use client'
import React from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Button, Typography, Box } from '@mui/material'

import { toast, ToastContainer } from 'react-toastify'

import { useAppDispatch } from '@/lib/hooks'
import { createApprovalCategory } from '@/redux/approvalMatrixSlice'
import 'react-toastify/dist/ReactToastify.css'

const validationSchema = Yup.object({
  approvalCategory: Yup.string()
    .required('Approval Category is required')
    .min(3, 'Approval Category must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters long')
})

const ApprovalCategoryForm = () => {
  const dispatch = useAppDispatch()

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

        console.log('Approval Category Created:', result)
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
        toast.error('Failed to create approval category. Please try again.', {
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
  })

  const handleClear = () => {
    formik.resetForm()
  }

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
              onChange={formik.handleChange}
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
              onChange={formik.handleChange}
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
