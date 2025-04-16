'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Checkbox, FormControlLabel, Box, Typography, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addNewUserRole, updateUserRole, resetAddUserRoleStatus, fetchUserRole } from '@/redux/UserRoles/userRoleSlice'
import DynamicButton from '@/components/Button/dynamicButton'
import { ArrowBack } from '@mui/icons-material'

const defaultPermissionsList = [
  { module: 'Home Dashboard', actions: ['read'] },
  { module: 'User Management', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'User Roles', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'Approvals ', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'Candidate Management', actions: ['read'] },
  { module: 'JD Management', actions: ['read', 'update', 'delete', 'create', 'upload', 'approval'] },
  { module: 'Vaccancy Management', actions: ['read', 'update'] },
  { module: 'Budget Management', actions: ['read', 'create', 'approval'] },
  { module: 'Branch Management', actions: ['read'] },
  { module: 'Approval Matrix', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'General Settings', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'Employee Management', actions: ['read'] }
]

const AddOrEditUserRole: React.FC<{ mode: 'add' | 'edit'; id?: string }> = ({ mode, id }) => {
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [initialFormValues, setInitialFormValues] = useState({
    roleName: '',
    description: '',
    permissions: defaultPermissionsList.map(p => ({
      module: p.module,
      selectedActions: p.module === 'Home Dashboard' ? ['read'] : []
    }))
  })
  const [isFormEdited, setIsFormEdited] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    isAddUserRoleLoading,
    addUserRoleSuccess,
    addUserRoleFailure,
    addUserRoleFailureMessage,
    userRoleData,
    isUserRoleLoading
  } = useAppSelector((state: any) => state.UserRoleReducer)

  const roleIdFromParams = searchParams.get('id') || id || ''

  useEffect(() => {
    if (mode === 'edit' && roleIdFromParams) {
      const existingRole = userRoleData?.data?.find((role: any) => role.id === roleIdFromParams)
      if (!existingRole) {
        dispatch(fetchUserRole({ id: roleIdFromParams }))
      }
    }
  }, [mode, roleIdFromParams, dispatch, userRoleData])

  useEffect(() => {
    if (addUserRoleFailure && addUserRoleFailureMessage) {
      const messages = Array.isArray(addUserRoleFailureMessage)
        ? addUserRoleFailureMessage
        : [addUserRoleFailureMessage || 'Failed to save the role. Please try again.']
      setApiErrors(messages)
    } else {
      setApiErrors([])
    }
  }, [addUserRoleFailure, addUserRoleFailureMessage])

  useEffect(() => {
    if (addUserRoleSuccess) {
      router.push('/user-role')
    }
  }, [addUserRoleSuccess, router])

  useEffect(() => {
    return () => {
      dispatch(resetAddUserRoleStatus())
    }
  }, [dispatch])

  const matchedRole =
    mode === 'edit' && userRoleData?.data ? userRoleData.data.find((role: any) => role.id === roleIdFromParams) : null

  useEffect(() => {
    if (mode === 'edit' && matchedRole) {
      const newInitialValues = {
        roleName: matchedRole.name || '',
        description: matchedRole.description || '',
        permissions: defaultPermissionsList.map(p => {
          const selectedActions =
            p.module === 'Home Dashboard'
              ? ['read']
              : matchedRole.permissions
                  .filter((perm: any) => {
                    const moduleMap: { [key: string]: string } = {
                      'User Management': 'user',
                      'User Roles': 'role',
                      Approvals: 'approvals',
                      'Candidate Management': 'candidate',
                      'JD Management': 'jd',
                      'Vaccancy Management': 'vacancy',
                      'Branch Management': 'branch',
                      'Budget Management': 'budget',
                      'Bucket Management': 'bucket',
                      'Approval Matrix': 'approvalmatrix',
                      'General Settings': 'general',
                      'Home Dashboard': 'home',
                      'Employee Management': 'employee'
                    }
                    const moduleShortName = moduleMap[p.module] || p.module.replace(/\s+/g, '').toLowerCase()
                    return perm.name.startsWith(`${moduleShortName}_`)
                  })
                  .map((perm: any) => perm.name.split('_')[1])
          return { module: p.module, selectedActions }
        })
      }
      setInitialFormValues(newInitialValues)
    }
  }, [mode, matchedRole])

  const roleFormik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      roleName: Yup.string().required('Role Name is required')
    }),
    onSubmit: async values => {
      setApiErrors([])

      const selectedPermissions = values.permissions.flatMap(perm => {
        const moduleMap: { [key: string]: string } = {
          'User Management': 'user',
          'User Roles': 'role',
          ' Approvals': 'approvals',
          'Candidate Management': 'candidate',
          'JD Management': 'jd',
          'Vaccancy Management': 'vacancy',
          'Branch Management': 'branch',
          'Budget Management': 'budget',
          'Bucket Management': 'bucket',
          'Approval Matrix': 'approvalmatrix',
          'General Settings': 'general',
          'Home Dashboard': 'home',
          'Employee Management': 'employee'
        }
        const moduleShortName = moduleMap[perm.module] || perm.module.replace(/\s+/g, '').toLowerCase()
        return perm.selectedActions.map(action => `${moduleShortName}_${action}`)
      })

      try {
        if (mode === 'edit' && roleIdFromParams) {
          await dispatch(
            updateUserRole({
              id: roleIdFromParams,
              params: { roleName: values.roleName, newPermissionNames: selectedPermissions }
            })
          ).unwrap()
        } else {
          await dispatch(
            addNewUserRole({
              name: values.roleName,
              description: values.description,
              selectedPermissions
            })
          ).unwrap()
        }
      } catch (error: any) {
        const errorMessages = error.message
          ? Array.isArray(error.message)
            ? error.message
            : [error.message]
          : ['An unexpected error occurred while saving. Please try again.']
        setApiErrors(errorMessages)
      }
    }
  })

  useEffect(() => {
    const hasChanges =
      roleFormik.values.roleName !== initialFormValues.roleName ||
      roleFormik.values.description !== initialFormValues.description ||
      roleFormik.values.permissions.some((perm, index) => {
        const initialPerm = initialFormValues.permissions[index]
        return (
          perm.module !== initialPerm.module ||
          perm.selectedActions.length !== initialPerm.selectedActions.length ||
          !perm.selectedActions.every(action => initialPerm.selectedActions.includes(action))
        )
      })
    setIsFormEdited(hasChanges)
  }, [roleFormik.values, initialFormValues])

  const handleCancel = () => {
    if (isFormEdited) {
      roleFormik.setValues(initialFormValues)
      setIsFormEdited(false)
      dispatch(resetAddUserRoleStatus())
      setApiErrors([])
    }
  }

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    if (module === 'Home Dashboard') return

    const currentPermissions = [...roleFormik.values.permissions]
    const moduleIndex = currentPermissions.findIndex(p => p.module === module)
    let selectedActions = moduleIndex >= 0 ? [...currentPermissions[moduleIndex].selectedActions] : []

    if (checked) {
      if (action !== 'read' && !selectedActions.includes('read')) selectedActions.push('read')
      if (!selectedActions.includes(action)) selectedActions.push(action)
    } else {
      if (action === 'read') {
        selectedActions = []
      } else {
        selectedActions = selectedActions.filter(a => a !== action)
      }
    }

    if (moduleIndex >= 0) {
      currentPermissions[moduleIndex] = { module, selectedActions }
    } else {
      currentPermissions.push({ module, selectedActions })
    }

    roleFormik.setFieldValue('permissions', currentPermissions)
  }

  const handleSelectAllPermissions = (module: string, allActions: string[], checked: boolean) => {
    if (module === 'Home Dashboard') return

    roleFormik.setFieldValue(
      'permissions',
      roleFormik.values.permissions
        .filter(p => p.module !== module)
        .concat({
          module,
          selectedActions: checked ? allActions : []
        })
    )
  }

  const handleSelectAllModules = (checked: boolean) => {
    roleFormik.setFieldValue(
      'permissions',
      defaultPermissionsList.map(perm => ({
        module: perm.module,
        selectedActions: perm.module === 'Home Dashboard' ? ['read'] : checked ? perm.actions : []
      }))
    )
  }

  const handleSelectAllRead = (checked: boolean) => {
    const updatedPermissions = defaultPermissionsList.map(perm => {
      const existingPerm = roleFormik.values.permissions.find(p => p.module === perm.module)
      const currentActions = existingPerm?.selectedActions || []

      if (perm.module === 'Home Dashboard') {
        return { module: perm.module, selectedActions: ['read'] }
      }

      if (checked) {
        return {
          module: perm.module,
          selectedActions: currentActions.includes('read') ? currentActions : [...currentActions, 'read']
        }
      } else {
        return {
          module: perm.module,
          selectedActions: []
        }
      }
    })

    roleFormik.setFieldValue('permissions', updatedPermissions)
  }

  if (mode === 'edit' && isUserRoleLoading) {
    return <Typography>Loading role data...</Typography>
  }

  return (
    <form onSubmit={roleFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit Role' : 'Add New Role'}</h1>

      {apiErrors.length > 0 && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
          <p className='text-red-600 font-semibold'>Error Saving Role:</p>
          <ul className='list-disc pl-5'>
            {apiErrors.map((error, index) => (
              <li key={index} className='text-red-600'>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Role Details</legend>
        <FormControl fullWidth margin='normal'>
          <TextField
            label='Role Name *'
            id='roleName'
            name='roleName'
            value={roleFormik.values.roleName}
            onChange={roleFormik.handleChange}
            onBlur={roleFormik.handleBlur}
            error={Boolean(roleFormik.errors.roleName && roleFormik.touched.roleName)}
            helperText={roleFormik.touched.roleName ? roleFormik.errors.roleName : ''}
            disabled={mode === 'edit'}
            InputProps={{ readOnly: mode === 'edit' }}
          />
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <TextField
            label='Description'
            id='description'
            name='description'
            value={roleFormik.values.description}
            onChange={roleFormik.handleChange}
            onBlur={roleFormik.handleBlur}
            disabled
          />
        </FormControl>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Permissions</legend>
        <div className='mb-4'>
          <FormControlLabel
            control={
              <Checkbox
                checked={roleFormik.values.permissions.every(p =>
                  defaultPermissionsList
                    .find(perm => perm.module === p.module)
                    ?.actions.every(action => p.selectedActions.includes(action))
                )}
                onChange={e => handleSelectAllModules(e.target.checked)}
              />
            }
            label='Select All'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={defaultPermissionsList.every(perm =>
                  roleFormik.values.permissions.some(
                    p => p.module === perm.module && p.selectedActions.includes('read')
                  )
                )}
                onChange={e => handleSelectAllRead(e.target.checked)}
              />
            }
            label='Select All Read Permissions'
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          {defaultPermissionsList.map(permission => (
            <div key={permission.module} className='mb-5'>
              <div className='flex items-center mb-2'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={roleFormik.values.permissions.some(
                        p =>
                          p.module === permission.module &&
                          permission.actions.every(action => p.selectedActions.includes(action))
                      )}
                      onChange={e =>
                        handleSelectAllPermissions(permission.module, permission.actions, e.target.checked)
                      }
                      disabled={permission.module === 'Home Dashboard'}
                    />
                  }
                  label={permission.module}
                />
              </div>
              <Box pl={6}>
                {permission.actions.map(action => {
                  const hasOtherPermissions = roleFormik.values.permissions
                    .find(p => p.module === permission.module)
                    ?.selectedActions.some(a => a !== 'read' && permission.actions.includes(a))

                  return (
                    <FormControlLabel
                      key={action}
                      control={
                        <Checkbox
                          checked={roleFormik.values.permissions.some(
                            p => p.module === permission.module && p.selectedActions.includes(action)
                          )}
                          onChange={e => handlePermissionChange(permission.module, action, e.target.checked)}
                          disabled={
                            permission.module === 'Home Dashboard' ||
                            (action === 'read' && hasOtherPermissions) ||
                            (action !== 'read' &&
                              !roleFormik.values.permissions.some(
                                p => p.module === permission.module && p.selectedActions.includes('read')
                              ))
                          }
                        />
                      }
                      label={action}
                    />
                  )
                })}
              </Box>
            </div>
          ))}
        </div>
      </fieldset>

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
          <DynamicButton
            type='submit'
            variant='contained'
            className='bg-blue-500'
            disabled={isAddUserRoleLoading}
          >
            {isAddUserRoleLoading ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Add User'}
          </DynamicButton>
        </div>
      </div>
    </form>
  )
}

export default AddOrEditUserRole
