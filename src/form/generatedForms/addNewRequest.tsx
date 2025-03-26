'use client'

// React Imports
import { useCallback, useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Form Imports
import { useFormik } from 'formik'
import * as Yup from 'yup'

// MUI Imports
import { Autocomplete, TextField, FormControl, CircularProgress, Box, Typography, FormLabel, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

// Component Imports
import DynamicButton from '@/components/Button/dynamicButton'

// Redux Imports
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchBusinessUnits,
  fetchEmployeeCategoryType,
  fetchDepartment,
  fetchDesignation,
  fetchGrade,
  fetchBand,
  fetchZone,
  fetchRegion,
  fetchArea,
  fetchBranch,
  fetchState,
  fetchDistrict,
  submitRecruitmentRequest
} from '@/redux/RecruitmentResignationSlice'

const initialOptionsData = [
  { id: 'businessUnit', label: 'Business Unit', options: [] },
  { id: 'employeeCategoryType', label: 'Employee Category Type', options: [] },
  { id: 'department', label: 'Department', options: [] },
  { id: 'designation', label: 'Designation', options: [] },
  { id: 'grade', label: 'Grade', options: [] },
  { id: 'band', label: 'Band', options: [] },
  { id: 'zone', label: 'Zone', options: [] },
  { id: 'region', label: 'Region', options: [] },
  { id: 'area', label: 'Area', options: [] },
  { id: 'branch', label: 'Branch', options: [] },
  { id: 'state', label: 'State', options: [] },
  { id: 'district', label: 'District', options: [] }
]

const validationSchema = Yup.object(
  initialOptionsData.reduce(
    (schema, field) => {
      schema[field.id] = Yup.string().required(`${field.label} is required`)

      return schema
    },
    {} as { [key: string]: Yup.StringSchema }
  )
)

interface Option {
  id: number
  name: string
}

const ManualRequestGeneratedForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [optionsData, setOptionsData] = useState(initialOptionsData)

  const {
    fetchBusinessUnitsLoading,
    fetchBusinessUnitsData,
    fetchEmployeeCategoryTypeLoading,
    fetchEmployeeCategoryTypeData,
    fetchDepartmentLoading,
    fetchDepartmentData,
    fetchDesignationLoading,
    fetchDesignationData,
    fetchGradeLoading,
    fetchGradeData,
    fetchBandLoading,
    fetchBandData,
    fetchZoneLoading,
    fetchZoneData,
    fetchRegionLoading,
    fetchRegionData,
    fetchAreaLoading,
    fetchAreaData,
    fetchBranchLoading,
    fetchBranchData,
    fetchStateLoading,
    fetchStateData,
    fetchDistrictLoading,
    fetchDistrictData,
    submitRecruitmentRequestLoading,
    submitRecruitmentRequestFailure,
    submitRecruitmentRequestFailureMessage
  } = useAppSelector(state => state.recruitmentResignationReducer)

  const requestFormik = useFormik({
    initialValues: initialOptionsData.reduce(
      (values, field) => {
        values[field.id] = ''

        return values
      },
      {} as { [key: string]: string }
    ),
    validationSchema,
    onSubmit: values => {
      const payload = {
        districtName: values.district,
        stateName: values.state,
        zoneName: values.zone,
        regionName: values.region,
        areaName: values.area,
        branchesName: values.branch,
        businessUnitName: values.businessUnit,
        employeeCategoryType: values.employeeCategoryType,
        departmentName: values.department,
        designationName: values.designation,
        gradeName: values.grade,
        bandName: values.band
      }

      dispatch(submitRecruitmentRequest(payload)).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
          router.push('/recruitment-management/overview')
        }
      })
    }
  })

  const fetchOptions = useCallback(
    async (fieldId: string, parentId?: number, page: number = 1) => {
      try {
        const requestBody = {
          page,
          limit: 7,
          ...(parentId !== undefined && { parentId }) // Include parentId if provided
        }

        let response

        switch (fieldId.toLowerCase()) {
          case 'businessunit':
            response = await dispatch(fetchBusinessUnits(requestBody)).unwrap()
            break
          case 'employeecategorytype':
            response = await dispatch(fetchEmployeeCategoryType(requestBody)).unwrap()
            break
          case 'department':
            response = await dispatch(fetchDepartment(requestBody)).unwrap()
            break
          case 'designation':
            response = await dispatch(fetchDesignation(requestBody)).unwrap()
            break
          case 'grade':
            response = await dispatch(fetchGrade(requestBody)).unwrap()
            break
          case 'band':
            response = await dispatch(fetchBand(requestBody)).unwrap()
            break
          case 'zone':
            response = await dispatch(fetchZone(requestBody)).unwrap()
            break
          case 'region':
            response = await dispatch(fetchRegion(requestBody)).unwrap()
            break
          case 'area':
            response = await dispatch(fetchArea(requestBody)).unwrap()
            break
          case 'branch':
            response = await dispatch(fetchBranch(requestBody)).unwrap()
            break
          case 'state':
            response = await dispatch(fetchState(requestBody)).unwrap()
            break
          case 'district':
            response = await dispatch(fetchDistrict(requestBody)).unwrap()
            break
          default:
            console.error(`No API defined for ${fieldId}`)

            return
        }

        updateOptionsData(fieldId.toLowerCase(), response)
      } catch (error) {
        console.error(`Error fetching options for ${fieldId}:`, error)
      }
    },
    [dispatch]
  )

  const handleEmployeeCategoryChange = async (fieldId: string, value: string) => {
    requestFormik.setFieldValue(fieldId, value)

    const selectedOption = optionsData
      .find(cat => cat.id === fieldId)
      ?.options.find((opt: Option) => opt.name === value)

    if (selectedOption) {
      const nextField = getNextField(fieldId)

      if (nextField) {
        await fetchOptions(nextField, selectedOption.id)
      }
    }
  }

  const getNextField = (currentField: string): string | undefined => {
    const fieldOrder = [
      'businessUnit',
      'employeeCategoryType',
      'department',
      'designation',
      'grade',
      'band',
      'zone',
      'region',
      'area',
      'branch',
      'state',
      'district'
    ]

    const currentIndex = fieldOrder.indexOf(currentField)

    return currentIndex < fieldOrder.length - 1 ? fieldOrder[currentIndex + 1] : undefined
  }

  const updateOptionsData = (fieldId: string, newOptions: Option[]) => {
    setOptionsData(prevOptions =>
      prevOptions.map(option => (option.id === fieldId ? { ...option, options: newOptions } : option))
    )
  }

  useEffect(() => {
    fetchOptions('businessUnit') // Initial fetch
  }, [fetchOptions])

  useEffect(() => {
    if (fetchBusinessUnitsData.length > 0) updateOptionsData('businessUnit', fetchBusinessUnitsData)
    if (fetchEmployeeCategoryTypeData.length > 0)
      updateOptionsData('employeeCategoryType', fetchEmployeeCategoryTypeData)
    if (fetchDepartmentData.length > 0) updateOptionsData('department', fetchDepartmentData)
    if (fetchDesignationData.length > 0) updateOptionsData('designation', fetchDesignationData)
    if (fetchGradeData.length > 0) updateOptionsData('grade', fetchGradeData)
    if (fetchBandData.length > 0) updateOptionsData('band', fetchBandData)
    if (fetchZoneData.length > 0) updateOptionsData('zone', fetchZoneData)
    if (fetchRegionData.length > 0) updateOptionsData('region', fetchRegionData)
    if (fetchAreaData.length > 0) updateOptionsData('area', fetchAreaData)
    if (fetchBranchData.length > 0) updateOptionsData('branch', fetchBranchData)
    if (fetchStateData.length > 0) updateOptionsData('state', fetchStateData)
    if (fetchDistrictData.length > 0) updateOptionsData('district', fetchDistrictData)
  }, [
    fetchBusinessUnitsData,
    fetchEmployeeCategoryTypeData,
    fetchDepartmentData,
    fetchDesignationData,
    fetchGradeData,
    fetchBandData,
    fetchZoneData,
    fetchRegionData,
    fetchAreaData,
    fetchBranchData,
    fetchStateData,
    fetchDistrictData
  ])

  const StyledAutocomplete = styled(Autocomplete)({
    '& .MuiAutocomplete-paper': {
      position: 'absolute',
      maxHeight: '200px',
      overflowY: 'auto',
      marginTop: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    '& .MuiAutocomplete-listbox': {
      padding: '8px 0'
    },
    '& .MuiAutocomplete-loading': {
      padding: '8px 0',
      textAlign: 'center',
      position: 'sticky',
      bottom: 0,
      backgroundColor: 'white',
      borderTop: '1px solid rgba(0,0,0,0.1)'
    }
  })

  const renderAutocomplete = (
    field: { id: string; label: string; options: Option[] },
    handleChange: (fieldId: string, value: string) => void
  ) => {
    const isLoading =
      (field.id === 'businessUnit' && fetchBusinessUnitsLoading) ||
      (field.id === 'employeeCategoryType' && fetchEmployeeCategoryTypeLoading) ||
      (field.id === 'department' && fetchDepartmentLoading) ||
      (field.id === 'designation' && fetchDesignationLoading) ||
      (field.id === 'grade' && fetchGradeLoading) ||
      (field.id === 'band' && fetchBandLoading) ||
      (field.id === 'zone' && fetchZoneLoading) ||
      (field.id === 'region' && fetchRegionLoading) ||
      (field.id === 'area' && fetchAreaLoading) ||
      (field.id === 'branch' && fetchBranchLoading) ||
      (field.id === 'state' && fetchStateLoading) ||
      (field.id === 'district' && fetchDistrictLoading)

    return (
      <FormControl fullWidth margin='normal' key={field.id}>
        <FormLabel htmlFor={field.id} sx={{ fontSize: '0.875rem', fontWeight: 'medium', color: 'text.secondary' }}>
          {field.label} *
        </FormLabel>
        <StyledAutocomplete
          id={field.id}
          options={field.options}
          getOptionLabel={(option: Option) => option.name}
          value={
            field.options.find((option: Option) => option.name === requestFormik.values[field.id]) ||
            (null as Option | null)
          }
          disableClearable
          onChange={(_, value) => handleChange(field.id, value ? (value as Option).name : '')}
          loading={isLoading}
          loadingText={
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <CircularProgress size={20} />
            </Box>
          }
          renderInput={params => (
            <TextField
              {...params}
              error={requestFormik.touched[field.id] && Boolean(requestFormik.errors[field.id])}
              helperText={requestFormik.touched[field.id] && requestFormik.errors[field.id]}
            />
          )}
        />
      </FormControl>
    )
  }

  return (
    <Box
      component='form'
      onSubmit={requestFormik.handleSubmit}
      sx={{
        p: 6,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 1
      }}
    >
      <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4 }}>
        Recruitment Request Form
      </Typography>

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 4,
          mb: 6
        }}
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'text.primary', mb: 2 }}>
          Employee Category Details
        </Typography>
        <Grid container spacing={4}>
          {optionsData.map(field => (
            <Grid item xs={12} sm={6} key={field.id}>
              {renderAutocomplete(field, handleEmployeeCategoryChange)}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <DynamicButton
          type='button'
          variant='contained'
          sx={{ bgcolor: 'grey.500', color: 'white', '&:hover': { bgcolor: 'grey.700' } }}
          onClick={() => router.push('/recruitment-management')}
        >
          Cancel
        </DynamicButton>
        <DynamicButton
          type='submit'
          variant='contained'
          sx={{ bgcolor: 'blue.500', color: 'white', '&:hover': { bgcolor: 'blue.700' } }}
          disabled={submitRecruitmentRequestLoading}
        >
          {submitRecruitmentRequestLoading ? 'Submitting...' : 'Submit'}
        </DynamicButton>
      </Box>

      {submitRecruitmentRequestFailure && (
        <Typography sx={{ color: 'error.main', mt: 2 }}>{submitRecruitmentRequestFailureMessage}</Typography>
      )}
    </Box>
  )
}

export default ManualRequestGeneratedForm
