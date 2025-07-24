'use client'

import React, { useState, useMemo, useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  FormControl,
  TextField,
  Autocomplete,
  Grid,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import DynamicButton from '@/components/Button/dynamicButton'
import {
  addNewBucket,
  fetchBucketDismiss,
  updateBucket,
  fetchBucketById,
  fetchJobRole
} from '@/redux/BucketManagemnet/BucketManagementSlice'
import type { RootState } from '@/redux/store'

type Props = {
  mode: 'add' | 'edit'
}

// interface PositionCategory {
//   jobRole: string
//   count: number
// }

interface JobRoleOption {
  label: string
  value: string
}

const AddOrEditUser: React.FC<Props> = ({ mode }) => {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    jobRoleData,
    isJobRoleLoading,
    jobRoleFailureMessage,
    selectedBucketData,
    isBucketByIdLoading,
    bucketByIdSuccess,
    bucketByIdFailureMessage,
    isAddBucketLoading,
    addBucketSuccess,
    addBucketFailureMessage,
    isUpdateBucketLoading,
    updateBucketSuccess,
    updateBucketFailureMessage
  } = useAppSelector((state: RootState) => state.BucketManagementReducer)

  const [isFormEdited, setIsFormEdited] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [page] = useState(1)
  const [limit] = useState(10)

  const [initialFormValues, setInitialFormValues] = useState({
    name: '',
    level: '',
    positionCategories: mode === 'add' ? [{ jobRole: '', count: 1 }] : selectedBucketData?.positionCategories || []
  })

  // Map jobRoleData to the format expected by Autocomplete
  const jobRoleOptions: JobRoleOption[] = useMemo(() => {
    if (jobRoleData?.data) {
      return jobRoleData.data.map(role => ({
        label: role.name,
        value: role.name // Use name as value
      }))
    }

    return []
  }, [jobRoleData])

  useEffect(() => {
    dispatch(fetchJobRole({ page, limit }))
  }, [dispatch, page, limit])

  useEffect(() => {
    if (mode === 'edit' && id) {
      dispatch(fetchBucketById(id as string))
    }
  }, [mode, id, dispatch])

  useEffect(() => {
    if (mode === 'edit' && bucketByIdSuccess && selectedBucketData) {
      setInitialFormValues({
        name: selectedBucketData.name || '',
        level: selectedBucketData.level?.toString() || '',
        positionCategories: selectedBucketData.positionCategories || []
      })
    }
  }, [mode, bucketByIdSuccess, selectedBucketData])

  const userFormik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      level: Yup.number().required('Level is required').min(1, 'Level must be at least 1'),
      positionCategories: Yup.array()
        .of(
          Yup.object().shape({
            jobRole: Yup.string().required('Job role is required'),
            count: Yup.number().required('Count is required').min(1, 'Count must be at least 1')
          })
        )
        .min(1, 'At least one position category is required')
    }),
    onSubmit: async values => {
      try {
        if (mode === 'edit' && id) {
          await dispatch(
            updateBucket({
              id: id as string,
              params: { positionCategories: values.positionCategories }
            })
          ).unwrap()
        } else {
          const requestBody = {
            name: values.name,
            level: parseInt(values.level),
            positionCategories: values.positionCategories
          }

          await dispatch(addNewBucket(requestBody)).unwrap()
        }

        setInitialFormValues(values)
        setIsFormEdited(false)
        setSnackbarOpen(true)
        router.push('/bucket-management')
      } catch (error) {
        setSnackbarOpen(true)
      }
    }
  })

  const handleCancel = () => {
    if (isFormEdited) {
      userFormik.setValues(initialFormValues)
      setIsFormEdited(false)
      dispatch(fetchBucketDismiss())
    }
  }

  const handleAddPositionCategory = () => {
    const availableOptions = jobRoleOptions.filter(
      opt => !userFormik.values.positionCategories.some(cat => cat.jobRole === opt.value)
    )

    if (availableOptions.length > 0) {
      const newCategory = { jobRole: availableOptions[0].value, count: 1 }

      userFormik.setFieldValue('positionCategories', [...userFormik.values.positionCategories, newCategory])
      setIsFormEdited(true)
    }
  }

  const handleDeletePositionCategory = (jobRole: string) => {
    const updatedCategories = userFormik.values.positionCategories.filter(cat => cat.jobRole !== jobRole)

    userFormik.setFieldValue('positionCategories', updatedCategories)
    setIsFormEdited(true)
  }

  const handlePositionCategoryChange = (index: number, newValue: JobRoleOption | null) => {
    if (newValue) {
      const updatedCategories = [...userFormik.values.positionCategories]

      updatedCategories[index] = { ...updatedCategories[index], jobRole: newValue.value }
      userFormik.setFieldValue('positionCategories', updatedCategories)
      setIsFormEdited(true)
    }
  }

  const handleCountChange = (index: number, count: number) => {
    const updatedCategories = [...userFormik.values.positionCategories]

    updatedCategories[index] = { ...updatedCategories[index], count }
    userFormik.setFieldValue('positionCategories', updatedCategories)
    setIsFormEdited(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    dispatch(fetchBucketDismiss())
  }

  const isLoading =
    mode === 'edit' ? isUpdateBucketLoading || isBucketByIdLoading : isAddBucketLoading || isJobRoleLoading

  const isSuccess = mode === 'edit' ? updateBucketSuccess : addBucketSuccess

  const failureMessage =
    mode === 'edit'
      ? updateBucketFailureMessage || bucketByIdFailureMessage
      : addBucketFailureMessage || jobRoleFailureMessage

  return (
    <form onSubmit={userFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit Bucket' : 'Add New Bucket'}</h1>

      {((isBucketByIdLoading && mode === 'edit') || isJobRoleLoading) && (
        <Box display='flex' justifyContent='center' my={2}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Name *'
              name='name'
              value={userFormik.values.name}
              onChange={e => {
                userFormik.handleChange(e)
                setIsFormEdited(true)
              }}
              error={userFormik.touched.name && Boolean(userFormik.errors.name)}
              helperText={userFormik.touched.name && userFormik.errors.name}
              disabled={isLoading || mode === 'edit'}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Level *'
              name='level'
              type='number'
              value={userFormik.values.level}
              onChange={e => {
                userFormik.handleChange(e)
                setIsFormEdited(true)
              }}
              error={userFormik.touched.level && Boolean(userFormik.errors.level)}
              helperText={userFormik.touched.level && userFormik.errors.level}
              disabled={isLoading || mode === 'edit'}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box display='flex' alignItems='center' mb={2}>
            <h3 className='text-lg font-semibold'>Position Categories *</h3>
          </Box>

          {userFormik.values.positionCategories.map((category, index) => (
            <Grid container spacing={2} key={index} alignItems='center'>
              <Grid item xs={5}>
                <FormControl fullWidth margin='normal'>
                  <Autocomplete
                    options={jobRoleOptions.filter(
                      opt =>
                        !userFormik.values.positionCategories.some((cat, i) => cat.jobRole === opt.value && i !== index)
                    )}
                    getOptionLabel={option => option.label}
                    value={jobRoleOptions.find(opt => opt.value === category.jobRole) || null}
                    onChange={(event, newValue) => handlePositionCategoryChange(index, newValue)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Job Role *'
                        placeholder='Select Job Role'
                        error={
                          userFormik.touched.positionCategories?.[index]?.jobRole &&
                          Boolean(userFormik.errors.positionCategories?.[index]?.jobRole)
                        }
                        helperText={
                          userFormik.touched.positionCategories?.[index]?.jobRole &&
                          (userFormik.errors.positionCategories?.[index]?.jobRole as string)
                        }
                      />
                    )}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={5}>
                <FormControl fullWidth margin='normal'>
                  <TextField
                    label='Count *'
                    type='number'
                    value={category.count}
                    onChange={e => handleCountChange(index, parseInt(e.target.value) || 1)}
                    error={
                      userFormik.touched.positionCategories?.[index]?.count &&
                      Boolean(userFormik.errors.positionCategories?.[index]?.count)
                    }
                    helperText={
                      userFormik.touched.positionCategories?.[index]?.count &&
                      (userFormik.errors.positionCategories?.[index]?.count as string)
                    }
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={2} display='flex' alignItems='center' gap={1}>
                <IconButton
                  color='error'
                  onClick={() => handleDeletePositionCategory(category.jobRole)}
                  disabled={userFormik.values.positionCategories.length <= 1 || isLoading}
                >
                  <DeleteIcon />
                </IconButton>

                {index === userFormik.values.positionCategories.length - 1 && (
                  <IconButton
                    color='primary'
                    onClick={handleAddPositionCategory}
                    disabled={userFormik.values.positionCategories.length >= jobRoleOptions.length || isLoading}
                    sx={{
                      backgroundColor: '#E0F7FA', // light cyan or use your preferred color
                      borderRadius: '50%',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: '#B2EBF2' // darker shade on hover
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          {userFormik.touched.positionCategories && userFormik.errors.positionCategories && (
            <Box color='error.main' mt={1}>
              {typeof userFormik.errors.positionCategories === 'string' && userFormik.errors.positionCategories}
            </Box>
          )}
        </Grid>
      </Grid>

      <div className='flex justify-between items-center mx-5 mt-3 mb-2'>
        <Box sx={{ display: 'flex' }}>
          <Button variant='outlined' onClick={() => router.back()} disabled={isLoading}>
            Go Back
          </Button>
        </Box>

        <div className='flex space-x-4'>
          <DynamicButton
            type='button'
            variant='contained'
            className='bg-gray-500'
            onClick={handleCancel}
            disabled={!isFormEdited || isLoading}
          >
            Clear
          </DynamicButton>
          <DynamicButton type='submit' variant='contained' className='bg-blue-500' disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : mode === 'edit' ? 'Update Bucket' : 'Add Bucket'}
          </DynamicButton>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={isSuccess ? 'success' : 'error'} sx={{ width: '100%' }}>
          {isSuccess
            ? mode === 'edit'
              ? 'Bucket updated successfully'
              : 'Bucket added successfully'
            : Array.isArray(failureMessage)
              ? failureMessage.join(', ')
              : failureMessage || 'An error occurred'}
        </Alert>
      </Snackbar>
    </form>
  )
}

export default AddOrEditUser
