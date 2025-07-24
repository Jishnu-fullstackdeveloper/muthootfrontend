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
import DeleteIcon from '@mui/icons-material/Delete'

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
  jd: Yup.string().required('JD is required'),
  band: Yup.string().required('Band is required'),
  notes: Yup.string(),
  locationDetails: Yup.array()
    .of(
      Yup.object().shape({
        location: Yup.string().required('Location is required'),
        count: Yup.number().required('Count is required').min(1, 'Count must be at least 1')
      })
    )
    .min(1, 'At least one location is required')
    .test('total-count', 'Total count must equal No. of Openings', function (value) {
      const { openings } = this.parent
      const totalCount = value.reduce((sum: number, item: any) => sum + (item.count || 0), 0)

      return totalCount === Number(openings) || !openings // Allow validation to pass if openings is not set
    })
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
  const [jds, setJDs] = useState<any[]>([])
  const [bands, setBands] = useState<any[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [locationType, setLocationType] = useState<string>('')
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
      jd: '',
      band: '',
      notes: '',
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
          businessUnit: values.businessUnit, // Send name instead of ID
          employeeCategory: values.employeeCategory, // Send name instead of ID
          employeeType: values.employeeType,
          grade: values.grade, // Send name instead of ID
          jd: jds.find(option => option.name === values.jd)?.id || values.jd, // Send ID for jd
          band: values.band, // Send name instead of ID
          notes: values.notes,
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

  const loadJDs = useCallback(() => {
    const jobRole = formik.values.jobRole

    if (!jobRole || jobRole === jobRoleFetchRef.current) return // Prevent redundant calls
    console.log('Fetching JDs with jobRole:', jobRole)
    dispatch(fetchJD({ page: 1, limit: 1000, search: jobRole }))
      .unwrap()
      .then(data => {
        setJDs(data?.data || [])
      })
  }, [dispatch, formik.values.jobRole])

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
    loadBands()

    // Do not call loadJDs here; it will be triggered by jobRole change
  }, [loadJobRoles, loadBusinessUnits, loadGrades, loadBands])

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

      // Fetch JD with jobRole name
      loadJDs()

      // Fetch location options with jobRole name
      dispatch(fetchJobRoleNamesByRole({ jobRole: formik.values.jobRole }))
        .unwrap()
        .then(data => {
          if (data?.type && data?.names) {
            setLocationOptions(data.names)
            setLocationType(data.type)
            formik.setFieldValue('locationDetails', [
              { location: data.type, count: 1 } // Set first location as the type
            ])
          }
        })
    } else if (!formik.values.jobRole && jobRoleFetchRef.current !== null) {
      jobRoleFetchRef.current = null
      setLocationOptions([])
      formik.setFieldValue('jd', '') // Clear JD when jobRole is cleared
      formik.setFieldValue('locationDetails', [{ location: '', count: 1 }])
      setJDs([]) // Clear JDs when jobRole is cleared
    }
  }, [formik.values.jobRole, dispatch, formik, loadJDs])

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
    const openings = parseInt(formik.values.openings) || 0
    const totalCount = locationDetails.reduce((sum, item) => sum + (item.count || 0), 0)

    if (totalCount < openings && locationDetails.length < locationOptions.length) {
      setLocationDetails([...locationDetails, { location: '', count: 1 }])
      formik.setFieldValue('locationDetails', [...locationDetails, { location: '', count: 1 }])
    }
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

  console.log('Form Values:', formik.values)

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
                  options={jobRoles.map(option => ({ label: option.name, id: option.name }))} // Use name as id
                  value={
                    jobRoles.find(option => option.name === formik.values.jobRole)
                      ? { label: formik.values.jobRole, id: formik.values.jobRole }
                      : null
                  }
                  onChange={(_, value) => {
                    console.log('Selected Job Role:', value)
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
                <TextField
                  label='JD'
                  name='jd'
                  value={formik.values.jd}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.jd && Boolean(formik.errors.jd)}
                  helperText={formik.touched.jd && formik.errors.jd}
                  fullWidth
                  variant='outlined'
                  disabled // Disabled since it's auto-populated
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
                  value={
                    staticDropdownOptions.company.includes(formik.values.company)
                      ? { label: formik.values.company, id: formik.values.company }
                      : null
                  }
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
                  options={businessUnits.map(option => ({ label: option.name, id: option.name }))} // Use name as id
                  value={
                    businessUnits.find(option => option.name === formik.values.businessUnit)
                      ? { label: formik.values.businessUnit, id: formik.values.businessUnit }
                      : null
                  }
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
                  options={employeeCategories.map(option => ({ label: option.name, id: option.name }))} // Use name as id
                  value={
                    employeeCategories.find(option => option.name === formik.values.employeeCategory)
                      ? { label: formik.values.employeeCategory, id: formik.values.employeeCategory }
                      : null
                  }
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
                  value={
                    staticDropdownOptions.employeeType.includes(formik.values.employeeType)
                      ? { label: formik.values.employeeType, id: formik.values.employeeType }
                      : null
                  }
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
                  options={grades.map(option => ({ label: option.name, id: option.name }))} // Use name as id
                  value={
                    grades.find(option => option.name === formik.values.grade)
                      ? { label: formik.values.grade, id: formik.values.grade }
                      : null
                  }
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
                  options={bands.map(option => ({ label: option.name, id: option.name }))} // Use name as id
                  value={
                    bands.find(option => option.name === formik.values.band)
                      ? { label: formik.values.band, id: formik.values.band }
                      : null
                  }
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Notes'
                  name='notes'
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                  fullWidth
                  variant='outlined'
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Location Details */}
        {selectedTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {locationDetails.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 2,
                      alignItems: 'center'
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        options={locationOptions.map(option => ({ label: option, id: option }))}
                        value={
                          locationOptions.includes(item.location) ? { label: item.location, id: item.location } : null
                        }
                        onChange={(_, value) => handleLocationChange(index, value?.id || '')}
                        onBlur={() => formik.setFieldTouched(`locationDetails[${index}].location`, true)}
                        renderInput={params => (
                          <MUITextField
                            {...params}
                            label={`${locationType} ${index + 1}`}
                            error={
                              formik.touched.locationDetails?.[index]?.location &&
                              Boolean(formik.errors.locationDetails?.[index]?.location)
                            }
                            helperText={
                              formik.touched.locationDetails?.[index]?.location &&
                              formik.errors.locationDetails?.[index]?.location
                            }
                            sx={{ flex: 1 }} // Allow it to grow
                          />
                        )}
                        fullWidth
                        disabled={!formik.values.jobRole}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                          formik.touched.locationDetails?.[index]?.count &&
                          formik.errors.locationDetails?.[index]?.count
                        }
                        inputProps={{ min: 1 }}
                        sx={{ flex: 1, width: '100%' }} // Limit width
                        disabled={!formik.values.jobRole}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={1} lg={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        color='error'
                        onClick={() => handleRemoveLocation(index)}
                        disabled={locationDetails.length <= 1} // Prevent removing the last location
                      >
                        <DeleteIcon />
                      </IconButton>
                      {index === locationDetails.length - 1 && (
                        <IconButton
                          color='primary'
                          onClick={handleAddLocation}
                          disabled={
                            !formik.values.openings ||
                            locationDetails.length >= locationOptions.length ||
                            locationDetails.reduce((sum, item) => sum + (item.count || 0), 0) >=
                              parseInt(formik.values.openings) ||
                            !formik.values.jobRole
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Box>
                ))}
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
