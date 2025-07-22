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
  Typography,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  IconButton,
  Autocomplete,
  TextField as MUITextField
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

// Redux Imports
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchJobRole,
  fetchBusinessUnit,
  fetchEmployeeCategoryType,
  fetchGrade,
  fetchApprovalCategories,
  createBudgetIncreaseRequest,
  fetchJD,
  fetchBand,
  fetchJobRoleNamesByRole
} from '@/redux/BudgetManagement/BudgetManagementSlice'

// Utility Imports
import { getUserId } from '@/utils/functions'

// Component Imports
import DynamicButton from '@/components/Button/dynamicButton'

// Static Dropdown Options
const staticDropdownOptions = {
  employeeType: ['Fulltime', 'Parttime'],
  company: ['Muthoot Fincorp Ltd.', 'Muthoot Papachan']
}

// Validation Schema
const validationSchema = Yup.object({
  openings: Yup.number()
    .required('No. of Openings is required')
    .min(1, 'No. of Openings must be a positive number (at least 1)'),
  startingDate: Yup.date().required('Start Date is required').nullable(),
  closingDate: Yup.date()
    .required('Closing Date is required')
    .nullable()
    .min(Yup.ref('startingDate'), 'Closing Date must be after Start Date'),
  company: Yup.string().required('Company is required'),
  businessUnit: Yup.string().required('Business Unit is required'),
  employeeCategory: Yup.string().required('Employee Category is required'),
  employeeType: Yup.string().required('Employee Type is required'),
  grade: Yup.string().required('Grade is required'),
  approvalCategory: Yup.string().required('Approval Category is required'),
  approvalCategoryId: Yup.string().required('Approval Category ID is required'),
  raisedById: Yup.string().required('Raised By ID is required'),
  jd: Yup.string().required('JD is required'),
  band: Yup.string().required('Band is required'),
  locationDetails: Yup.array()
    .of(
      Yup.object().shape({
        location: Yup.string().required('Location is required'),
        count: Yup.number()
          .required('Count is required')
          .min(1, 'Count must be at least 1')
          .test('max-count', 'Total count cannot exceed openings', function (value) {
            const { openings } = this.parent
            const totalCount = this.from[1].value.reduce((sum: number, item: any) => sum + (item.count || 0), 0)

            return totalCount <= openings
          })
      })
    )
    .min(1, 'At least one location is required')
})

const ManualRequestGeneratedForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)

  // Redux State
  const { createBudgetIncreaseRequestLoading, fetchJDData, fetchBandData, fetchJobRoleNamesByRoleData } =
    useAppSelector(state => state.budgetManagementReducer) as any

  // Form Data States
  const [jobRoles, setJobRoles] = useState<any[]>([])
  const [businessUnits, setBusinessUnits] = useState<any[]>([])
  const [employeeCategories, setEmployeeCategories] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [approvalCategories, setApprovalCategories] = useState<any[]>([])
  const [jds, setJDs] = useState<any[]>([])
  const [bands, setBands] = useState<any[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [locationDetails, setLocationDetails] = useState([{ location: '', count: 1 }])

  // Pagination States
  const [limit, setLimit] = useState({
    jobRole: 10
  })

  const [hasMore, setHasMore] = useState({
    jobRole: true
  })

  // Refs
  const jobRoleFetchRef = useRef<string | null>(null)
  const businessUnitFetchRef = useRef<string | null>(null)

  const observerRefs = {
    jobRole: useRef<HTMLDivElement | null>(null)
  }

  // Fetch raisedById
  const raisedById = getUserId()

  // Formik setup
  const formik = useFormik({
    initialValues: {
      jobRole: '',
      openings: '',
      startingDate: '',
      closingDate: '',
      company: '',
      businessUnit: '',
      employeeCategory: '',
      employeeType: '',
      grade: '',
      approvalCategory: '',
      approvalCategoryId: '',
      raisedById: raisedById || '',
      jd: '',
      band: '',
      locationDetails: [{ location: '', count: 1 }]
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const payload = {
          openings: values.openings,
          startingDate: values.startingDate,
          closingDate: values.closingDate,
          company: values.company,
          businessUnit: businessUnits.find(option => option.id === values.businessUnit)?.name || values.businessUnit,
          employeeCategory:
            employeeCategories.find(option => option.id === values.employeeCategory)?.name || values.employeeCategory,
          employeeType: values.employeeType,
          grade: grades.find(option => option.id === values.grade)?.name || values.grade,
          approvalCategory:
            approvalCategories.find(option => option.id === values.approvalCategory)?.name || values.approvalCategory,
          approvalCategoryId: values.approvalCategoryId,
          raisedById: values.raisedById,
          jd: jds.find(option => option.id === values.jd)?.name || values.jd,
          band: bands.find(option => option.id === values.band)?.name || values.band,
          campusOrLateral: 'Lateral', // Hardcoded as per requirement
          locationDetails: values.locationDetails.map(item => ({
            location: item.location,
            count: item.count
          }))
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

  const loadBusinessUnits = useCallback(() => {
    dispatch(fetchBusinessUnit({ page: 1, limit: 1000 }))
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

  const loadGrades = useCallback(() => {
    dispatch(fetchGrade({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setGrades(data?.data || [])
      })
  }, [dispatch])

  const loadApprovalCategories = useCallback(() => {
    dispatch(fetchApprovalCategories({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setApprovalCategories(data?.data || [])
      })
  }, [dispatch])

  const loadJDs = useCallback(() => {
    dispatch(fetchJD({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setJDs(data?.data || [])
      })
  }, [dispatch])

  const loadBands = useCallback(() => {
    dispatch(fetchBand({ page: 1, limit: 1000 }))
      .unwrap()
      .then(data => {
        setBands(data?.data || [])
      })
  }, [dispatch])

  // Initial API calls
  useEffect(() => {
    loadJobRoles()
    loadBusinessUnits()
    loadGrades()
    loadApprovalCategories()
    loadJDs()
    loadBands()
  }, [loadJobRoles, loadBusinessUnits, loadGrades, loadApprovalCategories, loadJDs, loadBands])

  // Intersection Observer
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
  }, [loadJobRoles])

  // Handle jobRole change
  useEffect(() => {
    if (formik.values.jobRole && formik.values.jobRole !== jobRoleFetchRef.current) {
      setLimit(prev => ({ ...prev, jobRole: 10 }))
      setHasMore(prev => ({ ...prev, jobRole: true }))
      jobRoleFetchRef.current = formik.values.jobRole
      dispatch(fetchJobRoleNamesByRole({ jobRole: formik.values.jobRole })) // Sending jobRole name instead of id
        .unwrap()
        .then(data => {
          if (data?.type && data?.names) {
            setLocationOptions(data.names)
            formik.setFieldValue('locationDetails', [{ location: '', count: 1 }])
          }
        })
    } else if (!formik.values.jobRole && jobRoleFetchRef.current !== null) {
      jobRoleFetchRef.current = null
      setLocationOptions([])
      formik.setFieldValue('locationDetails', [{ location: '', count: 1 }])
    }
  }, [formik.values.jobRole, dispatch, formik])

  // Handle businessUnit change
  useEffect(() => {
    if (formik.values.businessUnit && formik.values.businessUnit !== businessUnitFetchRef.current) {
      setEmployeeCategories([])
      businessUnitFetchRef.current = formik.values.businessUnit
      loadEmployeeCategories()
    } else if (!formik.values.businessUnit && businessUnitFetchRef.current !== null) {
      setEmployeeCategories([])
      formik.setFieldValue('employeeCategory', '')
      businessUnitFetchRef.current = null
    }
  }, [formik.values.businessUnit, loadEmployeeCategories, formik])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const handleAddLocation = () => {
    setLocationDetails([...locationDetails, { location: '', count: 1 }])
    formik.setFieldValue('locationDetails', [...locationDetails, { location: '', count: 1 }])
  }

  const handleRemoveLocation = (index: number) => {
    const newLocationDetails = locationDetails.filter((_, i) => i !== index)

    setLocationDetails(newLocationDetails)
    formik.setFieldValue('locationDetails', newLocationDetails)
  }

  const handleLocationChange = (index: number, value: string) => {
    const newLocationDetails = [...locationDetails]

    newLocationDetails[index].location = value
    setLocationDetails(newLocationDetails)
    formik.setFieldValue('locationDetails', newLocationDetails)
  }

  const handleCountChange = (index: number, value: number) => {
    const newLocationDetails = [...locationDetails]

    newLocationDetails[index].count = value
    setLocationDetails(newLocationDetails)
    formik.setFieldValue('locationDetails', newLocationDetails)
  }

  return (
    <Card
      sx={{
        p: 6,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': { boxShadow: 6 }
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
                <Autocomplete
                  options={jobRoles.map(option => ({ label: option.name, id: option.id }))}
                  value={jobRoles.find(option => option.id === formik.values.jobRole) || null}
                  onChange={(_, value) => {
                    formik.setFieldValue('jobRole', value?.id || '')
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Job Role'
                      error={formik.touched.jobRole && Boolean(formik.errors.jobRole)}
                      helperText={formik.touched.jobRole && formik.errors.jobRole}
                    />
                  )}
                  fullWidth
                />
                <div ref={observerRefs.jobRole} style={{ height: '1px' }} />
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
                <Autocomplete
                  options={jds.map(option => ({ label: option.name, id: option.id }))}
                  value={jds.find(option => option.id === formik.values.jd) || null}
                  onChange={(_, value) => formik.setFieldValue('jd', value?.id || '')}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='JD'
                      error={formik.touched.jd && Boolean(formik.errors.jd)}
                      helperText={formik.touched.jd && formik.errors.jd}
                    />
                  )}
                  fullWidth
                />
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
                <Autocomplete
                  options={staticDropdownOptions.company.map(option => ({ label: option, id: option }))}
                  value={{ label: formik.values.company, id: formik.values.company } || null}
                  onChange={(_, value) => formik.setFieldValue('company', value?.id || '')}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Company'
                      error={formik.touched.company && Boolean(formik.errors.company)}
                      helperText={formik.touched.company && formik.errors.company}
                    />
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={businessUnits.map(option => ({ label: option.name, id: option.id }))}
                  value={businessUnits.find(option => option.id === formik.values.businessUnit) || null}
                  onChange={(_, value) => {
                    formik.setFieldValue('businessUnit', value?.id || '')
                    formik.setFieldValue('employeeCategory', '')
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Business Unit'
                      error={formik.touched.businessUnit && Boolean(formik.errors.businessUnit)}
                      helperText={formik.touched.businessUnit && formik.errors.businessUnit}
                    />
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={employeeCategories.map(option => ({ label: option.name, id: option.id }))}
                  value={employeeCategories.find(option => option.id === formik.values.employeeCategory) || null}
                  onChange={(_, value) => formik.setFieldValue('employeeCategory', value?.id || '')}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.businessUnit}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Employee Category'
                      error={formik.touched.employeeCategory && Boolean(formik.errors.employeeCategory)}
                      helperText={formik.touched.employeeCategory && formik.errors.employeeCategory}
                    />
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={staticDropdownOptions.employeeType.map(option => ({ label: option, id: option }))}
                  value={{ label: formik.values.employeeType, id: formik.values.employeeType } || null}
                  onChange={(_, value) => formik.setFieldValue('employeeType', value?.id || '')}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Employee Type'
                      error={formik.touched.employeeType && Boolean(formik.errors.employeeType)}
                      helperText={formik.touched.employeeType && formik.errors.employeeType}
                    />
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={grades.map(option => ({ label: option.name, id: option.id }))}
                  value={grades.find(option => option.id === formik.values.grade) || null}
                  onChange={(_, value) => formik.setFieldValue('grade', value?.id || '')}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Grade'
                      error={formik.touched.grade && Boolean(formik.errors.grade)}
                      helperText={formik.touched.grade && formik.errors.grade}
                    />
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={bands.map(option => ({ label: option.name, id: option.id }))}
                  value={bands.find(option => option.id === formik.values.band) || null}
                  onChange={(_, value) => formik.setFieldValue('band', value?.id || '')}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Band'
                      error={formik.touched.band && Boolean(formik.errors.band)}
                      helperText={formik.touched.band && formik.errors.band}
                    />
                  )}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Location Details */}
        {selectedTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {locationDetails.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <Autocomplete
                      options={locationOptions.map(option => ({ label: option, id: option }))}
                      value={{ label: item.location, id: item.location } || null}
                      onChange={(_, value) => handleLocationChange(index, value?.id || '')}
                      onBlur={() => formik.setFieldTouched(`locationDetails[${index}].location`, true)}
                      renderInput={params => (
                        <MUITextField
                          {...params}
                          label={`Location ${index + 1}`}
                          error={
                            formik.touched.locationDetails?.[index]?.location &&
                            Boolean(formik.errors.locationDetails?.[index]?.location)
                          }
                          helperText={
                            formik.touched.locationDetails?.[index]?.location &&
                            formik.errors.locationDetails?.[index]?.location
                          }
                        />
                      )}
                      fullWidth
                      disabled={!formik.values.jobRole}
                    />
                    <TextField
                      label='Count'
                      type='number'
                      value={item.count}
                      onChange={e => handleCountChange(index, parseInt(e.target.value) || 1)}
                      onBlur={() => formik.setFieldTouched(`locationDetails[${index}].count`, true)}
                      error={
                        formik.touched.locationDetails?.[index]?.count &&
                        Boolean(formik.errors.locationDetails?.[index]?.count)
                      }
                      helperText={
                        formik.touched.locationDetails?.[index]?.count && formik.errors.locationDetails?.[index]?.count
                      }
                      inputProps={{ min: 1 }}
                      fullWidth
                      disabled={!formik.values.jobRole}
                    />
                    {index === locationDetails.length - 1 ? (
                      <IconButton
                        color='primary'
                        onClick={handleAddLocation}
                        disabled={locationDetails.length >= locationOptions.length || !formik.values.jobRole}
                      >
                        <AddIcon />
                      </IconButton>
                    ) : null}
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={approvalCategories.map(option => ({ label: option.name, id: option.id }))}
                  value={approvalCategories.find(option => option.id === formik.values.approvalCategory) || null}
                  onChange={(_, value) => {
                    const selectedCategory = approvalCategories.find(category => category.id === value?.id)

                    formik.setFieldValue('approvalCategory', value?.id || '')
                    formik.setFieldValue('approvalCategoryId', selectedCategory?.id || '')
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={params => (
                    <MUITextField
                      {...params}
                      label='Approval Category'
                      error={formik.touched.approvalCategory && Boolean(formik.errors.approvalCategory)}
                      helperText={formik.touched.approvalCategory && formik.errors.approvalCategory}
                    />
                  )}
                  fullWidth
                />
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
