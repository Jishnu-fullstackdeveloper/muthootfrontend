'use client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, IconButton, InputAdornment, Autocomplete } from '@mui/material'
import DynamicButton from '@/components/Button/dynamicButton'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline'
import { useRouter } from 'next/navigation'

type Props = {
  mode: any
  id: any
}

const AddOrEditBucket: React.FC<Props> = ({ mode, id }) => {
  console.log('mode', mode)
  console.log('id', id)

  // Hooks inside the functional component
  const [roleCount, setRoleCount] = useState<string>('')
  const [error, setError] = useState<string>('') // Error message
  const [warning, setWarning] = useState<string>('') // Warning message
  const [designations, setDesignations] = useState<any[]>([{ designationName: '', roleCount: 1 }])

  // Formik Setup
  const bucketFormik = useFormik({
    initialValues: {
      bucketName: '',
      turnoverLimit: '',
      turnoverId: '',
      note: '',
      designations: [{ designationName: '', roleCount: 1 }]
    },
    validationSchema: Yup.object().shape({
      bucketName: Yup.string().required('Bucket Name is required'),
      turnoverLimit: Yup.number().required('Turnover Limit is required'),
      turnoverId: Yup.string().required('Turnover ID is required'),
      note: Yup.string(),
      designations: Yup.array()
        .of(
          Yup.object().shape({
            designationName: Yup.string().required('Designation is required'),
            roleCount: Yup.number().required('Role Count is required').min(1)
          })
        )
        .min(1, 'At least one designation is required')
    }),
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  const router = useRouter()

  // Cancel button handler
  const handleCancel = () => {
    router.back()
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = event.target.value
    const newDesignations = [...designations]

    // Allow empty input or valid role count
    if (value === '') {
      newDesignations[index].roleCount = '' // Empty input for backspace
      setWarning('') // Remove warning
      setError('')
    } else if (parseInt(value, 10) === 0) {
      setError('Value cannot be zero') // Show error in red
      setWarning('')
      newDesignations[index].roleCount = '' // Reset if zero
    } else {
      setError('')
      setWarning('')
      newDesignations[index].roleCount = parseInt(value, 10)
    }
    setDesignations(newDesignations)
  }

  return (
    <form onSubmit={bucketFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Bucket Management Form</h1>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Bucket Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          <FormControl fullWidth margin='normal'>
            <label htmlFor='bucketName' className='block text-sm font-medium text-gray-700'>
              Bucket Name *
            </label>
            <TextField
              id='bucketName'
              name='bucketName'
              type='text'
              value={bucketFormik.values.bucketName}
              onChange={bucketFormik.handleChange}
              onFocus={() => bucketFormik.setFieldTouched('bucketName', true)}
              error={bucketFormik.touched.bucketName && Boolean(bucketFormik.errors.bucketName)}
              helperText={bucketFormik.touched.bucketName && bucketFormik.errors.bucketName ? String(bucketFormik.errors.bucketName) : undefined}
            />
          </FormControl>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormControl fullWidth margin='normal'>
            <label htmlFor='turnoverLimit' className='block text-sm font-medium text-gray-700'>
              Turnover Limit *
            </label>
            <TextField
              id='turnoverLimit'
              name='turnoverLimit'
              type='number'
              value={bucketFormik.values.turnoverLimit}
              onChange={bucketFormik.handleChange}
              onFocus={() => bucketFormik.setFieldTouched('turnoverLimit', true)}
              error={bucketFormik.touched.turnoverLimit && Boolean(bucketFormik.errors.turnoverLimit)}
              helperText={bucketFormik.touched.turnoverLimit && bucketFormik.errors.turnoverLimit ? String(bucketFormik.errors.turnoverLimit) : undefined}
              InputProps={{
                startAdornment: <InputAdornment position='start'>₹</InputAdornment>
              }}
            />
          </FormControl>

          {mode === 'add' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='turnoverId' className='block text-sm font-medium text-gray-700'>
                Turnover ID *
              </label>
              <TextField
                id='turnoverId'
                name='turnoverId'
                type='text'
                value={bucketFormik.values.turnoverId}
                onChange={bucketFormik.handleChange}
                onFocus={() => bucketFormik.setFieldTouched('turnoverId', true)}
                error={bucketFormik.touched.turnoverId && Boolean(bucketFormik.errors.turnoverId)}
                helperText={bucketFormik.touched.turnoverId && bucketFormik.errors.turnoverId ? String(bucketFormik.errors.turnoverId) : undefined}
              />
            </FormControl>
          )}
        </div>

        <div>
          <h4>Designations</h4>
          {designations.map((designation, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '16px',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div style={{ width: '300px' }}>
                <Autocomplete
                  options={['Manager', 'Lead', 'Member', 'Assistant', 'Director']}
                  value={designation.designationName}
                  onChange={(e, value) => {
                    const newDesignations = [...designations]
                    newDesignations[index].designationName = value || ''
                    setDesignations(newDesignations)
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={`Designation ${index + 1}`}
                      error={bucketFormik.touched.designations && Boolean(bucketFormik.errors.designations)}
                      helperText={bucketFormik.touched.designations && bucketFormik.errors.designations ? bucketFormik.errors.designations : ''}
                      style={{ width: '100%' }}
                    />
                  )}
                />
              </div>

              <div style={{ width: '150px', marginLeft: '10px' }}>
                <TextField
                  label='Role Count'
                  type='number'
                  value={designation.roleCount === '' ? '' : designation.roleCount} 
                  onChange={(e) => handleTextFieldChange(e, index)} 
                  onBlur={e => {
                    if (e.target.value === '') {
                      const newDesignations = [...designations]
                      newDesignations[index].roleCount = 1
                      setDesignations(newDesignations)
                      setRoleCount('')
                      setWarning('')
                      setError('')
                    }
                  }}
                  error={bucketFormik.touched.designations && !!bucketFormik.errors.designations}
                  helperText={error || warning}
                  fullWidth
                />
              </div>

              {designations.length > 1 && index > 0 && (
                <IconButton
                  color='secondary'
                  onClick={() => setDesignations(designations.filter((_, i) => i !== index))}
                >
                  <RemoveIcon />
                </IconButton>
              )}

              {index === designations.length - 1 && (
                <IconButton
                  color='primary'
                  onClick={() => setDesignations([...designations, { designationName: '', roleCount: 1 }])}
                >
                  <AddIcon />
                </IconButton>
              )}
            </div>
          ))}
        </div>

        <FormControl fullWidth margin='normal'>
          <label htmlFor='note' className='block text-sm font-medium text-gray-700'>
            Note
          </label>
          <TextField
            id='note'
            name='note'
            multiline
            rows={4}
            value={bucketFormik.values.note}
            onChange={bucketFormik.handleChange}
            onFocus={() => bucketFormik.setFieldTouched('note', true)}
            error={bucketFormik.touched.note && Boolean(bucketFormik.errors.note)}
            helperText={bucketFormik.touched.note && bucketFormik.errors.note ? bucketFormik.errors.note : undefined}
          />
        </FormControl>
      </fieldset>

      {/* Submit and Cancel Buttons */}
      <div className='flex justify-end space-x-4'>
        <DynamicButton
          type='button'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          onClick={handleCancel}
        >
          Cancel
        </DynamicButton>

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Save
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditBucket
