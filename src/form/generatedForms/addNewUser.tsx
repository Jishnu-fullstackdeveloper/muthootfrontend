'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Autocomplete, Grid, Box, Button } from '@mui/material'
import DynamicButton from '@/components/Button/dynamicButton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addNewUser, updateUser, resetAddUserStatus, fetchEmployees } from '@/redux/UserManagment/userManagementSlice'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'
import { ArrowBack } from '@mui/icons-material'

type Props = {
  mode: 'add' | 'edit'
}

const AddOrEditUser: React.FC<Props> = ({ mode }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  // const params = useParams()
   const searchParams = useSearchParams()
  const userId = mode === 'edit' ? (searchParams.get('id')) : null

  const { isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage, userManagementData } =
    useAppSelector((state: any) => state.UserManagementReducer || {})
  const { userRoleData, isUserRoleLoading } = useAppSelector((state: any) => state.UserRoleReducer || {})

  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [initialFormValues, setInitialFormValues] = useState({
    employeeCode: '',
    userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    designation: '',
    roles: []
  })
  const [isFormEdited, setIsFormEdited] = useState(false)

  useEffect(() => {
    dispatch(fetchEmployees({}))
    dispatch(fetchUserRole({ page: 1, limit: 100 }))
  }, [dispatch])

  useEffect(() => {
    if (addUserFailure && addUserFailureMessage) {
      setApiErrors(
        Array.isArray(addUserFailureMessage.message)
          ? addUserFailureMessage.message
          : [addUserFailureMessage.message || 'Unknown error']
      )
    } else {
      setApiErrors([])
    }
  }, [addUserFailure, addUserFailureMessage])

  useEffect(() => {
    if (addUserSuccess) {
      if (mode === 'add') {
        router.push('/user-management')
      } else {
        
        dispatch(resetAddUserStatus())
        setIsFormEdited(false)
        setApiErrors([])
      }
    }
  }, [addUserSuccess, router, mode, dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetAddUserStatus())
    }
  }, [dispatch])

  const sanitizeRole = (role: string) => role.replace(/[^a-zA-Z0-9\s-]/g, '').trim()

  const userFormik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      employeeCode: Yup.string().required('Employee Code is required'),
      userId: Yup.string().required('AD User Id is required'),
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      roles: Yup.array()
        .of(
          Yup.string().matches(/^[a-zA-Z0-9\s-]+$/, 'Role name can only contain letters, numbers, spaces, and hyphens')
        )
        .min(1, 'At least one role is required')
    }),
    onSubmit: async values => {
      const sanitizedRoles = values.roles.map(sanitizeRole).filter(role => role.length > 0)

      if (sanitizedRoles.length === 0) {
        setApiErrors(['At least one valid role is required'])
        return
      }

      try {
        if (mode === 'edit' && userId) {
          await dispatch(
            updateUser({ id: userId, params: { email: values.email, newRoleNames: sanitizedRoles } })
          ).unwrap()
          setInitialFormValues({
            ...initialFormValues,
            email: values.email,
            roles: sanitizedRoles
          })
        } else {
          await dispatch(
            addNewUser({
              employeeCode: values.employeeCode,
              userId: values.userId,
              firstName: values.firstName,
              lastName: values.lastName,
              middleName: values.middleName,
              email: values.email,
              designation: values.designation,
              newRoleNames: sanitizedRoles
            })
          ).unwrap()
        }
      } catch (error: any) {
        setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred'])
      }
    }
  })

  useEffect(() => {
    if (mode === 'edit' && userId && userManagementData?.data?.length) {
      const existingUser = userManagementData.data.find((user: any) => user.userId === userId)
      if (existingUser) {
        const newInitialValues = {
          employeeCode: existingUser.employeeCode || '',
          userId: existingUser.userId || '',
          firstName: existingUser.firstName || '',
          middleName: existingUser.middleName || '',
          lastName: existingUser.lastName || '',
          email: existingUser.email || '',
          designation: existingUser.designation || '',
          roles: existingUser.roles?.map((role: any) => (typeof role === 'string' ? role : role.name)) || []
        }
        setInitialFormValues(newInitialValues)
      }
    }
  }, [mode, userId, userManagementData])

  useEffect(() => {
    const hasChanges = Object.keys(userFormik.values).some(
      key =>
        userFormik.values[key] !== initialFormValues[key] &&
        !(
          Array.isArray(userFormik.values[key]) &&
          Array.isArray(initialFormValues[key]) &&
          userFormik.values[key].length === initialFormValues[key].length &&
          userFormik.values[key].every((val: any, i: number) => val === initialFormValues[key][i])
        )
    )
    setIsFormEdited(hasChanges)
  }, [userFormik.values, initialFormValues])

  const roleOptions = useMemo(
    () => (userRoleData?.data || []).map((role: any) => ({ label: role.name, value: role.name })),
    [userRoleData]
  )

  const handleCancel = () => {
    if (isFormEdited) {
      userFormik.setValues(initialFormValues)
      setIsFormEdited(false)
      dispatch(resetAddUserStatus())
      setApiErrors([])
    }
  }

  return (
    <form onSubmit={userFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit User' : 'Add New User'}</h1>

      {apiErrors.length > 0 && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
          {apiErrors.map((error, index) => (
            <div key={index} className='text-red-600'>
              • {error}
            </div>
          ))}
        </div>
      )}

      <Grid container spacing={2}>
        {[
          { name: 'employeeCode', label: 'Employee Code *', disabled: mode === 'edit' },
          { name: 'userId', label: 'User ID *', disabled: mode === 'edit' },
          { name: 'firstName', label: 'First Name *', disabled: mode === 'edit' },
          { name: 'middleName', label: 'Middle Name', disabled: mode === 'edit' },
          { name: 'lastName', label: 'Last Name *', disabled: mode === 'edit' },
          { name: 'email', label: 'Email *', disabled: mode === 'edit' },
          { name: 'designation', label: 'Designation *', disabled: mode === 'edit' }
        ].map(({ name, label, disabled }) => (
          <Grid item xs={6} key={name}>
            <FormControl fullWidth margin='normal'>
              <TextField
                label={label}
                name={name}
                value={(userFormik.values as any)[name]}
                onChange={userFormik.handleChange}
                disabled={disabled}
                error={userFormik.touched[name] && Boolean(userFormik.errors[name])}
                helperText={userFormik.touched[name] && userFormik.errors[name]}
              />
            </FormControl>
          </Grid>
        ))}

        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <Autocomplete
              multiple
              options={roleOptions}
              getOptionLabel={option => option.label}
              value={roleOptions.filter(option => userFormik.values.roles.includes(option.value))}
              onChange={(event, newValue) =>
                userFormik.setFieldValue(
                  'roles',
                  newValue.map(option => option.value)
                )
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label='Roles *'
                  error={userFormik.touched.roles && Boolean(userFormik.errors.roles)}
                  helperText={userFormik.touched.roles && userFormik.errors.roles}
                />
              )}
            />
          </FormControl>
        </Grid>
      </Grid>

      <div className='flex justify-between items-center mx-5 mt-3 mb-2'>
        <Box sx={{ display: 'flex' }}>
          <Button startIcon={<ArrowBack />} variant='outlined' onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>

        <div className='flex space-x-4'>
          <DynamicButton
            type='button'
            variant='contained'
            className='bg-gray-500'
            onClick={handleCancel}
            disabled={!isFormEdited}
          >
            Clear
          </DynamicButton>
          <DynamicButton type='submit' variant='contained' className='bg-blue-500' disabled={isAddUserLoading}>
            {isAddUserLoading ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Add User'}
          </DynamicButton>
        </div>
      </div>
    </form>
  )
}

export default AddOrEditUser
