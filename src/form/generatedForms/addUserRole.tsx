'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Card,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Checkbox,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
  Autocomplete
} from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import 'react-toastify/dist/ReactToastify.css'
import {
  fetchPermissions,
  fetchGroupRoleById,
  updateGroupRolePermission,
  fetchDesignationRole,
  createGroupRole,
  resetGroupRoleCreateStatus
} from '@/redux/UserRoles/userRoleSlice'
import type { RootState } from '@/redux/store'

interface Permission {
  id: string
  name: string
  description: string
}

interface GroupRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

interface DesignationRole {
  id: string
  name: string
}

interface FormValues {
  groupRoleName: string
  groupRoleDescription: string
  selectedPermissions: string[]
  designationRoles: string[]
}

interface PermissionGroup {
  module: string
  subModule?: string
  permissions: Permission[]
}

const parsePermissionName = (name: string) => {
  const parts = name.replace('prv_', '').split('_')
  if (parts.length === 2) {
    return `${parts[0]}: ${parts[1]}`
  } else if (parts.length === 3) {
    return `${parts[0]} - ${parts[1]}: ${parts[2]}`
  } else if (parts.length === 4) {
    return `${parts[0]} - ${parts[1]} - ${parts[2]}: ${parts[3]}`
  }
  return name
}

const parseModuleAndSubModule = (name: string) => {
  const parts = name.replace('prv_', '').split('_')
  if (parts.length === 2) {
    return { module: parts[0], subModule: undefined, action: parts[1] }
  } else if (parts.length === 3) {
    return { module: parts[0], subModule: parts[1], action: parts[2] }
  } else if (parts.length === 4) {
    return { module: parts[0], subModule: `${parts[1]} - ${parts[2]}`, action: parts[3] }
  }
  return { module: parts[0], subModule: undefined, action: parts.slice(1).join('_') }
}

// Validate permission format
const isValidPermissionFormat = (name: string): boolean => {
  const pattern = /^prv_[a-zA-Z0-9]+(_[a-zA-Z0-9]+){1,2}$/
  return pattern.test(name)
}

const AddOrEditUserRole: React.FC<{ mode: 'add' | 'edit'; id?: string }> = ({ mode, id }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupRoleId = searchParams.get('id') || id || ''

  const {
    permissionData,
    isPermissionLoading,
    permissionFailureMessage,
    isGroupRolePermissionUpdating,
    groupRolePermissionUpdateSuccess,
    groupRolePermissionUpdateFailure,
    groupRolePermissionUpdateFailureMessage,
    designationRoleData,
    isDesignationRoleLoading,
    designationRoleFailureMessage,
    isGroupRoleCreating,
    groupRoleCreateSuccess,
    groupRoleCreateFailure,
    groupRoleCreateFailureMessage
  } = useAppSelector((state: RootState) => state.UserRoleReducer)

  const groupRoleData = useAppSelector(
    (state: RootState) => state.UserRoleReducer.selectedGroupRoleData
  ) as GroupRole | null

  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])
  const [isFormEdited, setIsFormEdited] = useState(false)
  const [initialPermissionsFetched, setInitialPermissionsFetched] = useState(false)
  const [designationRoles, setDesignationRoles] = useState<DesignationRole[]>([])

  const initialFormValues: FormValues = {
    groupRoleName: mode === 'edit' && groupRoleData?.name ? groupRoleData.name : '',
    groupRoleDescription: mode === 'edit' && groupRoleData?.description ? groupRoleData.description : '',
    selectedPermissions:
      mode === 'edit' && groupRoleData?.permissions ? groupRoleData.permissions.map((p: Permission) => p.name) : [],
    designationRoles: []
  }

  const validationSchema = Yup.object().shape({
    groupRoleName: Yup.string()
      .required('Group role name is required')
      .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers, and spaces allowed')
      .test('not-only-spaces', 'Cannot be only spaces', value => value?.trim().length > 0),
    groupRoleDescription: Yup.string(),
    selectedPermissions: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one permission is required')
      .test('valid-format', 'Invalid permission format', values =>
        values.every(name => isValidPermissionFormat(name))
      ),
    designationRoles: mode === 'add' ? Yup.array().of(Yup.string()).min(1, 'At least one designation role is required') : Yup.array().of(Yup.string())
  })

  const formik = useFormik<FormValues>({
    initialValues: initialFormValues,
    enableReinitialize: !initialPermissionsFetched,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Form submission triggered with values:', values)
      try {
        // Validate permissions before submission
        const invalidPermissions = values.selectedPermissions.filter(name => !isValidPermissionFormat(name))
        if (invalidPermissions.length > 0) {
          console.error('Invalid permissions:', invalidPermissions)
          toast.error(`Invalid permission format: ${invalidPermissions.join(', ')}`, {
            position: 'top-right',
            autoClose: 3000
          })
          return
        }

        // Map designation role IDs to names
        const designationRoleNames = values.designationRoles
          .map(id => designationRoles.find(role => role.id === id)?.name)
          .filter((name): name is string => !!name)
        console.log('Mapped designation role names:', designationRoleNames)

        if (mode === 'add' && designationRoleNames.length !== values.designationRoles.length) {
          console.error('Some designation role IDs could not be mapped to names:', values.designationRoles)
          toast.error('Failed to map some designation roles', { position: 'top-right', autoClose: 3000 })
          return
        }

        if (mode === 'edit') {
          const payload = {
            id: groupRoleId,
            params: {
              groupRole: values.groupRoleName,
              newPermissions: values.selectedPermissions
            }
          }
          console.log('Edit payload:', payload)
          await dispatch(updateGroupRolePermission(payload)).unwrap()
        } else {
          const payload = {
            designationRoles: designationRoleNames, // Send names instead of IDs
            groupRole: values.groupRoleName,
            groupRoleDescription: values.groupRoleDescription,
            permissions: values.selectedPermissions
          }
          console.log('Add payload:', payload)
          await dispatch(createGroupRole(payload)).unwrap()
        }

        setIsFormEdited(false)
        formik.setFieldValue('selectedPermissions', [])
        router.push('/group-roles')
      } catch (error: any) {
        console.error('Submit error:', error)
        toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} group role: ${error.message || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 3000
        })
      } finally {
        setSubmitting(false)
      }
    }
  })

  useEffect(() => {
    const fetchAllPermissions = async () => {
      try {
        let allPermissions: Permission[] = []
        let currentPage = 1
        let totalPages = 1

        while (currentPage <= totalPages) {
          const response = await dispatch(fetchPermissions({ page: currentPage })).unwrap()
          allPermissions = [...allPermissions, ...response.data]
          totalPages = response.pagination.totalPages
          currentPage++
        }

        setAvailablePermissions(allPermissions)
        setInitialPermissionsFetched(true)
        console.log('Fetched permissions:', allPermissions)
        if (allPermissions.length === 0) {
          toast.warn('No permissions available', { position: 'top-right', autoClose: 3000 })
        }
      } catch (error) {
        console.error('Failed to fetch all permissions:', error)
        setAvailablePermissions([])
        toast.error('Failed to load permissions', { position: 'top-right', autoClose: 3000 })
      }
    }

    const fetchAllDesignationRoles = async () => {
      try {
        let allDesignationRoles: DesignationRole[] = []
        let currentPage = 1
        let totalPages = 1

        while (currentPage <= totalPages) {
          const response = await dispatch(fetchDesignationRole({ page: currentPage })).unwrap()
          allDesignationRoles = [...allDesignationRoles, ...response.data]
          totalPages = response.pagination.totalPages
          currentPage++
        }

        setDesignationRoles(allDesignationRoles)
        console.log('Fetched designation roles:', allDesignationRoles)
        if (allDesignationRoles.length === 0) {
          toast.warn('No designation roles available', { position: 'top-right', autoClose: 3000 })
        }
      } catch (error) {
        console.error('Failed to fetch designation roles:', error)
        setDesignationRoles([])
        toast.error('Failed to load designation roles', { position: 'top-right', autoClose: 3000 })
      }
    }

    fetchAllPermissions()
    fetchAllDesignationRoles()

    if (mode === 'edit' && groupRoleId && !initialPermissionsFetched) {
      dispatch(fetchGroupRoleById(groupRoleId))
    }

    // Reset create status on mount to avoid stuck state
    dispatch(resetGroupRoleCreateStatus())
  }, [dispatch, mode, groupRoleId])

  const groupedPermissions = availablePermissions.reduce((acc: PermissionGroup[], perm: Permission) => {
    const { module, subModule } = parseModuleAndSubModule(perm.name)
    let group = acc.find(g => g.module === module && g.subModule === subModule)

    if (!group) {
      group = { module, subModule, permissions: [] }
      acc.push(group)
    }

    group.permissions.push(perm)
    return acc
  }, [])

  const handleCheckboxToggle = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId)
    if (!permission) return

    const newSelectedPermissions = formik.values.selectedPermissions.includes(permission.name)
      ? formik.values.selectedPermissions.filter(name => name !== permission.name)
      : [...formik.values.selectedPermissions, permission.name]

    formik.setFieldValue('selectedPermissions', newSelectedPermissions)
    setIsFormEdited(true)
    console.log('Toggled permission:', permissionId, 'New selectedPermissions:', newSelectedPermissions)
  }

  const handleRemovePermission = (permissionName: string) => {
    const newSelectedPermissions = formik.values.selectedPermissions.filter(p => p !== permissionName)
    formik.setFieldValue('selectedPermissions', newSelectedPermissions)
    setIsFormEdited(true)
    console.log('Removed permission:', permissionName, 'New selected:', newSelectedPermissions)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    if (result.source.droppableId.startsWith('available') && result.destination.droppableId === 'selected') {
      const permission = availablePermissions[result.source.index]
      if (!permission) return

      const newSelectedPermissions = [...formik.values.selectedPermissions, permission.name]
      formik.setFieldValue('selectedPermissions', newSelectedPermissions)
      setIsFormEdited(true)
      console.log('Moved to selected:', newSelectedPermissions)
    } else if (result.source.droppableId === 'selected' && result.destination.droppableId.startsWith('available')) {
      const movedItem = formik.values.selectedPermissions[result.source.index]
      const newSelectedPermissions = formik.values.selectedPermissions.filter(
        (_, index) => index !== result.source.index
      )
      formik.setFieldValue('selectedPermissions', newSelectedPermissions)
      setIsFormEdited(true)
      console.log('Moved back to available:', newSelectedPermissions)
    }
  }

  const handleCancel = () => {
    formik.resetForm()
    setIsFormEdited(false)
    dispatch(resetGroupRoleCreateStatus())
    router.push('/group-roles')
  }

  useEffect(() => {
    if (groupRolePermissionUpdateSuccess) {
      toast.success('Group Role Updated Successfully', {
        position: 'top-right',
        autoClose: 3000
      })
      dispatch({ type: 'userRoles/resetUpdateState' })
    } else if (groupRolePermissionUpdateFailure) {
      toast.error(groupRolePermissionUpdateFailureMessage || 'Failed to save group role', {
        position: 'top-right',
        autoClose: 3000
      })
      dispatch({ type: 'userRoles/resetUpdateState' })
    } else if (groupRoleCreateSuccess) {
      toast.success('Group Role Added Successfully', {
        position: 'top-right',
        autoClose: 3000
      })
      dispatch({ type: 'userRoles/resetGroupRoleCreateStatus' })
    } else if (groupRoleCreateFailure) {
      toast.error(groupRoleCreateFailureMessage || 'Failed to create group role', {
        position: 'top-right',
        autoClose: 3000
      })
      dispatch({ type: 'userRoles/resetGroupRoleCreateStatus' })
    }
  }, [
    groupRolePermissionUpdateSuccess,
    groupRolePermissionUpdateFailure,
    groupRolePermissionUpdateFailureMessage,
    groupRoleCreateSuccess,
    groupRoleCreateFailure,
    groupRoleCreateFailureMessage,
    dispatch
  ])

  // Debug form state
  useEffect(() => {
    formik.validateForm().then(errors => {
      console.log('Form errors:', errors)
      console.log('Form is valid:', formik.isValid)
      console.log('Form values:', formik.values)
      console.log('isFormEdited:', isFormEdited)
      console.log('isGroupRoleCreating:', isGroupRoleCreating)
      console.log('isGroupRolePermissionUpdating:', isGroupRolePermissionUpdating)
    })
  }, [formik.values, isFormEdited])

  return (
    <Card sx={{ padding: 5 }}>
      <Box>
        <ToastContainer />
        <Typography variant='h5' sx={{ mb: 2, fontWeight: 600 }}>
          {mode === 'add' ? 'Add New Group Role' : 'Edit Group Role'}
        </Typography>

        <Card sx={{ p: 3, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='Group Role Name *'
              name='groupRoleName'
              value={formik.values.groupRoleName}
              onChange={e => {
                formik.handleChange(e)
                setIsFormEdited(true)
              }}
              InputProps={{ readOnly: mode === 'edit' }}
              onBlur={formik.handleBlur}
              error={formik.touched.groupRoleName && !!formik.errors.groupRoleName}
              helperText={formik.touched.groupRoleName && formik.errors.groupRoleName}
              fullWidth
            />
            <TextField
              label='Group Role Description'
              name='groupRoleDescription'
              value={formik.values.groupRoleDescription}
              onChange={e => {
                formik.handleChange(e)
                setIsFormEdited(true)
              }}
              onBlur={formik.handleBlur}
              multiline
              rows={3}
              error={formik.touched.groupRoleDescription && !!formik.errors.groupRoleDescription}
              helperText={formik.touched.groupRoleDescription && formik.errors.groupRoleDescription}
              fullWidth
            />
            {mode === 'add' && (
              <Autocomplete
                multiple
                options={designationRoles}
                getOptionLabel={(option: DesignationRole) => option.name}
                value={designationRoles.filter(role => formik.values.designationRoles.includes(role.id))}
                onChange={(_, newValue) => {
                  formik.setFieldValue('designationRoles', newValue.map((role: DesignationRole) => role.id))
                  setIsFormEdited(true)
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Designation Roles *'
                    error={formik.touched.designationRoles && !!formik.errors.designationRoles}
                    helperText={formik.touched.designationRoles && formik.errors.designationRoles}
                  />
                )}
                loading={isDesignationRoleLoading}
                disabled={isDesignationRoleLoading}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      sx={{ background: '#E0F7FA', color: '#00695C' }}
                    />
                  ))
                }
              />
            )}
            {designationRoleFailureMessage && (
              <Typography color='error' variant='caption'>
                {designationRoleFailureMessage}
              </Typography>
            )}
          </Box>
        </Card>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={mode === 'edit' ? 6 : 12}>
              <Card sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                  Available Permissions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {isPermissionLoading ? (
                  <Typography>Loading permissions...</Typography>
                ) : permissionFailureMessage ? (
                  <Typography color='error'>{permissionFailureMessage}</Typography>
                ) : groupedPermissions.length === 0 ? (
                  <Typography>No available permissions</Typography>
                ) : (
                  <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {groupedPermissions.map(group => (
                      <Box key={`${group.module}-${group.subModule || 'none'}`} sx={{ mb: 3 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                          {group.module} {group.subModule ? `- ${group.subModule}` : ''}
                        </Typography>
                        <Droppable
                          droppableId={`available-${group.module}-${group.subModule || 'none'}`}
                          direction='horizontal'
                        >
                          {provided => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                            >
                              {group.permissions.map((permission, index) => (
                                <Draggable draggableId={permission.id} index={index} key={permission.id}>
                                  {provided => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      sx={{
                                        bgcolor: formik.values.selectedPermissions.includes(permission.name)
                                          ? '#E8EAF6'
                                          : '#F3F4F6',
                                        border: '1px solid #ccc',
                                        borderRadius: 1,
                                        px: 2,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <Checkbox
                                        checked={formik.values.selectedPermissions.includes(permission.name)}
                                        onChange={() => handleCheckboxToggle(permission.id)}
                                        size='small'
                                      />
                                      <Typography variant='body2'>
                                        {parseModuleAndSubModule(permission.name).action}
                                      </Typography>
                                    </Box>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      </Box>
                    ))}
                  </List>
                )}
                {formik.touched.selectedPermissions && formik.errors.selectedPermissions && (
                  <Typography color='error' variant='caption' sx={{ mt: 2 }}>
                    {formik.errors.selectedPermissions}
                  </Typography>
                )}
              </Card>
            </Grid>

            {mode === 'edit' && (
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                    Selected Permissions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Droppable droppableId='selected'>
                    {provided => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{
                          maxHeight: '400px',
                          overflowY: 'auto',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 2
                        }}
                      >
                        {formik.values.selectedPermissions.length === 0 ? (
                          <Typography>No permissions selected</Typography>
                        ) : (
                          formik.values.selectedPermissions.map((permission, index) => (
                            <Draggable key={permission} draggableId={permission} index={index}>
                              {provided => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    flex: '0 0 calc(33.33% - 8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                    background: '#E0F7FA',
                                    color: '#00695C'
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      permissionData?.data?.find(p => p.name === permission)?.description ||
                                      'No description available'
                                    }
                                    placement='top'
                                    arrow
                                  >
                                    <Chip
                                      label={parsePermissionName(permission)}
                                      sx={{
                                        background: '#E0F7FA',
                                        color: '#00695C',
                                        fontSize: '14px',
                                        flexGrow: 2
                                      }}
                                    />
                                  </Tooltip>
                                  <IconButton
                                    size='small'
                                    onClick={() => handleRemovePermission(permission)}
                                    sx={{ ml: 1 }}
                                  >
                                    <CloseIcon fontSize='small' />
                                  </IconButton>
                                </Box>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                  {formik.touched.selectedPermissions && formik.errors.selectedPermissions && (
                    <Typography color='error' variant='caption' sx={{ mt: 2 }}>
                      {formik.errors.selectedPermissions}
                    </Typography>
                  )}
                </Card>
              </Grid>
            )}
          </Grid>
        </DragDropContext>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button
            variant='contained'
            onClick={handleCancel}
            disabled={!isFormEdited}
            sx={{
              backgroundColor: '#6B7280',
              color: 'white',
              '&:hover': { backgroundColor: '#4B5563' },
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              console.log('Add button clicked, form valid:', formik.isValid)
              console.log('Button disabled state:', {
                isFormEdited,
                isSubmitting: formik.isSubmitting,
                isGroupRoleCreating,
                isGroupRolePermissionUpdating,
                isValid: formik.isValid
              })
              formik.handleSubmit()
            }}
            disabled={!isFormEdited || formik.isSubmitting || isGroupRolePermissionUpdating || isGroupRoleCreating || !formik.isValid}
            sx={{
              backgroundColor: '#377DFF',
              color: 'white',
              '&:hover': { backgroundColor: '#2563EB' },
              borderRadius: '8px',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {(isGroupRolePermissionUpdating || isGroupRoleCreating) ? (
              <>
                <CircularProgress size={20} color='inherit' />
                Saving...
              </>
            ) : (
              <>{mode === 'edit' ? 'Update Role' : 'Add Role'}</>
            )}
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default AddOrEditUserRole
