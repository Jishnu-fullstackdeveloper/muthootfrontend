'use client'

import React, { useEffect, useState, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Autocomplete, Grid, Box, Button, CircularProgress } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import DynamicButton from '@/components/Button/dynamicButton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addNewUser, updateUser, resetAddUserStatus, fetchEmployees } from '@/redux/UserManagment/userManagementSlice'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

type Props = {
  mode: 'add' | 'edit'
}

interface GroupRole {
  id: string
  name: string
  description: string
  permissions: string[]
}

interface DesignationRole {
  id: string
  name: string
  description: string
  groupRoles: GroupRole[]
}

interface RoleOption {
  label: string
  value: string
}

const AddOrEditUser: React.FC<Props> = ({ mode }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = mode === 'edit' ? searchParams.get('id') : null

  const { isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage, userManagementData } =
    useAppSelector((state: any) => state.UserManagementReducer || {})

  const { userRoleData } = useAppSelector((state: any) => state.UserRoleReducer || {})

  const [apiErrors, setApiErrors] = useState<string[]>([])

  const [initialFormValues, setInitialFormValues] = useState({
    employeeCode: '',
    userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    designation: '',
    designationRole: null as RoleOption | null,
    roles: [] as string[]
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

  const cleanName = (name: string, prefix: string) => {
    if (!name) return ''

    return name.replace(new RegExp(`^${prefix}`), '').trim()
  }

  // Modified to preserve underscores in role names
  const sanitizeRole = (role: string) => role.trim()

  const userFormik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      employeeCode: Yup.string().required('Employee Code is required'),
      userId: Yup.string().required('AD User Id is required'),
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      designation: Yup.string().required('Designation is required'),
      designationRole: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.string()
        })
        .nullable()
        .required('Designation Role is required'),
      roles: Yup.array().min(1, 'At least one role is required')
    }),
    onSubmit: async values => {
      const sanitizedRoles = values.roles.map(sanitizeRole).filter(role => role.length > 0)

      if (sanitizedRoles.length === 0) {
        setApiErrors(['At least one valid role is required'])

        return
      }

      try {
        if (mode === 'edit' && userId) {
          const payload = {
            id: userId,
            params: {
              email: values.email,
              designation: values.designation,
              designationRole: values.designationRole?.value,
              newRoleNames: sanitizedRoles
            }
          }

          console.log('Edit Payload:', payload)
          await dispatch(updateUser(payload)).unwrap()
          setInitialFormValues({
            ...initialFormValues,
            email: values.email,
            designation: values.designation,
            designationRole: values.designationRole,
            roles: sanitizedRoles
          })
        } else {
          const payload = {
            employeeCode: values.employeeCode,
            userId: values.userId,
            firstName: values.firstName,
            lastName: values.lastName,
            middleName: values.middleName,
            email: values.email,
            designation: values.designation,
            designationRole: values.designationRole?.value,
            newRoleNames: sanitizedRoles
          }

          console.log('Add Payload:', payload)
          await dispatch(addNewUser(payload)).unwrap()
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
        const designationRole = existingUser.designationRole
          ? {
              label: cleanName(existingUser.designationRole.name, 'des_'),
              value: existingUser.designationRole.name
            }
          : null

        const newInitialValues = {
          employeeCode: existingUser.employeeCode || '',
          userId: existingUser.userId || '',
          firstName: existingUser.firstName || '',
          middleName: existingUser.middleName || '',
          lastName: existingUser.lastName || '',
          email: existingUser.email || '',
          designation: existingUser.designation || '',
          designationRole,
          roles: existingUser.groupRoles?.map((role: any) => role.name) || []
        }

        setInitialFormValues(newInitialValues)
      }
    }
  }, [mode, userId, userManagementData])

  useEffect(() => {
    const hasChanges = Object.keys(userFormik.values).some(key => {
      if (key === 'designationRole') {
        return (
          userFormik.values.designationRole?.value !== initialFormValues.designationRole?.value ||
          userFormik.values.designationRole?.label !== initialFormValues.designationRole?.label
        )
      }

      return (
        userFormik.values[key] !== initialFormValues[key] &&
        !(
          Array.isArray(userFormik.values[key]) &&
          Array.isArray(initialFormValues[key]) &&
          userFormik.values[key].length === initialFormValues[key].length &&
          userFormik.values[key].every((val: any, i: number) => val === initialFormValues[key][i])
        )
      )
    })

    setIsFormEdited(hasChanges)
  }, [userFormik.values, initialFormValues])

  const designationRoleOptions = useMemo(
    () =>
      (userRoleData?.data || []).map((role: DesignationRole) => ({
        label: cleanName(role.name, 'des_'),
        value: role.name
      })),
    [userRoleData]
  )

  const groupRoleOptions = useMemo(() => {
    if (!userRoleData?.data) return []

    return userRoleData.data
      .flatMap((d: DesignationRole) =>
        Array.isArray(d.groupRoles)
          ? d.groupRoles.map((gr: GroupRole) => ({
              label: cleanName(gr.name || '', 'grp_'),
              value: gr.name || ''
            }))
          : []
      )
      .filter((option, index, self) => option.value && index === self.findIndex(o => o.value === option.value))
  }, [userRoleData])

  const handleCancel = () => {
    if (isFormEdited) {
      userFormik.setValues(initialFormValues)
      setIsFormEdited(false)
      dispatch(resetAddUserStatus())
      setApiErrors([])
    }
  }

  if (!userRoleData || !userManagementData || isAddUserLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
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
                value={userFormik.values[name as keyof typeof userFormik.values]}
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
              options={designationRoleOptions}
              getOptionLabel={option => option.label}
              value={userFormik.values.designationRole}
              onChange={(event, newValue) => {
                userFormik.setFieldValue('designationRole', newValue)
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Designation Role *'
                  error={userFormik.touched.designationRole && Boolean(userFormik.errors.designationRole)}
                  helperText={userFormik.touched.designationRole && userFormik.errors.designationRole}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <Autocomplete
              multiple
              options={groupRoleOptions}
              getOptionLabel={option => option.label}
              value={groupRoleOptions.filter(option => userFormik.values.roles.includes(option.value))}
              onChange={(event, newValue) =>
                userFormik.setFieldValue(
                  'roles',
                  newValue.map(option => option.value)
                )
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label='Group Roles *'
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
