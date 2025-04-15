'use client'
import React, { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Autocomplete, IconButton, Typography, Button, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

// Import the ConfirmModal component
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog' // Adjust the import path based on your file structure

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  createNewApprovalMatrix,
  updateApprovalMatrix,
  createApprovalCategory,
  updateApprovalCategory,
  fetchDesignations,
  fetchGrades
} from '@/redux/approvalMatrixSlice'
import type { ApprovalMatrixFormValues, Section } from '@/types/approvalMatrix' // Import types

const validationSchema = Yup.object({
  approvalCategory: Yup.string().required('Approval Type is required'),
  numberOfLevels: Yup.number()
    .required('Number of Levels is required')
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
            id: Yup.string().required('Invalid option selected'), // Updated to string
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Approval For is required'),
        grade: Yup.object()
          .shape({
            id: Yup.string().required('Invalid option selected'), // Updated to string
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
  const searchParams = useSearchParams()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const isUpdateMode = Boolean(searchParams.get('id'))

  const { options, designations, grades } = useAppSelector(state => state.approvalMatrixReducer)

  const ApprovalMatrixFormik = useFormik<ApprovalMatrixFormValues>({
    initialValues: {
      id: '',
      approvalCategory: '',
      numberOfLevels: 1,
      description: '',
      sections: [] as Section[],
      draggingIndex: null as number | null
    },
    validationSchema,
    onSubmit: async values => {
      // Retrieve approvalCategoryId from searchParams in edit mode
      const categoryIdFromUrl = searchParams.get('approvalCategoryId') || approvalCategoryId || ''

      // Prepare the approval matrix data for submission
      const approvalMatrix = values.sections.map((section, index) => ({
        approvalCategoryId: categoryIdFromUrl, // Use the approvalCategoryId from URL or state
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
              name: values.approvalCategory,
              description: values.description
            })
          ).unwrap()
          console.log('Approval Category updated successfully')

          // Then update each approval matrix section
          await Promise.all(
            approvalMatrix.map((matrix, index) =>
              dispatch(
                updateApprovalMatrix({
                  id: values.id, // Assuming the ID from searchParams is the matrix ID to update
                  approvalMatrix: {
                    approvalCategoryId: matrix.approvalCategoryId,
                    designation: matrix.designation,
                    grade: matrix.grade,
                    level: matrix.level
                  }
                })
              ).unwrap()
            )
          )
          console.log('Approval Matrix updated successfully')
        } catch (error) {
          console.error('Error updating approval category or matrix:', error)
        }
      } else {
        try {
          const response = await dispatch(createNewApprovalMatrix({ approvalMatrix })).unwrap()
          console.log('Approval Matrices created successfully:', response)
        } catch (error) {
          console.error('Error creating approval matrices:', error)
        }
      }

      console.log('Approval Matrix Data to API:', approvalMatrix)
      ApprovalMatrixFormik.resetForm()
      setApprovalCategoryId(null) // Reset category ID after submission
      setSectionsVisible(false) // Hide sections after submission

      router.back()
    }
  })

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
        ApprovalMatrixFormik.setFieldValue('approvalCategory', approvalCategory)
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
    // Fetch designations and grades on component mount
    dispatch(fetchDesignations({}))
    dispatch(fetchGrades({}))
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
    const { approvalCategory, description } = ApprovalMatrixFormik.values

    // Validate approvalCategory and description before API call
    const errors = await ApprovalMatrixFormik.validateForm()
    if (errors.approvalCategory || errors.description) {
      ApprovalMatrixFormik.setTouched({ approvalCategory: true, description: true })
      return
    }

    try {
      const response = await dispatch(createApprovalCategory({ name: approvalCategory, description })).unwrap()
      console.log('Approval Category created successfully:', response)
      setApprovalCategoryId(response.id) // Store the created category ID
      handleAddSection() // Show sections after successful creation
    } catch (error) {
      console.error('Error creating approval category:', error)
    }
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
              <TextField
                label='Approval Category'
                id='approvalCategory'
                name='approvalCategory'
                variant='outlined'
                value={ApprovalMatrixFormik.values.approvalCategory}
                onChange={ApprovalMatrixFormik.handleChange}
                onBlur={ApprovalMatrixFormik.handleBlur}
                error={
                  ApprovalMatrixFormik.touched.approvalCategory && Boolean(ApprovalMatrixFormik.errors.approvalCategory)
                }
                helperText={
                  ApprovalMatrixFormik.touched.approvalCategory && ApprovalMatrixFormik.errors.approvalCategory
                }
                disabled={isUpdateMode} // Disable in edit mode if you don’t want category name changes; remove if editable
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label='Number of Levels'
                id='numberOfLevels'
                name='numberOfLevels'
                type='number'
                value={ApprovalMatrixFormik.values.numberOfLevels}
                onChange={ApprovalMatrixFormik.handleChange}
                onBlur={ApprovalMatrixFormik.handleBlur}
                error={
                  ApprovalMatrixFormik.touched.numberOfLevels && Boolean(ApprovalMatrixFormik.errors.numberOfLevels)
                }
                helperText={ApprovalMatrixFormik.touched.numberOfLevels && ApprovalMatrixFormik.errors.numberOfLevels}
                inputProps={{ min: 1, max: 10 }}
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
                    />
                  )}
                  sx={{ flex: 1, mr: 2 }}
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
                    />
                  )}
                  sx={{ flex: 1, mr: 2 }}
                />
                <IconButton onClick={() => handleOpenDialog(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
  )
}

export default AddNewApprovalMatrixGenerated
