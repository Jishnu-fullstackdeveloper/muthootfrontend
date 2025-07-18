/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { useState, useEffect, useCallback, useRef } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Form Imports
import { useFormik } from 'formik'
import * as Yup from 'yup'

// MUI Imports
import {
  Box,
  Card,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  Divider,
  CircularProgress
} from '@mui/material'

// Redux Imports
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchJobRole,
  fetchEmployee,
  fetchBusinessUnit,
  fetchEmployeeCategoryType,
  fetchDepartment,
  fetchDesignation,
  fetchGrade,
  fetchTerritory,
  fetchZone,
  fetchRegion,
  fetchArea,
  fetchCluster,
  fetchBranch,
  fetchCity,
  fetchState,
  fetchApprovalCategories,
  createBudgetIncreaseRequest
} from '@/redux/BudgetManagement/BudgetManagementSlice'

// Utility Imports
import { getUserId } from '@/utils/functions'

// Component Imports
import DynamicButton from '@/components/Button/dynamicButton'

// Static Dropdown Options
const staticDropdownOptions = {
  campusOrLateral: ['Campus', 'Lateral'],
  employeeType: ['Fulltime', 'Parttime'],
  company: ['Muthoot Fincorp Ltd.', 'Muthoot Papachan']
}

// Validation Schema
const validationSchema = Yup.object({
  jobTitle: Yup.string().required('Job Title is required'),
  jobRole: Yup.string().required('Job Role is required'),
  openings: Yup.number()
    .required('No. of Openings is required')
    .min(1, 'No. of Openings must be a positive number (at least 1)'),
  experienceMin: Yup.number()
    .required('Minimum Experience is required')
    .min(0, 'Minimum Experience must be 0 or positive'),
  experienceMax: Yup.number()
    .required('Maximum Experience is required')
    .min(0, 'Maximum Experience must be 0 or positive')
    .moreThan(Yup.ref('experienceMin'), 'Maximum Experience must be greater than Minimum Experience'),
  campusOrLateral: Yup.string().required('Campus / Lateral is required'),
  hiringManager: Yup.string().required('Hiring Manager is required'),
  startingDate: Yup.date().required('Start Date is required').nullable(),
  closingDate: Yup.date()
    .required('Closing Date is required')
    .nullable()
    .min(Yup.ref('startingDate'), 'Closing Date must be after Start Date'),
  company: Yup.string().required('Company is required'),
  businessUnit: Yup.string().required('Business Unit is required'),
  employeeCategory: Yup.string().required('Employee Category is required'),
  employeeType: Yup.string().required('Employee Type is required'),
  department: Yup.string().required('Department is required'),
  designation: Yup.string().required('Designation is required'),
  grade: Yup.string().required('Grade is required'),
  territory: Yup.string().required('Territory is required'),
  zone: Yup.string().required('Zone is required'),
  region: Yup.string().required('Region is required'),
  area: Yup.string().required('Area is required'),
  cluster: Yup.string().required('Cluster is required'),
  branchName: Yup.string().required('Branch Name is required'),
  branchCode: Yup.string().required('Branch Code is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  approvalCategory: Yup.string().required('Approval Category is required'),
  approvalCategoryId: Yup.string().required('Approval Category ID is required'),
  raisedById: Yup.string().required('Raised By ID is required')
})

const ManualRequestGeneratedForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)

  // Redux State
  const { createBudgetIncreaseRequestLoading } = useAppSelector(state => state.budgetManagementReducer) as any

  // Form Data States
  const [jobRoles, setJobRoles] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [businessUnits, setBusinessUnits] = useState<any[]>([])
  const [employeeCategories, setEmployeeCategories] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [designations, setDesignations] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [territories, setTerritories] = useState<any[]>([])
  const [zones, setZones] = useState<any[]>([])
  const [regions, setRegions] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [clusters, setClusters] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [approvalCategories, setApprovalCategories] = useState<any[]>([])

  // Pagination States (only for APIs that use lazy loading)
  const [limit, setLimit] = useState({
    jobRole: 10,
    employee: 10

    // Removed limits for APIs that don't need pagination
  })

  const [hasMore, setHasMore] = useState({
    jobRole: true,
    employee: true

    // Removed hasMore for APIs that don't need pagination
  })

  // Refs to track fetched values for dependent APIs
  const jobRoleFetchRef = useRef<string | null>(null)
  const businessUnitFetchRef = useRef<string | null>(null)
  const employeeCategoryFetchRef = useRef<string | null>(null)
  const departmentFetchRef = useRef<string | null>(null)
  const territoryFetchRef = useRef<string | null>(null)
  const zoneFetchRef = useRef<string | null>(null)
  const regionFetchRef = useRef<string | null>(null)
  const areaFetchRef = useRef<string | null>(null)
  const clusterFetchRef = useRef<string | null>(null)
  const branchNameFetchRef = useRef<string | null>(null)
  const cityFetchRef = useRef<string | null>(null)

  // Observer Refs (only for jobRole and employee)
  const observerRefs = {
    jobRole: useRef<HTMLDivElement | null>(null),
    employee: useRef<HTMLDivElement | null>(null)
  }

  // Fetch raisedById
  const raisedById = getUserId()

  // Formik setup
  const formik = useFormik({
    initialValues: {
      jobTitle: '',
      jobRole: '',
      openings: '',
      experienceMin: '',
      experienceMax: '',
      campusOrLateral: '',
      hiringManager: '',
      startingDate: '',
      closingDate: '',
      company: '',
      businessUnit: '',
      employeeCategory: '',
      employeeType: '',
      department: '',
      designation: '',
      grade: '',
      territory: '',
      zone: '',
      region: '',
      area: '',
      cluster: '',
      branchName: '',
      branchCode: '',
      city: '',
      state: '',
      approvalCategory: '',
      approvalCategoryId: '',
      raisedById: raisedById || ''
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const payload = {
          jobTitle: values.jobTitle,
          jobRole: jobRoles.find(option => option.id === values.jobRole)?.name || values.jobRole,
          openings: values.openings,
          experienceMin: values.experienceMin,
          experienceMax: values.experienceMax,
          campusOrLateral: values.campusOrLateral,
          hiringManager: employees.find(option => option.id === values.hiringManager)
            ? `${employees.find(option => option.id === values.hiringManager).firstName} ${
                employees.find(option => option.id === values.hiringManager).middleName || ''
              } ${employees.find(option => option.id === values.hiringManager).lastName}`.trim()
            : values.hiringManager,
          startingDate: values.startingDate,
          closingDate: values.closingDate,
          company: values.company,
          businessUnit: businessUnits.find(option => option.id === values.businessUnit)?.name || values.businessUnit,
          employeeCategory:
            employeeCategories.find(option => option.id === values.employeeCategory)?.name || values.employeeCategory,
          employeeType: values.employeeType,
          department: departments.find(option => option.id === values.department)?.name || values.department,
          designation: designations.find(option => option.id === values.designation)?.name || values.designation,
          grade: grades.find(option => option.id === values.grade)?.name || values.grade,
          territory: territories.find(option => option.id === values.territory)?.name || values.territory,
          zone: zones.find(option => option.id === values.zone)?.name || values.zone,
          region: regions.find(option => option.id === values.region)?.name || values.region,
          area: areas.find(option => option.id === values.area)?.name || values.area,
          cluster: clusters.find(option => option.id === values.cluster)?.name || values.cluster,
          branchName: branches.find(option => option.id === values.branchName)?.name || values.branchName,
          branchCode: values.branchCode,
          city: cities.find(option => option.id === values.city)?.name || values.city,
          state: states.find(option => option.id === values.state)?.name || values.state,
          approvalCategory:
            approvalCategories.find(option => option.id === values.approvalCategory)?.name || values.approvalCategory,
          approvalCategoryId: values.approvalCategoryId,
          raisedById: values.raisedById
        }

        await dispatch(createBudgetIncreaseRequest(payload)).unwrap()
        router.push('/budget-management')
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
  })

  // Fetch functions
  const loadJobRoles = useCallback(() => {
    if (!hasMore.jobRole) return
    dispatch(fetchJobRole({ page: 1, limit: limit.jobRole }))
      .unwrap()
      .then(data => {
        setJobRoles(prev => [...prev, ...(data?.data || [])])
        setLimit(prev => ({ ...prev, jobRole: prev.jobRole + 10 }))
        setHasMore(prev => ({ ...prev, jobRole: data.data.length === limit.jobRole }))
      })
  }, [dispatch, limit.jobRole, hasMore.jobRole])

  const loadMoreEmployees = useCallback(() => {
    if (!hasMore.employee || !formik.values.jobRole) return
    dispatch(fetchEmployee({ page: 1, limit: limit.employee, search: '' }))
      .unwrap()
      .then(data => {
        setEmployees(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, employee: prev.employee + 10 }))
        setHasMore(prev => ({ ...prev, employee: data.data.length === limit.employee }))
      })
  }, [dispatch, limit.employee, hasMore.employee, formik.values.jobRole])

  const loadBusinessUnits = useCallback(() => {
    dispatch(fetchBusinessUnit({ page: 1, limit: 1000 })) // Fetch all at once
      .unwrap()
      .then(data => {
        setBusinessUnits(data?.data || [])
      })
  }, [dispatch])

  const loadEmployeeCategories = useCallback(() => {
    if (!formik.values.businessUnit) return
    dispatch(fetchEmployeeCategoryType({ page: 1, limit: 1000, businessUnitId: formik.values.businessUnit }))
      .unwrap()
      .then(data => {
        setEmployeeCategories(data.data || [])
      })
  }, [dispatch, formik.values.businessUnit])

  const loadDepartments = useCallback(() => {
    if (!formik.values.employeeCategory) return
    dispatch(fetchDepartment({ page: 1, limit: 1000, employeeCategoryId: formik.values.employeeCategory }))
      .unwrap()
      .then(data => {
        setDepartments(data.data || [])
      })
  }, [dispatch, formik.values.employeeCategory])

  const loadDesignations = useCallback(() => {
    if (!formik.values.department) return
    dispatch(fetchDesignation({ page: 1, limit: 1000, departmentId: formik.values.department }))
      .unwrap()
      .then(data => {
        setDesignations(data.data || [])
      })
  }, [dispatch, formik.values.department])

  const loadGrades = useCallback(() => {
    dispatch(fetchGrade({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setGrades(data?.data || [])
      })
  }, [dispatch])

  const loadTerritories = useCallback(() => {
    dispatch(fetchTerritory({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setTerritories(data?.data || [])
      })
  }, [dispatch])

  const loadZones = useCallback(() => {
    if (!formik.values.territory) return
    dispatch(fetchZone({ page: 1, limit: 1000, territoryId: formik.values.territory }))
      .unwrap()
      .then(data => {
        setZones(data.data || [])
      })
  }, [dispatch, formik.values.territory])

  const loadRegions = useCallback(() => {
    if (!formik.values.zone) return
    dispatch(fetchRegion({ page: 1, limit: 1000, zoneId: formik.values.zone }))
      .unwrap()
      .then(data => {
        setRegions(data.data || [])
      })
  }, [dispatch, formik.values.zone])

  const loadAreas = useCallback(() => {
    if (!formik.values.region) return
    dispatch(fetchArea({ page: 1, limit: 1000, regionId: formik.values.region }))
      .unwrap()
      .then(data => {
        setAreas(data.data || [])
      })
  }, [dispatch, formik.values.region])

  const loadClusters = useCallback(() => {
    if (!formik.values.area) return
    dispatch(fetchCluster({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setClusters(data.data || [])
      })
  }, [dispatch, formik.values.area])

  const loadBranches = useCallback(() => {
    if (!formik.values.cluster) return
    dispatch(fetchBranch({ page: 1, limit: 1000, clusterId: formik.values.cluster }))
      .unwrap()
      .then(data => {
        setBranches(data.data || [])
      })
  }, [dispatch, formik.values.cluster])

  const loadCities = useCallback(() => {
    if (!formik.values.branchName) return
    dispatch(fetchCity({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setCities(data.data || [])
      })
  }, [dispatch, formik.values.branchName])

  const loadStates = useCallback(() => {
    if (!formik.values.city) return
    dispatch(fetchState({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setStates(data?.data || [])
      })
  }, [dispatch, formik.values.city])

  const loadApprovalCategories = useCallback(() => {
    dispatch(fetchApprovalCategories({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setApprovalCategories(data?.data || [])
      })
  }, [dispatch])

  // Initial API calls on page load (only once)
  useEffect(() => {
    loadJobRoles()
    loadBusinessUnits()
    loadGrades()
    loadTerritories()
    loadApprovalCategories()
  }, [loadJobRoles, loadBusinessUnits, loadGrades, loadTerritories, loadApprovalCategories])

  // Intersection Observer for lazy loading (only for jobRole and employee)
  useEffect(() => {
    const observers: { [key: string]: IntersectionObserver } = {}

    Object.keys(observerRefs).forEach(key => {
      observers[key] = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            switch (key) {
              case 'jobRole':
                loadJobRoles()
                break
              case 'employee':
                loadMoreEmployees()
                break
            }
          }
        },
        { threshold: 0.1 }
      )

      if (observerRefs[key as keyof typeof observerRefs].current) {
        observers[key].observe(observerRefs[key as keyof typeof observerRefs].current!)
      }
    })

    return () => {
      Object.keys(observers).forEach(key => {
        if (observerRefs[key as keyof typeof observerRefs].current) {
          observers[key].unobserve(observerRefs[key as keyof typeof observerRefs].current!)
        }
      })
    }
  }, [loadJobRoles, loadMoreEmployees])

  // Handle jobRole change to fetch employees
  useEffect(() => {
    if (formik.values.jobRole && formik.values.jobRole !== jobRoleFetchRef.current) {
      setEmployees([])
      setLimit(prev => ({ ...prev, employee: 10 }))
      setHasMore(prev => ({ ...prev, employee: true }))
      jobRoleFetchRef.current = formik.values.jobRole
      loadMoreEmployees()
    } else if (!formik.values.jobRole && jobRoleFetchRef.current !== null) {
      setEmployees([])
      formik.setFieldValue('hiringManager', '')
      jobRoleFetchRef.current = null
    }
  }, [formik.values.jobRole, loadMoreEmployees, formik])

  // Handle businessUnit change to fetch employee categories
  useEffect(() => {
    if (formik.values.businessUnit && formik.values.businessUnit !== businessUnitFetchRef.current) {
      setEmployeeCategories([])
      businessUnitFetchRef.current = formik.values.businessUnit
      loadEmployeeCategories()
    } else if (!formik.values.businessUnit && businessUnitFetchRef.current !== null) {
      setEmployeeCategories([])
      formik.setFieldValue('employeeCategory', '')
      formik.setFieldValue('department', '')
      formik.setFieldValue('designation', '')
      businessUnitFetchRef.current = null
    }
  }, [formik.values.businessUnit, loadEmployeeCategories, formik])

  // Handle employeeCategory change to fetch departments
  useEffect(() => {
    if (formik.values.employeeCategory && formik.values.employeeCategory !== employeeCategoryFetchRef.current) {
      setDepartments([])
      employeeCategoryFetchRef.current = formik.values.employeeCategory
      loadDepartments()
    } else if (!formik.values.employeeCategory && employeeCategoryFetchRef.current !== null) {
      setDepartments([])
      formik.setFieldValue('department', '')
      formik.setFieldValue('designation', '')
      employeeCategoryFetchRef.current = null
    }
  }, [formik.values.employeeCategory, loadDepartments, formik])

  // Handle department change to fetch designations
  useEffect(() => {
    if (formik.values.department && formik.values.department !== departmentFetchRef.current) {
      setDesignations([])
      departmentFetchRef.current = formik.values.department
      loadDesignations()
    } else if (!formik.values.department && departmentFetchRef.current !== null) {
      setDesignations([])
      formik.setFieldValue('designation', '')
      departmentFetchRef.current = null
    }
  }, [formik.values.department, loadDesignations, formik])

  // Handle territory change to fetch zones
  useEffect(() => {
    if (formik.values.territory && formik.values.territory !== territoryFetchRef.current) {
      setZones([])
      territoryFetchRef.current = formik.values.territory
      loadZones()
    } else if (!formik.values.territory && territoryFetchRef.current !== null) {
      formik.setFieldValue('zone', '')
      formik.setFieldValue('region', '')
      formik.setFieldValue('area', '')
      formik.setFieldValue('cluster', '')
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('branchCode', '')
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setZones([])
      setRegions([])
      setAreas([])
      setClusters([])
      setBranches([])
      setCities([])
      setStates([])
      territoryFetchRef.current = null
    }
  }, [formik.values.territory, loadZones, formik])

  // Handle zone change to fetch regions
  useEffect(() => {
    if (formik.values.zone && formik.values.zone !== zoneFetchRef.current) {
      setRegions([])
      zoneFetchRef.current = formik.values.zone
      loadRegions()
    } else if (!formik.values.zone && zoneFetchRef.current !== null) {
      formik.setFieldValue('region', '')
      formik.setFieldValue('area', '')
      formik.setFieldValue('cluster', '')
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('branchCode', '')
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setRegions([])
      setAreas([])
      setClusters([])
      setBranches([])
      setCities([])
      setStates([])
      zoneFetchRef.current = null
    }
  }, [formik.values.zone, loadRegions, formik])

  // Handle region change to fetch areas
  useEffect(() => {
    if (formik.values.region && formik.values.region !== regionFetchRef.current) {
      setAreas([])
      regionFetchRef.current = formik.values.region
      loadAreas()
    } else if (!formik.values.region && regionFetchRef.current !== null) {
      formik.setFieldValue('area', '')
      formik.setFieldValue('cluster', '')
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('branchCode', '')
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setAreas([])
      setClusters([])
      setBranches([])
      setCities([])
      setStates([])
      regionFetchRef.current = null
    }
  }, [formik.values.region, loadAreas, formik])

  // Handle area change to fetch clusters
  useEffect(() => {
    if (formik.values.area && formik.values.area !== areaFetchRef.current) {
      setClusters([])
      areaFetchRef.current = formik.values.area
      loadClusters()
    } else if (!formik.values.area && areaFetchRef.current !== null) {
      formik.setFieldValue('cluster', '')
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('branchCode', '')
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setClusters([])
      setBranches([])
      setCities([])
      setStates([])
      areaFetchRef.current = null
    }
  }, [formik.values.area, loadClusters, formik])

  // Handle cluster change to fetch branches
  useEffect(() => {
    if (formik.values.cluster && formik.values.cluster !== clusterFetchRef.current) {
      setBranches([])
      clusterFetchRef.current = formik.values.cluster
      loadBranches()
    } else if (!formik.values.cluster && clusterFetchRef.current !== null) {
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('branchCode', '')
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setBranches([])
      setCities([])
      setStates([])
      clusterFetchRef.current = null
    }
  }, [formik.values.cluster, loadBranches, formik])

  // Handle branchName change to fetch cities
  useEffect(() => {
    if (formik.values.branchName && formik.values.branchName !== branchNameFetchRef.current) {
      setCities([])
      branchNameFetchRef.current = formik.values.branchName
      loadCities()
    } else if (!formik.values.branchName && branchNameFetchRef.current !== null) {
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setCities([])
      setStates([])
      branchNameFetchRef.current = null
    }
  }, [formik.values.branchName, loadCities, formik])

  // Handle city change to fetch states
  useEffect(() => {
    if (formik.values.city && formik.values.city !== cityFetchRef.current) {
      setStates([])
      cityFetchRef.current = formik.values.city
      loadStates()
    } else if (!formik.values.city && cityFetchRef.current !== null) {
      formik.setFieldValue('state', '')
      setStates([])
      cityFetchRef.current = null
    }
  }, [formik.values.city, loadStates, formik])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Card
      sx={{
        p: 6,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <Box component='form' onSubmit={formik.handleSubmit}>
        <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4 }}>
          New Budget Request Form
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label='budget request tabs'
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label='General Details'
            sx={{ minWidth: 0, padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'medium' }}
          />
          <Tab
            label='Organization Details'
            sx={{ minWidth: 0, padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'medium' }}
          />
          <Tab
            label='Location Details'
            sx={{ minWidth: 0, padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'medium' }}
          />
        </Tabs>

        {/* General Details */}
        {selectedTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Job Title'
                  name='jobTitle'
                  value={formik.values.jobTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                  helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                  fullWidth
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='No. of Openings'
                  name='openings'
                  type='number'
                  value={formik.values.openings}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.openings && Boolean(formik.errors.openings)}
                  helperText={formik.touched.openings && formik.errors.openings}
                  fullWidth
                  variant='outlined'
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Job Role</InputLabel>
                  <Select
                    name='jobRole'
                    value={formik.values.jobRole}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('hiringManager', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Job Role'
                    error={formik.touched.jobRole && Boolean(formik.errors.jobRole)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                  >
                    {jobRoles.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                    <div ref={observerRefs.jobRole} style={{ height: '1px' }} />
                  </Select>
                  {formik.touched.jobRole && formik.errors.jobRole && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.jobRole}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Hiring Manager</InputLabel>
                  <Select
                    name='hiringManager'
                    value={formik.values.hiringManager}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Hiring Manager'
                    error={formik.touched.hiringManager && Boolean(formik.errors.hiringManager)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.jobRole}
                  >
                    {employees.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.firstName} {option.middleName} {option.lastName}
                      </MenuItem>
                    ))}
                    <div ref={observerRefs.employee} style={{ height: '1px' }} />
                  </Select>
                  {formik.touched.hiringManager && formik.errors.hiringManager && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.hiringManager}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label='Experience (Min)'
                    name='experienceMin'
                    type='number'
                    value={formik.values.experienceMin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.experienceMin && Boolean(formik.errors.experienceMin)}
                    helperText={formik.touched.experienceMin && formik.errors.experienceMin}
                    fullWidth
                    variant='outlined'
                    inputProps={{ min: 0 }}
                  />
                  <TextField
                    label='Experience (Max)'
                    name='experienceMax'
                    type='number'
                    value={formik.values.experienceMax}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.experienceMax && Boolean(formik.errors.experienceMax)}
                    helperText={formik.touched.experienceMax && formik.errors.experienceMax}
                    fullWidth
                    variant='outlined'
                    inputProps={{ min: 0 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Campus / Lateral</InputLabel>
                  <Select
                    name='campusOrLateral'
                    value={formik.values.campusOrLateral}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Campus / Lateral'
                    error={formik.touched.campusOrLateral && Boolean(formik.errors.campusOrLateral)}
                  >
                    {staticDropdownOptions.campusOrLateral.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.campusOrLateral && formik.errors.campusOrLateral && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.campusOrLateral}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Start Date'
                  name='startingDate'
                  type='date'
                  value={formik.values.startingDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startingDate && Boolean(formik.errors.startingDate)}
                  helperText={formik.touched.startingDate && formik.errors.startingDate}
                  fullWidth
                  variant='outlined'
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Closing Date'
                  name='closingDate'
                  type='date'
                  value={formik.values.closingDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.closingDate && Boolean(formik.errors.closingDate)}
                  helperText={formik.touched.closingDate && formik.errors.closingDate}
                  fullWidth
                  variant='outlined'
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Organization Details */}
        {selectedTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Company</InputLabel>
                  <Select
                    name='company'
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Company'
                    error={formik.touched.company && Boolean(formik.errors.company)}
                  >
                    {staticDropdownOptions.company.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.company && formik.errors.company && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.company}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Business Unit</InputLabel>
                  <Select
                    name='businessUnit'
                    value={formik.values.businessUnit}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('employeeCategory', '')
                      formik.setFieldValue('department', '')
                      formik.setFieldValue('designation', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Business Unit'
                    error={formik.touched.businessUnit && Boolean(formik.errors.businessUnit)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                  >
                    {businessUnits.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.businessUnit && formik.errors.businessUnit && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.businessUnit}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Employee Category</InputLabel>
                  <Select
                    name='employeeCategory'
                    value={formik.values.employeeCategory}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('department', '')
                      formik.setFieldValue('designation', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Employee Category'
                    error={formik.touched.employeeCategory && Boolean(formik.errors.employeeCategory)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.businessUnit}
                  >
                    {employeeCategories.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.employeeCategory && formik.errors.employeeCategory && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.employeeCategory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    name='employeeType'
                    value={formik.values.employeeType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Employee Type'
                    error={formik.touched.employeeType && Boolean(formik.errors.employeeType)}
                  >
                    {staticDropdownOptions.employeeType.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.employeeType && formik.errors.employeeType && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.employeeType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name='department'
                    value={formik.values.department}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('designation', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Department'
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.employeeCategory}
                  >
                    {departments.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.department && formik.errors.department && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.department}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    name='designation'
                    value={formik.values.designation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Designation'
                    error={formik.touched.designation && Boolean(formik.errors.designation)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.department}
                  >
                    {designations.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.designation && formik.errors.designation && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.designation}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    name='grade'
                    value={formik.values.grade}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Grade'
                    error={formik.touched.grade && Boolean(formik.errors.grade)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                  >
                    {grades.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.grade && formik.errors.grade && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.grade}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Location Details */}
        {selectedTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Territory</InputLabel>
                  <Select
                    name='territory'
                    value={formik.values.territory}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('zone', '')
                      formik.setFieldValue('region', '')
                      formik.setFieldValue('area', '')
                      formik.setFieldValue('cluster', '')
                      formik.setFieldValue('branchName', '')
                      formik.setFieldValue('branchCode', '')
                      formik.setFieldValue('city', '')
                      formik.setFieldValue('state', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Territory'
                    error={formik.touched.territory && Boolean(formik.errors.territory)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                  >
                    {territories.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.territory && formik.errors.territory && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.territory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Zone</InputLabel>
                  <Select
                    name='zone'
                    value={formik.values.zone}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('region', '')
                      formik.setFieldValue('area', '')
                      formik.setFieldValue('cluster', '')
                      formik.setFieldValue('branchName', '')
                      formik.setFieldValue('branchCode', '')
                      formik.setFieldValue('city', '')
                      formik.setFieldValue('state', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Zone'
                    error={formik.touched.zone && Boolean(formik.errors.zone)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.territory}
                  >
                    {zones.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.zone && formik.errors.zone && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.zone}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Region</InputLabel>
                  <Select
                    name='region'
                    value={formik.values.region}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('area', '')
                      formik.setFieldValue('cluster', '')
                      formik.setFieldValue('branchName', '')
                      formik.setFieldValue('branchCode', '')
                      formik.setFieldValue('city', '')
                      formik.setFieldValue('state', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Region'
                    error={formik.touched.region && Boolean(formik.errors.region)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.zone}
                  >
                    {regions.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.region && formik.errors.region && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.region}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Area</InputLabel>
                  <Select
                    name='area'
                    value={formik.values.area}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('cluster', '')
                      formik.setFieldValue('branchName', '')
                      formik.setFieldValue('branchCode', '')
                      formik.setFieldValue('city', '')
                      formik.setFieldValue('state', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Area'
                    error={formik.touched.area && Boolean(formik.errors.area)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.region}
                  >
                    {areas.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.area && formik.errors.area && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.area}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Cluster</InputLabel>
                  <Select
                    name='cluster'
                    value={formik.values.cluster}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('branchName', '')
                      formik.setFieldValue('branchCode', '')
                      formik.setFieldValue('city', '')
                      formik.setFieldValue('state', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Cluster'
                    error={formik.touched.cluster && Boolean(formik.errors.cluster)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.area}
                  >
                    {clusters.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.cluster && formik.errors.cluster && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.cluster}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Branch Name</InputLabel>
                  <Select
                    name='branchName'
                    value={formik.values.branchName}
                    onChange={event => {
                      const selectedBranch = branches.find(branch => branch.id === event.target.value)

                      formik.setFieldValue('branchName', event.target.value)
                      formik.setFieldValue('branchCode', selectedBranch?.branchCode || '')
                      formik.setFieldValue('city', '')
                      formik.setFieldValue('state', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Branch Name'
                    error={formik.touched.branchName && Boolean(formik.errors.branchName)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.cluster}
                  >
                    {branches.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.branchName && formik.errors.branchName && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.branchName}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Branch Code'
                  name='branchCode'
                  value={formik.values.branchCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.branchCode && Boolean(formik.errors.branchCode)}
                  helperText={formik.touched.branchCode && formik.errors.branchCode}
                  fullWidth
                  variant='outlined'
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>City</InputLabel>
                  <Select
                    name='city'
                    value={formik.values.city}
                    onChange={event => {
                      formik.handleChange(event)
                      formik.setFieldValue('state', '')
                    }}
                    onBlur={formik.handleBlur}
                    label='City'
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.branchName}
                  >
                    {cities.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.city && formik.errors.city && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.city}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>State</InputLabel>
                  <Select
                    name='state'
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='State'
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                    disabled={!formik.values.city}
                  >
                    {states.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.state && formik.errors.state && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.state}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Approval Category</InputLabel>
                  <Select
                    name='approvalCategory'
                    value={formik.values.approvalCategory}
                    onChange={event => {
                      const selectedCategory = approvalCategories.find(category => category.id === event.target.value)

                      formik.setFieldValue('approvalCategory', event.target.value)
                      formik.setFieldValue('approvalCategoryId', selectedCategory?.id || '')
                    }}
                    onBlur={formik.handleBlur}
                    label='Approval Category'
                    error={formik.touched.approvalCategory && Boolean(formik.errors.approvalCategory)}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300, overflowY: 'auto' }
                      }
                    }}
                  >
                    {approvalCategories.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.approvalCategory && formik.errors.approvalCategory && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.approvalCategory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Form Actions */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <DynamicButton
            type='button'
            variant='contained'
            sx={{ bgcolor: 'grey.500', color: 'white', '&:hover': { bgcolor: 'grey.700' } }}
            onClick={() => router.push('/budget-management')}
          >
            Cancel
          </DynamicButton>
          <DynamicButton
            type='submit'
            variant='contained'
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            disabled={createBudgetIncreaseRequestLoading}
          >
            {createBudgetIncreaseRequestLoading ? <CircularProgress size={24} /> : 'Submit'}
          </DynamicButton>
        </Box>
      </Box>
    </Card>
  )
}

export default ManualRequestGeneratedForm
