'use client'
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, MenuItem, FormControlLabel } from '@mui/material'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicCheckbox from '@/components/Checkbox/dynamicCheckbox'

const validationSchema = Yup.object().shape({
  approvalType: Yup.string().required('Approval Type is required'),
  numberOfLevels: Yup.string().required('Number of Levels is required'),
  levelNumber: Yup.string().required('Level Number is required'),
  approver: Yup.string().required('Approver is required')
})

const AddNewApprovalMatrixGenerated: React.FC = () => {
  const formik: any = useFormik({
    initialValues: { approvalType: '', numberOfLevels: '', levelNumber: '', approver: '' },
    validationSchema,
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Approval Process Form</h1>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Approval Type</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='approvalType' className='block text-sm font-medium text-gray-700'>
                Approval Type *
              </label>
              <DynamicSelect
                id='approvalType'
                name='approvalType'
                value={formik.values.approvalType}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('approvalType', true)}
                error={formik.touched.approvalType && Boolean(formik.errors.approvalType)}
                helperText={formik.touched.approvalType && formik.errors.approvalType ? formik.errors.approvalType : ''}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Sequential Approval'>Sequential Approval</MenuItem>
                <MenuItem value='Parallel Approval'>Parallel Approval</MenuItem>
                <MenuItem value='Single Approval'>Single Approval</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='numberOfLevels' className='block text-sm font-medium text-gray-700'>
                Number of Levels *
              </label>
              <DynamicTextField
                id='numberOfLevels'
                name='numberOfLevels'
                type='number'
                value={formik.values.numberOfLevels}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('numberOfLevels', true)}
                error={formik.touched.numberOfLevels && Boolean(formik.errors.numberOfLevels)}
                helperText={
                  formik.touched.numberOfLevels && formik.errors.numberOfLevels
                    ? formik.errors.numberOfLevels
                    : undefined
                }
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Approval Levels</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='levelNumber' className='block text-sm font-medium text-gray-700'>
                Level Number *
              </label>
              <DynamicTextField
                id='levelNumber'
                name='levelNumber'
                type='number'
                value={formik.values.levelNumber}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('levelNumber', true)}
                error={formik.touched.levelNumber && Boolean(formik.errors.levelNumber)}
                helperText={
                  formik.touched.levelNumber && formik.errors.levelNumber ? formik.errors.levelNumber : undefined
                }
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='approver' className='block text-sm font-medium text-gray-700'>
                Approver *
              </label>
              <DynamicSelect
                id='approver'
                name='approver'
                value={formik.values.approver}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('approver', true)}
                error={formik.touched.approver && Boolean(formik.errors.approver)}
                helperText={formik.touched.approver && formik.errors.approver ? formik.errors.approver : ''}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Branch Manager'>Branch Manager</MenuItem>
                <MenuItem value='HR Manager'>HR Manager</MenuItem>
                <MenuItem value='Director'>Director</MenuItem>
                <MenuItem value='CEO'>CEO</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}
        </div>
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton type='button' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Cancel
        </DynamicButton>

        <DynamicButton type='button' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Save Draft
        </DynamicButton>

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Submit
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddNewApprovalMatrixGenerated
