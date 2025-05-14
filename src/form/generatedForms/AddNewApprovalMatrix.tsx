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
  fetchDesignations,
  fetchGrades
} from '@/redux/approvalMatrixSlice'
import type { ApprovalMatrixFormValues, Section } from '@/types/approvalMatrix' // Import types

const validationSchema = Yup.object({
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
        designationName: Yup.object()
          .shape({
            id: Yup.string().required('Invalid option selected'),
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Approval For is required'),
        grade: Yup.object()
          .shape({
            id: Yup.string().required('Invalid option selected'),
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Grade is required')
      })
    )
    .min(1, 'At least one section is required')
})

const AddNewApprovalMatrixGenerated: React.FC = () => {
  const [sectionsVisible, setSectionsVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [approvalCategoryId, setApprovalCategoryId] = useState<string | null>(null) // Store the created category ID
  const [approvalCategoryLimit, setApprovalCategoryLimit] = useState(10) // Initial limit for approval categories
  const [designationLimit, setDesignationLimit] = useState(10) // Initial limit for designations
  const [gradeLimit, setGradeLimit] = useState(10) // Initial limit for grades
  const [approvalCategoryLoading, setApprovalCategoryLoading] = useState(false) // Loading state for approval categories
  const [designationLoading, setDesignationLoading] = useState(false) // Loading state for designations
  const [gradeLoading, setGradeLoading] = useState(false) // Loading state for grades
  const searchParams = useSearchParams()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const isUpdateMode = Boolean(searchParams.get('id'))

  const { designations, grades, approvalCategories } = useAppSelector(state => state.approvalMatrixReducer) //options

  // Debug  Debug: Log approvalCategories to check if data is fetched
  useEffect(() => {
    console.log('approvalCategories:', approvalCategories)
  }, [approvalCategories])

  const ApprovalMatrixFormik = useFormik<ApprovalMatrixFormValues>({
    initialValues: {
      id: '',
      approvalCategory: null, // Changed to null for Autocomplete
      numberOfLevels: 1,
      description: '',
      sections: [] as Section[],
      draggingIndex: null as number | null
    },
    validationSchema,

    onSubmit: async values => {
      // Check for duplicate designation or grade
      const seenDesignations = new Set<string>()
      const seenGrades = new Set<string>()
      let hasDuplicates = false

      for (let i = 0; i < values.sections.length; i++) {
        const section = values.sections[i]
        const designationId = section.designationName?.id || ''
        const gradeId = section.grade?.id || ''

        if (seenDesignations.has(designationId) || seenGrades.has(gradeId)) {
          hasDuplicates = true
          break
        }

        seenDesignations.add(designationId)
        seenGrades.add(gradeId)
      }

      if (hasDuplicates) {
        toast.error('The same designation or grade are selected in the previous level', {
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
        designation: section.designationName?.name || '',
        grade: section.grade?.name || '',
        level: index + 1
      }))

      if (isUpdateMode) {
        try {
          // Update the approval category first
          await dispatch(
            updateApprovalCategory({
              id: categoryIdFromUrl,
              name: values.approvalCategory?.name || '',
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
                      designation: matrix.designation,
                      grade: matrix.grade,
                      level: matrix.level
                    }
                  })
                ).unwrap()

                return existingMatrixIds[index]
              } else {
                // Create new matrix for additional levels
                const response = await dispatch(createNewApprovalMatrix({ approvalMatrix: [matrix] })).unwrap()

                return response[0]?.id || '' // Assume API returns the new matrix ID
              }
            })
          )

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
          toast.success('Approval Matrix created successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
        } catch (error) {
          console.error('Error creating approval matrices:', error)
          toast.error('Failed to create approval matrix. Please try again.', {
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

  // Scroll handler for Grade Autocomplete
  const handleScrollGrades = (event: any) => {
    const listboxNode = event.currentTarget

    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10) {
      if (!gradeLoading) {
        setGradeLoading(true)
        setGradeLimit(prev => prev + 10)
        const params = { limit: gradeLimit + 10 }

        dispatch(fetchGrades(params))
          .then(() => setGradeLoading(false))
          .catch(() => setGradeLoading(false))
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchOptions = async (_id: number, _p0: string) => {
    try {
      const tableId = searchParams.get('id') || ''
      const approvalCategory = searchParams.get('approvalCategory') || ''
      const numberOfLevels = searchParams.get('numberOfLevels') || '1'
      const description = searchParams.get('description') || ''
      const designationName = searchParams.get('designationName') || '[]'
      const grade = searchParams.get('grade') || '[]'
      const categoryId = searchParams.get('approvalCategoryId') || '' // Get approvalCategoryId from URL

      if (isUpdateMode) {
        ApprovalMatrixFormik.setFieldValue('id', tableId)

        // Set approvalCategory as an object for Autocomplete
        ApprovalMatrixFormik.setFieldValue('approvalCategory', { id: categoryId, name: approvalCategory })
        ApprovalMatrixFormik.setFieldValue('numberOfLevels', parseInt(numberOfLevels, 10))
        ApprovalMatrixFormik.setFieldValue('description', description)
        setApprovalCategoryId(categoryId) // Set approvalCategoryId for use in submission

        const parsedDesignations = JSON.parse(designationName)
        const parsedGrades = JSON.parse(grade)

        // Generate sections based on numberOfLevels, pre-filling designation and grade
        const sections = Array.from({ length: parseInt(numberOfLevels, 10) }, (_, index) => ({
          designationName: parsedDesignations[index] || null,
          grade: parsedGrades[index] || null
        }))

        ApprovalMatrixFormik.setFieldValue('sections', sections)
        setSectionsVisible(true) // Show sections immediately in edit mode
      }
    } catch (error) {
      console.error('Error fetching options:', error)
    }
  }

  useEffect(() => {
    // Fetch designations, grades, and approval categories on component mount
    dispatch(fetchDesignations({ limit: designationLimit }))
    dispatch(fetchGrades({ limit: gradeLimit }))
    dispatch(fetchApprovalCategories({ page: 1, limit: approvalCategoryLimit }))
    fetchOptions(0, 'designation')
  }, [dispatch])

  const handleAddSection = () => {
    const numberOfSections = ApprovalMatrixFormik.values.numberOfLevels

    const newSections = Array.from({ length: numberOfSections }, () => ({
      designationName: null,
      grade: null
    }))

    ApprovalMatrixFormik.setFieldValue('sections', newSections)
    setSectionsVisible(true)
  }

  const handleNextClick = async () => {
    // Validate approvalCategory and description before proceeding
    const errors = await ApprovalMatrixFormik.validateForm()

    if (errors.approvalCategory || errors.description) {
      ApprovalMatrixFormik.setTouched({ approvalCategory: true, description: true })

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

  const areAllSectionsFilled = ApprovalMatrixFormik.values.sections.every(
    section => section.designationName !== null && section.grade !== null
  )

  return (
    <>
      <form onSubmit={ApprovalMatrixFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
        {/* <h1 className='text-2xl font-bold text-gray-800 mb-4'>Approval Process Form</h1> */}
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
                {/* Autocomplete for Approval Category, displaying only the name in the dropdown */}
                <Autocomplete
                  value={ApprovalMatrixFormik.values.approvalCategory || null}
                  onChange={async (_, value) => {
                    ApprovalMatrixFormik.setFieldValue('approvalCategory', value)
                    setApprovalCategoryId(value?.id || null)

                    if (value?.id) {
                      try {
                        const response = await dispatch(fetchApprovalCategoryById(value.id)).unwrap()

                        ApprovalMatrixFormik.setFieldValue('description', response.description || '')
                      } catch (error) {
                        console.error('Error fetching approval category description:', error)
                        ApprovalMatrixFormik.setFieldValue('description', '')
                      }
                    } else {
                      ApprovalMatrixFormik.setFieldValue('description', '')
                    }
                  }}
                  options={approvalCategories} // Options from fetchApprovalCategories, only name is displayed
                  getOptionLabel={option => option.name || ''} // Display only the approval category name
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
                  disabled={isUpdateMode} // Disable in edit mode
                  loading={approvalCategoryLoading} // Pass the loading prop
                  onOpen={() => {
                    if (approvalCategories.length === 0) {
                      setApprovalCategoryLoading(true)
                      dispatch(fetchApprovalCategories({ page: 1, limit: approvalCategoryLimit }))
                        .then(() => setApprovalCategoryLoading(false))
                        .catch(() => setApprovalCategoryLoading(false))
                    }
                  }}
                />
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
                    maxWidth: 900,
                    boxShadow: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  <DragIndicatorIcon sx={{ mr: 2, color: '#666', cursor: 'grab' }} />
                  <Typography variant='body1' sx={{ mr: 2 }}>
                    Level {index + 1}:
                  </Typography>
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
                  {/* Added Grade Autocomplete */}
                  <Autocomplete
                    value={section.grade || null}
                    onChange={(_, value) => {
                      const updatedSections = [...ApprovalMatrixFormik.values.sections]

                      updatedSections[index].grade = value
                      ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                    }}
                    options={grades} // Use fetched grades
                    getOptionLabel={option => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    ListboxProps={{
                      onScroll: handleScrollGrades,
                      style: { maxHeight: '160px', overflow: 'auto' }
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder='Grade'
                        error={
                          ApprovalMatrixFormik.touched.sections?.[index]?.grade &&
                          Boolean((ApprovalMatrixFormik.errors.sections?.[index] as any)?.grade)
                        }
                        helperText={
                          ApprovalMatrixFormik.touched.sections?.[index]?.grade &&
                          ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.grade as string)
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {gradeLoading ? <CircularProgress color='inherit' size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                    sx={{ flex: 1, mr: 2 }}
                    loading={gradeLoading} // Pass the loading prop
                    onOpen={() => {
                      if (grades.length === 0) {
                        setGradeLoading(true)
                        dispatch(fetchGrades({ limit: gradeLimit }))
                          .then(() => setGradeLoading(false))
                          .catch(() => setGradeLoading(false))
                      }
                    }}
                  />
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
                  void ApprovalMatrixFormik.submitForm() // Second API call for designation and grade
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
