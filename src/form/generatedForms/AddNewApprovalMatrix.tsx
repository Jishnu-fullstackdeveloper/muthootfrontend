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
import { createNewApprovalMatrix, updateApprovalMatrix } from '@/redux/approvalMatrixSlice'

type Section = {
  designationName: { id: number; name: string } | null
  grade: { id: number; name: string } | null
}

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
            id: Yup.number().required('Invalid option selected'),
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Approval For is required'),
        grade: Yup.object()
          .shape({
            id: Yup.number().required('Invalid option selected'),
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
  const searchParams = useSearchParams()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const isUpdateMode = Boolean(searchParams.get('id'))

  const { options } = useAppSelector(state => state.approvalMatrixReducer)

  const ApprovalMatrixFormik = useFormik({
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
      const configurations = values.sections.map((section, index) => ({
        designationId: JSON.stringify(section.designationName?.id) || '',
        gradeId: JSON.stringify(section.grade?.id) || '',
        approvalSequenceLevel: index + 1
      }))

      const params = {
        name: values.approvalCategory,
        description: values.description,
        branchId: 'string',
        approvalActionCategoryId: searchParams.get('categoryId'),
        configurations: configurations
      }

      if (isUpdateMode) {
        dispatch(updateApprovalMatrix({ id: values.id, approvalMatrix: params })).unwrap()
      } else {
        try {
          const response = await dispatch(createNewApprovalMatrix(params as any)).unwrap()
          console.log('Approval Matrix created successfully:', response)
        } catch (error) {
          console.error('Error creating approval matrix:', error)
        }
      }

      console.log('Approval Data to API:', params)
      ApprovalMatrixFormik.resetForm()

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

      if (isUpdateMode) {
        ApprovalMatrixFormik.setFieldValue('id', tableId)
        ApprovalMatrixFormik.setFieldValue('approvalCategory', approvalCategory)
        ApprovalMatrixFormik.setFieldValue('numberOfLevels', parseInt(numberOfLevels, 10))
        ApprovalMatrixFormik.setFieldValue('description', description)

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
    fetchOptions(0, 'designation')
  }, [])

  const handleAddSection = () => {
    const numberOfSections = ApprovalMatrixFormik.values.numberOfLevels
    const newSections = Array.from({ length: numberOfSections }, () => ({
      designationName: null,
      grade: null
    }))

    ApprovalMatrixFormik.setFieldValue('sections', newSections)
    setSectionsVisible(true)
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
    }
    handleCloseDialog()
  }

  const areAllSectionsFilled = ApprovalMatrixFormik.values.sections.every(
    section => section.designationName !== null && section.grade !== null
  )

  const designationOptions = [
    { id: 1, name: 'HR Manager' },
    { id: 2, name: 'Branch Manager' },
    { id: 3, name: 'Area Manager' },
    { id: 4, name: 'Manager' }, // Added to match sample data
    { id: 5, name: 'Supervisor' } // Added to match sample data
  ]
  // Mock grade options (replace with actual data from your store/api if available)
  const gradeOptions = [
    { id: 1, name: 'Grade A' },
    { id: 2, name: 'Grade B' },
    { id: 3, name: 'Grade C' },
    { id: 4, name: 'Area Manager' }, // Added to match sample data
    { id: 5, name: 'Jr. Manager' } // Added to match sample data
  ]

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
                  options={designationOptions} //options={Array.isArray(options) ? options : []}
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
                  options={gradeOptions}
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
          <Button variant='contained' color='secondary' onClick={() => ApprovalMatrixFormik.resetForm()}>
            Clear
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              if (sectionsVisible && areAllSectionsFilled) {
                void ApprovalMatrixFormik.submitForm()
              } else {
                handleAddSection()
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
