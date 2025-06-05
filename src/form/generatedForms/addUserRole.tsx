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
  CircularProgress,
  Typography,
  Chip,
  Autocomplete,
  Collapse,
  IconButton
} from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  addNewUserRole,
  updateUserRole,
  resetAddUserRoleStatus,
  getUserRoleDetails,
  fetchUserRole
} from '@/redux/UserRoles/userRoleSlice'
import DynamicButton from '@/components/Button/dynamicButton'
import 'react-toastify/dist/ReactToastify.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

interface FeatureState {
  name: string
  actions: string[]
  selectedActions?: string[]
}

interface SubModuleState {
  name: string
  actions?: string[]
  features: FeatureState[]
}

interface PermissionState {
  module: string
  subModule?: string
  features?: FeatureState[]
  actions?: string[]
  subModules?: SubModuleState[]
}

interface FormValues {
  designation: string
  groupDesignation: string | string[]
  groupRoleDescription: string
  newPermissionNames: PermissionState[]
}

const defaultPermissionsList: PermissionState[] = [
  {
    module: 'Home',
    actions: ['read']
  },
  {
    module: 'User',
    features: [
      { name: 'User', actions: ['create', 'read', 'update', 'delete'] },
      { name: 'Role', actions: ['create', 'read', 'update', 'delete'] },
      { name: 'Employee', actions: ['read', 'sync'] }
    ]
  },
  {
    module: 'Approvals',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    module: 'Hiring',
    features: [
      { name: 'Cvpool', actions: ['read'] },
      { name: 'Interview', actions: ['read', 'update'] },
      { name: 'Jobposting', actions: ['read', 'update'] },
      { name: 'Onboarding', actions: ['create', 'read', 'update'] },
      { name: 'Resignation', actions: ['read', 'sync'] },
      { name: 'Budget', actions: ['create', 'read', 'approval', 'delete'] }
    ],
    subModules: [
      {
        name: 'Vacancy',
        features: [
          { name: 'Vacancylist', actions: ['read'] },
          { name: 'Vacancyrequest', actions: ['read', 'approval'] }
        ]
      }
    ]
  },
  {
    module: 'Jd',
    actions: ['create', 'read', 'update', 'delete', 'upload', 'approval']
  },
  {
    module: 'Branch',
    actions: ['read']
  },
  {
    module: 'System',
    features: [
      { name: 'Dataupload', actions: ['read', 'upload'] },
      { name: 'Approvalcategory', actions: ['read'] },
      { name: 'Approvalmatrix', actions: ['create', 'read', 'update', 'delete'] },
      { name: 'Organizationalmapping', actions: ['create', 'read', 'update', 'delete'] },
      { name: 'Scheduler', actions: ['create', 'read', 'update', 'delete'] }
    ],
    subModules: [
      {
        name: 'Xfactor',
        features: [
          { name: 'Noticeperiodrange', actions: ['create', 'read', 'update', 'delete'] },
          { name: 'Resignedxfactor', actions: ['create', 'read', 'update', 'delete'] },
          { name: 'Vacancyxfactor', actions: ['create', 'read', 'update', 'delete'] }
        ]
      }
    ]
  },
  {
    module: 'General',
    actions: ['create', 'read', 'update', 'delete']
  }
]

const AddOrEditUserRole: React.FC<{ mode: 'add' | 'edit'; id?: string }> = ({ mode, id }) => {
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [isFormEdited, setIsFormEdited] = useState(false)
  const [fetchedRoleData, setFetchedRoleData] = useState<any>(null)
  const [groupRoleLimit, setGroupRoleLimit] = useState(100)
  const [isGroupRoleLoading, setIsGroupRoleLoading] = useState(false)
  const [hasMoreGroupRoles, setHasMoreGroupRoles] = useState(true)
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({})
  const [expandedSubModules, setExpandedSubModules] = useState<{ [key: string]: boolean }>({})
  const [groupDesignationOptions, setGroupDesignationOptions] = useState<string[]>([])

  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editType = searchParams.get('editType') || 'designation'
  const roleId = searchParams.get('id') || id || ''
  const groupRoleId = searchParams.get('groupRoleId')

  const [activeSection, setActiveSection] = useState<'roleDetails' | 'permissions'>(
    mode === 'edit' && (searchParams.get('editType') || 'designation') === 'designation' ? 'roleDetails' : 'permissions'
  )

  const rawDesignation = searchParams.get('name') || ''
  const currentDesignation = rawDesignation.replace(/^des_/i, '').replace(/_/g, ' ')

  const {
    isAddUserRoleLoading,
    addUserRoleSuccess,
    addUserRoleFailure,
    addUserRoleFailureMessage,
    userRoleData,
    isUserRoleLoading
  } = useAppSelector((state: any) => state.UserRoleReducer)

  const initialFormValues: FormValues = useMemo(() => {
    return {
      designation: currentDesignation,
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
        actions: p.actions ? ([] as string[]) : [],
        subModules: p.subModules
          ? p.subModules.map(sm => ({
              name: sm.name,
              actions: sm.actions ? ([] as string[]) : [],
              features: sm.features.map(f => ({
                name: f.name,
                actions: f.actions,
                selectedActions: [] as string[]
              }))
            }))
          : undefined
      }))
    }
  }, [editType, currentDesignation])

  useEffect(() => {
    fetchGroupRoles()
  }, [dispatch])

  useEffect(() => {
    if (groupRoleLimit > 100) {
      fetchGroupRoles()
    }
  }, [groupRoleLimit])

  const fetchGroupRoles = async () => {
    setIsGroupRoleLoading(true)
    try {
      const response = await dispatch(fetchUserRole({ limit: groupRoleLimit, page: 1 })).unwrap()
      const totalItems = response?.pagination?.totalCount || 0
      const newOptions =
        response?.data?.flatMap(
          (role: any) => role.groupRoles?.map((gr: any) => gr.name.replace(/^grp_/i, '').replace(/_/g, ' ')) || []
        ) || []
      setGroupDesignationOptions(prev => [...new Set([...prev, ...newOptions])])
      setHasMoreGroupRoles(groupRoleLimit < totalItems)
    } catch (error) {
      console.error('Failed to fetch group roles:', error)
      setApiErrors(['Failed to fetch group roles. Please try again.'])
    } finally {
      setIsGroupRoleLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'edit' && roleId) {
      const fetchRoleData = async () => {
        try {
          const res = await dispatch(getUserRoleDetails({ id: roleId })).unwrap()
          setFetchedRoleData(res.data)
        } catch (error) {
          console.error('Failed to fetch role data:', error)
          setApiErrors(['Failed to fetch role data. Please try again.'])
        }
      }
      fetchRoleData()
    }
  }, [mode, roleId, dispatch])

  useEffect(() => {
    if (mode !== 'edit' || !fetchedRoleData) return

    const matchedRole = fetchedRoleData

    if (!matchedRole) {
      console.warn(`No role found for roleId: ${roleId}`)
      return
    }

    const validDesignation = matchedRole.name
      ? matchedRole.name.replace(/^des_/i, '').replace(/_/g, ' ')
      : currentDesignation || ''

    const groupRole =
      editType === 'groupRole' && groupRoleId
        ? matchedRole.groupRoles?.find((gr: any) => gr.id === groupRoleId) || {}
        : matchedRole.groupRoles?.[0] || {}

    const groupDesignation =
      editType === 'designation'
        ? matchedRole.groupRoles?.map((gr: any) => gr.name.replace(/^grp_/i, '').replace(/_/g, ' ')) || []
        : groupRole.name
          ? groupRole.name.replace(/^grp_/i, '').replace(/_/g, ' ')
          : ''

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
                .filter((perm: string) => perm.startsWith(`prv_${moduleShortName}_`) && perm.split('_').length === 3)
                .map((perm: string) => perm.split('_').pop() || '') || []
            : [],
          subModules: p.subModules
            ? p.subModules.map(sm => ({
                name: sm.name,
                actions: sm.actions
                  ? permissions
                      .filter(
                        (perm: string) =>
                          perm.startsWith(`prv_${moduleShortName}_${sm.name.toLowerCase()}_`) &&
                          perm.split('_').length === 4
                      )
                      .map((perm: string) => perm.split('_').pop() || '') || []
                  : [],
                features: sm.features.map(f => ({
                  name: f.name,
                  actions: f.actions,
                  selectedActions:
                    permissions
                      .filter((perm: string) =>
                        perm.startsWith(`prv_${moduleShortName}_${sm.name.toLowerCase()}_${f.name.toLowerCase()}_`)
                      )
                      .map((perm: string) => perm.split('_').pop() || '') || []
                }))
              }))
            : undefined
        }
      })
    })
  }, [mode, fetchedRoleData, roleId, groupRoleId, editType, currentDesignation])

  useEffect(() => {
    if (addUserRoleFailure && addUserRoleFailureMessage) {
      setApiErrors(Array.isArray(addUserRoleFailureMessage) ? addUserRoleFailureMessage : [addUserRoleFailureMessage])
    } else {
      setApiErrors([])
    }
  }, [addUserRoleFailure, addUserRoleFailureMessage])

  useEffect(() => {
    if (addUserRoleSuccess && mode === 'edit') {
      if (editType === 'designation' && activeSection === 'roleDetails') {
        setActiveSection('permissions')
        setIsFormEdited(false)
        dispatch(resetAddUserRoleStatus())
        setApiErrors([])
        fetchGroupRoles() // Refresh group roles after edit
      } else {
        const fetchUpdatedRoleData = async () => {
          try {
            const res = await dispatch(getUserRoleDetails({ id: roleId })).unwrap()
            setFetchedRoleData(res.data)
            dispatch(resetAddUserRoleStatus())
            setIsFormEdited(false)
            setApiErrors([])
            fetchGroupRoles() // Refresh group roles after edit
          } catch (error) {
            console.error('Failed to fetch updated role data:', error)
            setApiErrors(['Failed to fetch updated role data. Please try again.'])
          }
        }
        fetchUpdatedRoleData()
      }
    } else if (addUserRoleSuccess && mode === 'add') {
      router.push('/user-management/role')
      fetchGroupRoles() // Refresh group roles after add
    }
  }, [addUserRoleSuccess, dispatch, roleId, mode, router, editType, activeSection])

  useEffect(() => {
    return () => {
      dispatch(resetAddUserRoleStatus())
    }
  }, [dispatch])

  const roleFormik = useFormik<FormValues>({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      designation: Yup.string()
        .required('Designation is required')
        .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers, and spaces allowed'),
      groupDesignation:
        editType === 'groupRole'
          ? Yup.string()
              .required('Group designation is required')
              .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers, and spaces allowed')
              .test('not-only-spaces', 'Cannot be only spaces', value => value?.trim().length > 0)
          : Yup.array().of(Yup.string()),
      groupRoleDescription: Yup.string(),
      newPermissionNames: Yup.array().test('at-least-one-permission', 'At least one permission required', value =>
        value.some(
          p =>
            (p.features ? p.features.some(f => f.selectedActions?.length > 0) : p.actions?.length > 0) ||
            (p.subModules
              ? p.subModules.some(sm => sm.actions?.length > 0 || sm.features.some(f => f.selectedActions?.length > 0))
              : false)
        )
      )
    }),
    onSubmit: async values => {
      setApiErrors([])

      const permissions = values.newPermissionNames
        .flatMap(perm => {
          const moduleResults = perm.features
            ? perm.features.flatMap(
                f =>
                  f.selectedActions?.map(action =>
                    perm.subModule
                      ? `prv_${perm.module.toLowerCase()}_${perm.subModule.toLowerCase()}_${f.name.toLowerCase()}_${action}`
                      : `prv_${perm.module.toLowerCase()}_${f.name.toLowerCase()}_${action}`
                  ) || []
              )
            : perm.actions?.map(action => `prv_${perm.module.toLowerCase()}_${action}`) || []

          const subModuleResults = perm.subModules
            ? perm.subModules.flatMap(sm => [
                ...(sm.actions?.map(action => `prv_${perm.module.toLowerCase()}_${sm.name.toLowerCase()}_${action}`) ||
                  []),
                ...sm.features.flatMap(
                  f =>
                    f.selectedActions?.map(
                      action =>
                        `prv_${perm.module.toLowerCase()}_${sm.name.toLowerCase()}_${f.name.toLowerCase()}_${action}`
                    ) || []
                )
              ])
            : []

          // Add module-level read permissions for specific cases
          const additionalPermissions: string[] = []
          if (perm.module === 'User' && perm.features?.some(f => f.selectedActions?.length > 0)) {
            additionalPermissions.push(`prv_user_read`)
          }
          if (
            perm.module === 'Hiring' &&
            (perm.features?.some(f => f.selectedActions?.length > 0) ||
              perm.subModules?.some(sm => sm.features.some(f => f.selectedActions?.length > 0)))
          ) {
            additionalPermissions.push(`prv_hiring_read`)
          }
          if (
            perm.module === 'Hiring' &&
            perm.subModules?.some(sm => sm.name === 'Vacancy' && sm.features.some(f => f.selectedActions?.length > 0))
          ) {
            additionalPermissions.push(`prv_hiring_vacancy_read`)
          }
          if (
            perm.module === 'System' &&
            (perm.features?.some(f => f.selectedActions?.length > 0) ||
              perm.subModules?.some(sm => sm.features.some(f => f.selectedActions?.length > 0)))
          ) {
            additionalPermissions.push(`prv_system_read`)
          }
          if (
            perm.module === 'System' &&
            perm.subModules?.some(sm => sm.name === 'Xfactor' && sm.features.some(f => f.selectedActions?.length > 0))
          ) {
            additionalPermissions.push(`prv_system_xfactor_read`)
          }

          return [...moduleResults, ...subModuleResults, ...additionalPermissions]
        })
        .filter(Boolean)

      try {
        let res = null

        if (mode === 'edit' && roleId) {
          if (editType === 'designation') {
            if (activeSection === 'roleDetails') {
              res = await dispatch(
                updateUserRole({
                  id: roleId,
                  params: {
                    designation: currentDesignation,
                    newGroupDesignations: Array.isArray(values.groupDesignation)
                      ? values.groupDesignation.map(gd => {
                          return gd
                        })
                      : [values.groupDesignation],
                    editType: 'designation'
                  }
                })
              ).unwrap()
            } else if (activeSection === 'permissions') {
              res = await dispatch(
                updateUserRole({
                  id: roleId,
                  params: {
                    designation: currentDesignation,
                    newPermissionNames: permissions,
                    editType: 'designation'
                  }
                })
              ).unwrap()
            }
          } else if (editType === 'groupRole' && groupRoleId) {
            const groupDesignation = typeof values.groupDesignation === 'string' ? values.groupDesignation.trim() : ''
            if (!groupDesignation) throw new Error('Group designation is required.')
            res = await dispatch(
              updateUserRole({
                id: roleId,
                groupRoleId,
                params: {
                  designation: currentDesignation,
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
              group_designation: groupDesignation.toLowerCase().replace(/\s+/g, '_').replace(/^grp_/, ''),
              grp_role_description: values.groupRoleDescription,
              permissions,
              des_role_description: ''
            })
          ).unwrap()
        }

        toast.success(res?.message || 'Successfully Updated', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      } catch (error: any) {
        toast.error(error?.message || 'Failed to save role', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
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
    checked: boolean,
    isSubModule: boolean = false,
    parentSubModule?: string
  ) => {
    const permissions = [...roleFormik.values.newPermissionNames]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

    if (isSubModule && parentSubModule) {
      const subModuleIndex = permissions[moduleIndex].subModules!.findIndex(sm => sm.name === parentSubModule)
      if (featureOrAction === 'actions') {
        permissions[moduleIndex].subModules![subModuleIndex].actions = checked
          ? [...new Set([...(permissions[moduleIndex].subModules![subModuleIndex].actions || []), action])]
          : (permissions[moduleIndex].subModules![subModuleIndex].actions || []).filter(a => a !== action)
      } else {
        const featureIndex = permissions[moduleIndex].subModules![subModuleIndex].features.findIndex(
          f => f.name === featureOrAction
        )
        const selectedActions = [
          ...(permissions[moduleIndex].subModules![subModuleIndex].features[featureIndex].selectedActions || [])
        ]
        permissions[moduleIndex].subModules![subModuleIndex].features[featureIndex].selectedActions = checked
          ? [...new Set([...selectedActions, action])]
          : selectedActions.filter(a => a !== action)
      }
    } else if (featureOrAction !== 'actions' && permissions[moduleIndex].features) {
      const featureIndex = permissions[moduleIndex].features.findIndex(f => f.name === featureOrAction)
      if (featureIndex !== -1) {
        const selectedActions = [...(permissions[moduleIndex].features[featureIndex].selectedActions || [])]
        permissions[moduleIndex].features[featureIndex].selectedActions = checked
          ? [...new Set([...selectedActions, action])]
          : selectedActions.filter(a => a !== action)
      }
    } else if (permissions[moduleIndex].actions) {
      permissions[moduleIndex].actions = checked
        ? [...new Set([...(permissions[moduleIndex].actions || []), action])]
        : (permissions[moduleIndex].actions || []).filter(a => a !== action)
    }

    roleFormik.setFieldValue('newPermissionNames', permissions)
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
    const permissions = [...roleFormik.values.newPermissionNames]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

    if (isSubModule && parentSubModule) {
      const subModuleIndex = permissions[moduleIndex].subModules!.findIndex(sm => sm.name === parentSubModule)
      if (feature === 'actions') {
        permissions[moduleIndex].subModules![subModuleIndex].actions = checked ? allActions : []
      } else {
        const featureIndex = permissions[moduleIndex].subModules![subModuleIndex].features.findIndex(
          f => f.name === feature
        )
        permissions[moduleIndex].subModules![subModuleIndex].features[featureIndex].selectedActions = checked
          ? allActions
          : []
      }
    } else if (feature === 'actions') {
      permissions[moduleIndex].actions = checked ? allActions : []
    } else {
      const featureIndex = permissions[moduleIndex].features!.findIndex(f => f.name === feature)
      permissions[moduleIndex].features![featureIndex].selectedActions = checked ? allActions : []
    }

    roleFormik.setFieldValue('newPermissionNames', permissions)
  }

  const handleSelectAllFeatures = (module: string, subModule: string | undefined, checked: boolean) => {
    const permissions = [...roleFormik.values.newPermissionNames]
    const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)
    const perm = defaultPermissionsList.find(p => p.module === module && p.subModule === subModule)

    permissions[moduleIndex].features =
      perm?.features?.map(f => ({
        name: f.name,
        actions: f.actions,
        selectedActions: checked ? f.actions : []
      })) || []
    permissions[moduleIndex].actions = checked ? perm?.actions || [] : []

    roleFormik.setFieldValue('newPermissionNames', permissions)
  }

  const handleSelectAllModules = (checked: boolean) => {
    roleFormik.setFieldValue(
      'newPermissionNames',
      defaultPermissionsList.map(p => ({
        module: p.module,
        subModule: p.subModule,
        features:
          p.features?.map(f => ({
            name: f.name,
            actions: f.actions,
            selectedActions: checked ? f.actions : []
          })) || [],
        actions: checked ? p.actions || [] : [],
        subModules: p.subModules
          ? p.subModules.map(sm => ({
              name: sm.name,
              actions: checked ? sm.actions || [] : [],
              features: sm.features.map(f => ({
                name: f.name,
                actions: f.actions,
                selectedActions: checked ? f.actions : []
              }))
            }))
          : []
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
          features:
            perm.features?.map(f => ({
              name: f.name,
              actions: f.actions,
              selectedActions: checked
                ? [
                    ...new Set([
                      ...(f.selectedActions || []),
                      ...(defaultPerm?.features
                        ?.find(feat => feat.name === f.name)
                        ?.actions.filter(a => a === 'read') || [])
                    ])
                  ]
                : (f.selectedActions || []).filter(a => a !== 'read')
            })) || [],
          actions: defaultPerm?.actions
            ? checked
              ? [...new Set([...(perm.actions || []), ...defaultPerm.actions.filter(a => a === 'read')])]
              : (perm.actions || []).filter(a => a !== 'read')
            : [],
          subModules:
            perm.subModules?.map(sm => ({
              name: sm.name,
              actions: defaultPerm?.subModules?.find(s => s.name === sm.name)?.actions
                ? checked
                  ? [
                      ...new Set([
                        ...(sm.actions || []),
                        ...defaultPerm.subModules!.find(s => s.name === sm.name)!.actions.filter(a => a === 'read')
                      ])
                    ]
                  : (sm.actions || []).filter(a => a !== 'read')
                : [],
              features: sm.features.map(f => ({
                name: f.name,
                actions: f.actions,
                selectedActions: checked
                  ? [
                      ...new Set([
                        ...(f.selectedActions || []),
                        ...(defaultPerm?.subModules
                          ?.find(s => s.name === sm.name)
                          ?.features.find(feat => feat.name === f.name)
                          ?.actions.filter(a => a === 'read') || [])
                      ])
                    ]
                  : (f.selectedActions || []).filter(a => a !== 'read')
              }))
            })) || []
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

  const handleSlider = (event: React.UIEvent<HTMLElement>) => {
    const target = event.currentTarget
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 1

    if (bottom && hasMoreGroupRoles && !isGroupRoleLoading) {
      setGroupRoleLimit(prevLimit => prevLimit + 100)
    }
  }

  const handleRoleDetailsClick = () => {
    if (editType === 'designation') {
      setActiveSection('roleDetails')
    }
  }

  const handlePermissionsClick = () => {
    if (editType === 'designation') {
      setActiveSection('permissions')
    }
  }

  const toggleModule = (module: string) => {
    setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }))
  }

  const toggleSubModule = (subModule: string) => {
    setExpandedSubModules(prev => ({ ...prev, [subModule]: !prev[subModule] }))
  }

  if (isUserRoleLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <form onSubmit={roleFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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

      <Box
        component='fieldset'
        className={`border rounded p-4 mb-6 cursor-pointer transition-all duration-200 ${
          editType === 'designation' && activeSection === 'roleDetails'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300'
        }`}
        disabled={editType === 'designation' && activeSection !== 'roleDetails'}
        onClick={handleRoleDetailsClick}
      >
        <legend className='text-lg font-semibold text-gray-700'>Role Details</legend>
        <FormControl fullWidth margin='normal'>
          <TextField
            label='Designation *'
            name='designation'
            value={roleFormik.values.designation || ''}
            onChange={roleFormik.handleChange}
            onBlur={roleFormik.handleBlur}
            error={roleFormik.touched.designation && !!roleFormik.errors.designation}
            helperText={roleFormik.touched.designation && roleFormik.errors.designation}
            disabled={mode === 'edit'}
          />
        </FormControl>

        {editType === 'designation' && mode === 'edit' ? (
          <FormControl fullWidth margin='normal'>
            <Autocomplete
              id='groupDesignation'
              options={groupDesignationOptions}
              value={Array.isArray(roleFormik.values.groupDesignation) ? roleFormik.values.groupDesignation : []}
              onChange={(_, value) => roleFormik.setFieldValue('groupDesignation', value)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Group Designations'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isGroupRoleLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant='outlined' key={index} label={option as string} {...getTagProps({ index })} />
                ))
              }
              multiple
              disabled={editType === 'designation' && activeSection !== 'roleDetails'}
              ListboxProps={{
                onScroll: handleSlider,
                style: { maxHeight: '300px' }
              }}
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
              value={roleFormik.values.groupRoleDescription || ''}
              onChange={roleFormik.handleChange}
              onBlur={roleFormik.handleBlur}
              error={roleFormik.touched.groupRoleDescription && !!roleFormik.errors.groupRoleDescription}
              helperText={roleFormik.touched.groupRoleDescription && roleFormik.errors.groupRoleDescription}
            />
          </FormControl>
        )}
      </Box>

      {/* ###### Permissions ###### */}
      <Box
        component='fieldset'
        sx={{
          border: '1px solid',
          borderColor: editType === 'designation' && activeSection === 'permissions' ? 'blue.500' : 'gray.200',
          borderRadius: '8px',
          p: 3,
          mb: 6,
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: editType === 'designation' && activeSection === 'permissions' ? 'blue.50' : 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}
        disabled={editType === 'designation' && activeSection !== 'permissions'}
        onClick={handlePermissionsClick}
      >
        <legend style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', padding: '0 8px' }}>
          {editType === 'designation' ? 'Permissions of Designations' : 'Permissions of Group'}
        </legend>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={roleFormik.values.newPermissionNames.every(p => {
                  const defaultPerm = defaultPermissionsList.find(
                    d => d.module === p.module && p.subModule === d.subModule
                  )
                  const featuresChecked = defaultPerm?.features
                    ? p.features?.every(f =>
                        defaultPerm
                          .features!.find(feat => feat.name === f.name)
                          ?.actions.every(a => f.selectedActions?.includes(a) ?? false)
                      ) ?? true
                    : true
                  const actionsChecked = defaultPerm?.actions ? p.actions?.length === defaultPerm.actions.length : true
                  const subModulesChecked = defaultPerm?.subModules
                    ? p.subModules?.every(sm => {
                        const defaultSubModule = defaultPerm.subModules!.find(dsm => dsm.name === sm.name)
                        const subActionsChecked = defaultSubModule?.actions
                          ? sm.actions?.length === defaultSubModule.actions.length
                          : true
                        const subFeaturesChecked = defaultSubModule?.features
                          ? sm.features.every(f =>
                              defaultSubModule
                                .features!.find(feat => feat.name === f.name)
                                ?.actions.every(a => f.selectedActions?.includes(a) ?? false)
                            )
                          : true
                        return subActionsChecked && subFeaturesChecked
                      }) ?? true
                    : true
                  return featuresChecked && actionsChecked && subModulesChecked
                })}
                onChange={e => handleSelectAllModules(e.target.checked)}
                disabled={editType === 'designation' && activeSection !== 'permissions'}
                sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
              />
            }
            label={<Typography sx={{ color: 'gray.700', fontWeight: 500 }}>Select All</Typography>}
            sx={{ color: 'gray.700', fontWeight: 500 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={roleFormik.values.newPermissionNames.every(p =>
                  p.features
                    ? p.features.every(f => f.selectedActions?.includes('read') ?? false) &&
                      (p.subModules
                        ? p.subModules.every(
                            sm =>
                              sm.actions?.includes('read') ??
                              (true && sm.features.every(f => f.selectedActions?.includes('read') ?? false))
                          )
                        : true)
                    : p.actions?.includes('read') ?? false
                )}
                onChange={e => handleSelectAllReadPermissions(e.target.checked)}
                disabled={editType === 'designation' && activeSection !== 'permissions'}
                sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
              />
            }
            label={<Typography sx={{ color: 'gray.700', fontWeight: 500 }}>Select All Read Permissions</Typography>}
            sx={{ color: 'gray.700', fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {defaultPermissionsList.map(permission => {
            const currentPerm = roleFormik.values.newPermissionNames.find(
              p => p.module === permission.module && p.subModule === permission.subModule
            )
            return (
              <Box
                key={`${permission.module}-${permission.subModule || ''}`}
                sx={{
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'gray.200',
                  borderRadius: '6px',
                  p: 2,
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => toggleModule(permission.module)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          (permission.features
                            ? currentPerm?.features?.every(f =>
                                permission
                                  .features!.find(feat => feat.name === f.name)
                                  ?.actions.every(a => f.selectedActions?.includes(a) ?? false)
                              ) ?? true
                            : true) &&
                          (permission.actions ? currentPerm?.actions?.length === permission.actions.length : true) &&
                          (permission.subModules
                            ? currentPerm?.subModules?.every(
                                sm =>
                                  (permission
                                    .subModules!.find(dsm => dsm.name === sm.name)
                                    ?.features.every(
                                      f =>
                                        sm.features.find(feat => feat.name === f.name)?.selectedActions?.length ===
                                        f.actions.length
                                    ) ||
                                    true) &&
                                  sm.actions?.length ===
                                    permission.subModules!.find(dsm => dsm.name === sm.name)?.actions?.length
                              ) ?? true
                            : true)
                        }
                        onChange={e =>
                          handleSelectAllFeatures(permission.module, permission.subModule, e.target.checked)
                        }
                        disabled={editType === 'designation' && activeSection !== 'permissions'}
                        sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 600, color: 'gray.800' }}>
                        {permission.subModule ? `${permission.module} - ${permission.subModule}` : permission.module}
                      </Typography>
                    }
                  />
                  <IconButton size='small'>
                    {expandedModules[permission.module] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={expandedModules[permission.module] || false}>
                  <Box sx={{ pl: permission.features ? 4 : 2, mt: 2 }}>
                    {permission.actions && (
                      <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={currentPerm?.actions?.length === permission.actions?.length}
                              onChange={e =>
                                handleSelectAllPermissions(
                                  permission.module,
                                  permission.subModule,
                                  'actions',
                                  permission.actions || [],
                                  e.target.checked
                                )
                              }
                              disabled={editType === 'designation' && activeSection !== 'permissions'}
                              sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                            />
                          }
                          label={<Typography sx={{ color: 'gray.700' }}>Actions</Typography>}
                        />
                        <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {permission.actions.map(action => (
                            <FormControlLabel
                              key={action}
                              control={
                                <Checkbox
                                  checked={currentPerm?.actions?.includes(action) ?? false}
                                  onChange={e =>
                                    handlePermissionChange(
                                      permission.module,
                                      permission.subModule,
                                      action,
                                      action,
                                      e.target.checked
                                    )
                                  }
                                  disabled={editType === 'designation' && activeSection !== 'permissions'}
                                  sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                                />
                              }
                              label={
                                <Typography sx={{ color: 'gray.600', fontSize: '0.875rem' }}>
                                  {action.charAt(0).toUpperCase() + action.slice(1)}
                                </Typography>
                              }
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {permission.features?.map(feature => {
                      const currentFeature = roleFormik.values.newPermissionNames
                        .find(p => p.module === permission.module && p.subModule === permission.subModule)
                        ?.features?.find(f => f.name === feature.name)
                      return (
                        <Box key={feature.name} sx={{ mb: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={(currentFeature?.selectedActions?.length ?? 0) === feature.actions.length}
                                onChange={e =>
                                  handleSelectAllPermissions(
                                    permission.module,
                                    permission.subModule,
                                    feature.name,
                                    feature.actions,
                                    e.target.checked
                                  )
                                }
                                disabled={editType === 'designation' && activeSection !== 'permissions'}
                                sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                              />
                            }
                            label={<Typography sx={{ color: 'gray.700' }}>{feature.name}</Typography>}
                          />
                          <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {feature.actions.map(action => (
                              <FormControlLabel
                                key={action}
                                control={
                                  <Checkbox
                                    checked={currentFeature?.selectedActions?.includes(action) ?? false}
                                    onChange={e =>
                                      handlePermissionChange(
                                        permission.module,
                                        permission.subModule,
                                        feature.name,
                                        action,
                                        e.target.checked
                                      )
                                    }
                                    disabled={editType === 'designation' && activeSection !== 'permissions'}
                                    sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                                  />
                                }
                                label={
                                  <Typography sx={{ color: 'gray.600', fontSize: '0.875rem' }}>
                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                  </Typography>
                                }
                              />
                            ))}
                          </Box>
                        </Box>
                      )
                    })}
                    {permission.subModules?.map(subModule => {
                      const currentSubModule = currentPerm?.subModules?.find(sm => sm.name === subModule.name)
                      return (
                        <Box key={subModule.name} sx={{ mt: 2, pl: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: 'gray.50',
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
                                      (currentSubModule?.actions?.length === subModule.actions?.length || true) &&
                                      subModule.features.every(
                                        f =>
                                          currentSubModule?.features?.find(cf => cf.name === f.name)?.selectedActions
                                            ?.length === f.actions.length
                                      )
                                    }
                                    onChange={e => {
                                      if (subModule.actions) {
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
                                    disabled={editType === 'designation' && activeSection !== 'permissions'}
                                    sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                                  />
                                }
                                label={
                                  <Typography sx={{ fontWeight: 500, color: 'gray.700' }}>{subModule.name}</Typography>
                                }
                              />
                            </Box>
                            <IconButton size='small'>
                              {expandedSubModules[subModule.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>
                          <Collapse in={expandedSubModules[subModule.name] || false}>
                            <Box sx={{ pl: 2, mt: 1 }}>
                              {subModule.actions && (
                                <Box sx={{ mb: 2 }}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={currentSubModule?.actions?.length === subModule.actions?.length}
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
                                        disabled={editType === 'designation' && activeSection !== 'permissions'}
                                        sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                                      />
                                    }
                                    label={<Typography sx={{ color: 'gray.700' }}>Actions</Typography>}
                                  />
                                  <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {subModule.actions.map(action => (
                                      <FormControlLabel
                                        key={action}
                                        control={
                                          <Checkbox
                                            checked={currentSubModule?.actions?.includes(action) ?? false}
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
                                            disabled={editType === 'designation' && activeSection !== 'permissions'}
                                            sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                                          />
                                        }
                                        label={
                                          <Typography sx={{ color: 'gray.600', fontSize: '0.875rem' }}>
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
                                          (currentSubModule?.features?.find(f => f.name === feature.name)
                                            ?.selectedActions?.length ?? 0) === feature.actions.length
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
                                        disabled={editType === 'designation' && activeSection !== 'permissions'}
                                        sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                                      />
                                    }
                                    label={<Typography sx={{ color: 'gray.700' }}>{feature.name}</Typography>}
                                  />
                                  <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {feature.actions.map(action => (
                                      <FormControlLabel
                                        key={action}
                                        control={
                                          <Checkbox
                                            checked={
                                              currentSubModule?.features
                                                ?.find(f => f.name === feature.name)
                                                ?.selectedActions?.includes(action) ?? false
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
                                            disabled={editType === 'designation' && activeSection !== 'permissions'}
                                            sx={{ color: 'gray.600', '&.Mui-checked': { color: 'blue.600' } }}
                                          />
                                        }
                                        label={
                                          <Typography sx={{ color: 'gray.600', fontSize: '0.875rem' }}>
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
        {roleFormik.touched.newPermissionNames && roleFormik.errors.newPermissionNames && (
          <Typography color='error' variant='caption' sx={{ mt: 2 }}>
            {typeof roleFormik.errors.newPermissionNames === 'string'
              ? roleFormik.errors.newPermissionNames
              : Array.isArray(roleFormik.errors.newPermissionNames)
                ? roleFormik.errors.newPermissionNames
                    .filter(Boolean)
                    .map(err => err?.toString() || JSON.stringify(err))
                    .join(', ')
                : JSON.stringify(roleFormik.errors.newPermissionNames)}
          </Typography>
        )}
      </Box>

      <Box display='flex' justifyContent='space-between' alignItems='center' mx={5} mt={3} mb={2}>
        <Box display='flex' gap={2}>
          <DynamicButton
            type='button'
            variant='contained'
            sx={{ backgroundColor: 'gray.500', color: 'white', '&:hover': { backgroundColor: 'gray.600' } }}
            onClick={handleCancel}
            disabled={!isFormEdited}
          >
            Clear
          </DynamicButton>
          <DynamicButton
            type='submit'
            variant='contained'
            sx={{ backgroundColor: 'blue.500', color: 'white', '&:hover': { backgroundColor: 'blue.600' } }}
            disabled={
              isAddUserRoleLoading ||
              (mode === 'add' && (!roleFormik.isValid || !roleFormik.dirty)) ||
              (mode === 'edit' && !isFormEdited)
            }
          >
            {isAddUserRoleLoading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Role'}
          </DynamicButton>
        </Box>
      </Box>
    </form>
  )
}

export default AddOrEditUserRole
