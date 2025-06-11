'use client'
import React, { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  FormControl,
  TextField,
  Autocomplete,
  IconButton,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

// Import the ConfirmModal component
import { toast, ToastContainer } from 'react-toastify'

import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog' // Adjust the import path based on your file structure

import 'react-toastify/dist/ReactToastify.css'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  createNewApprovalMatrix,
  updateApprovalMatrix,
  fetchApprovalCategories,
  fetchApprovalCategoryById,
  updateApprovalCategory,
  deleteApprovalMatrix,
  fetchDesignations,
  fetchLevels // Import the new thunk
} from '@/redux/approvalMatrixSlice'
import type { ApprovalMatrixFormValues, Section, LevelOption } from '@/types/approvalMatrix' // Import types

// Update the validation schema to conditionally validate based on approverType
const validationSchema = (approverType: string | null) =>
  Yup.object({
    approvalCategory: Yup.object()
      .shape({
        id: Yup.string().required('Invalid option selected'),
        name: Yup.string().required('Invalid option selected')
      })
      .nullable()
      .required('Approval Category is required'),
    numberOfLevels: Yup.number()
      .required('Number of Levels is required')
      .integer('Number of Levels must be an integer')
      .min(1, 'Number of Levels must be at least 1')
      .max(10, 'Number of Levels cannot exceed 10'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters long'),
    sections: Yup.array()
      .of(
        Yup.object().shape({
          // Conditionally require designationName or level based on approverType
          designationName:
            approverType === 'Designation'
              ? Yup.object()
                  .shape({
                    id: Yup.string().required('Invalid option selected'),
                    name: Yup.string().required('Invalid option selected')
                  })
                  .nullable()
                  .required('Approval For is required')
              : Yup.mixed().nullable().notRequired(),
          level:
            approverType === 'Level'
              ? Yup.object()
                  .shape({
                    id: Yup.string().required('Invalid option selected'),
                    name: Yup.string().required('Invalid option selected')
                  })
                  .nullable()
                  .required('Level is required')
              : Yup.mixed().nullable().notRequired()
        })
      )
      .min(1, 'At least one section is required')
  })

const AddNewApprovalMatrixGenerated: React.FC = () => {
  const [sectionsVisible, setSectionsVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [approvalCategoryId, setApprovalCategoryId] = useState<string | null>(null) // Store the created category ID
  const [approverType, setApproverType] = useState<string | null>(null) // State to store approverType
  const [approvalCategoryLimit, setApprovalCategoryLimit] = useState(10) // Initial limit for approval categories
  const [designationLimit, setDesignationLimit] = useState(10) // Initial limit for designations
  const [approvalCategoryLoading, setApprovalCategoryLoading] = useState(false) // Loading state for approval categories
  const [designationLoading, setDesignationLoading] = useState(false) // Loading state for designations
  const [levelLoading, setLevelLoading] = useState(false) // Loading state for levels
  const searchParams = useSearchParams()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const isUpdateMode = Boolean(searchParams.get('id'))

  const { designations, approvalCategories, levels } = useAppSelector(state => state.approvalMatrixReducer) // Removed grades from selector

  // Debug: Log approvalCategories to check if data is fetched
  useEffect(() => {
    console.log('approvalCategories:', approvalCategories)
  }, [approvalCategories])

  // Fetch levels when approverType changes to "Level"
  useEffect(() => {
    if (approverType === 'Level' && levels.length === 0) {
      setLevelLoading(true)
      dispatch(fetchLevels())
        .then(() => setLevelLoading(false))
        .catch(() => setLevelLoading(false))
    }
  }, [approverType, dispatch, levels.length])

  const ApprovalMatrixFormik = useFormik<ApprovalMatrixFormValues>({
    initialValues: {
      id: '',
      approvalCategory: null,
      numberOfLevels: 1,
      description: '',

      sections: [] as Section[],
      draggingIndex: null as number | null
    },
    validationSchema: validationSchema(approverType),

    onSubmit: async values => {
      // Check for duplicate designation or level
      const seenDesignationsOrLevels = new Set<string>()
      let hasDuplicates = false

      for (let i = 0; i < values.sections.length; i++) {
        const section = values.sections[i]

        const designationOrLevelId =
          approverType === 'Level' ? section.level?.id || '' : section.designationName?.id || ''

        if (seenDesignationsOrLevels.has(designationOrLevelId)) {
          hasDuplicates = true
          break
        }

        seenDesignationsOrLevels.add(designationOrLevelId)
      }

      if (hasDuplicates) {
        toast.error('The same designation/level are selected in the previous level', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })

        return // Prevent form submission and stay on the same page
      }

      // Retrieve approvalCategoryId from searchParams in edit mode
      const categoryIdFromUrl = searchParams.get('approvalCategoryId') || approvalCategoryId || ''

      // Prepare the approval matrix data for submission
      const approvalMatrix = values.sections.map((section, index) => ({
        approvalCategoryId: categoryIdFromUrl,
        approver: approverType === 'Level' ? section.level?.name || '' : section.designationName?.name || '', // Use level name if approverType is "Level"
        level: index + 1
      }))

      if (isUpdateMode) {
        try {
          // Update the approval category first, including approverType
          await dispatch(
            updateApprovalCategory({
              id: categoryIdFromUrl,
              name: values.approvalCategory?.name || '',
              approverType: approverType || '', // Pass the approverType
              description: values.description
            })
          ).unwrap()
          console.log('Approval Category updated successfully')

          // Get existing matrix IDs for the approval category
          const existingMatrixIds = searchParams.get('id')?.split(',') || []

          // Update or create matrices for current levels
          const updatedMatrixIds = await Promise.all(
            approvalMatrix.map(async (matrix, index) => {
              if (index < existingMatrixIds.length) {
                // Update existing matrix
                const response = await dispatch(
                  updateApprovalMatrix({
                    id: existingMatrixIds[index],
                    approvalMatrix: {
                      approvalCategoryId: matrix.approvalCategoryId,
                      approver: matrix.approver,
                      level: matrix.level
                    }
                  })
                ).unwrap()

                response

                return existingMatrixIds[index]
              } else {
                // Create new matrix for additional levels
                const response = await dispatch(createNewApprovalMatrix({ approvalMatrix: [matrix] })).unwrap()

                return response[0]?.id || '' // Assume API returns the new matrix ID
              }
            })
          )

          updatedMatrixIds

          // Delete matrices for levels that were removed
          const matricesToDelete = existingMatrixIds.slice(values.sections.length)

          await Promise.all(matricesToDelete.map(id => dispatch(deleteApprovalMatrix(id)).unwrap()))

          console.log('Approval Matrix updated successfully')
          toast.success('Approval Matrix updated successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
        } catch (error) {
          console.error('Error updating approval category or matrix:', error)
          toast.error('Failed to update approval matrix. Please try again.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })

          return // Stay on the same page on error
        }
      } else {
        try {
          const response = await dispatch(createNewApprovalMatrix({ approvalMatrix })).unwrap()

          console.log('Approval Matrices created successfully:', response)
          toast.success(response.message || 'Approval Matrix created successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
        } catch (error) {
          console.error(error.message, 'Error creating approval matrices:')
          toast.error(error.message || 'Failed to create approval matrix. Please try again.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })

          return // Stay on the same page on error
        }
      }

      console.log('Approval Matrix Data to API:', approvalMatrix)
      ApprovalMatrixFormik.resetForm()
      setApprovalCategoryId(null) // Reset category ID after submission
      setSectionsVisible(false) // Hide sections after submission
      setApproverType(null) // Reset approverType after submission

      router.back() // Route back to the listing page
    }
  })

  // Scroll handler for Approval Category Autocomplete
  const handleScrollApprovalCategories = (event: any) => {
    const listboxNode = event.currentTarget

    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10) {
      if (!approvalCategoryLoading) {
        setApprovalCategoryLoading(true)
        setApprovalCategoryLimit(prev => prev + 10)
        const params = { page: 1, limit: approvalCategoryLimit + 10 }

        dispatch(fetchApprovalCategories(params))
          .then(() => setApprovalCategoryLoading(false))
          .catch(() => setApprovalCategoryLoading(false))
      }
    }
  }

  // Scroll handler for Designation Autocomplete
  const handleScrollDesignations = (event: any) => {
    const listboxNode = event.currentTarget

    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10) {
      if (!designationLoading) {
        setDesignationLoading(true)
        setDesignationLimit(prev => prev + 10)
        const params = { limit: designationLimit + 10 }

        dispatch(fetchDesignations(params))
          .then(() => setDesignationLoading(false))
          .catch(() => setDesignationLoading(false))
      }
    }
  }

  // Removed Scroll handler for Grade Autocomplete

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchOptions = async (_id: number, _p0: string) => {
    try {
      const tableId = searchParams.get('id') || ''
      const approvalCategory = searchParams.get('approvalCategory') || ''
      const numberOfLevels = searchParams.get('numberOfLevels') || '1'
      const description = searchParams.get('description') || ''
      const designationName = searchParams.get('designationName') || '[]' // For Designation approverType
      const level = searchParams.get('level') || '[]' // For Level approverType
      const categoryId = searchParams.get('approvalCategoryId') || '' // Get approvalCategoryId from URL

      if (isUpdateMode) {
        ApprovalMatrixFormik.setFieldValue('id', tableId)

        // Set approvalCategory as an object for Autocomplete
        ApprovalMatrixFormik.setFieldValue('approvalCategory', { id: categoryId, name: approvalCategory })
        ApprovalMatrixFormik.setFieldValue('numberOfLevels', parseInt(numberOfLevels, 10))
        ApprovalMatrixFormik.setFieldValue('description', description)
        setApprovalCategoryId(categoryId) // Set approvalCategoryId for use in submission

        // Fetch approval category details to get approverType
        let fetchedApproverType: string | null = null

        if (categoryId) {
          try {
            const response = await dispatch(fetchApprovalCategoryById(categoryId)).unwrap()

            fetchedApproverType = response.approverType || null
            setApproverType(fetchedApproverType) // Set approverType in edit mode
          } catch (error) {
            console.error('Error fetching approval category details in edit mode:', error)
            setApproverType(null)
          }
        }

        // Fetch levels if approverType is 'Level' and levels are not already fetched
        let availableLevels: LevelOption[] = levels.map(lvl => ({
          ...lvl,
          displayName: lvl.displayName || lvl.name // Ensure displayName exists
        }))

        if (fetchedApproverType === 'Level') {
          setLevelLoading(true)
          const levelsResult = await dispatch(fetchLevels()).unwrap() // Directly get the result from the thunk

          setLevelLoading(false)
          availableLevels = levelsResult // Use the fetched levels directly
        }

        // Parse the approver data based on approverType
        const parsedApprovers = fetchedApproverType === 'Level' ? JSON.parse(level) : JSON.parse(designationName)

        // Generate sections based on numberOfLevels, pre-filling designation or level
        const sections = Array.from({ length: parseInt(numberOfLevels, 10) }, (_, index) => {
          const approverEntry = parsedApprovers[index] || { id: '', name: '' }

          return {
            designationName: fetchedApproverType === 'Level' ? null : approverEntry,
            level:
              fetchedApproverType === 'Level'
                ? availableLevels.find(option => option.name === approverEntry.name) || null
                : null
          }
        })

        ApprovalMatrixFormik.setFieldValue('sections', sections)
        setSectionsVisible(true) // Show sections immediately in edit mode
      }
    } catch (error) {
      console.error('Error fetching options:', error)
    }
  }

  // Fetch levels when approverType changes to "Level" (only in create mode)
  useEffect(() => {
    if (!isUpdateMode && approverType === 'Level' && levels.length === 0) {
      setLevelLoading(true)
      dispatch(fetchLevels())
        .then(() => setLevelLoading(false))
        .catch(() => setLevelLoading(false))
    }
  }, [approverType, dispatch, levels.length, isUpdateMode])

  useEffect(() => {
    // Fetch designations and approval categories on component mount
    dispatch(fetchDesignations({ limit: designationLimit }))
    dispatch(fetchApprovalCategories({ page: 1, limit: approvalCategoryLimit }))
    fetchOptions(0, 'designation')
  }, [dispatch])

  // Re-apply validation schema when approverType changes
  useEffect(() => {
    ApprovalMatrixFormik.setFormikState(state => ({
      ...state,
      validationSchema: validationSchema(approverType)
    }))
  }, [approverType])

  const handleAddSection = () => {
    const numberOfSections = ApprovalMatrixFormik.values.numberOfLevels

    const newSections = Array.from({ length: numberOfSections }, () => ({
      designationName: null,
      level: null // Initialize level field
    }))

    ApprovalMatrixFormik.setFieldValue('sections', newSections)
    setSectionsVisible(true)
  }

  const handleNextClick = async () => {
    // Validate approvalCategory and description before proceeding
    const errors = await ApprovalMatrixFormik.validateForm()

    if (errors.approvalCategory || errors.description) {
      ApprovalMatrixFormik.setTouched({ approvalCategory: { id: true, name: true }, description: true })

      return
    }

    handleAddSection() // Show sections without creating a new category
  }

  const handleDragStart = (index: number) => {
    ApprovalMatrixFormik.setFieldValue('draggingIndex', index)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (index: number) => {
    const draggingIndex = ApprovalMatrixFormik.values.draggingIndex

    if (draggingIndex === null || draggingIndex === index) return

    const updatedSections = [...ApprovalMatrixFormik.values.sections]
    const [removed] = updatedSections.splice(draggingIndex, 1)

    updatedSections.splice(index, 0, removed)

    ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
    ApprovalMatrixFormik.setFieldValue('draggingIndex', null)
  }

  const handleOpenDialog = (index: number) => {
    setDeleteIndex(index)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDeleteIndex(null)
  }

  const handleConfirmDelete = (index?: number | string) => {
    if (index !== undefined && typeof index === 'number') {
      const updatedSections = ApprovalMatrixFormik.values.sections.filter((_, i) => i !== index)

      ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
      ApprovalMatrixFormik.setFieldValue('numberOfLevels', updatedSections.length)

      // If no sections remain, hide the sections
      if (updatedSections.length === 0) {
        setSectionsVisible(false)
      }
    }

    handleCloseDialog()
  }

  const areAllSectionsFilled = ApprovalMatrixFormik.values.sections.every(section => {
    if (approverType === 'Level') {
      return section.level !== null
    }

    return section.designationName !== null
  })

  // Reset numberOfLevels and sections when approverType changes to "Level"
  // useEffect(() => {
  //   if (approverType === 'Level') {
  //     ApprovalMatrixFormik.setFieldValue('numberOfLevels', 1)
  //     ApprovalMatrixFormik.setFieldValue('sections', [{ designationName: null, level: null }])
  //     setSectionsVisible(true) // Ensure sections are visible with one level
  //   }
  // }, [approverType])

  // Dynamically update sections when numberOfLevels changes
  useEffect(() => {
    if (ApprovalMatrixFormik.values.numberOfLevels > 0) {
      const currentSections = ApprovalMatrixFormik.values.sections
      const newSectionCount = ApprovalMatrixFormik.values.numberOfLevels

      // If sections are already visible, adjust the sections array dynamically
      if (sectionsVisible) {
        const newSections = Array.from({ length: newSectionCount }, (_, index) => {
          // Preserve existing sections if they exist, otherwise create a new empty section
          return (
            currentSections[index] || {
              designationName: null,
              level: null
            }
          )
        })

        ApprovalMatrixFormik.setFieldValue('sections', newSections)
      }
    }
  }, [ApprovalMatrixFormik.values.numberOfLevels, sectionsVisible])

  return (
    <>
      <form onSubmit={ApprovalMatrixFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
        <Typography variant='h5' sx={{ fontSize: 'bold' }}>
          Approval Matrix Form
        </Typography>

        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 6, mb: 4, mt: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 4,
              boxShadow: 1,
              borderRadius: 1,
              bgcolor: 'background.paper'
            }}
          >
            {/* Nested Box to keep Approval Category and Number of Levels in the same line */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <Autocomplete
                  value={ApprovalMatrixFormik.values.approvalCategory || null}
                  onChange={async (_, value) => {
                    ApprovalMatrixFormik.setFieldValue('approvalCategory', value)
                    setApprovalCategoryId(value?.id || null)

                    if (value?.id) {
                      try {
                        const response = await dispatch(fetchApprovalCategoryById(value.id)).unwrap()

                        ApprovalMatrixFormik.setFieldValue('description', response.description || '')
                        setApproverType(response.approverType || null) // Store approverType in state
                      } catch (error) {
                        console.error('Error fetching approval category details:', error)
                        ApprovalMatrixFormik.setFieldValue('description', '')
                        setApproverType(null) // Reset approverType on error
                      }
                    } else {
                      ApprovalMatrixFormik.setFieldValue('description', '')
                      setApproverType(null) // Reset approverType if no category is selected
                    }
                  }}
                  options={approvalCategories}
                  getOptionLabel={option => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  ListboxProps={{
                    onScroll: handleScrollApprovalCategories,
                    style: { maxHeight: '160px', overflow: 'auto' }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Approval Category'
                      error={
                        ApprovalMatrixFormik.touched.approvalCategory &&
                        Boolean(ApprovalMatrixFormik.errors.approvalCategory)
                      }
                      helperText={
                        ApprovalMatrixFormik.touched.approvalCategory &&
                        (ApprovalMatrixFormik.errors.approvalCategory as string)
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {approvalCategoryLoading ? <CircularProgress color='inherit' size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  disabled={isUpdateMode}
                  loading={approvalCategoryLoading}
                  onOpen={() => {
                    if (approvalCategories.length === 0) {
                      setApprovalCategoryLoading(true)
                      dispatch(fetchApprovalCategories({ page: 1, limit: approvalCategoryLimit }))
                        .then(() => setApprovalCategoryLoading(false))
                        .catch(() => setApprovalCategoryLoading(false))
                    }
                  }}
                />
                {approverType && (
                  <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
                    Approver Type: {approverType}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label='Number of Levels'
                  id='numberOfLevels'
                  name='numberOfLevels'
                  type='number'
                  value={ApprovalMatrixFormik.values.numberOfLevels}
                  onChange={e => {
                    const value = e.target.value

                    // Allow only integers between 1 and 10
                    if (
                      value === '' ||
                      (/^[1-9]$|^10$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 10)
                    ) {
                      ApprovalMatrixFormik.handleChange(e)
                    }
                  }}
                  onBlur={ApprovalMatrixFormik.handleBlur}
                  error={
                    ApprovalMatrixFormik.touched.numberOfLevels && Boolean(ApprovalMatrixFormik.errors.numberOfLevels)
                  }
                  helperText={ApprovalMatrixFormik.touched.numberOfLevels && ApprovalMatrixFormik.errors.numberOfLevels}
                  inputProps={{
                    min: 1,
                    max: 10,
                    pattern: '[1-9]|10', // Restrict to 1-9 or 10
                    inputMode: 'numeric' // Suggest numeric keyboard on mobile
                  }}
                  onKeyDown={e => {
                    // Allow only numbers, backspace, delete, arrow keys, and tab
                    if (
                      !/^[0-9]$/.test(e.key) &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Delete' &&
                      e.key !== 'ArrowLeft' &&
                      e.key !== 'ArrowRight' &&
                      e.key !== 'Tab'
                    ) {
                      e.preventDefault()
                    }
                  }}

                  //disabled={approverType === 'Level'} // Disable when approverType is "Level"
                />
              </FormControl>
            </Box>

            {/* Description Textarea below the row */}
            <FormControl fullWidth sx={{ mt: 3 }}>
              <TextField
                label='Description'
                id='description'
                name='description'
                placeholder='Type here...'
                multiline
                rows={4}
                variant='outlined'
                value={ApprovalMatrixFormik.values.description}
                onChange={ApprovalMatrixFormik.handleChange}
                onBlur={ApprovalMatrixFormik.handleBlur}
                error={ApprovalMatrixFormik.touched.description && Boolean(ApprovalMatrixFormik.errors.description)}
                helperText={ApprovalMatrixFormik.touched.description && ApprovalMatrixFormik.errors.description}
                disabled
              />
            </FormControl>
          </Box>

          {sectionsVisible && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 6 }}>
              {ApprovalMatrixFormik.values.sections.map((section, index) => (
                <Box
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    width: '100%',
                    maxWidth: 500,
                    boxShadow: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  <DragIndicatorIcon sx={{ mr: 2, color: '#666', cursor: 'grab' }} />
                  <Typography variant='body1' sx={{ mr: 2 }}>
                    Approval {index + 1}:
                  </Typography>
                  {approverType === 'Level' ? (
                    <Autocomplete
                      value={section.level || null}
                      onChange={(_, value: LevelOption | null) => {
                        const updatedSections = [...ApprovalMatrixFormik.values.sections]

                        updatedSections[index].level = value
                        ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                      }}
                      options={levels} // Use fetched levels
                      getOptionLabel={(option: LevelOption) => option.displayName || ''} // Use displayName for dropdown
                      isOptionEqualToValue={(option: LevelOption, value: LevelOption | null) => option.id === value?.id}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Level'
                          error={
                            ApprovalMatrixFormik.touched.sections?.[index]?.level &&
                            Boolean((ApprovalMatrixFormik.errors.sections?.[index] as any)?.level)
                          }
                          helperText={
                            ApprovalMatrixFormik.touched.sections?.[index]?.level &&
                            ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.level as string)
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {levelLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            )
                          }}
                        />
                      )}
                      sx={{ flex: 1, mr: 2 }}
                      loading={levelLoading}
                      onOpen={() => {
                        if (levels.length === 0 && approverType === 'Level') {
                          setLevelLoading(true)
                          dispatch(fetchLevels())
                            .then(() => setLevelLoading(false))
                            .catch(() => setLevelLoading(false))
                        }
                      }}
                    />
                  ) : (
                    <Autocomplete
                      value={section.designationName || null}
                      onChange={(_, value) => {
                        const updatedSections = [...ApprovalMatrixFormik.values.sections]

                        updatedSections[index].designationName = value
                        ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                      }}
                      options={designations} // Use fetched designations
                      getOptionLabel={option => option.name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      ListboxProps={{
                        onScroll: handleScrollDesignations,
                        style: { maxHeight: '160px', overflow: 'auto' }
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Designations'
                          error={
                            ApprovalMatrixFormik.touched.sections?.[index]?.designationName &&
                            Boolean((ApprovalMatrixFormik.errors.sections?.[index] as any)?.designationName)
                          }
                          helperText={
                            ApprovalMatrixFormik.touched.sections?.[index]?.designationName &&
                            ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.designationName as string)
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {designationLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            )
                          }}
                        />
                      )}
                      sx={{ flex: 1, mr: 2 }}
                      loading={designationLoading} // Pass the loading prop
                      onOpen={() => {
                        if (designations.length === 0) {
                          setDesignationLoading(true)
                          dispatch(fetchDesignations({ limit: designationLimit }))
                            .then(() => setDesignationLoading(false))
                            .catch(() => setDesignationLoading(false))
                        }
                      }}
                    />
                  )}
                  <IconButton onClick={() => handleOpenDialog(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            {!isUpdateMode && (
              <Button
                variant='contained'
                color='secondary'
                onClick={() => {
                  ApprovalMatrixFormik.resetForm()
                  setSectionsVisible(false) // Reset sections visibility
                  setApprovalCategoryId(null) // Reset category ID on clear
                  setApproverType(null) // Reset approverType on clear
                }}
              >
                Clear
              </Button>
            )}
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                if (sectionsVisible && areAllSectionsFilled) {
                  void ApprovalMatrixFormik.submitForm() // Second API call for designation and level
                } else {
                  void handleNextClick() // First API call for approval category and description
                }
              }}
            >
              {sectionsVisible && areAllSectionsFilled ? (isUpdateMode ? 'Update' : 'Create') : 'Next'}
            </Button>
          </Box>
        </Box>

        {/* Replaced Dialog with ConfirmModal */}
        <ConfirmModal
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          title='Confirm Deletion'
          description='Are you sure you want to delete this section? This action cannot be undone.'
          id={deleteIndex ?? undefined} // Pass deleteIndex as id
        />
      </form>

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
    </>
  )
}

export default AddNewApprovalMatrixGenerated
