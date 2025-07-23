// 'use client'

// import React, { useState, useEffect, useMemo } from 'react'

// import { useRouter, useSearchParams } from 'next/navigation'

// import { useFormik } from 'formik'
// import * as Yup from 'yup'
// import {
//   FormControl,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Box,
//   CircularProgress,
//   Typography,
//   Chip,
//   Autocomplete,
//   Collapse,
//   IconButton
// } from '@mui/material'
// import { toast, ToastContainer } from 'react-toastify'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import ExpandLessIcon from '@mui/icons-material/ExpandLess'

// import { useAppDispatch, useAppSelector } from '@/lib/hooks'
// import {
//   addNewUserRole,
//   updateUserRole,
//   resetAddUserRoleStatus,
//   getUserRoleDetails,
//   fetchUserRole,
//   fetchDesignation
// } from '@/redux/UserRoles/userRoleSlice'
// import DynamicButton from '@/components/Button/dynamicButton'
// import 'react-toastify/dist/ReactToastify.css'

// interface FeatureState {
//   name: string
//   actions: string[]
//   selectedActions: string[]
// }

// interface SubModuleState {
//   name: string
//   actions: string[]
//   features: FeatureState[]
// }

// interface PermissionState {
//   module: string
//   subModule?: string
//   features: FeatureState[]
//   actions: string[]
//   subModules: SubModuleState[]
// }

// interface FormValues {
//   designation: string
//   groupDesignation: string | string[]
//   groupRoleDescription: string
//   newPermissionNames: PermissionState[]
// }

// interface UserRoleState {
//   isAddUserRoleLoading: boolean
//   addUserRoleSuccess: boolean
//   addUserRoleFailure: boolean
//   addUserRoleFailureMessage: string | string[]
//   isUserRoleLoading: boolean
// }

// const defaultPermissionsList: PermissionState[] = [
//   {
//     module: 'Home',
//     actions: ['read'],
//     features: [],
//     subModules: []
//   },
//   {
//     module: 'User',
//     actions: [],
//     features: [
//       { name: 'User', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
//       { name: 'Role', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
//       { name: 'Employee', actions: ['read', 'sync'], selectedActions: [] }
//     ],
//     subModules: []
//   },
//   {
//     module: 'Approvals',
//     actions: ['create', 'read', 'update', 'delete'],
//     features: [],
//     subModules: []
//   },
//   {
//     module: 'Hiring',
//     actions: [],
//     features: [
//       { name: 'Cvpool', actions: ['read'], selectedActions: [] },
//       { name: 'Interview', actions: ['read', 'update'], selectedActions: [] },
//       { name: 'Jobposting', actions: ['read', 'update'], selectedActions: [] },
//       { name: 'Onboarding', actions: ['create', 'read', 'update'], selectedActions: [] },
//       { name: 'Resignation', actions: ['read', 'sync'], selectedActions: [] },
//       { name: 'Budget', actions: ['create', 'read', 'approval', 'delete'], selectedActions: [] }
//     ],
//     subModules: [
//       {
//         name: 'Vacancy',
//         actions: [],
//         features: [
//           { name: 'Vacancylist', actions: ['read'], selectedActions: [] },
//           { name: 'Vacancyrequest', actions: ['read', 'approval'], selectedActions: [] }
//         ]
//       }
//     ]
//   },
//   {
//     module: 'Jd',
//     actions: ['create', 'read', 'update', 'delete', 'upload', 'approval'],
//     features: [],
//     subModules: []
//   },
//   {
//     module: 'Branch',
//     actions: ['read'],
//     features: [],
//     subModules: []
//   },
//   {
//     module: 'System',
//     actions: [],
//     features: [
//       { name: 'Dataupload', actions: ['read', 'upload'], selectedActions: [] },
//       { name: 'Approvalcategory', actions: ['read'], selectedActions: [] },
//       { name: 'Approvalmatrix', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
//       { name: 'Organizationalmapping', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
//       { name: 'Scheduler', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] }
//     ],
//     subModules: [
//       {
//         name: 'Xfactor',
//         actions: [],
//         features: [
//           { name: 'Noticeperiodrange', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
//           { name: 'Resignedxfactor', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] },
//           { name: 'Vacancyxfactor', actions: ['create', 'read', 'update', 'delete'], selectedActions: [] }
//         ]
//       }
//     ]
//   },
//   {
//     module: 'General',
//     actions: ['create', 'read', 'update', 'delete'],
//     features: [],
//     subModules: []
//   }
// ]

// const AddOrEditUserRole: React.FC<{ mode: 'add' | 'edit'; id?: string }> = ({ mode, id }) => {
//   const [apiErrors, setApiErrors] = useState<string[]>([])
//   const [isFormEdited, setIsFormEdited] = useState(false)
//   const [fetchedRoleData, setFetchedRoleData] = useState<any>(null)
//   const [groupRoleLimit, setGroupRoleLimit] = useState(100)
//   const [isGroupRoleLoading, setIsGroupRoleLoading] = useState(false)
//   const [hasMoreGroupRoles, setHasMoreGroupRoles] = useState(true)
//   const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({})
//   const [expandedSubModules, setExpandedSubModules] = useState<{ [key: string]: boolean }>({})
//   const [groupDesignationOptions, setGroupDesignationOptions] = useState<string[]>([])
//   const [designationOptions, setDesignationOptions] = useState<string[]>([])
//   const [isDesignationLoading, setIsDesignationLoading] = useState(false)

//   const dispatch = useAppDispatch()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const editType = searchParams.get('editType') || 'designation'
//   const roleId = searchParams.get('id') || id || ''
//   const groupRoleId = searchParams.get('groupRoleId') || ''

//   const [activeSection, setActiveSection] = useState<'roleDetails' | 'permissions'>(
//     mode === 'add' ? 'roleDetails' : editType === 'designation' ? 'roleDetails' : 'permissions'
//   )

//   const rawDesignation = searchParams.get('name') || ''
//   const currentDesignation = rawDesignation.replace(/^des_/i, '').replace(/_/g, ' ')

//   const { isAddUserRoleLoading, addUserRoleSuccess, addUserRoleFailure, addUserRoleFailureMessage, isUserRoleLoading } =
//     useAppSelector((state: { UserRoleReducer: UserRoleState }) => state.UserRoleReducer)

//   const initialFormValues: FormValues = useMemo(() => {
//     return {
//       designation: currentDesignation,
//       groupDesignation: editType === 'designation' ? [] : '',
//       groupRoleDescription: '',
//       newPermissionNames: defaultPermissionsList.map(p => ({
//         module: p.module,
//         subModule: p.subModule,
//         features: p.features.map(f => ({
//           name: f.name,
//           actions: f.actions,
//           selectedActions: []
//         })),
//         actions: p.actions,
//         subModules: p.subModules.map(sm => ({
//           name: sm.name,
//           actions: sm.actions,
//           features: sm.features.map(f => ({
//             name: f.name,
//             actions: f.actions,
//             selectedActions: []
//           }))
//         }))
//       }))
//     }
//   }, [editType, currentDesignation])

//   useEffect(() => {
//     fetchGroupRoles()
//     fetchDesignations()
//   }, [dispatch])

//   useEffect(() => {
//     if (groupRoleLimit > 100) {
//       fetchGroupRoles()
//     }
//   }, [groupRoleLimit])

//   const fetchGroupRoles = async () => {
//     setIsGroupRoleLoading(true)

//     try {
//       const response = await dispatch(fetchUserRole({ limit: groupRoleLimit, page: 1 })).unwrap()
//       const totalItems = response?.pagination?.totalCount || 0

//       const newOptions =
//         response?.data?.flatMap(
//           (role: any) => role.groupRoles?.map((gr: any) => gr.name.replace(/^grp_/i, '').replace(/_/g, ' ')) || []
//         ) || []

//       setGroupDesignationOptions(prev => [...new Set([...prev, ...newOptions])])
//       setHasMoreGroupRoles(groupRoleLimit < totalItems)
//     } catch (error) {
//       console.error('Failed to fetch group roles:', error)
//       setApiErrors(['Failed to fetch group roles. Please try again.'])
//     } finally {
//       setIsGroupRoleLoading(false)
//     }
//   }

//   const fetchDesignations = async () => {
//     setIsDesignationLoading(true)

//     try {
//       const response = await dispatch(fetchDesignation({ limit: 100, page: 1 })).unwrap()

//       const newOptions =
//         response?.data?.map((designation: any) => designation.name.replace(/^des_/i, '').replace(/_/g, ' ')) || []

//       setDesignationOptions(prev => [...new Set([...prev, ...newOptions])])
//     } catch (error) {
//       console.error('Failed to fetch designations:', error)
//       setApiErrors(['Failed to fetch designations. Please try again.'])
//     } finally {
//       setIsDesignationLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (mode === 'edit' && roleId) {
//       const fetchRoleData = async () => {
//         try {
//           const res = await dispatch(getUserRoleDetails({ id: roleId })).unwrap()

//           setFetchedRoleData(res.data)
//         } catch (error) {
//           console.error('Failed to fetch role data:', error)
//           setApiErrors(['Failed to fetch role data. Please try again.'])
//         }
//       }

//       fetchRoleData()
//     }
//   }, [mode, roleId, dispatch])

//   useEffect(() => {
//     if (mode !== 'edit' || !fetchedRoleData) return
//     const matchedRole = fetchedRoleData

//     if (!matchedRole) {
//       console.warn(`No role found for roleId: ${roleId}`)

//       return
//     }

//     const validDesignation = matchedRole.name
//       ? matchedRole.name.replace(/^role_/i, '').replace(/_/g, ' ')
//       : currentDesignation || ''

//     const groupRole =
//       editType === 'groupRole' && groupRoleId
//         ? matchedRole.groupRoles?.find((gr: any) => gr.id === groupRoleId) || {}
//         : matchedRole.groupRoles?.[0] || {}

//     const groupDesignation =
//       editType === 'designation'
//         ? matchedRole.groupRoles?.map((gr: any) => gr.name.replace(/^grp_/i, '').replace(/_/g, ' ')) || []
//         : groupRole.name
//           ? groupRole.name.replace(/^grp_/i, '').replace(/_/g, ' ')
//           : ''

//     const permissions = editType === 'groupRole' ? groupRole.permissions || [] : matchedRole.permissions || []

//     roleFormik.setValues({
//       designation: validDesignation,
//       groupDesignation,
//       groupRoleDescription: groupRole.description || '',
//       newPermissionNames: defaultPermissionsList.map(p => {
//         const moduleShortName = p.module.toLowerCase()
//         const subModuleShortName = p.subModule?.toLowerCase()

//         return {
//           module: p.module,
//           subModule: p.subModule,
//           features: p.features.map(f => ({
//             name: f.name,
//             actions: f.actions,
//             selectedActions:
//               permissions
//                 .filter((perm: string) =>
//                   subModuleShortName
//                     ? perm.startsWith(`prv_${moduleShortName}_${subModuleShortName}_${f.name.toLowerCase()}_`)
//                     : perm.startsWith(`prv_${moduleShortName}_${f.name.toLowerCase()}_`)
//                 )
//                 .map((perm: string) => perm.split('_').pop() || '') || []
//           })),
//           actions: p.actions.filter((action: string) => permissions.includes(`prv_${moduleShortName}_${action}`)),
//           subModules: p.subModules.map(sm => ({
//             name: sm.name,
//             actions: sm.actions.filter((action: string) =>
//               permissions.includes(`prv_${moduleShortName}_${sm.name.toLowerCase()}_${action}`)
//             ),
//             features: sm.features.map(f => ({
//               name: f.name,
//               actions: f.actions,
//               selectedActions:
//                 permissions
//                   .filter((perm: string) =>
//                     perm.startsWith(`prv_${moduleShortName}_${sm.name.toLowerCase()}_${f.name.toLowerCase()}_`)
//                   )
//                   .map((perm: string) => perm.split('_').pop() || '') || []
//             }))
//           }))
//         }
//       })
//     })
//   }, [mode, fetchedRoleData, roleId, groupRoleId, editType, currentDesignation])

//   useEffect(() => {
//     if (addUserRoleFailure && addUserRoleFailureMessage) {
//       setApiErrors(Array.isArray(addUserRoleFailureMessage) ? addUserRoleFailureMessage : [addUserRoleFailureMessage])
//     } else {
//       setApiErrors([])
//     }
//   }, [addUserRoleFailure, addUserRoleFailureMessage])

//   useEffect(() => {
//     if (addUserRoleSuccess) {
//       if (mode === 'edit') {
//         if (editType === 'designation' && activeSection === 'roleDetails') {
//           setActiveSection('permissions')
//           setIsFormEdited(false)
//           dispatch(resetAddUserRoleStatus())
//           setApiErrors([])
//           fetchGroupRoles()
//         } else {
//           const fetchUpdatedRoleData = async () => {
//             try {
//               const res = await dispatch(getUserRoleDetails({ id: roleId })).unwrap()

//               setFetchedRoleData(res.data)
//               dispatch(resetAddUserRoleStatus())
//               setIsFormEdited(false)
//               setApiErrors([])
//               fetchGroupRoles()
//             } catch (error) {
//               console.error('Failed to fetch updated role data:', error)
//               setApiErrors(['Failed to fetch updated role data. Please try again.'])
//             }
//           }

//           fetchUpdatedRoleData()
//         }
//       } else {
//         setActiveSection('roleDetails')
//         router.push('/user-management/role')
//         dispatch(resetAddUserRoleStatus())
//         setIsFormEdited(false)
//         setApiErrors([])
//         fetchGroupRoles()
//       }
//     }
//   }, [addUserRoleSuccess, dispatch, roleId, mode, router, editType, activeSection])

//   useEffect(() => {
//     return () => {
//       dispatch(resetAddUserRoleStatus())
//     }
//   }, [dispatch])

//   const roleFormik = useFormik<FormValues>({
//     initialValues: initialFormValues,
//     enableReinitialize: true,
//     validationSchema: Yup.object().shape({
//       designation: Yup.string()
//         .required('Designation is required')
//         .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers, and spaces allowed'),
//       groupDesignation:
//         mode === 'add'
//           ? Yup.string().required('Group designation is required')
//           : editType === 'groupRole'
//             ? Yup.string()
//                 .required('Group designation is required')
//                 .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers, and spaces allowed')
//                 .test('not-only-spaces', 'Cannot be only spaces', value => value?.trim().length > 0)
//             : Yup.array().of(Yup.string()),
//       groupRoleDescription: Yup.string(),
//       newPermissionNames: Yup.array().test(
//         'at-least-one-permission',
//         'At least one permission required',
//         value =>
//           value?.some(
//             p =>
//               p.features.some(f => f.selectedActions.length > 0) ||
//               p.actions.length > 0 ||
//               p.subModules.some(sm => sm.actions.length > 0 || sm.features.some(f => f.selectedActions.length > 0))
//           ) ?? false
//       )
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       setApiErrors([])
//       console.log(apiErrors)
//       const normalizeName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ')

//       const permissions = values.newPermissionNames
//         .flatMap(perm => {
//           const moduleResults = perm.features.flatMap(f =>
//             f.selectedActions.map(action =>
//               perm.subModule
//                 ? `prv_${perm.module.toLowerCase()}_${perm.subModule.toLowerCase()}_${f.name.toLowerCase()}_${action}`
//                 : `prv_${perm.module.toLowerCase()}_${f.name.toLowerCase()}_${action}`
//             )
//           )

//           const subModuleResults = perm.subModules.flatMap(sm => [
//             ...sm.actions.map(action => `prv_${perm.module.toLowerCase()}_${sm.name.toLowerCase()}_${action}`),
//             ...sm.features.flatMap(f =>
//               f.selectedActions.map(
//                 action => `prv_${perm.module.toLowerCase()}_${sm.name.toLowerCase()}_${f.name.toLowerCase()}_${action}`
//               )
//             )
//           ])

//           const additionalPermissions: string[] = []

//           if (perm.module === 'User' && perm.features.some(f => f.selectedActions.length > 0)) {
//             additionalPermissions.push('prv_user_read')
//           }

//           if (
//             perm.module === 'Hiring' &&
//             (perm.features.some(f => f.selectedActions.length > 0) ||
//               perm.subModules.some(sm => sm.features.some(f => f.selectedActions.length > 0)))
//           ) {
//             additionalPermissions.push('prv_hiring_read')
//           }

//           if (
//             perm.module === 'Hiring' &&
//             perm.subModules.some(sm => sm.name === 'Vacancy' && sm.features.some(f => f.selectedActions.length > 0))
//           ) {
//             additionalPermissions.push('prv_hiring_vacancy_read')
//           }

//           if (
//             perm.module === 'System' &&
//             (perm.features.some(f => f.selectedActions.length > 0) ||
//               perm.subModules.some(sm => sm.features.some(f => f.selectedActions.length > 0)))
//           ) {
//             additionalPermissions.push('prv_system_read')
//           }

//           if (
//             perm.module === 'System' &&
//             perm.subModules.some(sm => sm.name === 'Xfactor' && sm.features.some(f => f.selectedActions.length > 0))
//           ) {
//             additionalPermissions.push('prv_system_xfactor_read')
//           }

//           return [
//             ...moduleResults,
//             ...subModuleResults,
//             ...perm.actions.map(action => `prv_${perm.module.toLowerCase()}_${action}`),
//             ...additionalPermissions
//           ]
//         })
//         .filter(Boolean)

//       try {
//         let res = null

//         if (mode === 'edit' && roleId) {
//           if (editType === 'designation') {
//             const params: any = {
//               id: roleId,
//               params: {
//                 designation: values.designation.replace(/^des/i, '').trim(),
//                 editType: 'designation'
//               }
//             }

//             if (activeSection === 'roleDetails') {
//               params.params.newGroupDesignations = Array.isArray(values.groupDesignation)
//                 ? values.groupDesignation.map(normalizeName)
//                 : [normalizeName(values.groupDesignation as string)]
//             } else if (activeSection === 'permissions') {
//               params.params.newPermissionNames = permissions
//             }

//             res = await dispatch(updateUserRole(params)).unwrap()
//           } else if (editType === 'groupRole' && groupRoleId) {
//             const groupDesignation = typeof values.groupDesignation === 'string' ? values.groupDesignation.trim() : ''

//             if (!groupDesignation) throw new Error('Group designation is required.')
//             res = await dispatch(
//               updateUserRole({
//                 id: roleId,
//                 groupRoleId,
//                 params: {
//                   designation: values.designation.replace(/^des/i, '').trim(),
//                   targetGroupDesignation: normalizeName(groupDesignation),
//                   targetGroupPermissions: permissions,
//                   groupRoleDescription: values.groupRoleDescription,
//                   editType: 'groupRole'
//                 }
//               })
//             ).unwrap()
//           }
//         } else {
//           const groupDesignation = typeof values.groupDesignation === 'string' ? values.groupDesignation.trim() : ''

//           if (!groupDesignation) throw new Error('Group designation is required.')
//           res = await dispatch(
//             addNewUserRole({
//               designation: normalizeName(values.designation),
//               group_designation: normalizeName(groupDesignation),
//               grp_role_description: values.groupRoleDescription,
//               permissions
//             })
//           ).unwrap()
//         }

//         toast.success(res?.message || (mode === 'add' ? 'Role Added Successfully' : 'Role Updated Successfully'), {
//           position: 'top-right',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true
//         })
//       } catch (error: any) {
//         const errorMessages = error.message
//           ? Array.isArray(error.message)
//             ? error.message.map((err: any) => err.constraints?.whitelistValidation || err)
//             : [error.message]
//           : ['An unexpected error occurred.']

//         toast.error(errorMessages.join(', ') || 'Failed to save role', {
//           position: 'top-right',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true
//         })
//         setApiErrors(errorMessages)
//       } finally {
//         setSubmitting(false)
//       }
//     }
//   })

//   useEffect(() => {
//     setIsFormEdited(JSON.stringify(roleFormik.values) !== JSON.stringify(initialFormValues))
//   }, [roleFormik.values, initialFormValues])

//   const handlePermissionChange = (
//     module: string,
//     subModule: string | undefined,
//     featureOrAction: string,
//     action: string,
//     checked: boolean,
//     isSubModule: boolean = false,
//     parentSubModule?: string
//   ) => {
//     const permissions = [...roleFormik.values.newPermissionNames]
//     const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

//     if (moduleIndex === -1) return

//     if (isSubModule && parentSubModule) {
//       const subModuleIndex = permissions[moduleIndex].subModules.findIndex(sm => sm.name === parentSubModule)

//       if (subModuleIndex === -1) return

//       if (featureOrAction.toLowerCase() === 'actions') {
//         permissions[moduleIndex].subModules[subModuleIndex].actions = checked
//           ? [...new Set([...permissions[moduleIndex].subModules[subModuleIndex].actions, action])]
//           : permissions[moduleIndex].subModules[subModuleIndex].actions.filter(a => a !== action)
//       } else {
//         const featureIndex = permissions[moduleIndex].subModules[subModuleIndex].features.findIndex(
//           f => f.name === featureOrAction
//         )

//         if (featureIndex === -1) return
//         permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions = checked
//           ? [
//               ...new Set([
//                 ...permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions,
//                 action
//               ])
//             ]
//           : permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions.filter(
//               a => a !== action
//             )
//       }
//     } else if (featureOrAction.toLowerCase() !== 'actions' && permissions[moduleIndex].features.length > 0) {
//       const featureIndex = permissions[moduleIndex].features.findIndex(f => f.name === featureOrAction)

//       if (featureIndex === -1) return
//       permissions[moduleIndex].features[featureIndex].selectedActions = checked
//         ? [...new Set([...permissions[moduleIndex].features[featureIndex].selectedActions, action])]
//         : permissions[moduleIndex].features[featureIndex].selectedActions.filter(a => a !== action)
//     } else if (featureOrAction.toLowerCase() === 'actions') {
//       permissions[moduleIndex].actions = checked
//         ? [...new Set([...permissions[moduleIndex].actions, action])]
//         : permissions[moduleIndex].actions.filter(a => a !== action)
//     }

//     roleFormik.setFieldValue('newPermissionNames', permissions)
//   }

//   const handleSelectAllPermissions = (
//     module: string,
//     subModule: string | undefined,
//     feature: string,
//     allActions: string[],
//     checked: boolean,
//     isSubModule: boolean = false,
//     parentSubModule?: string
//   ) => {
//     const permissions = [...roleFormik.values.newPermissionNames]
//     const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

//     if (moduleIndex === -1) return

//     if (isSubModule && parentSubModule) {
//       const subModuleIndex = permissions[moduleIndex].subModules.findIndex(sm => sm.name === parentSubModule)

//       if (subModuleIndex === -1) return

//       if (feature.toLowerCase() === 'actions') {
//         permissions[moduleIndex].subModules[subModuleIndex].actions = checked ? allActions : []
//       } else {
//         const featureIndex = permissions[moduleIndex].subModules[subModuleIndex].features.findIndex(
//           f => f.name === feature
//         )

//         if (featureIndex === -1) return
//         permissions[moduleIndex].subModules[subModuleIndex].features[featureIndex].selectedActions = checked
//           ? allActions
//           : []
//       }
//     } else if (feature.toLowerCase() === 'actions') {
//       permissions[moduleIndex].actions = checked ? allActions : []
//     } else {
//       const featureIndex = permissions[moduleIndex].features.findIndex(f => f.name === feature)

//       if (featureIndex === -1) return
//       permissions[moduleIndex].features[featureIndex].selectedActions = checked ? allActions : []
//     }

//     roleFormik.setFieldValue('newPermissionNames', permissions)
//   }

//   const handleSelectAllFeatures = (module: string, subModule: string | undefined, checked: boolean) => {
//     const permissions = [...roleFormik.values.newPermissionNames]
//     const moduleIndex = permissions.findIndex(p => p.module === module && p.subModule === subModule)

//     if (moduleIndex === -1) return
//     const perm = defaultPermissionsList.find(p => p.module === module && p.subModule === subModule)

//     permissions[moduleIndex].features = perm?.features.map(f => ({
//       name: f.name,
//       actions: f.actions,
//       selectedActions: checked ? f.actions : []
//     }))
//     permissions[moduleIndex].actions = checked ? perm?.actions : []
//     permissions[moduleIndex].subModules = perm?.subModules.map(sm => ({
//       name: sm.name,
//       actions: checked ? sm.actions : [],
//       features: sm.features.map(f => ({
//         name: f.name,
//         actions: f.actions,
//         selectedActions: checked ? f.actions : []
//       }))
//     }))
//     roleFormik.setFieldValue('newPermissionNames', permissions)
//   }

//   const handleSelectAllModules = (checked: boolean) => {
//     roleFormik.setFieldValue(
//       'newPermissionNames',
//       defaultPermissionsList.map(p => ({
//         module: p.module,
//         subModule: p.subModule,
//         features: p.features.map(f => ({
//           name: f.name,
//           actions: f.actions,
//           selectedActions: checked ? f.actions : []
//         })),
//         actions: checked ? p.actions : [],
//         subModules: p.subModules.map(sm => ({
//           name: sm.name,
//           actions: checked ? sm.actions : [],
//           features: sm.features.map(f => ({
//             name: f.name,
//             actions: f.actions,
//             selectedActions: checked ? f.actions : []
//           }))
//         }))
//       }))
//     )
//   }

//   const handleCancel = () => {
//     if (isFormEdited) {
//       roleFormik.resetForm({ values: initialFormValues })
//       setIsFormEdited(false)
//       dispatch(resetAddUserRoleStatus())
//       setApiErrors([])
//     }
//   }

//   const handleSlider = (event: React.UIEvent<HTMLElement>) => {
//     const target = event.currentTarget
//     const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 1

//     if (bottom && hasMoreGroupRoles && !isGroupRoleLoading) {
//       setGroupRoleLimit(prevLimit => prevLimit + 100)
//     }
//   }

//   const handleRoleDetailsClick = () => {
//     if (editType === 'designation') {
//       setActiveSection('roleDetails')
//     }
//   }

//   const handlePermissionsClick = () => {
//     if (editType === 'designation') {
//       setActiveSection('permissions')
//     }
//   }

//   const toggleModule = (module: string) => {
//     setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }))
//   }

//   const toggleSubModule = (subModule: string) => {
//     setExpandedSubModules(prev => ({ ...prev, [subModule]: !prev[subModule] }))
//   }

//   if (isUserRoleLoading) {
//     return (
//       <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <form
//       onSubmit={e => {
//         e.preventDefault()
//         roleFormik.handleSubmit()
//       }}
//       className='p-6 bg-white shadow-md rounded'
//     >
//       <ToastContainer
//         position='top-right'
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <Typography variant='h5' className='mb-4'>
//         {mode === 'edit' ? (editType === 'groupRole' ? 'Edit Group Role' : 'Edit Designation') : 'Add New Role'}
//       </Typography>

//       <Box
//         component='fieldset'
//         className={`border rounded p-4 mb-6 cursor-pointer transition-all duration-200 ${
//           editType === 'designation' && activeSection === 'roleDetails'
//             ? 'border-blue-500 bg-blue-50'
//             : 'border-grey-300'
//         }`}
//         disabled={editType === 'designation' && activeSection !== 'roleDetails'}
//         onClick={handleRoleDetailsClick}
//       >
//         <legend className='text-lg font-semibold text-grey-700'>Role Details</legend>
//         <FormControl fullWidth margin='normal'>
//           {mode === 'add' ? (
//             <Autocomplete
//               id='designation'
//               options={designationOptions}
//               value={roleFormik.values.designation || ''}
//               onChange={(_, value) => roleFormik.setFieldValue('designation', value || '')}
//               onBlur={() => roleFormik.setFieldTouched('designation', true)}
//               renderInput={params => (
//                 <TextField
//                   {...params}
//                   label='Designation *'
//                   error={roleFormik.touched.designation && !!roleFormik.errors.designation}
//                   helperText={roleFormik.touched.designation && roleFormik.errors.designation}
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {isDesignationLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     )
//                   }}
//                 />
//               )}
//               disabled={editType === 'designation' && activeSection !== 'roleDetails'}
//             />
//           ) : (
//             <TextField
//               label='Designation *'
//               name='designation'
//               value={roleFormik.values.designation.replace(/^des/i, '').trim() || ''}
//               onChange={roleFormik.handleChange}
//               onBlur={roleFormik.handleBlur}
//               error={roleFormik.touched.designation && !!roleFormik.errors.designation}
//               helperText={roleFormik.touched.designation && roleFormik.errors.designation}
//               disabled={mode === 'edit'}
//             />
//           )}
//         </FormControl>

//         {editType === 'designation' && mode === 'edit' ? (
//           <FormControl fullWidth margin='normal'>
//             <Autocomplete
//               id='groupDesignation'
//               options={groupDesignationOptions}
//               value={Array.isArray(roleFormik.values.groupDesignation) ? roleFormik.values.groupDesignation : []}
//               onChange={(_, value) => roleFormik.setFieldValue('groupDesignation', value)}
//               renderInput={params => (
//                 <TextField
//                   {...params}
//                   label='Group Designations'
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {isGroupRoleLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     )
//                   }}
//                 />
//               )}
//               renderTags={(value, getTagProps) =>
//                 value.map((option, index) => (
//                   <Chip variant='outlined' key={index} label={option as string} {...getTagProps({ index })} />
//                 ))
//               }
//               multiple
//               disabled={editType === 'designation' && activeSection !== 'roleDetails'}
//               ListboxProps={{
//                 onScroll: handleSlider,
//                 style: { maxHeight: '300px' }
//               }}
//             />
//             {roleFormik.touched.groupDesignation && roleFormik.errors.groupDesignation && (
//               <Typography color='error' variant='caption'>
//                 {roleFormik.errors.groupDesignation}
//               </Typography>
//             )}
//           </FormControl>
//         ) : mode === 'add' ? (
//           <FormControl fullWidth margin='normal'>
//             <TextField
//               label='Group Designation *'
//               name='groupDesignation'
//               value={typeof roleFormik.values.groupDesignation === 'string' ? roleFormik.values.groupDesignation : ''}
//               onChange={roleFormik.handleChange}
//               onBlur={roleFormik.handleBlur}
//               error={roleFormik.touched.groupDesignation && !!roleFormik.errors.groupDesignation}
//               helperText={roleFormik.touched.groupDesignation && roleFormik.errors.groupDesignation}
//             />
//           </FormControl>
//         ) : (
//           <FormControl fullWidth margin='normal'>
//             <TextField
//               label='Group Designation *'
//               name='groupDesignation'
//               value={typeof roleFormik.values.groupDesignation === 'string' ? roleFormik.values.groupDesignation : ''}
//               onChange={roleFormik.handleChange}
//               onBlur={roleFormik.handleBlur}
//               error={roleFormik.touched.groupDesignation && !!roleFormik.errors.groupDesignation}
//               helperText={roleFormik.touched.groupDesignation && roleFormik.errors.groupDesignation}
//             />
//           </FormControl>
//         )}

//         {(mode === 'add' || editType === 'groupRole') && (
//           <FormControl fullWidth margin='normal'>
//             <TextField
//               label='Group Role Description'
//               name='groupRoleDescription'
//               value={roleFormik.values.groupRoleDescription || ''}
//               onChange={roleFormik.handleChange}
//               onBlur={roleFormik.handleBlur}
//               error={roleFormik.touched.groupRoleDescription && !!roleFormik.errors.groupRoleDescription}
//               helperText={roleFormik.touched.groupRoleDescription && roleFormik.errors.groupRoleDescription}
//             />
//           </FormControl>
//         )}
//       </Box>

//       <Box
//         component='fieldset'
//         className={`border rounded p-4 mb-6 cursor-pointer transition-all duration-200 ${
//           editType === 'designation' && activeSection === 'permissions'
//             ? 'border-blue-500 bg-blue-50'
//             : 'border-grey-300'
//         }`}
//         disabled={editType === 'designation' && activeSection !== 'permissions'}
//         onClick={handlePermissionsClick}
//       >
//         <legend style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', padding: '0 8px' }}>
//           {editType === 'designation' ? 'Permissions of Designations' : 'Permissions of Group'}
//         </legend>
//         <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={roleFormik.values.newPermissionNames.every(p => {
//                   const defaultPerm = defaultPermissionsList.find(
//                     d => d.module === p.module && p.subModule === d.subModule
//                   )

//                   const actionsChecked =
//                     defaultPerm?.actions.length > 0
//                       ? p.actions.length === defaultPerm.actions.length &&
//                         defaultPerm.actions.every(a => p.actions.includes(a))
//                       : true

//                   const featuresChecked =
//                     defaultPerm?.features.length > 0
//                       ? p.features.every(f =>
//                           defaultPerm.features
//                             .find(feat => feat.name === f.name)
//                             ?.actions.every(a => f.selectedActions.includes(a))
//                         )
//                       : true

//                   const subModulesChecked =
//                     defaultPerm?.subModules.length > 0
//                       ? p.subModules.every(sm => {
//                           const defaultSubModule = defaultPerm.subModules.find(dsm => dsm.name === sm.name)

//                           const subActionsChecked =
//                             defaultSubModule?.actions.length > 0
//                               ? sm.actions.length === defaultSubModule.actions.length &&
//                                 defaultSubModule.actions.every(a => sm.actions.includes(a))
//                               : true

//                           const subFeaturesChecked =
//                             defaultSubModule?.features.length > 0
//                               ? sm.features.every(f =>
//                                   defaultSubModule.features
//                                     .find(feat => feat.name === f.name)
//                                     ?.actions.every(a => f.selectedActions.includes(a))
//                                 )
//                               : true

//                           return subActionsChecked && subFeaturesChecked
//                         })
//                       : true

//                   return actionsChecked && featuresChecked && subModulesChecked
//                 })}
//                 onChange={e => handleSelectAllModules(e.target.checked)}
//                 disabled={editType === 'designation' && activeSection !== 'permissions'}
//                 sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//               />
//             }
//             label={<Typography sx={{ color: 'grey[700]', fontWeight: 500 }}>Select All</Typography>}
//             sx={{ color: 'grey[700]', fontWeight: 500 }}
//           />
//         </Box>

//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//           {defaultPermissionsList.map(permission => {
//             const currentPerm = roleFormik.values.newPermissionNames.find(
//               p => p.module === permission.module && p.subModule === permission.subModule
//             )

//             return (
//               <Box
//                 key={`${permission.module}-${permission.subModule || ''}`}
//                 sx={{
//                   backgroundColor: 'white',
//                   border: '1px solid',
//                   borderColor: 'grey[200]',
//                   borderRadius: '6px',
//                   p: 2,
//                   boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
//                   transition: 'box-shadow 0.2s',
//                   '&:hover': { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }
//                 }}
//               >
//                 <Box
//                   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
//                   onClick={() => toggleModule(permission.module)}
//                 >
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={
//                           (permission.actions.length > 0
//                             ? currentPerm?.actions.length === permission.actions.length &&
//                               permission.actions.every(a => currentPerm?.actions.includes(a))
//                             : true) &&
//                           (permission.features.length > 0
//                             ? currentPerm?.features.every(f =>
//                                 permission.features
//                                   .find(feat => feat.name === f.name)
//                                   ?.actions.every(a => f.selectedActions.includes(a))
//                               )
//                             : true) &&
//                           (permission.subModules.length > 0
//                             ? currentPerm?.subModules.every(sm => {
//                                 const defaultSubModule = permission.subModules.find(dsm => dsm.name === sm.name)

//                                 return (
//                                   (defaultSubModule?.actions.length > 0
//                                     ? sm.actions.length === defaultSubModule.actions.length &&
//                                       defaultSubModule.actions.every(a => sm.actions.includes(a))
//                                     : true) &&
//                                   (defaultSubModule?.features.length > 0
//                                     ? sm.features.every(f =>
//                                         defaultSubModule.features
//                                           .find(feat => feat.name === f.name)
//                                           ?.actions.every(a => f.selectedActions.includes(a))
//                                       )
//                                     : true)
//                                 )
//                               })
//                             : true)
//                         }
//                         onChange={e =>
//                           handleSelectAllFeatures(permission.module, permission.subModule, e.target.checked)
//                         }
//                         disabled={editType === 'designation' && activeSection !== 'permissions'}
//                         sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                       />
//                     }
//                     label={
//                       <Typography sx={{ fontWeight: 'bold', color: 'grey[800]' }}>
//                         {permission.subModule ? `${permission.module} - ${permission.subModule}` : permission.module}
//                       </Typography>
//                     }
//                   />
//                   <IconButton
//                     onClick={e => {
//                       e.stopPropagation()
//                       toggleModule(permission.module)
//                     }}
//                   >
//                     {expandedModules[permission.module] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                   </IconButton>
//                 </Box>
//                 <Collapse in={expandedModules[permission.module]}>
//                   <Box sx={{ pl: permission.features.length > 0 ? 4 : 2, mt: 2 }}>
//                     {permission.actions.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={
//                                 currentPerm?.actions.length === permission.actions.length &&
//                                 permission.actions.every(a => currentPerm?.actions.includes(a))
//                               }
//                               onChange={e =>
//                                 handleSelectAllPermissions(
//                                   permission.module,
//                                   permission.subModule,
//                                   'actions',
//                                   permission.actions,
//                                   e.target.checked
//                                 )
//                               }
//                               disabled={editType === 'designation' && activeSection !== 'permissions'}
//                               sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                             />
//                           }
//                           label={<Typography sx={{ color: 'grey[700]' }}>Actions</Typography>}
//                         />
//                         <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                           {permission.actions.map(action => (
//                             <FormControlLabel
//                               key={action}
//                               control={
//                                 <Checkbox
//                                   checked={currentPerm?.actions.includes(action) ?? false}
//                                   onChange={e =>
//                                     handlePermissionChange(
//                                       permission.module,
//                                       permission.subModule,
//                                       'actions',
//                                       action,
//                                       e.target.checked
//                                     )
//                                   }
//                                   disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                   sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                                 />
//                               }
//                               label={
//                                 <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
//                                   {action.charAt(0).toUpperCase() + action.slice(1)}
//                                 </Typography>
//                               }
//                             />
//                           ))}
//                         </Box>
//                       </Box>
//                     )}
//                     {permission.features.map(feature => {
//                       const currentFeature = currentPerm?.features.find(f => f.name === feature.name)

//                       return (
//                         <Box key={feature.name} sx={{ mb: 2 }}>
//                           <FormControlLabel
//                             control={
//                               <Checkbox
//                                 checked={
//                                   currentFeature?.selectedActions.length === feature.actions.length &&
//                                   feature.actions.every(a => currentFeature?.selectedActions.includes(a))
//                                 }
//                                 onChange={e =>
//                                   handleSelectAllPermissions(
//                                     permission.module,
//                                     permission.subModule,
//                                     feature.name,
//                                     feature.actions,
//                                     e.target.checked
//                                   )
//                                 }
//                                 disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                 sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                               />
//                             }
//                             label={<Typography sx={{ color: 'grey[700]' }}>{feature.name}</Typography>}
//                           />
//                           <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                             {feature.actions.map(action => (
//                               <FormControlLabel
//                                 key={action}
//                                 control={
//                                   <Checkbox
//                                     checked={currentFeature?.selectedActions.includes(action) ?? false}
//                                     onChange={e =>
//                                       handlePermissionChange(
//                                         permission.module,
//                                         permission.subModule,
//                                         feature.name,
//                                         action,
//                                         e.target.checked
//                                       )
//                                     }
//                                     disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                     sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                                   />
//                                 }
//                                 label={
//                                   <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
//                                     {action.charAt(0).toUpperCase() + action.slice(1)}
//                                   </Typography>
//                                 }
//                               />
//                             ))}
//                           </Box>
//                         </Box>
//                       )
//                     })}
//                     {permission.subModules.map(subModule => {
//                       const currentSubModule = currentPerm?.subModules.find(sm => sm.name === subModule.name)

//                       return (
//                         <Box key={subModule.name} sx={{ mt: 2, pl: 2 }}>
//                           <Box
//                             sx={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'space-between',
//                               backgroundColor: 'grey[50]',
//                               p: 1.5,
//                               borderRadius: '4px'
//                             }}
//                             onClick={() => toggleSubModule(subModule.name)}
//                           >
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <FormControlLabel
//                                 control={
//                                   <Checkbox
//                                     checked={
//                                       (subModule.actions.length > 0
//                                         ? currentSubModule?.actions.length === subModule.actions.length &&
//                                           subModule.actions.every(a => currentSubModule?.actions.includes(a))
//                                         : true) &&
//                                       subModule.features.every(
//                                         f =>
//                                           currentSubModule?.features.find(cf => cf.name === f.name)?.selectedActions
//                                             .length === f.actions.length
//                                       )
//                                     }
//                                     onChange={e => {
//                                       if (subModule.actions.length > 0) {
//                                         handleSelectAllPermissions(
//                                           permission.module,
//                                           undefined,
//                                           'actions',
//                                           subModule.actions,
//                                           e.target.checked,
//                                           true,
//                                           subModule.name
//                                         )
//                                       }

//                                       subModule.features.forEach(f =>
//                                         handleSelectAllPermissions(
//                                           permission.module,
//                                           undefined,
//                                           f.name,
//                                           f.actions,
//                                           e.target.checked,
//                                           true,
//                                           subModule.name
//                                         )
//                                       )
//                                     }}
//                                     disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                     sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                                   />
//                                 }
//                                 label={
//                                   <Typography sx={{ fontWeight: 500, color: 'grey[700]' }}>{subModule.name}</Typography>
//                                 }
//                               />
//                             </Box>
//                             <IconButton
//                               size='small'
//                               onClick={e => {
//                                 e.stopPropagation()
//                                 toggleSubModule(subModule.name)
//                               }}
//                             >
//                               {expandedSubModules[subModule.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                             </IconButton>
//                           </Box>
//                           <Collapse in={expandedSubModules[subModule.name]}>
//                             <Box sx={{ pl: 2, mt: 1 }}>
//                               {subModule.actions.length > 0 && (
//                                 <Box sx={{ mb: 2 }}>
//                                   <FormControlLabel
//                                     control={
//                                       <Checkbox
//                                         checked={
//                                           currentSubModule?.actions.length === subModule.actions.length &&
//                                           subModule.actions.every(a => currentSubModule?.actions.includes(a))
//                                         }
//                                         onChange={e =>
//                                           handleSelectAllPermissions(
//                                             permission.module,
//                                             undefined,
//                                             'actions',
//                                             subModule.actions,
//                                             e.target.checked,
//                                             true,
//                                             subModule.name
//                                           )
//                                         }
//                                         disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                         sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                                       />
//                                     }
//                                     label={<Typography sx={{ color: 'grey[700]' }}>Actions</Typography>}
//                                   />
//                                   <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                                     {subModule.actions.map(action => (
//                                       <FormControlLabel
//                                         key={action}
//                                         control={
//                                           <Checkbox
//                                             checked={currentSubModule?.actions.includes(action) ?? false}
//                                             onChange={e =>
//                                               handlePermissionChange(
//                                                 permission.module,
//                                                 undefined,
//                                                 'actions',
//                                                 action,
//                                                 e.target.checked,
//                                                 true,
//                                                 subModule.name
//                                               )
//                                             }
//                                             disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                             sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                                           />
//                                         }
//                                         label={
//                                           <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
//                                             {action.charAt(0).toUpperCase() + action.slice(1)}
//                                           </Typography>
//                                         }
//                                       />
//                                     ))}
//                                   </Box>
//                                 </Box>
//                               )}
//                               {subModule.features.map(feature => (
//                                 <Box key={feature.name} sx={{ mb: 2 }}>
//                                   <FormControlLabel
//                                     control={
//                                       <Checkbox
//                                         checked={
//                                           currentSubModule?.features.find(f => f.name === feature.name)?.selectedActions
//                                             .length === feature.actions.length
//                                         }
//                                         onChange={e =>
//                                           handleSelectAllPermissions(
//                                             permission.module,
//                                             undefined,
//                                             feature.name,
//                                             feature.actions,
//                                             e.target.checked,
//                                             true,
//                                             subModule.name
//                                           )
//                                         }
//                                         disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                         sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                                       />
//                                     }
//                                     label={<Typography sx={{ color: 'grey[700]' }}>{feature.name}</Typography>}
//                                   />
//                                   <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                                     {feature.actions.map(action => (
//                                       <FormControlLabel
//                                         key={action}
//                                         control={
//                                           <Checkbox
//                                             checked={
//                                               currentSubModule?.features
//                                                 .find(f => f.name === feature.name)
//                                                 ?.selectedActions.includes(action) ?? false
//                                             }
//                                             onChange={e =>
//                                               handlePermissionChange(
//                                                 permission.module,
//                                                 undefined,
//                                                 feature.name,
//                                                 action,
//                                                 e.target.checked,
//                                                 true,
//                                                 subModule.name
//                                               )
//                                             }
//                                             disabled={editType === 'designation' && activeSection !== 'permissions'}
//                                             sx={{ color: 'grey[600]', '&.Mui-checked': { color: 'blue[600]' } }}
//                                           />
//                                         }
//                                         label={
//                                           <Typography sx={{ color: 'grey[600]', fontSize: '0.875rem' }}>
//                                             {action.charAt(0).toUpperCase() + action.slice(1)}
//                                           </Typography>
//                                         }
//                                       />
//                                     ))}
//                                   </Box>
//                                 </Box>
//                               ))}
//                             </Box>
//                           </Collapse>
//                         </Box>
//                       )
//                     })}
//                   </Box>
//                 </Collapse>
//               </Box>
//             )
//           })}
//           {roleFormik.touched.newPermissionNames && roleFormik.errors.newPermissionNames && (
//             <Typography color='error' variant='caption' sx={{ mt: 2 }}>
//               {typeof roleFormik.errors.newPermissionNames === 'string'
//                 ? roleFormik.errors.newPermissionNames
//                 : Array.isArray(roleFormik.errors.newPermissionNames)
//                   ? roleFormik.errors.newPermissionNames
//                       .filter(Boolean)
//                       .map(err => err?.toString() || '')
//                       .join(', ')
//                   : JSON.stringify(roleFormik.errors.newPermissionNames)}
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       <Box display='flex' justifyContent='space-between' alignItems='center' mx={5} mt={2} mb={3}>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <DynamicButton
//             type='button'
//             variant='contained'
//             sx={{ backgroundColor: 'grey[500]', color: 'white', '&:hover': { backgroundColor: 'grey[600]' } }}
//             onClick={handleCancel}
//             disabled={!isFormEdited}
//           >
//             Cancel
//           </DynamicButton>
//           <DynamicButton
//             type='submit'
//             variant='contained'
//             sx={{ backgroundColor: 'blue[500]', color: 'white', '&:hover': { backgroundColor: 'blue[600]' } }}
//             disabled={isAddUserRoleLoading || !isFormEdited}
//           >
//             {isAddUserRoleLoading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Role'}
//           </DynamicButton>
//         </Box>
//       </Box>
//     </form>
//   )
// }

// export default AddOrEditUserRole


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

  // Autocomplete,
  Chip,
  Avatar,
  FormControlLabel,

  // Switch,
  Checkbox,
  Collapse,
  IconButton,
  Divider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchUserById,
  resetAddUserStatus,
  updateUserPermission,
  updateUserRole,
  fetchUserGroupRole
} from '@/redux/UserManagment/userManagementSlice'
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

  const {  selectedUserData, isUserLoading, userFailureMessage } = userManagement || {
    selectedUserData: null,
    isUserLoading: false,
    userFailureMessage: ''
  }

  const { userGroupRoleData } = useAppSelector(state => state.UserManagementReducer)

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
      dispatch(fetchUserGroupRole())
      dispatch(resetAddUserStatus())
    }
  }, [id, dispatch])

  console.log(userGroupRoleData, 'userGroupRoleData')
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

    if (!isEditMode && id) {
      const payload = {
        email: formData.email,
        newRoleNames: formData.groupRoles
      }

      await dispatch(updateUserRole({ id, params: payload }))
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
