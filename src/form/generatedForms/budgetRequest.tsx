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
  employeeType: ['Full-Time', 'Part-Time'],
  company: ['Tech Corp', 'Innovate Inc']
}

// Validation Schema
const validationSchema = Yup.object({
  jobTitle: Yup.string().required('Job Title is required'),
  jobRole: Yup.string().required('Job Role is required'),
  openings: Yup.number().required('No. of Openings is required').min(1, 'No. of Openings must be at least 1'),
  experienceMin: Yup.number()
    .required('Minimum Experience is required')
    .min(0, 'Minimum Experience must be at least 0'),
  experienceMax: Yup.number()
    .required('Maximum Experience is required')
    .min(Yup.ref('experienceMin'), 'Maximum Experience must be greater than or equal to Minimum Experience'),
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

  // Pagination States
  const [limit, setLimit] = useState({
    jobRole: 10,
    employee: 10,
    businessUnit: 10,
    employeeCategory: 10,
    department: 10,
    designation: 10,
    grade: 10,
    territory: 10,
    zone: 10,
    region: 10,
    area: 10,
    cluster: 10,
    branch: 10,
    city: 10,
    state: 10,
    approvalCategory: 10
  })

  const [hasMore, setHasMore] = useState({
    jobRole: true,
    employee: true,
    businessUnit: true,
    employeeCategory: true,
    department: true,
    designation: true,
    grade: true,
    territory: true,
    zone: true,
    region: true,
    area: true,
    cluster: true,
    branch: true,
    city: true,
    state: true,
    approvalCategory: true
  })

  // Refs to track fetched values for dependent APIs
  const employeeFetchRef = useRef<string | null>(null)
  const businessUnitFetchRef = useRef<string | null>(null)
  const employeeCategoryRef = useRef<string | null>(null)

  // Observer Refs
  const observerRefs = {
    jobRole: useRef<HTMLDivElement | null>(null),
    employee: useRef<HTMLDivElement | null>(null),
    businessUnit: useRef<HTMLDivElement | null>(null),
    employeeCategory: useRef<HTMLDivElement | null>(null),
    department: useRef<HTMLDivElement | null>(null),
    designation: useRef<HTMLDivElement | null>(null),
    grade: useRef<HTMLDivElement | null>(null),
    territory: useRef<HTMLDivElement | null>(null),
    zone: useRef<HTMLDivElement | null>(null),
    region: useRef<HTMLDivElement | null>(null),
    area: useRef<HTMLDivElement | null>(null),
    cluster: useRef<HTMLDivElement | null>(null),
    branch: useRef<HTMLDivElement | null>(null),
    city: useRef<HTMLDivElement | null>(null),
    state: useRef<HTMLDivElement | null>(null),
    approvalCategory: useRef<HTMLDivElement | null>(null)
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
          ...values,
          approvalCategoryId: values.approvalCategoryId,
          raisedById: values.raisedById,
          branchCode: values.branchCode
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
    dispatch(fetchEmployee({ page: 1, limit: limit.employee, search: 'hr' }))
      .unwrap()
      .then(data => {
        setEmployees(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, employee: prev.employee + 10 }))
        setHasMore(prev => ({ ...prev, employee: data.data.length === limit.employee }))
      })
  }, [dispatch, limit.employee, hasMore.employee, formik.values.jobRole])

  const loadBusinessUnits = useCallback(() => {
    if (!hasMore.businessUnit) return
    dispatch(fetchBusinessUnit({ page: 1, limit: limit.businessUnit }))
      .unwrap()
      .then(data => {
        setBusinessUnits(prev => [...prev, ...(data?.data || [])])
        setLimit(prev => ({ ...prev, businessUnit: prev.businessUnit + 10 }))
        setHasMore(prev => ({ ...prev, businessUnit: data.data.length === limit.businessUnit }))
      })
  }, [dispatch, limit.businessUnit, hasMore.businessUnit])

  const loadEmployeeCategories = useCallback(() => {
    if (!hasMore.employeeCategory || !formik.values.businessUnit) return
    dispatch(
      fetchEmployeeCategoryType({ page: 1, limit: limit.employeeCategory, businessUnitId: formik.values.businessUnit })
    )
      .unwrap()
      .then(data => {
        setEmployeeCategories(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, employeeCategory: prev.employeeCategory + 10 }))
        setHasMore(prev => ({ ...prev, employeeCategory: data.data.length === limit.employeeCategory }))
      })
  }, [dispatch, limit.employeeCategory, hasMore.employeeCategory, formik.values.businessUnit])

  const loadDepartments = useCallback(() => {
    if (!hasMore.department || !formik.values.employeeCategory) return
    dispatch(fetchDepartment({ page: 1, limit: limit.department, employeeCategoryId: formik.values.employeeCategory }))
      .unwrap()
      .then(data => {
        setDepartments(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, department: prev.department + 10 }))
        setHasMore(prev => ({ ...prev, department: data.data.length === limit.department }))
      })
  }, [dispatch, limit.department, hasMore.department, formik.values.employeeCategory])

  const loadDesignations = useCallback(() => {
    if (!hasMore.designation || !formik.values.department) return
    dispatch(fetchDesignation({ page: 1, limit: limit.designation, departmentId: formik.values.department }))
      .unwrap()
      .then(data => {
        setDesignations(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, designation: prev.designation + 10 }))
        setHasMore(prev => ({ ...prev, designation: data.data.length === limit.designation }))
      })
  }, [dispatch, limit.designation, hasMore.designation, formik.values.department])

  const loadGrades = useCallback(() => {
    if (!hasMore.grade) return
    dispatch(fetchGrade({ page: 1, limit: limit.grade }))
      .unwrap()
      .then(data => {
        setGrades(prev => [...prev, ...(data?.data || [])])
        setLimit(prev => ({ ...prev, grade: prev.grade + 10 }))
        setHasMore(prev => ({ ...prev, grade: data.data.length === limit.grade }))
      })
  }, [dispatch, limit.grade, hasMore.grade])

  const loadTerritories = useCallback(() => {
    if (!hasMore.territory) return
    dispatch(fetchTerritory({ page: 1, limit: limit.territory }))
      .unwrap()
      .then(data => {
        setTerritories(prev => [...prev, ...(data?.data || [])])
        setLimit(prev => ({ ...prev, territory: prev.territory + 10 }))
        setHasMore(prev => ({ ...prev, territory: data.data.length === limit.territory }))
      })
  }, [dispatch, limit.territory, hasMore.territory])

  const loadZones = useCallback(() => {
    if (!hasMore.zone || !formik.values.territory) return
    dispatch(fetchZone({ page: 1, limit: limit.zone, territoryId: formik.values.territory }))
      .unwrap()
      .then(data => {
        setZones(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, zone: prev.zone + 10 }))
        setHasMore(prev => ({ ...prev, zone: data.data.length === limit.zone }))
      })
  }, [dispatch, limit.zone, hasMore.zone, formik.values.territory])

  const loadRegions = useCallback(() => {
    if (!hasMore.region || !formik.values.zone) return
    dispatch(fetchRegion({ page: 1, limit: limit.region, zoneId: formik.values.zone }))
      .unwrap()
      .then(data => {
        setRegions(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, region: prev.region + 10 }))
        setHasMore(prev => ({ ...prev, region: data.data.length === limit.region }))
      })
  }, [dispatch, limit.region, hasMore.region, formik.values.zone])

  const loadAreas = useCallback(() => {
    if (!hasMore.area || !formik.values.region) return
    dispatch(fetchArea({ page: 1, limit: limit.area, regionId: formik.values.region }))
      .unwrap()
      .then(data => {
        setAreas(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, area: prev.area + 10 }))
        setHasMore(prev => ({ ...prev, area: data.data.length === limit.area }))
      })
  }, [dispatch, limit.area, hasMore.area, formik.values.region])

  const loadClusters = useCallback(() => {
    if (!hasMore.cluster || !formik.values.area) return
    dispatch(fetchCluster({ page: 1, limit: limit.cluster, areaId: formik.values.area }))
      .unwrap()
      .then(data => {
        setClusters(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, cluster: prev.cluster + 10 }))
        setHasMore(prev => ({ ...prev, cluster: data.data.length === limit.cluster }))
      })
  }, [dispatch, limit.cluster, hasMore.cluster, formik.values.area])

  const loadBranches = useCallback(() => {
    if (!hasMore.branch || !formik.values.cluster) return
    dispatch(fetchBranch({ page: 1, limit: limit.branch, clusterId: formik.values.cluster }))
      .unwrap()
      .then(data => {
        setBranches(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, branch: prev.branch + 10 }))
        setHasMore(prev => ({ ...prev, branch: data.data.length === limit.branch }))
      })
  }, [dispatch, limit.branch, hasMore.branch, formik.values.cluster])

  const loadCities = useCallback(() => {
    if (!hasMore.city || !formik.values.branchName) return
    dispatch(fetchCity({ page: 1, limit: limit.city }))
      .unwrap()
      .then(data => {
        setCities(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, city: prev.city + 10 }))
        setHasMore(prev => ({ ...prev, city: data.data.length === limit.city }))
      })
  }, [dispatch, limit.city, hasMore.city, formik.values.branchName])

  const loadStates = useCallback(() => {
    if (!hasMore.state || !formik.values.city) return
    dispatch(fetchState({ page: 1, limit: limit.state }))
      .unwrap()
      .then(data => {
        setStates(prev => [...prev, ...(data.data || [])])
        setLimit(prev => ({ ...prev, state: prev.state + 10 }))
        setHasMore(prev => ({ ...prev, state: data.data.length === limit.state }))
      })
  }, [dispatch, limit.state, hasMore.state, formik.values.city])

  const loadApprovalCategories = useCallback(() => {
    if (!hasMore.approvalCategory) return
    dispatch(fetchApprovalCategories({ page: 1, limit: limit.approvalCategory }))
      .unwrap()
      .then(data => {
        setApprovalCategories(prev => [...prev, ...(data?.data || [])])
        setLimit(prev => ({ ...prev, approvalCategory: prev.approvalCategory + 10 }))
        setHasMore(prev => ({ ...prev, approvalCategory: data.data.length === limit.approvalCategory }))
      })
  }, [dispatch, limit.approvalCategory, hasMore.approvalCategory])

  // Initial API calls on page load (only once)
  useEffect(() => {
    loadJobRoles()
    loadBusinessUnits()
    loadGrades()
    loadTerritories()
    loadApprovalCategories()
  }, []) // Empty dependency array ensures this runs only once

  // Intersection Observer for lazy loading
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
              case 'businessUnit':
                loadBusinessUnits()
                break
              case 'employeeCategory':
                loadEmployeeCategories()
                break
              case 'department':
                loadDepartments()
                break
              case 'designation':
                loadDesignations()
                break
              case 'grade':
                loadGrades()
                break
              case 'territory':
                loadTerritories()
                break
              case 'zone':
                loadZones()
                break
              case 'region':
                loadRegions()
                break
              case 'area':
                loadAreas()
                break
              case 'cluster':
                loadClusters()
                break
              case 'branch':
                loadBranches()
                break
              case 'city':
                loadCities()
                break
              case 'state':
                loadStates()
                break
              case 'approvalCategory':
                loadApprovalCategories()
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
  }, [
    loadJobRoles,
    loadMoreEmployees,
    loadBusinessUnits,
    loadEmployeeCategories,
    loadDepartments,
    loadDesignations,
    loadGrades,
    loadTerritories,
    loadZones,
    loadRegions,
    loadAreas,
    loadClusters,
    loadBranches,
    loadCities,
    loadStates,
    loadApprovalCategories
  ])

  // Handle jobRole change to fetch employees (single call)
  useEffect(() => {
    if (formik.values.jobRole && formik.values.jobRole !== employeeFetchRef.current) {
      setEmployees([])
      setLimit(prev => ({ ...prev, employee: 10 }))
      setHasMore(prev => ({ ...prev, employee: true }))
      employeeFetchRef.current = formik.values.jobRole
      loadMoreEmployees()
    } else if (!formik.values.jobRole) {
      setEmployees([])
      formik.setFieldValue('hiringManager', '')
      employeeFetchRef.current = null
    }
  }, [formik.values.jobRole, loadMoreEmployees, formik.setFieldValue])

  // Handle businessUnit change to fetch employee categories (single call)
  useEffect(() => {
    if (formik.values.businessUnit && formik.values.businessUnit !== businessUnitFetchRef.current) {
      setEmployeeCategories([])
      setLimit(prev => ({ ...prev, employeeCategory: 10 }))
      setHasMore(prev => ({ ...prev, employeeCategory: true }))
      businessUnitFetchRef.current = formik.values.businessUnit
      loadEmployeeCategories()
    } else if (!formik.values.businessUnit) {
      setEmployeeCategories([])
      formik.setFieldValue('employeeCategory', '')
      formik.setFieldValue('department', '')
      formik.setFieldValue('designation', '')
      businessUnitFetchRef.current = null
    }
  }, [formik.values.businessUnit, loadEmployeeCategories, formik.setFieldValue])

  // Handle employeeCategory change to fetch departments
  useEffect(() => {
    if (formik.values.employeeCategory && formik.values.employeeCategory !== employeeCategoryRef.current) {
      setDepartments([])
      setLimit(prev => ({ ...prev, department: 10 }))
      setHasMore(prev => ({ ...prev, department: true }))
      employeeCategoryRef.current = formik.values.employeeCategory
      loadDepartments()
    } else if (!formik.values.employeeCategory) {
      setDepartments([])
      formik.setFieldValue('department', '')
      formik.setFieldValue('designation', '')
      employeeCategoryRef.current = null
    }
  }, [formik.values.employeeCategory, loadDepartments, formik.setFieldValue])

  // Handle department change to fetch designations
  useEffect(() => {
    if (formik.values.department) {
      setDesignations([])
      setLimit(prev => ({ ...prev, designation: 10 }))
      setHasMore(prev => ({ ...prev, designation: true }))
      loadDesignations()
    } else {
      setDesignations([])
      formik.setFieldValue('designation', '')
    }
  }, [formik.values.department, loadDesignations, formik.setFieldValue])

  // Handle territory change to fetch zones
  useEffect(() => {
    if (formik.values.territory) {
      setZones([])
      setLimit(prev => ({ ...prev, zone: 10 }))
      setHasMore(prev => ({ ...prev, zone: true }))
      loadZones()
    } else {
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
      setLimit(prev => ({
        ...prev,
        zone: 10,
        region: 10,
        area: 10,
        cluster: 10,
        branch: 10,
        city: 10,
        state: 10
      }))
      setHasMore(prev => ({
        ...prev,
        zone: true,
        region: true,
        area: true,
        cluster: true,
        branch: true,
        city: true,
        state: true
      }))
    }
  }, [formik.values.territory, loadZones, formik.setFieldValue])

  // Handle zone change to fetch regions
  useEffect(() => {
    if (formik.values.zone) {
      setRegions([])
      setLimit(prev => ({ ...prev, region: 10 }))
      setHasMore(prev => ({ ...prev, region: true }))
      loadRegions()
    } else {
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
      setLimit(prev => ({
        ...prev,
        region: 10,
        area: 10,
        cluster: 10,
        branch: 10,
        city: 10,
        state: 10
      }))
      setHasMore(prev => ({
        ...prev,
        region: true,
        area: true,
        cluster: true,
        branch: true,
        city: true,
        state: true
      }))
    }
  }, [formik.values.zone, loadRegions, formik.setFieldValue])

  // Handle region change to fetch areas
  useEffect(() => {
    if (formik.values.region) {
      setAreas([])
      setLimit(prev => ({ ...prev, area: 10 }))
      setHasMore(prev => ({ ...prev, area: true }))
      loadAreas()
    } else {
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
      setLimit(prev => ({
        ...prev,
        area: 10,
        cluster: 10,
        branch: 10,
        city: 10,
        state: 10
      }))
      setHasMore(prev => ({
        ...prev,
        area: true,
        cluster: true,
        branch: true,
        city: true,
        state: true
      }))
    }
  }, [formik.values.region, loadAreas, formik.setFieldValue])

  // Handle area change to fetch clusters
  useEffect(() => {
    if (formik.values.area) {
      setClusters([])
      setLimit(prev => ({ ...prev, cluster: 10 }))
      setHasMore(prev => ({ ...prev, cluster: true }))
      loadClusters()
    } else {
      formik.setFieldValue('cluster', '')
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('branchCode', '')
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setClusters([])
      setBranches([])
      setCities([])
      setStates([])
      setLimit(prev => ({
        ...prev,
        cluster: 10,
        branch: 10,
        city: 10,
        state: 10
      }))
      setHasMore(prev => ({
        ...prev,
        cluster: true,
        branch: true,
        city: true,
        state: true
      }))
    }
  }, [formik.values.area, loadClusters, formik.setFieldValue])

  // Handle cluster change to fetch branches
  useEffect(() => {
    if (formik.values.cluster) {
      setBranches([])
      setLimit(prev => ({ ...prev, branch: 10 }))
      setHasMore(prev => ({ ...prev, branch: true }))
      loadBranches()
    } else {
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('branchCode', '')
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setBranches([])
      setCities([])
      setStates([])
      setLimit(prev => ({
        ...prev,
        branch: 10,
        city: 10,
        state: 10
      }))
      setHasMore(prev => ({
        ...prev,
        branch: true,
        city: true,
        state: true
      }))
    }
  }, [formik.values.cluster, loadBranches, formik.setFieldValue])

  // Handle branchName change to fetch cities
  useEffect(() => {
    if (formik.values.branchName) {
      setCities([])
      setLimit(prev => ({ ...prev, city: 10 }))
      setHasMore(prev => ({ ...prev, city: true }))
      loadCities()
    } else {
      formik.setFieldValue('city', '')
      formik.setFieldValue('state', '')
      setCities([])
      setStates([])
      setLimit(prev => ({
        ...prev,
        city: 10,
        state: 10
      }))
      setHasMore(prev => ({
        ...prev,
        city: true,
        state: true
      }))
    }
  }, [formik.values.branchName, loadCities, formik.setFieldValue])

  // Handle city change to fetch states
  useEffect(() => {
    if (formik.values.city) {
      setStates([])
      setLimit(prev => ({ ...prev, state: 10 }))
      setHasMore(prev => ({ ...prev, state: true }))
      loadStates()
    } else {
      formik.setFieldValue('state', '')
      setStates([])
      setLimit(prev => ({ ...prev, state: 10 }))
      setHasMore(prev => ({ ...prev, state: true }))
    }
  }, [formik.values.city, loadStates, formik.setFieldValue])

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
                    <div ref={observerRefs.businessUnit} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.employeeCategory} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.department} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.designation} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.grade} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.territory} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.zone} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.region} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.area} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.cluster} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.branch} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.city} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.state} style={{ height: '1px' }} />
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
                    <div ref={observerRefs.approvalCategory} style={{ height: '1px' }} />
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
