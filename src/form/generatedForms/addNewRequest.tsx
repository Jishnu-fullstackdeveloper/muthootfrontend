'use client'
import React, { useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Autocomplete, TextField, FormControl } from '@mui/material'
import DynamicButton from '@/components/Button/dynamicButton'
import { styled } from '@mui/material/styles'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchRecruitMentRequestOptions, submitRecruitmentRequest } from '@/redux/RecruitmentResignationSlice'
import { useRouter } from 'next/navigation'

const initialOptionsData = {
  employeeCategoryDetails: [
    { id: 'department', label: 'Department', options: ['IT', 'HR', 'Finance', 'Operations'] },
    {
      id: 'empCategoryType',
      label: 'Employee Category Type',
      options: ['Full-Time', 'Part-Time', 'Contractor', 'Intern']
    },
    {
      id: 'designation',
      label: 'Designation',
      options: ['Software Engineer', 'Project Manager', 'UI/UX Designer', 'Data Scientist']
    },
    { id: 'grade', label: 'Grade', options: ['G1', 'G2', 'G3', 'G4'] }
  ],
  locationCategoryDetails: [
    { id: 'company', label: 'Company', options: ['C1', 'C2', 'C3', 'C4'] },
    { id: 'businessUnit', label: 'Business Unit', options: ['BU1', 'BU2', 'BU3', 'BU4'] },
    { id: 'territory', label: 'Territory', options: ['T1', 'T2', 'T3', 'T4'] },
    { id: 'zone', label: 'Zone', options: ['Z1', 'Z2', 'Z3', 'Z4'] },
    { id: 'region', label: 'Region', options: ['R1', 'R2', 'R3', 'R4'] },
    { id: 'area', label: 'Area', options: ['A1', 'A2', 'A3', 'A4'] },
    { id: 'branch', label: 'Branch', options: ['BR1', 'BR2', 'BR3', 'BR4'] }
  ]
}

const validationSchema = Yup.object(
  Object.values(initialOptionsData)
    .flat()
    .reduce(
      (schema, field) => {
        schema[field.id] = Yup.string().required(`${field.label} is required`)
        return schema
      },
      {} as { [key: string]: Yup.StringSchema }
    )
)

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiAutocomplete-paper': {
    maxHeight: 150, // Set maximum height for dropdown
    overflowY: 'auto' // Enable scrollbar
  }
})

interface Option {
  id: number
  name: string
}

interface FieldOption {
  id: string
  label: string
  options: Option[]
}

interface OptionsData {
  employeeCategoryDetails: FieldOption[]
  locationCategoryDetails: FieldOption[]
}

const ManualRequestGeneratedForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const [optionsData, setOptionsData] = React.useState<OptionsData>({
    employeeCategoryDetails: [
      { id: 'department', label: 'Department', options: [] },
      { id: 'empCategoryType', label: 'Employee Category Type', options: [] },
      { id: 'designation', label: 'Designation', options: [] },
      { id: 'grade', label: 'Grade', options: [] }
    ],
    locationCategoryDetails: [
      { id: 'company', label: 'Company', options: [] },
      { id: 'businessUnit', label: 'Business Unit', options: [] },
      { id: 'territory', label: 'Territory', options: [] },
      { id: 'zone', label: 'Zone', options: [] },
      { id: 'region', label: 'Region', options: [] },
      { id: 'area', label: 'Area', options: [] },
      { id: 'branch', label: 'Branches', options: [] }
    ]
  })
  const [currentField, setCurrentField] = React.useState<string>('')
  const router = useRouter()

  const [apiResponseData, setApiResponseData] = React.useState<any>({})
  // const { manualRequestLoading, manualRequestSuccess, manualRequestError, manualRequestErrorMessage } = useAppSelector(
  //   (state: any) => state.manualRecruitmentRequest
  // )

  const {
    fetchRecruitmentRequestOptionsLoading,
    fetchRecruitmentRequestOptionsSuccess,
    fetchRecruitmentRequestOptionsData,
    fetchRecruitmentRequestOptionsFailure,
    fetchRecruitmentRequestOptionsFailureMessage
  } = useAppSelector(state => state.recruitmentResignationReducer)

  const requestFormik = useFormik({
    initialValues: Object.values(optionsData)
      .flat()
      .reduce(
        (values, field) => {
          values[field.id] = ''
          return values
        },
        {} as { [key: string]: string }
      ),
    validationSchema,
    onSubmit: values => {
      console.log('values', values)
      onSubmit(values)
    }
  })

  useAppSelector(state => state.recruitmentResignationReducer)
  const {
    submitRecruitmentRequestLoading,
    submitRecruitmentRequestSuccess,
    submitRecruitmentRequestFailure,
    submitRecruitmentRequestFailureMessage
  } = useAppSelector((state: any) => state.recruitmentResignationReducer)

  // Function to fetch dropdown options
  const fetchOptions = async (id: number, name: string) => {
    try {
      console.log('Fetching options for:', name, 'with id:', id) // Debug log
      setCurrentField(name)
      const requestBody = {
        id: id,
        name: name
      }
      await dispatch(fetchRecruitMentRequestOptions(requestBody)).unwrap()
    } catch (error) {
      console.error('Error fetching options:', error)
    }
  }

  // const safeGetData = (source: any): any[] => (source?.data && Array.isArray(source.data) ? source.data : [])

  // const apiOptionsData = useMemo(() => {
  //   const data = safeGetData(fetchRecruitmentRequestOptionsData)
  //   return data
  // }, [fetchRecruitmentRequestOptionsData])

  // // Function to safely get data from API response
  // const getOptionsFromApiData = (data: any, fieldName: string): string[] => {
  //   try {
  //     if (!data || !data[fieldName] || !Array.isArray(data[fieldName])) {
  //       console.warn(`No valid data for ${fieldName}`)
  //       return []
  //     }
  //     return data[fieldName].map((item: any) => item.name)
  //   } catch (error) {
  //     console.error(`Error processing ${fieldName} data:`, error)
  //     return []
  //   }
  // }

  const handleSubmit = async (values: any) => {
    try {
      // Get the selected options from your form state
      const selectedGrade = optionsData.employeeCategoryDetails
        .find(cat => cat.id === 'grade')
        ?.options.find((grade: Option) => grade.name === values.grade)

      const selectedBranch = optionsData.locationCategoryDetails
        .find(cat => cat.id === 'branch')
        ?.options.find((branch: Option) => branch.name === values.branch)

      const selectedEmpCategoryType = optionsData.employeeCategoryDetails
        .find(cat => cat.id === 'empCategoryType')
        ?.options.find((type: Option) => type.name === values.empCategoryType)

      if (!selectedGrade || !selectedBranch || !selectedEmpCategoryType) {
        console.error('Required selections are missing')
        return
      }

      const requestBody = {
        gradeId: selectedGrade.id,
        branchId: selectedBranch.id,
        employeeCategoryTypeId: selectedEmpCategoryType.id
      }

      await dispatch(submitRecruitmentRequest(requestBody)).unwrap()
      router.push('/recruitment-management/overview')
      // Handle success
      if (submitRecruitmentRequestSuccess) {
        // Show success message or redirect
        console.log('Form submitted successfully')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Handle error (show error message)
    }
  }

  const onSubmit = (values: any) => {
    handleSubmit(values)
  }

  // Handle employee category changes
  const handleEmployeeCategoryChange = async (fieldId: string, value: string) => {
    console.log('Employee category change:', fieldId, value)
    requestFormik.setFieldValue(fieldId, value)

    switch (fieldId) {
      case 'department':
        const selectedDept = optionsData.employeeCategoryDetails
          .find(cat => cat.id === 'department')
          ?.options.find((dept: Option) => dept.name === value)

        if (selectedDept) {
          console.log('Selected department:', selectedDept)
          await fetchOptions(selectedDept.id, 'Designation')
        }
        break

      case 'designation':
        const selectedDesig = optionsData.employeeCategoryDetails
          .find(cat => cat.id === 'designation')
          ?.options.find((desig: Option) => desig.name === value)

        if (selectedDesig) {
          console.log('Selected designation:', selectedDesig)
          await fetchOptions(selectedDesig.id, 'Grade')
        }
        break
      case 'grade':
        const selectedGrade = optionsData.employeeCategoryDetails
          .find(cat => cat.id === 'grade')
          ?.options.find((grade: Option) => grade.name === value)

        if (selectedGrade) {
          console.log('Selected grade:', selectedGrade)
          // Start location chain with Company (using id: 0)
          await fetchOptions(0, 'Company')
        }
        break
    }
  }

  // Handle location category changes
  const handleLocationCategoryChange = async (fieldId: string, value: string) => {
    console.log('Location category change:', fieldId, value)
    requestFormik.setFieldValue(fieldId, value)

    // Define the chain of API calls
    const nextFieldMap: { [key: string]: string } = {
      grade: 'Company',
      company: 'BusinessUnit',
      businessUnit: 'Territory',
      territory: 'Zone',
      zone: 'Region',
      region: 'Area',
      area: 'Branches'
    }

    switch (fieldId) {
      case 'grade':
        // When grade is selected, start location chain with Company
        await fetchOptions(0, 'Company')
        break

      case 'company':
        const selectedCompany = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'company')
          ?.options.find((comp: Option) => comp.name === value)

        if (selectedCompany) {
          console.log('Selected company:', selectedCompany)
          await fetchOptions(selectedCompany.id, 'BusinessUnit')
        }
        break

      case 'businessUnit':
        const selectedBU = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'businessUnit')
          ?.options.find((bu: Option) => bu.name === value)

        if (selectedBU) {
          console.log('Selected business unit:', selectedBU)
          await fetchOptions(selectedBU.id, 'Territory')
        }
        break

      case 'territory':
        const selectedTerritory = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'territory')
          ?.options.find((terr: Option) => terr.name === value)

        if (selectedTerritory) {
          await fetchOptions(selectedTerritory.id, 'Zone')
        }
        break

      case 'zone':
        const selectedZone = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'zone')
          ?.options.find((zone: Option) => zone.name === value)

        if (selectedZone) {
          await fetchOptions(selectedZone.id, 'Region')
        }
        break

      case 'region':
        const selectedRegion = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'region')
          ?.options.find((reg: Option) => reg.name === value)

        if (selectedRegion) {
          await fetchOptions(selectedRegion.id, 'Area')
        }
        break

      case 'area':
        const selectedArea = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'area')
          ?.options.find((area: Option) => area.name === value)

        if (selectedArea) {
          await fetchOptions(selectedArea.id, 'Branches')
        }
        break
    }
  }

  // Transform API data and merge with existing data
  const transformApiData = (apiData: any) => {
    console.log('Transforming API data:', apiData, 'for field:', currentField)
    const newOptionsData = { ...optionsData }

    // Handle initial response (Department and EmployeeCategoryType)
    if (apiData.Department) {
      const departmentIndex = newOptionsData.employeeCategoryDetails.findIndex(item => item.id === 'department')
      if (departmentIndex !== -1) {
        newOptionsData.employeeCategoryDetails[departmentIndex].options = apiData.Department
      }
    }

    if (apiData.EmployeeCategoryType) {
      const categoryTypeIndex = newOptionsData.employeeCategoryDetails.findIndex(item => item.id === 'empCategoryType')
      if (categoryTypeIndex !== -1) {
        newOptionsData.employeeCategoryDetails[categoryTypeIndex].options = apiData.EmployeeCategoryType
      }
    }

    // Handle Designation, Grade, and Location responses
    if (apiData.success && Array.isArray(apiData.data)) {
      switch (currentField.toLowerCase()) {
        case 'designation':
          const designationIndex = newOptionsData.employeeCategoryDetails.findIndex(item => item.id === 'designation')
          if (designationIndex !== -1) {
            newOptionsData.employeeCategoryDetails[designationIndex].options = apiData.data
          }
          break

        case 'grade':
          const gradeIndex = newOptionsData.employeeCategoryDetails.findIndex(item => item.id === 'grade')
          if (gradeIndex !== -1) {
            newOptionsData.employeeCategoryDetails[gradeIndex].options = apiData.data
          }
          break

        case 'company':
          const companyIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'company')
          if (companyIndex !== -1) {
            newOptionsData.locationCategoryDetails[companyIndex].options = apiData.data
          }
          break

        case 'businessunit':
          const businessUnitIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'businessUnit')
          if (businessUnitIndex !== -1) {
            newOptionsData.locationCategoryDetails[businessUnitIndex].options = apiData.data
          }
          break

        case 'territory':
          const territoryIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'territory')
          if (territoryIndex !== -1) {
            newOptionsData.locationCategoryDetails[territoryIndex].options = apiData.data
          }
          break

        case 'zone':
          const zoneIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'zone')
          if (zoneIndex !== -1) {
            newOptionsData.locationCategoryDetails[zoneIndex].options = apiData.data
          }
          break

        case 'region':
          const regionIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'region')
          if (regionIndex !== -1) {
            newOptionsData.locationCategoryDetails[regionIndex].options = apiData.data
          }
          break

        case 'area':
          const areaIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'area')
          if (areaIndex !== -1) {
            newOptionsData.locationCategoryDetails[areaIndex].options = apiData.data
          }
          break

        case 'branches':
          const branchIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'branch')
          if (branchIndex !== -1) {
            newOptionsData.locationCategoryDetails[branchIndex].options = apiData.data
          }
          break
      }
    }

    return newOptionsData
  }

  // Handle API response and update options
  useEffect(() => {
    if (fetchRecruitmentRequestOptionsSuccess && fetchRecruitmentRequestOptionsData) {
      try {
        // For initial load (Department and EmployeeCategoryType)
        if (fetchRecruitmentRequestOptionsData.data?.Department) {
          const updatedOptionsData = transformApiData(fetchRecruitmentRequestOptionsData.data)
          setOptionsData(updatedOptionsData)
        }
        // For Designation and Grade responses
        else if (fetchRecruitmentRequestOptionsData.success) {
          const updatedOptionsData = transformApiData(fetchRecruitmentRequestOptionsData)
          setOptionsData(updatedOptionsData)
        }
      } catch (error) {
        console.error('Error processing API response:', error)
      }
    }
  }, [fetchRecruitmentRequestOptionsSuccess, fetchRecruitmentRequestOptionsData])

  useEffect(() => {
    fetchOptions(0, 'department')
  }, [])

  // Render Autocomplete components with proper value handling
  const renderAutocomplete = (field: FieldOption, handleChange: (fieldId: string, value: string) => void) => (
    <FormControl fullWidth margin='normal' key={field.id}>
      <label htmlFor={field.id} className='block text-sm font-medium text-gray-700'>
        {field.label} *
      </label>
      <StyledAutocomplete
        id={field.id}
        options={field.options}
        getOptionLabel={(option: string | Option) => {
          if (typeof option === 'string') return option
          return option.name
        }}
        value={requestFormik.values[field.id] || null}
        disableClearable
        onChange={(_, value) => {
          const selectedValue = typeof value === 'string' ? value : (value as Option).name
          handleChange(field.id, selectedValue)
        }}
        isOptionEqualToValue={(option, value) => {
          if (typeof option === 'string' || typeof value === 'string') {
            return option === value
          }
          // Type guard to check if option and value have id property
          if (
            typeof option === 'object' &&
            option !== null &&
            'id' in option &&
            typeof value === 'object' &&
            value !== null &&
            'id' in value
          ) {
            return option.id === value.id
          }
          return false
        }}
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

  return (
    <form onSubmit={requestFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Recruitment Request Form</h1>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Employee Category Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          {optionsData.employeeCategoryDetails.map(field => renderAutocomplete(field, handleEmployeeCategoryChange))}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Location Category Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          {optionsData.locationCategoryDetails.map(field => renderAutocomplete(field, handleLocationCategoryChange))}
        </div>
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton type='button' variant='contained' className='bg-gray-500 text-white hover:bg-gray-700'>
          Cancel
        </DynamicButton>
        <DynamicButton
          type='submit'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          disabled={submitRecruitmentRequestLoading}
        >
          {submitRecruitmentRequestLoading ? 'Submitting...' : 'Submit'}
        </DynamicButton>
      </div>

      {submitRecruitmentRequestFailure && (
        <div className='text-red-500 mt-2'>Failed to submit request. Please try again.</div>
      )}
    </form>
  )
}

export default ManualRequestGeneratedForm
