'use client'

import React, { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Checkbox, FormControlLabel, Box } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addNewUserRole, updateUserRole, resetAddUserRoleStatus } from '@/redux/UserRoles/userRoleSlice'
import DynamicButton from '@/components/Button/dynamicButton'

const permissions = [
  { module: 'Home Dashboard', actions: ['read'] },
  { module: 'User Management', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'User Roles', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'Approval Management', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'JD Management', actions: ['read', 'update', 'delete', 'create', 'upload', 'approval'] },
  { module: 'Vaccancy Management', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'Recruitment Management', actions: ['read', 'update', 'delete', 'create', 'approval'] },
  { module: 'Branch Management', actions: ['read'] },
  { module: 'Bucket Management', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'Approval Matrix', actions: ['read', 'update', 'delete', 'create'] },
  { module: 'General Settings', actions: ['read', 'update', 'delete', 'create'] }
]

const AddOrEditUserRole: React.FC<{ mode: 'add' | 'edit'; id?: string }> = ({ mode, id }) => {
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { isAddUserRoleLoading, addUserRoleSuccess, addUserRoleFailure, addUserRoleFailureMessage } = useAppSelector(
    (state: any) => state.UserRoleReducer
  )

  // Update apiErrors when there's a failure
  useEffect(() => {
    if (addUserRoleFailure && addUserRoleFailureMessage) {
      const messages = Array.isArray(addUserRoleFailureMessage)
        ? addUserRoleFailureMessage
        : [addUserRoleFailureMessage || 'Failed to save the role. Please try again.']

      setApiErrors(messages)
    } else {
      setApiErrors([]) // Clear errors on success or reset
    }
  }, [addUserRoleFailure, addUserRoleFailureMessage])

  // Redirect on success
  useEffect(() => {
    if (addUserRoleSuccess) {
      router.push('/user-role')
    }
  }, [addUserRoleSuccess, router])

  // Cleanup Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetAddUserRoleStatus())
    }
  }, [dispatch])

  // Initial permissions for edit mode
  const initialPermissions: { name: string }[] =
    mode === 'edit' ? JSON.parse(searchParams.get('permissions') || '[]') : []

  // Ensure 'Home Dashboard' permission is included by default
  const defaultPermissions = [{ module: 'Home Dashboard', selectedActions: ['read'] }]

  const permissionNames = initialPermissions.map(perm => perm.name)

  const roleFormik = useFormik({
    initialValues: {
      roleName: mode === 'edit' ? searchParams.get('name') || '' : '',
      description: mode === 'edit' ? searchParams.get('description') || '' : '',
      permissions: [
        ...defaultPermissions,
        ...permissions.map(p => {
          const moduleMap: { [key: string]: string } = {
            'User Management': 'user',
            'User Roles': 'role',
            'Approval Management': 'approval',
            'JD Management': 'jd',
            'Vaccancy Management': 'vacancy',
            'Recruitment Management': 'recruitment',
            'Branch Management': 'branch',
            'Bucket Management': 'bucket',
            'Approval Matrix': 'approvalmatrix',
            'General Settings': 'general',
            'Home Dashboard': 'home'
          }

          const moduleShortName = moduleMap[p.module] || p.module.replace(/\s+/g, '').toLowerCase()

          const selectedActions =
            mode === 'edit' ? p.actions.filter(action => permissionNames.includes(`${moduleShortName}_${action}`)) : []

          return { module: p.module, selectedActions }
        })
      ]
    },
    validationSchema: Yup.object().shape({
      roleName: Yup.string().required('Role Name is required')
    }),
    onSubmit: async values => {
      setApiErrors([]) // Clear previous errors on new submission

      const selectedPermissions = values.permissions.flatMap(perm => {
        const moduleMap: { [key: string]: string } = {
          'User Management': 'user',
          'User Roles': 'role',
          'Approval Management': 'approval',
          'JD Management': 'jd',
          'Vaccancy Management': 'vacancy',
          'Recruitment Management': 'recruitment',
          'Branch Management': 'branch',
          'Bucket Management': 'bucket',
          'Approval Matrix': 'approvalmatrix',
          'General Settings': 'general',
          'Home Dashboard': 'home'
        }

        const moduleShortName = moduleMap[perm.module] || perm.module.replace(/\s+/g, '').toLowerCase()

        return perm.selectedActions.map(action => `${moduleShortName}_${action}`)
      })

      try {
        if (mode === 'edit' && id) {
          await dispatch(
            updateUserRole({
              id,
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

  const handleCancel = () => {
    dispatch(resetAddUserRoleStatus())
    router.back()
  }

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    const currentPermissions = [...roleFormik.values.permissions]
    const moduleIndex = currentPermissions.findIndex(p => p.module === module)
    let selectedActions = moduleIndex >= 0 ? [...currentPermissions[moduleIndex].selectedActions] : []

    if (checked) {
      if (action !== 'read' && !selectedActions.includes('read')) selectedActions.push('read')
      if (!selectedActions.includes(action)) selectedActions.push(action)
    } else {
      selectedActions = selectedActions.filter(a => a !== action)
      if (action === 'read') selectedActions = []
    }

    if (moduleIndex >= 0) {
      currentPermissions[moduleIndex] = { module, selectedActions }
    } else {
      currentPermissions.push({ module, selectedActions })
    }

    roleFormik.setFieldValue('permissions', currentPermissions)
  }

  const handleSelectAllPermissions = (module: string, allActions: string[], checked: boolean) => {
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
      permissions.map(perm => ({
        module: perm.module,
        selectedActions: checked ? perm.actions : []
      }))
    )
  }

  const handleSelectAllRead = (checked: boolean) => {
    const updatedPermissions = permissions.map(perm => {
      const existingPerm = roleFormik.values.permissions.find(p => p.module === perm.module)

      return {
        module: perm.module,
        selectedActions: checked
          ? existingPerm?.selectedActions.includes('read')
            ? existingPerm.selectedActions
            : ['read']
          : existingPerm?.selectedActions.filter(a => a !== 'read') || []
      }
    })

    roleFormik.setFieldValue('permissions', updatedPermissions)
  }

  return (
    <form onSubmit={roleFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit Role' : 'Add New Role'}</h1>

      {apiErrors.length > 0 && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
          <p className='text-red-600 font-semibold'>Error Saving Role:</p>
          <ul className='list-disc pl-5'>
            {apiErrors.map((error, index) => (
              <li key={index} className='text-red-600'>
                {error}
              </li>
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
            error={!!roleFormik.errors.roleName && roleFormik.touched.roleName}
            helperText={roleFormik.touched.roleName && roleFormik.errors.roleName}
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
            disabled={mode === 'edit'}
            InputProps={{ readOnly: mode === 'edit' }}
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
                  permissions
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
                checked={permissions.every(perm =>
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
          {permissions.map(permission => (
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
                    />
                  }
                  label={permission.module}
                />
              </div>
              <Box pl={6}>
                {permission.actions.map(action => (
                  <FormControlLabel
                    key={action}
                    control={
                      <Checkbox
                        checked={roleFormik.values.permissions.some(
                          p => p.module === permission.module && p.selectedActions.includes(action)
                        )}
                        onChange={e => handlePermissionChange(permission.module, action, e.target.checked)}
                        disabled={
                          action !== 'read' &&
                          !roleFormik.values.permissions.some(
                            p => p.module === permission.module && p.selectedActions.includes('read')
                          )
                        }
                      />
                    }
                    label={action}
                  />
                ))}
              </Box>
            </div>
          ))}
        </div>
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton type='button' variant='contained' onClick={handleCancel}>
          Cancel
        </DynamicButton>
        <DynamicButton type='submit' variant='contained' disabled={isAddUserRoleLoading}>
          {isAddUserRoleLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Save'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditUserRole
