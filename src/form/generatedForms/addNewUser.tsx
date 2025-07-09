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
  Autocomplete,
  Chip,
  Avatar,
  FormControlLabel,
  Switch,
  Checkbox,
  Collapse,
  IconButton,
  Divider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserById, resetAddUserStatus, updateUserPermission } from '@/redux/UserManagment/userManagementSlice'
import type { RootState } from '@/redux/store'

interface UserManagementState {
  selectedUserData: any
  isUserLoading: boolean
  userFailureMessage: string
}

interface FeatureState {
  name: string
  actions: string[]
  selectedActions: string[]
}

interface SubModuleState {
  name: string
  actions: string[]
  features: FeatureState[]
}

interface PermissionState {
  module: string
  subModule?: string
  features: FeatureState[]
  actions: string[]
  subModules: SubModuleState[]
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

const defaultPermissionsList: PermissionState[] = [
  {
    module: 'Home',
    actions: ['read'],
    features: [],
    subModules: []
  },
  {
    module: 'User',
    actions: [],
    features: [
      { name: 'User', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
      { name: 'Role', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
      { name: 'Employee', actions: ['read', 'sync'], selectedActions: [] }
    ],
    subModules: []
  },
  {
    module: 'Approvals',
    actions: ['create', 'read', 'update', 'delete'],
    features: [],
    subModules: []
  },
  {
    module: 'Hiring',
    actions: [],
    features: [
      { name: 'Cvpool', actions: ['read'], selectedActions: [] },
      { name: 'Interview', actions: ['read', 'update'], selectedActions: [] },
      { name: 'Jobposting', actions: ['read', 'update'], selectedActions: [] },
      { name: 'Onboarding', actions: ['create', 'read', 'update'], selectedActions: [] },
      { name: 'Resignation', actions: ['read', 'sync'], selectedActions: [] },
      { name: 'Budget', actions: ['create', 'read', 'approval', 'delete'], selectedActions: [] }
    ],
    subModules: [
      {
        name: 'Vacancy',
        actions: [],
        features: [
          { name: 'Vacancylist', actions: ['read'], selectedActions: [] },
          { name: 'Vacancyrequest', actions: ['read', 'approval'], selectedActions: [] }
        ]
      }
    ]
  },
  {
    module: 'Jd',
    actions: ['create', 'read', 'update', 'delete', 'upload', 'approval'],
    features: [],
    subModules: []
  },
  {
    module: 'Branch',
    actions: ['read'],
    features: [],
    subModules: []
  },
  {
    module: 'System',
    actions: [],
    features: [
      { name: 'Dataupload', actions: ['read', 'upload'], selectedActions: [] },
      { name: 'Approvalcategory', actions: ['read'], selectedActions: [] },
      { name: 'Approvalmatrix', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
      { name: 'Organizationalmapping', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
      { name: 'Scheduler', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] }
    ],
    subModules: [
      {
        name: 'Xfactor',
        actions: [],
        features: [
          { name: 'Noticeperiodrange', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
          { name: 'Resignedxfactor', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
          { name: 'Vacancyxfactor', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] }
        ]
      }
    ]
  },
  {
    module: 'General',
    actions: ['create', 'read', 'update', 'delete'],
    features: [],
    subModules: []
  }
]

const UserForm = () => {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userManagement = useAppSelector((state: RootState) => state.UserManagementReducer) as UserManagementState

  const { selectedUserData, isUserLoading, userFailureMessage } = userManagement || {
    selectedUserData: null,
    isUserLoading: false,
    userFailureMessage: ''
  }

  const isEditMode = !!id

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    employeeCode: '',
    designation: '',
    designationRole: '',
    groupRoles: [] as string[],
    directPermissions: defaultPermissionsList,
    status: true
  })

  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({})
  const [expandedSubModules, setExpandedSubModules] = useState<{ [key: string]: boolean }>({})
  const [showAllInherited, setShowAllInherited] = useState(false)

  useEffect(() => {
    if (isEditMode && id && typeof id === 'string') {
      dispatch(fetchUserById(id))
    }

    return () => {
      dispatch(resetAddUserStatus())
    }
  }, [id, dispatch])

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
        groupRoles: selectedUserData.groupRoles?.map(role => cleanName(role.name, '')) || [],
        directPermissions: defaultPermissionsList.map(p => {
          const moduleShortName = p.module.toLowerCase()
          const subModuleShortName = p.subModule?.toLowerCase()

          return {
            module: p.module,
            subModule: p.subModule,
            features: p.features.map(f => ({
              name: f.name,
              actions: f.actions,
              selectedActions:
                selectedUserData.directPermissions
                  ?.filter((perm: { name: string }) =>
                    subModuleShortName
                      ? perm.name.startsWith(`prv_${moduleShortName}_${subModuleShortName}_${f.name.toLowerCase()}_`)
                      : perm.name.startsWith(`prv_${moduleShortName}_${f.name.toLowerCase()}_`)
                  )
                  .map((perm: { name: string }) => perm.name.split('_').pop() || '') || []
            })),
            actions: p.actions.filter((action: string) =>
              selectedUserData.directPermissions?.some(
                (perm: { name: string }) => perm.name === `prv_${moduleShortName}_${action}`
              )
            ),
            subModules: p.subModules.map(sm => ({
              name: sm.name,
              actions: sm.actions.filter((action: string) =>
                selectedUserData.directPermissions?.some(
                  (perm: { name: string }) => perm.name === `prv_${moduleShortName}_${sm.name.toLowerCase()}_${action}`
                )
              ),
              features: sm.features.map(f => ({
                name: f.name,
                actions: f.actions,
                selectedActions:
                  selectedUserData.directPermissions
                    ?.filter((perm: { name: string }) =>
                      perm.name.startsWith(`prv_${moduleShortName}_${sm.name.toLowerCase()}_${f.name.toLowerCase()}_`)
                    )
                    .map((perm: { name: string }) => perm.name.split('_').pop() || '') || []
              }))
            }))
          }
        }),
        status: selectedUserData.status?.toLowerCase() === 'active'
      })
    }
  }, [selectedUserData, isEditMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (
    module: string,
    subModule: string | undefined,
    featureOrAction: string,
    action: string,
    checked: boolean,
    isSubModule: boolean = false,
    parentSubModule?: string
  ) => {
    const permissions = [...formData.directPermissions]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

    if (moduleIndex === -1) return

    if (isSubModule && parentSubModule) {
      const subModuleIndex = permissions[moduleIndex].subModules.findIndex(sm => sm.name === parentSubModule)

      if (subModuleIndex === -1) return

      if (featureOrAction.toLowerCase() === 'actions') {
        permissions[moduleIndex].subModules[subModuleIndex].actions = checked
          ? [...new Set([...permissions[moduleIndex].subModules[subModuleIndex].actions, action])]
          : permissions[moduleIndex].subModules[subModuleIndex].actions.filter(a => a !== action)
      } else {
        const featureIndex = permissions[moduleIndex].subModules[subModuleIndex].features.findIndex(
          f => f.name === featureOrAction
        )

        if (featureIndex === -1) return
        permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions = checked
          ? [
              ...new Set([
                ...permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions,
                action
              ])
            ]
          : permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions.filter(
              a => a !== action
            )
      }
    } else if (featureOrAction.toLowerCase() !== 'actions' && permissions[moduleIndex].features.length > 0) {
      const featureIndex = permissions[moduleIndex].features.findIndex(f => f.name === featureOrAction)

      if (featureIndex === -1) return
      permissions[moduleIndex].features[featureIndex].selectedActions = checked
        ? [...new Set([...permissions[moduleIndex].features[featureIndex].selectedActions, action])]
        : permissions[moduleIndex].features[featureIndex].selectedActions.filter(a => a !== action)
    } else if (featureOrAction.toLowerCase() === 'actions') {
      permissions[moduleIndex].actions = checked
        ? [...new Set([...permissions[moduleIndex].actions, action])]
        : permissions[moduleIndex].actions.filter(a => a !== action)
    }

    setFormData(prev => ({ ...prev, directPermissions: permissions }))
  }

  const handleSelectAllPermissions = (
    module: string,
    subModule: string | undefined,
    feature: string,
    allActions: string[],
    checked: boolean,
    isSubModule: boolean = false,
    parentSubModule?: string
  ) => {
    const permissions = [...formData.directPermissions]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

    if (moduleIndex === -1) return

    if (isSubModule && parentSubModule) {
      const subModuleIndex = permissions[moduleIndex].subModules.findIndex(sm => sm.name === parentSubModule)

      if (subModuleIndex === -1) return

      if (feature.toLowerCase() === 'actions') {
        permissions[moduleIndex].subModules[subModuleIndex].actions = checked ? allActions : []
      } else {
        const featureIndex = permissions[moduleIndex].subModules[subModuleIndex].features.findIndex(
          f => f.name === feature
        )

        if (featureIndex === -1) return
        permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions = checked
          ? allActions
          : []
      }
    } else if (feature.toLowerCase() === 'actions') {
      permissions[moduleIndex].actions = checked ? allActions : []
    } else {
      const featureIndex = permissions[moduleIndex].features.findIndex(f => f.name === feature)

      if (featureIndex === -1) return
      permissions[moduleIndex].features[featureIndex].selectedActions = checked ? allActions : []
    }

    setFormData(prev => ({ ...prev, directPermissions: permissions }))
  }

  const handleSelectAllFeatures = (module: string, subModule: string | undefined, checked: boolean) => {
    const permissions = [...formData.directPermissions]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

    if (moduleIndex === -1) return
    const perm = defaultPermissionsList.find(p => p.module === module && p.subModule === subModule)

    permissions[moduleIndex].features =
      perm?.features.map(f => ({
        name: f.name,
        actions: f.actions,
        selectedActions: checked ? f.actions : []
      })) || []
    permissions[moduleIndex].actions = checked ? perm?.actions || [] : []
    permissions[moduleIndex].subModules =
      perm?.subModules.map(sm => ({
        name: sm.name,
        actions: checked ? sm.actions : [],
        features: sm.features.map(f => ({
          name: f.name,
          actions: f.actions,
          selectedActions: checked ? f.actions : []
        }))
      })) || []
    setFormData(prev => ({ ...prev, directPermissions: permissions }))
  }

  const handleSelectAllModules = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      directPermissions: defaultPermissionsList.map(p => ({
        module: p.module,
        subModule: p.subModule,
        features: p.features.map(f => ({
          name: f.name,
          actions: f.actions,
          selectedActions: checked ? f.actions : []
        })),
        actions: checked ? p.actions : [],
        subModules: p.subModules.map(sm => ({
          name: sm.name,
          actions: checked ? sm.actions : [],
          features: sm.features.map(f => ({
            name: f.name,
            actions: f.actions,
            selectedActions: checked ? f.actions : []
          }))
        }))
      }))
    }))
  }

  const toggleModule = (module: string) => {
    setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }))
  }

  const toggleSubModule = (subModule: string) => {
    setExpandedSubModules(prev => ({ ...prev, [subModule]: !prev[subModule] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const permissions = formData.directPermissions
      .flatMap(perm => {
        const moduleResults = perm.features.flatMap(f =>
          f.selectedActions.map(action =>
            perm.subModule
              ? `prv_${perm.module.toLowerCase()}_${perm.subModule.toLowerCase()}_${f.name.toLowerCase()}_${action}`
              : `prv_${perm.module.toLowerCase()}_${f.name.toLowerCase()}_${action}`
          )
        )

        const subModuleResults = perm.subModules.flatMap(sm => [
          ...sm.actions.map(action => `prv_${perm.module.toLowerCase()}_${sm.name.toLowerCase()}_${action}`),
          ...sm.features.flatMap(f =>
            f.selectedActions.map(
              action => `prv_${perm.module.toLowerCase()}_${sm.name.toLowerCase()}_${f.name.toLowerCase()}_${action}`
            )
          )
        ])

        const additionalPermissions: string[] = []

        if (perm.module === 'User' && perm.features.some(f => f.selectedActions.length > 0)) {
          additionalPermissions.push('prv_user_read')
        }

        if (
          perm.module === 'Hiring' &&
          (perm.features.some(f => f.selectedActions.length > 0) ||
            perm.subModules.some(sm => sm.features.some(f => f.selectedActions.length > 0)))
        ) {
          additionalPermissions.push('prv_hiring_read')
        }

        if (
          perm.module === 'Hiring' &&
          perm.subModules.some(sm => sm.name === 'Vacancy' && sm.features.some(f => f.selectedActions.length > 0))
        ) {
          additionalPermissions.push('prv_hiring_vacancy_read')
        }

        if (
          perm.module === 'System' &&
          (perm.features.some(f => f.selectedActions.length > 0) ||
            perm.subModules.some(sm => sm.features.some(f => f.selectedActions.length > 0)))
        ) {
          additionalPermissions.push('prv_system_read')
        }

        if (
          perm.module === 'System' &&
          perm.subModules.some(sm => sm.name === 'Xfactor' && sm.features.some(f => f.selectedActions.length > 0))
        ) {
          additionalPermissions.push('prv_system_xfactor_read')
        }

        return [
          ...moduleResults,
          ...subModuleResults,
          ...perm.actions.map(action => `prv_${perm.module.toLowerCase()}_${action}`),
          ...additionalPermissions
        ]
      })
      .filter(Boolean)

    if (isEditMode && id) {
      const payload = {
        email: formData.email,
        newPermissions: permissions
      }

      await dispatch(updateUserPermission({ id, params: payload }))
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
      <Card sx={{ p: 4, borderRadius: '14px' }}>
        <Typography variant='h5' gutterBottom>
          {isEditMode ? 'Edit User' : 'Add User'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Profile Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    alt={formData.firstName}
                    src={selectedUserData?.profileImage || ''}
                    sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
                  />
                  <Grid container justifyContent='center'>
                    <Grid item>
                      <Box sx={{ display: 'flex', gap: 1 }}>
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
                    </Grid>
                  </Grid>
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
                <Divider></Divider>
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ mb: 1, fontWeight: 600, display: 'flex', flexWrap: 'wrap' }}>
                    Inherited Permissions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {uniqueInheritedPermissions.slice(0, 5).map((permission, idx) => (
                      <Chip
                        key={idx}
                        label={toTitleCase(cleanName(permission.name, ''))}
                        sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                      />
                    ))}
                    {uniqueInheritedPermissions.length > 5 && (
                      <>
                        <Chip
                          label={`+${uniqueInheritedPermissions.length - 5}`}
                          onClick={() => setShowAllInherited(!showAllInherited)}
                          sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px', cursor: 'pointer' }}
                        />
                        <Collapse in={showAllInherited}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {uniqueInheritedPermissions.slice(5).map((permission, idx) => (
                              <Chip
                                key={idx}
                                label={toTitleCase(cleanName(permission.name, ''))}
                                sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                              />
                            ))}
                          </Box>
                        </Collapse>
                      </>
                    )}
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
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Designation' name='designation' value={formData.designation} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Designation Role'
                    name='designationRole'
                    value={formData.designationRole}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ mb: 1, fontWeight: 600 }}>Direct Permissions:</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.directPermissions.every(p => {
                            const defaultPerm = defaultPermissionsList.find(
                              d => d.module === p.module && p.subModule === d.subModule
                            )

                            const actionsChecked =
                              defaultPerm?.actions.length > 0
                                ? p.actions.length === defaultPerm.actions.length &&
                                  defaultPerm.actions.every(a => p.actions.includes(a))
                                : true

                            const featuresChecked =
                              defaultPerm?.features.length > 0
                                ? p.features.every(f =>
                                    defaultPerm.features
                                      .find(feat => feat.name === f.name)
                                      ?.actions.every(a => f.selectedActions.includes(a))
                                  )
                                : true

                            const subModulesChecked =
                              defaultPerm?.subModules.length > 0
                                ? p.subModules.every(sm => {
                                    const defaultSubModule = defaultPerm.subModules.find(dsm => dsm.name === sm.name)

                                    const subActionsChecked =
                                      defaultSubModule?.actions.length > 0
                                        ? sm.actions.length === defaultSubModule.actions.length &&
                                          defaultSubModule.actions.every(a => sm.actions.includes(a))
                                        : true

                                    const subFeaturesChecked =
                                      defaultSubModule?.features.length > 0
                                        ? sm.features.every(f =>
                                            defaultSubModule.features
                                              .find(feat => feat.name === f.name)
                                              ?.actions.every(a => f.selectedActions.includes(a))
                                          )
                                        : true

                                    return subActionsChecked && subFeaturesChecked
                                  })
                                : true

                            return actionsChecked && featuresChecked && subModulesChecked
                          })}
                          onChange={e => handleSelectAllModules(e.target.checked)}
                          sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                        />
                      }
                      label={<Typography sx={{ color: 'grey[700]', fontWeight: 500 }}>Select All</Typography>}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                      {defaultPermissionsList.map(permission => {
                        const currentPerm = formData.directPermissions.find(
                          p => p.module === permission.module && p.subModule === permission.subModule
                        )

                        return (
                          <Box
                            key={`${permission.module}-${permission.subModule || ''}`}
                            sx={{
                              backgroundColor: 'white',
                              border: '1px solid',
                              borderColor: 'grey[200]',
                              borderRadius: '6px',
                              p: 2,
                              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                              transition: 'box-shadow 0.2s',
                              '&:hover': { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      (permission.actions.length > 0
                                        ? currentPerm?.actions.length === permission.actions.length &&
                                          permission.actions.every(a => currentPerm?.actions.includes(a))
                                        : true) &&
                                      (permission.features.length > 0
                                        ? currentPerm?.features.every(f =>
                                            permission.features
                                              .find(feat => feat.name === f.name)
                                              ?.actions.every(a => f.selectedActions.includes(a))
                                          )
                                        : true) &&
                                      (permission.subModules.length > 0
                                        ? currentPerm?.subModules.every(sm => {
                                            const defaultSubModule = permission.subModules.find(
                                              dsm => dsm.name === sm.name
                                            )

                                            return (
                                              (defaultSubModule?.actions.length > 0
                                                ? sm.actions.length === defaultSubModule.actions.length &&
                                                  defaultSubModule.actions.every(a => sm.actions.includes(a))
                                                : true) &&
                                              (defaultSubModule?.features.length > 0
                                                ? sm.features.every(f =>
                                                    defaultSubModule.features
                                                      .find(feat => feat.name === f.name)
                                                      ?.actions.every(a => f.selectedActions.includes(a))
                                                  )
                                                : true)
                                            )
                                          })
                                        : true)
                                    }
                                    onChange={e =>
                                      handleSelectAllFeatures(permission.module, permission.subModule, e.target.checked)
                                    }
                                    sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                  />
                                }
                                label={
                                  <Typography sx={{ fontWeight: 'bold', color: 'grey[800]' }}>
                                    {permission.subModule
                                      ? `${permission.module} - ${permission.subModule}`
                                      : permission.module}
                                  </Typography>
                                }
                              />
                              <IconButton onClick={() => toggleModule(permission.module)}>
                                {expandedModules[permission.module] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </Box>
                            <Collapse in={expandedModules[permission.module]}>
                              <Box sx={{ pl: permission.features.length > 0 ? 4 : 2, mt: 2 }}>
                                {permission.actions.length > 0 && (
                                  <Box sx={{ mb: 2 }}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={
                                            currentPerm?.actions.length === permission.actions.length &&
                                            permission.actions.every(a => currentPerm?.actions.includes(a))
                                          }
                                          onChange={e =>
                                            handleSelectAllPermissions(
                                              permission.module,
                                              permission.subModule,
                                              'actions',
                                              permission.actions,
                                              e.target.checked
                                            )
                                          }
                                          sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                        />
                                      }
                                      label={<Typography sx={{ color: 'grey[700]' }}>Actions</Typography>}
                                    />
                                    <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {permission.actions.map(action => (
                                        <FormControlLabel
                                          key={action}
                                          control={
                                            <Checkbox
                                              checked={currentPerm?.actions.includes(action) ?? false}
                                              onChange={e =>
                                                handlePermissionChange(
                                                  permission.module,
                                                  permission.subModule,
                                                  'actions',
                                                  action,
                                                  e.target.checked
                                                )
                                              }
                                              sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                            />
                                          }
                                          label={
                                            <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
                                              {action.charAt(0).toUpperCase() + action.slice(1)}
                                            </Typography>
                                          }
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                )}
                                {permission.features.map(feature => {
                                  const currentFeature = currentPerm?.features.find(f => f.name === feature.name)

                                  return (
                                    <Box key={feature.name} sx={{ mb: 2 }}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              currentFeature?.selectedActions.length === feature.actions.length &&
                                              feature.actions.every(a => currentFeature?.selectedActions.includes(a))
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
                                            sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                          />
                                        }
                                        label={<Typography sx={{ color: 'grey[700]' }}>{feature.name}</Typography>}
                                      />
                                      <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {feature.actions.map(action => (
                                          <FormControlLabel
                                            key={action}
                                            control={
                                              <Checkbox
                                                checked={currentFeature?.selectedActions.includes(action) ?? false}
                                                onChange={e =>
                                                  handlePermissionChange(
                                                    permission.module,
                                                    permission.subModule,
                                                    feature.name,
                                                    action,
                                                    e.target.checked
                                                  )
                                                }
                                                sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                              />
                                            }
                                            label={
                                              <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
                                                {action.charAt(0).toUpperCase() + action.slice(1)}
                                              </Typography>
                                            }
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                  )
                                })}
                                {permission.subModules.map(subModule => {
                                  const currentSubModule = currentPerm?.subModules.find(
                                    sm => sm.name === subModule.name
                                  )

                                  return (
                                    <Box key={subModule.name} sx={{ mt: 2, pl: 2 }}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          backgroundColor: 'grey[50]',
                                          p: 1.5,
                                          borderRadius: '4px'
                                        }}
                                        onClick={() => toggleSubModule(subModule.name)}
                                      >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                checked={
                                                  (subModule.actions.length > 0
                                                    ? currentSubModule?.actions.length === subModule.actions.length &&
                                                      subModule.actions.every(a =>
                                                        currentSubModule?.actions.includes(a)
                                                      )
                                                    : true) &&
                                                  subModule.features.every(
                                                    f =>
                                                      currentSubModule?.features.find(cf => cf.name === f.name)
                                                        ?.selectedActions.length === f.actions.length
                                                  )
                                                }
                                                onChange={e => {
                                                  if (subModule.actions.length > 0) {
                                                    handleSelectAllPermissions(
                                                      permission.module,
                                                      undefined,
                                                      'actions',
                                                      subModule.actions,
                                                      e.target.checked,
                                                      true,
                                                      subModule.name
                                                    )
                                                  }

                                                  subModule.features.forEach(f =>
                                                    handleSelectAllPermissions(
                                                      permission.module,
                                                      undefined,
                                                      f.name,
                                                      f.actions,
                                                      e.target.checked,
                                                      true,
                                                      subModule.name
                                                    )
                                                  )
                                                }}
                                                sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                              />
                                            }
                                            label={
                                              <Typography sx={{ fontWeight: 500, color: 'grey[700]' }}>
                                                {subModule.name}
                                              </Typography>
                                            }
                                          />
                                        </Box>
                                        <IconButton
                                          size='small'
                                          onClick={e => {
                                            e.stopPropagation()
                                            toggleSubModule(subModule.name)
                                          }}
                                        >
                                          {expandedSubModules[subModule.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                      </Box>
                                      <Collapse in={expandedSubModules[subModule.name]}>
                                        <Box sx={{ pl: 2, mt: 1 }}>
                                          {subModule.actions.length > 0 && (
                                            <Box sx={{ mb: 2 }}>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={
                                                      currentSubModule?.actions.length === subModule.actions.length &&
                                                      subModule.actions.every(a =>
                                                        currentSubModule?.actions.includes(a)
                                                      )
                                                    }
                                                    onChange={e =>
                                                      handleSelectAllPermissions(
                                                        permission.module,
                                                        undefined,
                                                        'actions',
                                                        subModule.actions,
                                                        e.target.checked,
                                                        true,
                                                        subModule.name
                                                      )
                                                    }
                                                    sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                                  />
                                                }
                                                label={<Typography sx={{ color: 'grey[700]' }}>Actions</Typography>}
                                              />
                                              <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {subModule.actions.map(action => (
                                                  <FormControlLabel
                                                    key={action}
                                                    control={
                                                      <Checkbox
                                                        checked={currentSubModule?.actions.includes(action) ?? false}
                                                        onChange={e =>
                                                          handlePermissionChange(
                                                            permission.module,
                                                            undefined,
                                                            'actions',
                                                            action,
                                                            e.target.checked,
                                                            true,
                                                            subModule.name
                                                          )
                                                        }
                                                        sx={{
                                                          color: 'grey[600]',
                                                          '&.Mui-checked': { color: 'blue[600]' }
                                                        }}
                                                      />
                                                    }
                                                    label={
                                                      <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
                                                        {action.charAt(0).toUpperCase() + action.slice(1)}
                                                      </Typography>
                                                    }
                                                  />
                                                ))}
                                              </Box>
                                            </Box>
                                          )}
                                          {subModule.features.map(feature => (
                                            <Box key={feature.name} sx={{ mb: 2 }}>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={
                                                      currentSubModule?.features.find(f => f.name === feature.name)
                                                        ?.selectedActions.length === feature.actions.length
                                                    }
                                                    onChange={e =>
                                                      handleSelectAllPermissions(
                                                        permission.module,
                                                        undefined,
                                                        feature.name,
                                                        feature.actions,
                                                        e.target.checked,
                                                        true,
                                                        subModule.name
                                                      )
                                                    }
                                                    sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
                                                  />
                                                }
                                                label={
                                                  <Typography sx={{ color: 'grey[700]' }}>{feature.name}</Typography>
                                                }
                                              />
                                              <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {feature.actions.map(action => (
                                                  <FormControlLabel
                                                    key={action}
                                                    control={
                                                      <Checkbox
                                                        checked={
                                                          currentSubModule?.features
                                                            .find(f => f.name === feature.name)
                                                            ?.selectedActions.includes(action) ?? false
                                                        }
                                                        onChange={e =>
                                                          handlePermissionChange(
                                                            permission.module,
                                                            undefined,
                                                            feature.name,
                                                            action,
                                                            e.target.checked,
                                                            true,
                                                            subModule.name
                                                          )
                                                        }
                                                        sx={{
                                                          color: 'grey[600]',
                                                          '&.Mui-checked': { color: 'blue[600]' }
                                                        }}
                                                      />
                                                    }
                                                    label={
                                                      <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
                                                        {action.charAt(0).toUpperCase() + action.slice(1)}
                                                      </Typography>
                                                    }
                                                  />
                                                ))}
                                              </Box>
                                            </Box>
                                          ))}
                                        </Box>
                                      </Collapse>
                                    </Box>
                                  )
                                })}
                              </Box>
                            </Collapse>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button variant='contained' type='submit'>
                      {isEditMode ? 'Save Changes' : 'Add User'}
                    </Button>
                    <Button
                      variant='outlined'
                      color='secondary'
                      sx={{ ml: 2 }}
                      onClick={() => router.push('/user-management')}
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
