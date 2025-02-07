'use client'
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Autocomplete, TextField, FormControl, FormGroup, FormControlLabel, Checkbox, Grid } from '@mui/material'
import DynamicButton from '@/components/Button/dynamicButton'
import { styled } from '@mui/material/styles'
import { useAppDispatch } from '@/lib/hooks'
import { manualRecruitmentRequest } from '@/redux/manualRecruitmentRequestSlice'

const optionsData = {
  designation: ['Software Engineer', 'Project Manager', 'UI/UX Designer', 'Data Scientist'],
  department: ['IT', 'HR', 'Finance', 'Operations'],
  category: ['Technical', 'Non-Technical', 'Management', 'Support'],
  band: ['G1', 'G2', 'G3', 'G4']
}

const permissions = ['Read', 'View', 'Delete', 'Edit']

const validationSchema = Yup.object({
  designation: Yup.string().required('Designation is required'),
  department: Yup.string().required('Department is required'),
  category: Yup.string().required('Category is required'),
  band: Yup.string().required('Band is required'),
})

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiAutocomplete-paper': {
    maxHeight: 150,
    overflowY: 'auto'
  }
})

const AddUserPermissionList: React.FC = () => {
  const dispatch = useAppDispatch()
  
  const requestFormik = useFormik({
    initialValues: {
      designation: '',
      department: '',
      category: '',
      band: '',
      permissions: []
    },
    validationSchema,
    onSubmit: values => {
      let params = {
        gradeId: 0,
        branchId: 0,
        permissions: values.permissions
      }
      dispatch(manualRecruitmentRequest(params))
      console.log('Form Submitted:', values)
    }
  })

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target
    requestFormik.setFieldValue(
      'permissions',
      checked
        ? [...requestFormik.values.permissions, value]
        : requestFormik.values.permissions.filter((perm: string) => perm !== value)
    )
  }

  return (
    <form onSubmit={requestFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Recruitment Request Form</h1>

      <Grid container spacing={3}>
        {Object.entries(optionsData).map(([key, options]) => (
          <Grid item xs={12} sm={6} key={key}>
            <FormControl fullWidth margin='normal'>
              <label htmlFor={key} className='block text-sm font-medium text-gray-700'>
                {key.charAt(0).toUpperCase() + key.slice(1)} *
              </label>
              <StyledAutocomplete
                id={key}
                options={options}
                disableClearable
                onChange={(_, value) => requestFormik.setFieldValue(key, value)}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={requestFormik.touched[key] && Boolean(requestFormik.errors[key])}
                    helperText={requestFormik.touched[key] && requestFormik.errors[key]}
                  />
                )}
              />
            </FormControl>
          </Grid>
        ))}
      </Grid>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Permissions</legend>
        <FormGroup row>
          {permissions.map(permission => (
            <FormControlLabel
              key={permission}
              control={
                <Checkbox
                  value={permission}
                  onChange={handleCheckboxChange}
                  checked={requestFormik.values.permissions.includes(permission)}
                />
              }
              label={permission}
            />
          ))}
        </FormGroup>
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton type='button' variant='contained' className='bg-gray-500 text-white hover:bg-gray-700'>
          Cancel
        </DynamicButton>
        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Submit
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddUserPermissionList
