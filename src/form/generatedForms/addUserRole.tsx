
'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Checkbox, FormControlLabel, Box } from '@mui/material'

import DynamicButton from '@/components/Button/dynamicButton'

const permissions = [
  { module: 'User Management', actions: ['view', 'edit', 'delete', 'create'] },
  { module: 'User Roles', actions: ['view', 'edit', 'delete', 'create'] },
  { module: 'Approval Management', actions: ['view', 'edit', 'delete', 'create'] },
  { module: 'JD Management', actions: ['view', 'edit', 'delete', 'create', 'upload', 'approval'] },
  { module: 'Vaccancy Management', actions: ['view', 'edit', 'delete', 'create'] },
  { module: 'Recruitment Management', actions: ['view', 'edit', 'delete', 'create', 'approval'] },
  { module: 'Branch Management', actions: ['view'] },
  { module: 'Bucket Management', actions: ['view', 'edit', 'delete', 'create'] },
  { module: 'Approval Matrix', actions: ['view', 'edit', 'delete', 'create'] }
]

type Permission = {
  module: string
  selectedActions: string[]
}

const AddOrEditUserRole: React.FC<{ mode: 'add' | 'edit'; id?: string }> = ({ mode, id }) => {
  const router = useRouter()

  const roleFormik = useFormik({
    initialValues: {
      roleName: '',
      department: '',
      category: '',
      permissions: [] as Permission[]
    },
    validationSchema: Yup.object().shape({
      roleName: Yup.string().required('Role Name is required'),
      department: Yup.string().required('Department is required'),
      category: Yup.string().required('Category is required')
    }),
    onSubmit: values => {
      console.log('Form submitted:', { ...values, ...(mode === 'edit' && { id }) })
      router.push('/roles')
    }
  })

  const handleCancel = () => {
    router.back()
  }

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    const currentPermissions = [...roleFormik.values.permissions]
    const moduleIndex = currentPermissions.findIndex(p => p.module === module)

    let selectedActions = moduleIndex >= 0 ? [...currentPermissions[moduleIndex].selectedActions] : []

    if (checked) {
      if (action !== 'view' && !selectedActions.includes('view')) {
        selectedActions.push('view')
      }

      if (!selectedActions.includes(action)) {
        selectedActions.push(action)
      }
    } else {
      selectedActions = selectedActions.filter(a => a !== action)

      if (action === 'view') {
        selectedActions = []
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
    const actions = checked ? ['view', ...allActions] : []

    roleFormik.setFieldValue(
      'permissions',
      roleFormik.values.permissions.filter(p => p.module !== module).concat({ module, selectedActions: actions })
    )
  }

  return (
    <form onSubmit={roleFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit Role' : 'Add New Role'}</h1>

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
          />
        </FormControl>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Permissions</legend>

        <div className='grid grid-cols-2 gap-4'>
          {permissions.map(permission => (
            <div key={permission.module} className='mb-5'>
              <div className='flex items-center mb-2'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={roleFormik.values.permissions.some(
                        p =>
                          p.module === permission.module && p.selectedActions.length === permission.actions.length + 1
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
                          action !== 'view' &&
                          !roleFormik.values.permissions.some(
                            p => p.module === permission.module && p.selectedActions.includes('view')
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
        <DynamicButton type='submit' variant='contained'>
          {mode === 'edit' ? 'Update' : 'Save'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditUserRole
