'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Typography,
  Chip,
  Autocomplete
} from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  addNewUserRole,
  updateUserRole,
  resetAddUserRoleStatus,
  fetchUserRole,
  fetchDesignation
} from '@/redux/UserRoles/userRoleSlice'
import DynamicButton from '@/components/Button/dynamicButton'

interface FeatureState {
  name: string
  actions: string[]
  selectedActions?: string[]
}

interface PermissionState {
  module: string
  subModule?: string
  features?: FeatureState[]
  actions?: string[]
}

interface FormValues {
  designation: string
  groupDesignation: string | string[]
  groupRoleDescription: string
  newPermissionNames: PermissionState[]
}

const defaultPermissionsList: PermissionState[] = [
  {
    module: 'User',
    features: [
      { name: 'User', actions: ['read', 'update', 'delete', 'create'] },
      { name: 'Role', actions: ['read', 'update', 'delete', 'create'] },
      { name: 'Employee', actions: ['read'] }

      // { name: 'Resigned', actions: ['read', 'approval'] }
    ]
  },
  {
    module: 'System',
    subModule: 'XFactor',
    features: [
      { name: 'NoticePeriodRange', actions: ['read', 'update', 'delete', 'create'] },
      { name: 'ResignedXFactor', actions: ['read', 'update', 'delete', 'create'] },
      { name: 'VacancyXFactor', actions: ['read', 'update', 'delete', 'create'] }
    ]
  },
  {
    module: 'System',
    features: [
      { name: 'DataUpload', actions: ['read', 'upload'] },
      { name: 'Scheduler', actions: ['read', 'update', 'delete', 'create'] },
      { name: 'OrganizationalMapping', actions: ['read', 'update', 'delete', 'create'] },
      { name: 'ApprovalMatrix', actions: ['read', 'update', 'delete', 'create'] },
      { name: 'ApprovalCategory', actions: ['read'] }
    ]
  },
  {
    module: 'Hiring',
    features: [
      { name: 'CVPool', actions: ['read'] },
      { name: 'Budget', actions: ['read', 'create', 'delete', 'approval'] },
      { name: 'Onboarding', actions: ['read', 'update', 'create'] },
      { name: 'Vacancy', actions: ['read'] },

      // { name: 'Vacancy', actions: ['read', 'update'] },
      { name: 'JobPosting', actions: ['read', 'update'] },
      { name: 'Interview', actions: ['read', 'update'] }
    ]
  },
  {
    module: 'JD',
    actions: ['read', 'update', 'delete', 'create', 'approval', 'upload']
  },
  {
    module: 'Approvals',
    actions: ['read', 'update', 'delete', 'create']
  },
  {
    module: 'General',
    actions: ['read', 'update', 'delete', 'create']
  },
  {
    module: 'Home',
    actions: ['read']
  },
  {
    module: 'Branch',
    actions: ['read']
  }
]

const AddOrEditUserRole: React.FC<{ mode: 'add' | 'edit'; id?: string }> = ({ mode, id }) => {
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [isFormEdited, setIsFormEdited] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editType = searchParams.get('editType') || 'designation'
  const roleId = searchParams.get('id') || id || ''
  const groupRoleId = searchParams.get('groupRoleId')

  const {
    isAddUserRoleLoading,
    addUserRoleSuccess,
    addUserRoleFailure,
    addUserRoleFailureMessage,
    userRoleData,
    designationData,
    isDesignationLoading,
    designationFailure,
    designationFailureMessage,
    isUserRoleLoading
  } = useAppSelector((state: any) => state.UserRoleReducer)

  const initialFormValues: FormValues = useMemo(
    () => ({
      designation: '',
      groupDesignation: editType === 'designation' ? [] : '',
      groupRoleDescription: '',
      newPermissionNames: defaultPermissionsList.map(p => ({
        module: p.module,
        subModule: p.subModule,
        features: p.features
          ? p.features.map(f => ({
              name: f.name,
              actions: f.actions,
              selectedActions: [] as string[]
            }))
          : undefined,
        actions: p.actions ? ([] as string[]) : undefined
      }))
    }),
    [editType]
  )

  useEffect(() => {
    dispatch(fetchDesignation({}))
    dispatch(fetchUserRole({ limit: 10, page: 1 }))
  }, [dispatch])

  useEffect(() => {
    if (mode === 'edit' && roleId) {
      dispatch(fetchUserRole({ id: roleId }))
    }
  }, [mode, roleId, dispatch])

  useEffect(() => {
    if (addUserRoleFailure && addUserRoleFailureMessage) {
      setApiErrors(Array.isArray(addUserRoleFailureMessage) ? addUserRoleFailureMessage : [addUserRoleFailureMessage])
    } else if (designationFailure && designationFailureMessage) {
      setApiErrors(Array.isArray(designationFailureMessage) ? designationFailureMessage : [designationFailureMessage])
    } else {
      setApiErrors([])
    }
  }, [addUserRoleFailure, addUserRoleFailureMessage, designationFailure, designationFailureMessage])
  useEffect(() => {
    if (addUserRoleSuccess) {
      router.push('/user-management/role')
    }
  }, [addUserRoleSuccess, router])

  useEffect(() => {
    return () => {
      dispatch(resetAddUserRoleStatus())
    }
  }, [dispatch])

  useEffect(() => {
    if (mode !== 'edit' || !userRoleData?.data || !designationData?.data) return

    const matchedRole = userRoleData.data.find((role: any) => role.id === roleId)

    if (!matchedRole) {
      console.warn(`No role found for roleId: ${roleId}`)

      return
    }

    const validDesignation =
      matchedRole.name && designationData.data.some((d: any) => d.name === matchedRole.name)
        ? matchedRole.name
        : designationData.data[0]?.name || ''

    const groupRole =
      editType === 'groupRole' && groupRoleId
        ? matchedRole.groupRoles?.find((gr: any) => gr.id === groupRoleId) || {}
        : matchedRole.groupRoles?.[0] || {}

    const groupDesignation =
      editType === 'designation'
        ? matchedRole.groupRoles?.map((gr: any) => gr.name.replace(/^grp_/, '').trim()) || []
        : groupRole.name?.replace(/^grp_/, '').trim() || ''

    const permissions = editType === 'groupRole' ? groupRole.permissions || [] : matchedRole.permissions || []

    roleFormik.setValues({
      designation: validDesignation,
      groupDesignation,
      groupRoleDescription: groupRole.description || '',
      newPermissionNames: defaultPermissionsList.map(p => {
        const moduleShortName = p.module.toLowerCase()
        const subModuleShortName = p.subModule?.toLowerCase()

        return {
          module: p.module,
          subModule: p.subModule,
          features: p.features
            ? p.features.map(f => ({
                name: f.name,
                actions: f.actions,
                selectedActions:
                  permissions
                    .filter((perm: string) =>
                      subModuleShortName
                        ? perm.startsWith(`prv_${moduleShortName}_${subModuleShortName}_${f.name.toLowerCase()}_`)
                        : perm.startsWith(`prv_${moduleShortName}_${f.name.toLowerCase()}_`)
                    )
                    .map((perm: string) => perm.split('_').pop() || '') || []
              }))
            : undefined,
          actions: p.actions
            ? permissions
                .filter((perm: string) => perm.startsWith(`prv_${moduleShortName}_`))
                .map((perm: string) => perm.split('_').pop() || '') || []
            : undefined
        }
      })
    })
  }, [mode, userRoleData, roleId, groupRoleId, editType, designationData])

  const roleFormik = useFormik<FormValues>({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      designation: Yup.string()
        .required('Designation is required')
        .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers, and spaces allowed'),
      groupDesignation:
        editType === 'designation' && mode === 'edit'
          ? Yup.array().of(Yup.string()).min(1, 'At least one group designation required')
          : Yup.string()
              .required('Group designation is required')
              .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers, and spaces allowed')
              .test('not-only-spaces', 'Cannot be only spaces', value => value?.trim().length > 0),
      groupRoleDescription: Yup.string(),
      newPermissionNames: Yup.array().test('at-least-one-permission', 'At least one permission required', value =>
        value.some(p => (p.features ? p.features.some(f => f.selectedActions.length > 0) : p.actions?.length > 0))
      )
    }),
    onSubmit: async values => {
      setApiErrors([])

      const permissions = values.newPermissionNames.flatMap(perm =>
        perm.features
          ? perm.features.flatMap(f =>
              f.selectedActions.map(action =>
                perm.subModule
                  ? `prv_${perm.module.toLowerCase()}_${perm.subModule.toLowerCase()}_${f.name.toLowerCase()}_${action}`
                  : `prv_${perm.module.toLowerCase()}_${f.name.toLowerCase()}_${action}`
              )
            )
          : perm.actions!.map(action => `prv_${perm.module.toLowerCase()}_${action}`)
      )

      try {
        if (mode === 'edit' && roleId) {
          if (editType === 'designation') {
            await dispatch(
              updateUserRole({
                id: roleId,
                params: {
                  designation: values.designation,
                  newGroupDesignations: Array.isArray(values.groupDesignation)
                    ? values.groupDesignation
                    : [values.groupDesignation],
                  newPermissionNames: permissions,
                  editType: 'designation'
                }
              })
            ).unwrap()
          } else if (editType === 'groupRole' && groupRoleId) {
            const groupDesignation = typeof values.groupDesignation === 'string' ? values.groupDesignation.trim() : ''

            if (!groupDesignation) throw new Error('Group designation is required.')
            await dispatch(
              updateUserRole({
                id: roleId,
                groupRoleId,
                params: {
                  designation: values.designation,
                  targetGroupDesignation: groupDesignation,
                  targetGroupPermissions: permissions,
                  editType: 'designation'
                }
              })
            ).unwrap()
          }
        } else {
          const groupDesignation = typeof values.groupDesignation === 'string' ? values.groupDesignation.trim() : ''

          if (!groupDesignation) throw new Error('Group designation is required.')
          await dispatch(
            addNewUserRole({
              designation: values.designation,
              group_designation: groupDesignation,
              grp_role_description: values.groupRoleDescription,
              permissions,
              des_role_description: ''
            })
          ).unwrap()
        }
      } catch (error: any) {
        setApiErrors(
          error.message
            ? Array.isArray(error.message)
              ? error.message.map((err: any) => err.constraints?.whitelistValidation || err)
              : [error.message]
            : ['An unexpected error occurred.']
        )
      }
    }
  })

  useEffect(() => {
    setIsFormEdited(JSON.stringify(roleFormik.values) !== JSON.stringify(initialFormValues))
  }, [roleFormik.values, initialFormValues])

  const handlePermissionChange = (
    module: string,
    subModule: string | undefined,
    featureOrAction: string,
    action: string,
    checked: boolean
  ) => {
    const permissions = [...roleFormik.values.newPermissionNames]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)
    const perm = defaultPermissionsList.find(p => p.module === module && p.subModule === subModule)

    if (perm?.features) {
      const featureIndex = permissions[moduleIndex].features!.findIndex(f => f.name === featureOrAction)
      const selectedActions = [...(permissions[moduleIndex].features![featureIndex].selectedActions || [])]

      permissions[moduleIndex].features![featureIndex].selectedActions = checked
        ? [...new Set([...selectedActions, action])]
        : selectedActions.filter(a => a !== action)
    } else {
      permissions[moduleIndex].actions = checked
        ? [...new Set([...(permissions[moduleIndex].actions || []), featureOrAction])]
        : (permissions[moduleIndex].actions || []).filter(a => a !== featureOrAction)
    }

    roleFormik.setFieldValue('newPermissionNames', permissions)
  }

  const handleSelectAllPermissions = (
    module: string,
    subModule: string | undefined,
    feature: string,
    allActions: string[],
    checked: boolean
  ) => {
    const permissions = [...roleFormik.values.newPermissionNames]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)
    const featureIndex = permissions[moduleIndex].features!.findIndex(f => f.name === feature)

    permissions[moduleIndex].features![featureIndex].selectedActions = checked ? allActions : []
    roleFormik.setFieldValue('newPermissionNames', permissions)
  }

  const handleSelectAllFeatures = (module: string, subModule: string | undefined, checked: boolean) => {
    const permissions = [...roleFormik.values.newPermissionNames]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)
    const perm = defaultPermissionsList.find(p => p.module === module && p.subModule === subModule)

    if (perm?.features) {
      permissions[moduleIndex].features = perm.features.map(f => ({
        name: f.name,
        actions: f.actions,
        selectedActions: checked ? f.actions : []
      }))
    } else {
      permissions[moduleIndex].actions = checked ? perm!.actions! : []
    }

    roleFormik.setFieldValue('newPermissionNames', permissions)
  }

  const handleSelectAllModules = (checked: boolean) => {
    roleFormik.setFieldValue(
      'newPermissionNames',
      defaultPermissionsList.map(p => ({
        module: p.module,
        subModule: p.subModule,
        features: p.features?.map(f => ({ name: f.name, selectedActions: checked ? f.actions : [] })),
        actions: p.actions ? (checked ? p.actions : []) : undefined
      }))
    )
  }

  const handleSelectAllReadPermissions = (checked: boolean) => {
    roleFormik.setFieldValue(
      'newPermissionNames',
      roleFormik.values.newPermissionNames.map(perm => {
        const defaultPerm = defaultPermissionsList.find(p => p.module === perm.module && p.subModule === perm.subModule)

        return {
          ...perm,
          features: perm.features?.map(f => ({
            name: f.name,
            selectedActions: checked
              ? [
                  ...new Set([
                    ...(f.selectedActions || []),
                    ...(defaultPerm?.features?.find(feat => feat.name === f.name)?.actions.filter(a => a === 'read') ||
                      [])
                  ])
                ]
              : (f.selectedActions || []).filter(a => a !== 'read')
          })),
          actions: defaultPerm?.actions
            ? checked
              ? [...new Set([...(perm.actions || []), ...defaultPerm.actions.filter(a => a === 'read')])]
              : (perm.actions || []).filter(a => a !== 'read')
            : perm.actions
        }
      })
    )
  }

  const handleCancel = () => {
    if (isFormEdited) {
      roleFormik.setValues(initialFormValues)
      setIsFormEdited(false)
      dispatch(resetAddUserRoleStatus())
      setApiErrors([])
    }
  }

  if (isUserRoleLoading || isDesignationLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <form onSubmit={roleFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <Typography variant='h5' className='mb-4'>
        {mode === 'edit' ? (editType === 'groupRole' ? 'Edit Group Role' : 'Edit Designation') : 'Add New Role'}
      </Typography>

      {apiErrors.length > 0 && (
        <Box className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
          <Typography color='error' fontWeight='bold'>
            Error Saving Role:
          </Typography>
          <ul className='list-disc pl-5'>
            {apiErrors.map((error, index) => (
              <li key={index} className='text-red-600'>
                {error}
              </li>
            ))}
          </ul>
        </Box>
      )}

      <Box component='fieldset' className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Role Details</legend>
        <FormControl fullWidth margin='normal'>
          <InputLabel id='designation-label'>Designation *</InputLabel>
          <Select
            labelId='designation-label'
            label='Designation *'
            name='designation'
            value={roleFormik.values.designation ? roleFormik.values.designation : ''}
            onChange={roleFormik.handleChange}
            onBlur={roleFormik.handleBlur}
            error={roleFormik.touched.designation && !!roleFormik.errors.designation}
          >
            {designationData?.data?.map((d: any) => (
              <MenuItem key={d.id} value={d.name}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
          {roleFormik.touched.designation && roleFormik.errors.designation && (
            <Typography color='error' variant='caption'>
              {roleFormik.errors.designation}
            </Typography>
          )}
        </FormControl>

        {editType === 'designation' && mode === 'edit' ? (
          <FormControl fullWidth margin='normal'>
            <Autocomplete
              id='groupDesignation'
              options={
                userRoleData?.data?.flatMap(
                  (d: any) =>
                    d.groupRoles?.map(
                      (gr: any) =>
                        gr.name
                          .replace(/^grp_/, '') // Remove "grp_"
                          .replace(/_/g, ' ') // Replace underscores with space
                          .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
                    ) || []
                ) || []
              }
              value={Array.isArray(roleFormik.values.groupDesignation) ? roleFormik.values.groupDesignation : []}
              onChange={(e, value) => roleFormik.setFieldValue('groupDesignation', value)}
              renderInput={params => <TextField {...params} label='Group Designations *' />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant='outlined' key='' label={option} {...getTagProps({ index })} />
                ))
              }
              multiple
            />
            {roleFormik.touched.groupDesignation && roleFormik.errors.groupDesignation && (
              <Typography color='error' variant='caption'>
                {roleFormik.errors.groupDesignation}
              </Typography>
            )}
          </FormControl>
        ) : (
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Group Designation *'
              name='groupDesignation'
              value={typeof roleFormik.values.groupDesignation === 'string' ? roleFormik.values.groupDesignation : ''}
              onChange={roleFormik.handleChange}
              onBlur={roleFormik.handleBlur}
              error={roleFormik.touched.groupDesignation && !!roleFormik.errors.groupDesignation}
              helperText={roleFormik.touched.groupDesignation && roleFormik.errors.groupDesignation}
            />
          </FormControl>
        )}

        {mode === 'add' && (
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Group Role Description'
              name='groupRoleDescription'
              value={roleFormik.values.groupRoleDescription}
              onChange={roleFormik.handleChange}
              onBlur={roleFormik.handleBlur}
              error={roleFormik.touched.groupRoleDescription && !!roleFormik.errors.groupRoleDescription}
              helperText={roleFormik.touched.groupRoleDescription && roleFormik.errors.groupRoleDescription}
            />
          </FormControl>
        )}
      </Box>

      {/* ###### Permissions ###### */}

      <Box component='fieldset' className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Permissions</legend>
        <Box mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={roleFormik.values.newPermissionNames.every(p => {
                  const defaultPerm = defaultPermissionsList.find(
                    d => d.module === p.module && d.subModule === p.subModule
                  )

                  return defaultPerm?.features
                    ? p.features?.every(f =>
                        defaultPerm
                          .features!.find(feat => feat.name === f.name)
                          ?.actions.every(a => f.selectedActions?.includes(a) ?? false)
                      ) ?? false
                    : (p.actions?.length ?? 0) === defaultPerm?.actions!.length
                })}
                onChange={e => handleSelectAllModules(e.target.checked)}
              />
            }
            label='Select All'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={roleFormik.values.newPermissionNames.every(p =>
                  p.features
                    ? p.features.every(f => f.selectedActions?.includes('read') ?? false)
                    : p.actions?.includes('read') ?? false
                )}
                onChange={e => handleSelectAllReadPermissions(e.target.checked)}
              />
            }
            label='Select All Read Permissions'
          />
        </Box>

        <Box className='grid grid-cols-2 gap-4'>
          {defaultPermissionsList.map(permission => (
            <Box key={`${permission.module}-${permission.subModule || ''}`} className='mb-5'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      permission.features
                        ? roleFormik.values.newPermissionNames
                            .find(p => p.module === permission.module && p.subModule === permission.subModule)
                            ?.features?.every(f =>
                              permission
                                .features!.find(feat => feat.name === f.name)
                                ?.actions.every(a => f.selectedActions?.includes(a) ?? false)
                            ) ?? false
                        : (roleFormik.values.newPermissionNames.find(
                            p => p.module === permission.module && p.subModule === permission.subModule
                          )?.actions?.length ?? 0) === permission.actions!.length
                    }
                    onChange={e => handleSelectAllFeatures(permission.module, permission.subModule, e.target.checked)}
                  />
                }
                label={permission.subModule ? `${permission.module} - ${permission.subModule}` : permission.module}
              />
              <Box pl={permission.features ? 6 : 4}>
                {permission.features
                  ? permission.features.map(feature => (
                      <Box key={feature.name} className='mb-3'>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                (roleFormik.values.newPermissionNames
                                  .find(p => p.module === permission.module && p.subModule === permission.subModule)
                                  ?.features?.find(f => f.name === feature.name)?.selectedActions?.length ?? 0) ===
                                feature.actions.length
                              }
                              onChange={e =>
                                handleSelectAllPermissions(
                                  permission.module,
                                  permission.subModule,
                                  feature.name,
                                  feature.actions,
                                  e.target.checked
                                )
                              }
                            />
                          }
                          label={feature.name}
                        />
                        <Box pl={6}>
                          {feature.actions.map(action => (
                            <FormControlLabel
                              key={action}
                              control={
                                <Checkbox
                                  checked={
                                    roleFormik.values.newPermissionNames
                                      .find(p => p.module === permission.module && p.subModule === permission.subModule)
                                      ?.features?.find(f => f.name === feature.name)
                                      ?.selectedActions?.includes(action) ?? false
                                  }
                                  onChange={e =>
                                    handlePermissionChange(
                                      permission.module,
                                      permission.subModule,
                                      feature.name,
                                      action,
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label={action.charAt(0).toUpperCase() + action.slice(1)}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))
                  : permission.actions!.map(action => (
                      <FormControlLabel
                        key={action}
                        control={
                          <Checkbox
                            checked={
                              roleFormik.values.newPermissionNames
                                .find(p => p.module === permission.module && p.subModule === permission.subModule)
                                ?.actions?.includes(action) ?? false
                            }
                            onChange={e =>
                              handlePermissionChange(
                                permission.module,
                                permission.subModule,
                                action,
                                action,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={
                          <Typography variant='body2'>{action.charAt(0).toUpperCase() + action.slice(1)}</Typography>
                        }
                      />
                    ))}
              </Box>
            </Box>
          ))}
        </Box>
        {roleFormik.touched.newPermissionNames && roleFormik.errors.newPermissionNames && (
          <Typography color='error' variant='caption'>
            {Array.isArray(roleFormik.errors.newPermissionNames)
              ? roleFormik.errors.newPermissionNames
                  .filter(Boolean)
                  .map(err =>
                    typeof err === 'string' ? err : typeof err === 'object' && err ? JSON.stringify(err) : null
                  )
                  .join(', ')
              : typeof roleFormik.errors.newPermissionNames === 'string'
                ? roleFormik.errors.newPermissionNames
                : JSON.stringify(roleFormik.errors.newPermissionNames)}
          </Typography>
        )}
      </Box>

      <Box display='flex' justifyContent='space-between' alignItems='center' mx={5} mt={3} mb={2}>
        <Box display='flex' gap={2}>
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
            disabled={
              isAddUserRoleLoading ||
              (mode === 'add' && (!roleFormik.isValid || !roleFormik.dirty)) ||
              (mode === 'edit' && !isFormEdited)
            }
          >
            {isAddUserRoleLoading
              ? 'Saving...'
              : mode === 'edit'
                ? editType === 'groupRole'
                  ? 'Update Group Role'
                  : 'Update Designation'
                : 'Add Role'}
          </DynamicButton>
        </Box>
      </Box>
    </form>
  )
}

export default AddOrEditUserRole
