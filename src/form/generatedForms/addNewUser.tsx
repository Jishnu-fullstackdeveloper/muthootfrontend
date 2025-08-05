'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  CircularProgress,
  Card,
  Grid,
  TextField,
  Button,
  Chip,
  Avatar,
  Divider,
  List,
  Tooltip,
  IconButton,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Collapse
} from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import CloseIcon from '@mui/icons-material/Close'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchUserById,
  resetAddUserStatus,
  updateUserPermission,
  updateUserRole,
  fetchDesignationRoles
} from '@/redux/UserManagment/userManagementSlice'
import { fetchPermissions } from '@/redux/UserRoles/userRoleSlice'
import type { RootState } from '@/redux/store'

interface Permission {
  id: string
  name: string
  description: string
}

interface PermissionGroup {
  module: string
  subModule?: string
  permissions: Permission[]
}

interface UserManagementState {
  selectedUserData: any
  isUserLoading: boolean
  userFailureMessage: string
  isUserPermissionUpdating: boolean
  userPermissionUpdateSuccess: boolean
  userPermissionUpdateFailure: boolean
  userPermissionUpdateFailureMessage: string
}

const toTitleCase = (str: string) =>
  str
    .toString()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const cleanName = (name: string, prefix: string) => {
  if (!name) return ''

  return name.replace(new RegExp(`^${prefix}`), '').trim()
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

const UserForm = () => {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [page] = useState(1)
  const [limit] = useState(100)

  const userManagement = useAppSelector(
    (state: RootState) => state.UserManagementReducer
  ) as unknown as UserManagementState

  const {
    selectedUserData,
    isUserLoading,
    userFailureMessage,
    isUserPermissionUpdating,
    userPermissionUpdateSuccess,
    userPermissionUpdateFailure,
    userPermissionUpdateFailureMessage
  } = userManagement || {
    selectedUserData: null,
    isUserLoading: false,
    userFailureMessage: '',
    isUserPermissionUpdating: false,
    userPermissionUpdateSuccess: false,
    userPermissionUpdateFailure: false,
    userPermissionUpdateFailureMessage: ''
  }

  const { userDesignationRoleData } = useAppSelector((state: RootState) => state.UserManagementReducer)

  const isEditMode = !!id
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isFormEdited, setIsFormEdited] = useState(false)
  const [showAllInherited, setShowAllInherited] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    employeeCode: '',
    designation: '',
    designationRole: '',
    groupRoles: [] as string[],
    status: true
  })

  useEffect(() => {
    const fetchAllPermissions = async () => {
      try {
        let allPermissions: Permission[] = []
        let currentPage = 1
        let totalPages = 1

        while (currentPage <= totalPages) {
          const response = await dispatch(fetchPermissions({ page: currentPage, limit: 100 })).unwrap()

          allPermissions = [...allPermissions, ...response.data]
          totalPages = response.pagination.totalPages
          currentPage++
        }

        setAvailablePermissions(allPermissions)
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
        toast.error('Failed to load permissions', { position: 'top-right', autoClose: 3000 })
      }
    }

    fetchAllPermissions()

    if (isEditMode && id && typeof id === 'string') {
      dispatch(fetchUserById(id))
    }

    dispatch(fetchDesignationRoles({ page, limit }))

    return () => {
      dispatch(resetAddUserStatus())
    }
  }, [id, dispatch, page, limit])

  useEffect(() => {
    if (isEditMode && selectedUserData) {
      setFormData({
        firstName: selectedUserData.firstName || '',
        middleName: selectedUserData.middleName || '',
        lastName: selectedUserData.lastName || '',
        email: selectedUserData.email || '',
        employeeCode: selectedUserData.employeeCode || '',
        designation: selectedUserData.designation || '',
        designationRole: selectedUserData.designationRole?.name
          ? cleanName(selectedUserData.designationRole.name, 'des_')
          : '',
        groupRoles: selectedUserData.groupRoles?.map((role: any) => cleanName(role.name, '')) || [],
        status: selectedUserData.status?.toLowerCase() === 'active'
      })
      setSelectedPermissions(selectedUserData.directPermissions?.map((perm: { name: string }) => perm.name) || [])
    }
  }, [selectedUserData, isEditMode])

  useEffect(() => {
    if (userPermissionUpdateSuccess) {
      toast.success('User permissions updated successfully', { position: 'top-right', autoClose: 3000 })
      dispatch({ type: 'userManagement/resetUpdateState' })
      router.back()
    } else if (userPermissionUpdateFailure) {
      toast.error(userPermissionUpdateFailureMessage || 'Failed to update user permissions', {
        position: 'top-right',
        autoClose: 3000
      })
      dispatch({ type: 'userManagement/resetUpdateState' })
    }
  }, [userPermissionUpdateSuccess, userPermissionUpdateFailure, userPermissionUpdateFailureMessage, dispatch, router])

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

    const newSelectedPermissions = selectedPermissions.includes(permission.name)
      ? selectedPermissions.filter(name => name !== permission.name)
      : [...selectedPermissions, permission.name]

    setSelectedPermissions(newSelectedPermissions)
    setIsFormEdited(true)
  }

  const handleRemovePermission = (permissionName: string) => {
    const newSelectedPermissions = selectedPermissions.filter(p => p !== permissionName)

    setSelectedPermissions(newSelectedPermissions)
    setIsFormEdited(true)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    if (result.source.droppableId.startsWith('available') && result.destination.droppableId === 'selected') {
      const permission = availablePermissions[result.source.index]

      if (!permission) return

      const newSelectedPermissions = [...selectedPermissions, permission.name]

      setSelectedPermissions(newSelectedPermissions)
      setIsFormEdited(true)
    } else if (result.source.droppableId === 'selected' && result.destination.droppableId.startsWith('available')) {
      const newSelectedPermissions = selectedPermissions.filter((_, index) => index !== result.source.index)

      setSelectedPermissions(newSelectedPermissions)
      setIsFormEdited(true)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPermissionNames = availablePermissions.map(p => p.name)

      setSelectedPermissions(allPermissionNames)
    } else {
      setSelectedPermissions([])
    }

    setIsFormEdited(true)
  }

  const handleSelectModule = (module: string, subModule: string | undefined, checked: boolean) => {
    const modulePermissions = groupedPermissions
      .filter(g => g.module === module && g.subModule === subModule)
      .flatMap(g => g.permissions.map(p => p.name))

    const newSelectedPermissions = checked
      ? [...new Set([...selectedPermissions, ...modulePermissions])]
      : selectedPermissions.filter(p => !modulePermissions.includes(p))

    setSelectedPermissions(newSelectedPermissions)
    setIsFormEdited(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
    setIsFormEdited(true)
  }

  const handleCancel = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      employeeCode: '',
      designation: '',
      designationRole: '',
      groupRoles: [],
      status: true
    })
    setSelectedPermissions([])
    setIsFormEdited(false)
    dispatch(resetAddUserStatus())
    router.back()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode && id && typeof id === 'string') {
      const permissionPayload = {
        email: formData.email,
        newPermissions: selectedPermissions
      }

      const rolePayload = {
        email: formData.email,
        newRoleNames: formData.groupRoles
      }

      try {
        await Promise.all([
          dispatch(updateUserPermission({ id, params: permissionPayload })).unwrap(),
          dispatch(updateUserRole({ id, params: rolePayload })).unwrap(),
          toast.success('Permission Updated Successfully', {
            position: 'top-right',
            autoClose: 3000
          })
        ])
      } catch (error: any) {
        toast.error(`Failed to update user: ${error.message || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 3000
        })
      }
    }

    router.back()
  }

  if (isUserLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (userFailureMessage) {
    return <Typography color='error'>Error: {userFailureMessage}</Typography>
  }

  const uniqueInheritedPermissions = Array.from(
    new Map(selectedUserData?.inheritedPermissions?.map(p => [p.name, p]) || []).values()
  )

  return (
    <Box>
      <ToastContainer />
      <Card sx={{ p: 4, borderRadius: '14px' }}>
        <Typography variant='h5' gutterBottom>
          {isEditMode ? 'Edit User' : 'Add User'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  alt={formData.firstName}
                  src={selectedUserData?.profileImage || ''}
                  sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
                      {formData.firstName || '-'}
                    </Typography>
                    {formData.middleName && (
                      <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
                        {formData.middleName}
                      </Typography>
                    )}
                    <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
                      {formData.lastName || '-'}
                    </Typography>
                  </Box>
                  <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
                    {formData.employeeCode}
                  </Typography>
                </Box>
                <Box sx={{ mt: 10 }}>
                  <Typography sx={{ mb: 1, fontWeight: 600, display: 'flex', flexWrap: 'wrap' }}>
                    Group Roles
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.groupRoles?.length > 0 ? (
                      formData.groupRoles.map((role: string, index: number) => (
                        <Chip
                          key={index}
                          label={toTitleCase(role)}
                          sx={{ background: '#377DFF33', color: '#0096DA', mr: 1, mb: 1 }}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        No group roles assigned.
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ mb: 1, fontWeight: 600, display: 'flex', flexWrap: 'wrap' }}>
                    Inherited Permissions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {uniqueInheritedPermissions.slice(0, 5).map((permission, idx) => (
                      <Chip
                        key={idx}
                        label={toTitleCase(cleanName((permission as any).name, ''))}
                        sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                      />
                    ))}
                    {!showAllInherited && uniqueInheritedPermissions.length > 5 && (
                      <Chip
                        label={`+${uniqueInheritedPermissions.length - 5} more`}
                        onClick={() => setShowAllInherited(true)}
                        sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px', cursor: 'pointer' }}
                      />
                    )}
                    <Collapse in={showAllInherited} unmountOnExit>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {uniqueInheritedPermissions.slice(5).map((permission, idx) => (
                          <Chip
                            key={idx}
                            label={toTitleCase(cleanName((permission as any).name, ''))}
                            sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label='Show Less'
                          onClick={() => setShowAllInherited(false)}
                          sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px', cursor: 'pointer' }}
                        />
                      </Box>
                    </Collapse>
                    {uniqueInheritedPermissions.length === 0 && <Typography>N/A</Typography>}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Designation'
                    name='designation'
                    value={formData.designation}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    options={userDesignationRoleData?.map(role => cleanName(role.name, 'des_')) || []}
                    value={formData.designationRole || ''}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, designationRole: newValue || '' }))
                      setIsFormEdited(true)
                    }}
                    disabled
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Designation Role'
                        name='designationRole'
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ mb: 1, fontWeight: 600 }}>Direct Permissions:</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPermissions.length === availablePermissions.length}
                          onChange={e => handleSelectAll(e.target.checked)}
                          sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                        />
                      }
                      label={<Typography sx={{ color: 'grey[700]', fontWeight: 500 }}>Select All</Typography>}
                    />
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                              Available Permissions
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {isUserLoading ? (
                              <Typography>Loading permissions...</Typography>
                            ) : userFailureMessage ? (
                              <Typography color='error'>{userFailureMessage}</Typography>
                            ) : groupedPermissions.length === 0 ? (
                              <Typography>No available permissions</Typography>
                            ) : (
                              <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {groupedPermissions.map(group => (
                                  <Box key={`${group.module}-${group.subModule || 'none'}`} sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={group.permissions.every(p => selectedPermissions.includes(p.name))}
                                            onChange={e =>
                                              handleSelectModule(group.module, group.subModule, e.target.checked)
                                            }
                                            sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                          />
                                        }
                                        label={
                                          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                            {group.module} {group.subModule ? `- ${group.subModule}` : ''}
                                          </Typography>
                                        }
                                      />
                                    </Box>
                                    <Droppable
                                      droppableId={`available-${group.module}-${group.subModule || 'none'}`}
                                      direction='horizontal'
                                    >
                                      {provided => (
                                        <Box
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, pl: 4 }}
                                        >
                                          {group.permissions.map((permission, index) => (
                                            <Draggable draggableId={permission.id} index={index} key={permission.id}>
                                              {provided => (
                                                <Box
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  sx={{
                                                    bgcolor: selectedPermissions.includes(permission.name)
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
                                                    checked={selectedPermissions.includes(permission.name)}
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
                          </Card>
                        </Grid>
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
                                  {selectedPermissions.length === 0 ? (
                                    <Typography>No permissions selected</Typography>
                                  ) : (
                                    selectedPermissions.map((permission, index) => (
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
                                                availablePermissions.find(p => p.name === permission)?.description ||
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
                          </Card>
                        </Grid>
                      </Grid>
                    </DragDropContext>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant='contained'
                      type='submit'
                      disabled={!isFormEdited || isUserPermissionUpdating}
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
                      {isUserPermissionUpdating ? (
                        <>
                          <CircularProgress size={20} color='inherit' />
                          Saving...
                        </>
                      ) : (
                        <>{isEditMode ? 'Save Changes' : 'Add User'}</>
                      )}
                    </Button>
                    <Button
                      variant='outlined'
                      color='secondary'
                      sx={{ ml: 2, borderRadius: '8px', textTransform: 'none' }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  )
}

export default UserForm
