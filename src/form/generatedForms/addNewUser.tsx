'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Autocomplete, Grid, Box, Button, CircularProgress } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import DynamicButton from '@/components/Button/dynamicButton'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addNewUser, updateUser, resetAddUserStatus, fetchUserById } from '@/redux/UserManagment/userManagementSlice'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

type Props = {
  mode: 'add' | 'edit'
  id?: string
}

const AddOrEditUser: React.FC<Props> = ({ mode }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = mode === 'edit' ? searchParams.get('id') : null

  const { isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage, selectedUser } = useAppSelector(
    (state: any) => state.UserManagementReducer || {}
  )

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
    designationRole: '',
    groupRoles: [] as string[]
  })

  const [isFormEdited, setIsFormEdited] = useState(false)

  // State for lazy loading of group roles
  const [groupRolesPage, setGroupRolesPage] = useState(1)
  const [allGroupRoles, setAllGroupRoles] = useState<any[]>([]) // Store all fetched group roles
  const [hasMoreGroupRoles, setHasMoreGroupRoles] = useState(true) // Flag to check if more roles are available
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set()) // Track which pages have been loaded

  // Fetch user data and initial roles on component mount
  useEffect(() => {
    // Fetch user by ID if in edit mode
    if (mode === 'edit' && userId) {
      dispatch(fetchUserById(userId))
    }

    // Fetch initial roles if not already loaded
    if (!loadedPages.has(1)) {
      dispatch(fetchUserRole({ page: 1, limit: 100 }))
      setLoadedPages(prev => new Set(prev).add(1))
    }
  }, [dispatch, mode, userId, loadedPages])

  // Handle fetched roles and append to allGroupRoles
  useEffect(() => {
    if (userRoleData?.data) {
      const newGroupRoles = userRoleData.data.flatMap((role: any) => role.groupRoles || []).filter(Boolean)

      if (newGroupRoles.length === 0) {
        setHasMoreGroupRoles(false)
      } else {
        setAllGroupRoles(prevRoles => {
          // Create a map of existing roles for quick lookup
          const existingRoles = new Map(prevRoles.map(role => [role.name, role]))

          // Filter out duplicates from new roles
          const uniqueNewRoles = newGroupRoles.filter((role: any) => !existingRoles.has(role.name))

          return [...prevRoles, ...uniqueNewRoles]
        })
        setHasMoreGroupRoles(newGroupRoles.length === 100) // If we get 100 roles, there might be more
      }
    }
  }, [userRoleData])

  useEffect(() => {
    if (addUserFailure && addUserFailureMessage) {
      setApiErrors(
        Array.isArray(addUserFailureMessage.message)
          ? [...new Set(addUserFailureMessage.message)]
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
        // After successful update, refetch user data to reflect updated group roles
        if (userId) {
          dispatch(fetchUserById(userId))
        }

        dispatch(resetAddUserStatus())
        setIsFormEdited(false)
        setApiErrors([])
      }
    }
  }, [addUserSuccess, router, mode, dispatch, userId])

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
      designation: Yup.string().required('Designation is required'),
      designationRole: Yup.string()
    }),
    onSubmit: async values => {
      const sanitizedGroupRoles = values.groupRoles.map(sanitizeRole).filter(role => role.length > 0)
      const backendGroupRoles = values.groupRoles.map(role => (role.startsWith('grp_') ? role : `grp_${role}`))

      try {
        if (mode === 'edit' && userId) {
          if (initialFormValues.designationRole === 'des_default_role') {
            // When initial designationRole is 'des_default_role', send email, newDesignationRole, and groupRoles
            await dispatch(
              updateUser({
                id: userId,
                params: {
                  email: values.email,
                  newDesignationRole: values.designationRole || '',
                  newRoleNames: backendGroupRoles
                }
              })
            ).unwrap()
            setInitialFormValues({
              ...initialFormValues,
              email: values.email,
              designationRole: values.designationRole,
              groupRoles: sanitizedGroupRoles
            })
          } else {
            // Otherwise, send email and newRoleNames
            await dispatch(
              updateUser({
                id: userId,
                params: {
                  email: values.email,
                  newRoleNames: backendGroupRoles
                }
              })
            ).unwrap()
            setInitialFormValues({
              ...initialFormValues,
              email: values.email,
              groupRoles: sanitizedGroupRoles
            })
          }
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
              newDesignationRole: values.designationRole || '',
              newRoleNames: backendGroupRoles
            })
          ).unwrap()
        }
      } catch (error: any) {
        const errorMessages = Array.isArray(error.message)
          ? [...new Set(error.message)]
          : [error.message || 'An error occurred']

        setApiErrors(errorMessages)
      }
    }
  })

  // Update initial form values when selectedUser is available
  useEffect(() => {
    if (mode === 'edit' && userId && selectedUser) {
      const newInitialValues = {
        employeeCode: selectedUser.employeeCode || '',
        userId: selectedUser.userId || '',
        firstName: selectedUser.firstName || '',
        middleName: selectedUser.middleName || '',
        lastName: selectedUser.lastName || '',
        email: selectedUser.email || '',
        designation: selectedUser.designation || '',
        designationRole: selectedUser.designationRole?.name || '',
        groupRoles:
          selectedUser.designationRole?.groupRoles?.map((role: any) =>
            typeof role === 'string' ? role.replace(/^grp_/, '') : role.name.replace(/^grp_/, '')
          ) || []
      }

      setInitialFormValues(newInitialValues)
    }
  }, [mode, userId, selectedUser])

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

  const designationRoleOptions = useMemo(() => {
    const roles = (userRoleData?.data || []).map((role: any) => ({
      label: role.name.replace(/^des_/, ''),
      value: role.name
    }))

    if (!roles.some(role => role.value === '')) {
      roles.unshift({ label: 'None', value: '' })
    }

    return roles
  }, [userRoleData])

  const groupRoleOptions = useMemo(() => {
    // Use a Set to ensure unique values
    const uniqueRoles = new Map<string, { label: string; value: string }>()

    allGroupRoles.forEach((role: any) => {
      const formattedName = role.name.replace(/^grp_/, '')
      const formattedLabel = formattedName.replace(/_/g, ' ')

      if (!uniqueRoles.has(formattedName)) {
        uniqueRoles.set(formattedName, {
          label: formattedLabel,
          value: formattedName
        })
      }
    })

    return Array.from(uniqueRoles.values())
  }, [allGroupRoles])

  // Handle scroll to bottom of group roles Autocomplete
  const handleGroupRolesScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const listboxNode = event.currentTarget
      const scrollPosition = listboxNode.scrollTop + listboxNode.clientHeight
      const scrollThreshold = listboxNode.scrollHeight - 50 // Trigger 50px before the bottom

      if (scrollPosition >= scrollThreshold && !isUserRoleLoading && hasMoreGroupRoles) {
        const nextPage = groupRolesPage + 1

        // Only fetch if we haven't loaded this page before
        if (!loadedPages.has(nextPage)) {
          setGroupRolesPage(nextPage)
          dispatch(fetchUserRole({ page: nextPage, limit: 100 }))
          setLoadedPages(prev => new Set(prev).add(nextPage))
        }
      }
    },
    [isUserRoleLoading, hasMoreGroupRoles, groupRolesPage, dispatch, loadedPages]
  )

  const handleCancel = () => {
    if (isFormEdited) {
      userFormik.setValues(initialFormValues)
      setIsFormEdited(false)
      dispatch(resetAddUserStatus())
      setApiErrors([])
    }
  }

  const isDesignationRoleEditable = initialFormValues.designationRole === 'des_default_role'

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
              options={designationRoleOptions}
              getOptionLabel={option => option.label}
              value={designationRoleOptions.find(option => option.value === userFormik.values.designationRole) || null}
              onChange={(event, newValue) =>
                userFormik.setFieldValue('designationRole', newValue ? newValue.value : '')
              }
              disabled={mode === 'edit' && !isDesignationRoleEditable}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Designation Role'
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
              value={groupRoleOptions.filter(option => userFormik.values.groupRoles.includes(option.value))}
              onChange={(event, newValue) =>
                userFormik.setFieldValue(
                  'groupRoles',
                  newValue.map(option => option.value)
                )
              }
              disabled={mode === 'edit' && isDesignationRoleEditable}
              ListboxProps={{
                onScroll: handleGroupRolesScroll,
                style: { maxHeight: 200, overflow: 'auto' }
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Group Roles *'
                  error={userFormik.touched.groupRoles && Boolean(userFormik.errors.groupRoles)}
                  helperText={userFormik.touched.groupRoles && (userFormik.errors.groupRoles as string)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isUserRoleLoading && <CircularProgress color='inherit' size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
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
