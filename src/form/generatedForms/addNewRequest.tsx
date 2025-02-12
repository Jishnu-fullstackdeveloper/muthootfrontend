'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Autocomplete, TextField, FormControl, CircularProgress } from '@mui/material'
import DynamicButton from '@/components/Button/dynamicButton'
import { styled } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  submitRecruitmentRequest,
  fetchHierarchyData,
  fetchEmployeeHierarchyOptions,
  fetchCorporateHierarchyOptions
} from '@/redux/RecruitmentResignationSlice'
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
  const router = useRouter()
  const [currentField, setCurrentField] = React.useState<string>('')
  const [isHierarchyDataLoaded, setIsHierarchyDataLoaded] = React.useState(false)
  const [paginationState, setPaginationState] = useState<{ [key: string]: { page: number; hasMore: boolean } }>({})

  const [apiResponseData, setApiResponseData] = React.useState<any>({})
  // const { manualRequestLoading, manualRequestSuccess, manualRequestError, manualRequestErrorMessage } = useAppSelector(
  //   (state: any) => state.manualRecruitmentRequest
  // )

  const {
    fetchEmployeeHierarchyOptionsLoading,
    fetchEmployeeHierarchyOptionsSuccess,
    fetchEmployeeHierarchyOptionsData,
    fetchEmployeeHierarchyOptionsFailure,
    fetchEmployeeHierarchyOptionsFailureMessage,
    fetchCorporateHierarchyOptionsLoading,
    fetchCorporateHierarchyOptionsSuccess,
    fetchCorporateHierarchyOptionsData,
    fetchCorporateHierarchyOptionsFailure,
    fetchCorporateHierarchyOptionsFailureMessage
  } = useAppSelector(state => state.recruitmentResignationReducer)

  const { fetchHierarchyDataData, fetchHierarchyDataLoading } = useAppSelector(
    state => state.recruitmentResignationReducer
  )
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

  const findHierarchyId = (hierarchyData: any, name: string): number | null => {
    const employeeHierarchy = hierarchyData?.data?.employeeHierarchyData || []
    const corporateHierarchy = hierarchyData?.data?.corporateHierarchyData || []

    const foundInEmployee = employeeHierarchy.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
    const foundInCorporate = corporateHierarchy.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
    return foundInEmployee?.id || foundInCorporate?.id || null
  }

  // Function to fetch dropdown options
  const fetchOptions = async (id: number, name: string, page: number = 1) => {
    try {
      setCurrentField(name)

      if (!isHierarchyDataLoaded) {
        await dispatch(fetchHierarchyData('All')).unwrap()
      }

      const hierarchyId = findHierarchyId(fetchHierarchyDataData, name)
      if (!hierarchyId) {
        console.error(`${name} hierarchy not found`)
        return
      }

      const requestBody = {
        id,
        hierarchyId,
        page,
        limit: 7 // Increased limit for better UX
      }

      const employeeFields = ['department', 'designation', 'grade']
      const corporateFields = ['company', 'businessunit', 'territory', 'zone', 'region', 'area', 'branch']

      let response
      if (employeeFields.includes(name.toLowerCase())) {
        response = await dispatch(fetchEmployeeHierarchyOptions(requestBody)).unwrap()
      } else if (corporateFields.includes(name.toLowerCase())) {
        response = await dispatch(fetchCorporateHierarchyOptions(requestBody)).unwrap()
      }

      // Update pagination state based on response
      setPaginationState(prev => ({
        ...prev,
        [name]: {
          page,
          hasMore: response?.data?.options?.length === requestBody.limit
        }
      }))
    } catch (error) {
      console.error('Error fetching options:', error)
    }
  }

  const handleOptionScroll = async (name: string) => {
    const currentPagination = paginationState[name] || { page: 1, hasMore: true }

    if (!currentPagination.hasMore) return

    const nextPage = currentPagination.page + 1
    await fetchOptions(0, name, nextPage) // Use appropriate ID instead of 0
  }

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
    requestFormik.setFieldValue(fieldId, value)

    switch (fieldId) {
      case 'department':
        const selectedDept = optionsData.employeeCategoryDetails
          .find(cat => cat.id === 'department')
          ?.options.find((dept: Option) => dept.name === value)

        if (selectedDept) {
          await fetchOptions(selectedDept.id, 'Designation')
        }
        break

      case 'designation':
        const selectedDesig = optionsData.employeeCategoryDetails
          .find(cat => cat.id === 'designation')
          ?.options.find((desig: Option) => desig.name === value)

        if (selectedDesig) {
          await fetchOptions(selectedDesig.id, 'Grade')
        }
        break
      case 'grade':
        const selectedGrade = optionsData.employeeCategoryDetails
          .find(cat => cat.id === 'grade')
          ?.options.find((grade: Option) => grade.name === value)

        if (selectedGrade) {
          // Start location chain with Company (using id: 0)
          await fetchOptions(0, 'Company')
        }
        break
    }
  }

  // Handle location category changes
  const handleLocationCategoryChange = async (fieldId: string, value: string) => {
    requestFormik.setFieldValue(fieldId, value)

    switch (fieldId) {
      case 'company':
        const selectedCompany = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'company')
          ?.options.find((comp: Option) => comp.name === value)

        if (selectedCompany) {
          await fetchOptions(selectedCompany.id, 'businessUnit')
        }
        break

      case 'businessUnit':
        const selectedBU = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'businessUnit')
          ?.options.find((bu: Option) => bu.name === value)

        if (selectedBU) {
          await fetchOptions(selectedBU.id, 'territory')
        }
        break

      case 'territory':
        const selectedTerritory = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'territory')
          ?.options.find((terr: Option) => terr.name === value)

        if (selectedTerritory) {
          await fetchOptions(selectedTerritory.id, 'zone')
        }
        break

      case 'zone':
        const selectedZone = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'zone')
          ?.options.find((zone: Option) => zone.name === value)

        if (selectedZone) {
          await fetchOptions(selectedZone.id, 'region')
        }
        break

      case 'region':
        const selectedRegion = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'region')
          ?.options.find((reg: Option) => reg.name === value)

        if (selectedRegion) {
          await fetchOptions(selectedRegion.id, 'area')
        }
        break

      case 'area':
        const selectedArea = optionsData.locationCategoryDetails
          .find(cat => cat.id === 'area')
          ?.options.find((area: Option) => area.name === value)

        if (selectedArea) {
          await fetchOptions(selectedArea.id, 'branches')
        }
        break
    }
  }

  // Transform API data and merge with existing data
  // const transformApiData = (apiData: any) => {
  //   const newOptionsData = { ...optionsData }

  //   if (apiData?.success) {
  //     const options = apiData.data.options || []
  //     const currentPagination = paginationState[currentField] || { page: 1 }

  //     switch (currentField.toLowerCase()) {
  //       case 'department':
  //         const departmentIndex = newOptionsData.employeeCategoryDetails.findIndex(item => item.id === 'department')
  //         if (departmentIndex !== -1) {
  //           if (currentPagination.page > 1) {
  //             // Append new options for pagination
  //             newOptionsData.employeeCategoryDetails[departmentIndex].options = [
  //               ...newOptionsData.employeeCategoryDetails[departmentIndex].options,
  //               ...options
  //             ]
  //           } else {
  //             // Replace options for first page
  //             newOptionsData.employeeCategoryDetails[departmentIndex].options = options
  //           }
  //         }
  //         break

  //       case 'designation':
  //         const designationIndex = newOptionsData.employeeCategoryDetails.findIndex(item => item.id === 'designation')
  //         if (designationIndex !== -1) {
  //           newOptionsData.employeeCategoryDetails[designationIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'grade':
  //         const gradeIndex = newOptionsData.employeeCategoryDetails.findIndex(item => item.id === 'grade')
  //         if (gradeIndex !== -1) {
  //           newOptionsData.employeeCategoryDetails[gradeIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'company':
  //         const companyIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'company')
  //         if (companyIndex !== -1) {
  //           newOptionsData.locationCategoryDetails[companyIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'businessunit':
  //         const businessUnitIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'businessUnit')
  //         if (businessUnitIndex !== -1) {
  //           newOptionsData.locationCategoryDetails[businessUnitIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'territory':
  //         const territoryIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'territory')
  //         if (territoryIndex !== -1) {
  //           newOptionsData.locationCategoryDetails[territoryIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'zone':
  //         const zoneIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'zone')
  //         if (zoneIndex !== -1) {
  //           newOptionsData.locationCategoryDetails[zoneIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'region':
  //         const regionIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'region')
  //         if (regionIndex !== -1) {
  //           newOptionsData.locationCategoryDetails[regionIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'area':
  //         const areaIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'area')
  //         if (areaIndex !== -1) {
  //           newOptionsData.locationCategoryDetails[areaIndex].options = apiData.data.options
  //         }
  //         break

  //       case 'branches':
  //         const branchIndex = newOptionsData.locationCategoryDetails.findIndex(item => item.id === 'branch')
  //         if (branchIndex !== -1) {
  //           newOptionsData.locationCategoryDetails[branchIndex].options = apiData.data.options
  //         }
  //         break
  //     }
  //   }

  //   return newOptionsData
  // }

  const transformApiData = (apiData: any) => {
    const newOptionsData = { ...optionsData }

    if (apiData?.success) {
      const options = apiData.data.options || []
      const currentPagination = paginationState[currentField] || { page: 1 }

      // const updateOptions = (categoryType: 'employeeCategoryDetails' | 'locationCategoryDetails', fieldId: string) => {
      //   const index = newOptionsData[categoryType].findIndex(item => item.id === fieldId)
      //   if (index !== -1) {
      //     if (currentPagination.page > 1) {
      //       // Append new options to existing ones
      //       newOptionsData[categoryType][index].options = [...newOptionsData[categoryType][index].options, ...options]
      //     } else {
      //       // First page - replace options
      //       newOptionsData[categoryType][index].options = options
      //     }
      //   }
      // }

      const updateOptions = (categoryType: 'employeeCategoryDetails' | 'locationCategoryDetails', fieldId: string) => {
        const index = newOptionsData[categoryType].findIndex(item => item.id === fieldId)
        if (index !== -1) {
          // Append new options to existing ones regardless of the current page
          newOptionsData[categoryType][index].options = [...newOptionsData[categoryType][index].options, ...options]
        }
      }

      switch (currentField.toLowerCase()) {
        case 'department':
          updateOptions('employeeCategoryDetails', 'department')
          break
        case 'designation':
          updateOptions('employeeCategoryDetails', 'designation')
          break
        case 'grade':
          updateOptions('employeeCategoryDetails', 'grade')
          break
        case 'company':
          updateOptions('locationCategoryDetails', 'company')
          break
        case 'businessunit':
          updateOptions('locationCategoryDetails', 'businessUnit')
          break
        case 'territory':
          updateOptions('locationCategoryDetails', 'territory')
          break
        case 'zone':
          updateOptions('locationCategoryDetails', 'zone')
          break
        case 'region':
          updateOptions('locationCategoryDetails', 'region')
          break
        case 'area':
          updateOptions('locationCategoryDetails', 'area')
          break
        case 'branches':
          updateOptions('locationCategoryDetails', 'branch')
          break
      }
    }

    return newOptionsData
  }

  useEffect(() => {
    dispatch(fetchHierarchyData('All'))
  }, [dispatch])

  useEffect(() => {
    if (fetchHierarchyDataData) {
      setIsHierarchyDataLoaded(true)
    }
  }, [fetchHierarchyDataData])

  // Handle API response and update options
  useEffect(() => {
    if (
      (fetchEmployeeHierarchyOptionsSuccess && fetchEmployeeHierarchyOptionsData) ||
      (fetchCorporateHierarchyOptionsSuccess && fetchCorporateHierarchyOptionsData)
    ) {
      try {
        let apiData
        // Define which fields belong to which hierarchy
        const employeeFields = ['department', 'designation', 'grade']
        const corporateFields = ['company', 'businessunit', 'territory', 'zone', 'region', 'area', 'branches']

        // Check if current field is from employee or corporate hierarchy
        if (employeeFields.includes(currentField.toLowerCase())) {
          apiData = fetchEmployeeHierarchyOptionsData
        } else if (corporateFields.includes(currentField.toLowerCase())) {
          apiData = fetchCorporateHierarchyOptionsData
        }

        const updatedOptionsData = transformApiData(apiData)
        setOptionsData(updatedOptionsData)
      } catch (error) {
        console.error('Error processing API response:', error)
      }
    }
  }, [
    fetchEmployeeHierarchyOptionsSuccess,
    fetchEmployeeHierarchyOptionsData,
    fetchCorporateHierarchyOptionsSuccess,
    fetchCorporateHierarchyOptionsData,
    currentField
  ])

  useEffect(() => {
    if (isHierarchyDataLoaded) {
      fetchOptions(0, 'department')
    }
  }, [isHierarchyDataLoaded])

  const StyledAutocomplete = styled(Autocomplete)({
    '& .MuiAutocomplete-paper': {
      position: 'absolute',
      maxHeight: '200px', // Set maximum height for dropdown
      overflowY: 'auto', // Enable scrollbar
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

  const renderAutocomplete = (field: FieldOption, handleChange: (fieldId: string, value: string) => void) => {
    const [isOpen, setIsOpen] = useState(false)
    const pagination = paginationState[field.id] || { page: 1, hasMore: true }
    const isLoading = fetchEmployeeHierarchyOptionsLoading || fetchCorporateHierarchyOptionsLoading

    return (
      <FormControl fullWidth margin='normal' key={field.id}>
        <label htmlFor={field.id} className='block text-sm font-medium text-gray-700'>
          {field.label} *
        </label>
        <StyledAutocomplete
          id={field.id}
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={(event, reason) => {
            if (reason === 'toggleInput') {
              setIsOpen(!isOpen)
            } else if (reason === 'escape') {
              setIsOpen(false)
            }
          }}
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
            setIsOpen(false)
          }}
          ListboxProps={{
            onScroll: (event: React.UIEvent<HTMLUListElement>) => {
              const listbox = event.currentTarget
              if (
                listbox.scrollTop + listbox.clientHeight >= listbox.scrollHeight - 50 &&
                pagination.hasMore &&
                !isLoading
              ) {
                handleOptionScroll(field.id)
              }
            }
          }}
          renderOption={(props, option) => <li {...props}>{typeof option === 'string' ? option : option.name}</li>}
          loading={isLoading}
          loadingText={
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <CircularProgress size={20} />
            </div>
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
