'use client'
import React, { useState, useEffect } from 'react'
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { createNewApprovalMatrix, updateApprovalMatrix, getApprovalMatrixOptions } from '@/redux/approvalMatrixSlice'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

type Section = {
  approvalBy: { id: number; name: string } | null
}

const validationSchema = Yup.object({
  approvalType: Yup.string().required('Approval Type is required'),
  numberOfLevels: Yup.number()
    .required('Number of Levels is required')
    .min(1, 'Number of Levels must be at least 1')
    .max(10, 'Number of Levels cannot exceed 10'),
  sections: Yup.array()
    .of(
      Yup.object().shape({
        approvalBy: Yup.object()
          .shape({
            id: Yup.number().required('Invalid option selected'),
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Approval For is required')
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
      approvalType: '',
      numberOfLevels: 1,
      sections: [] as Section[],
      draggingIndex: null as number | null
    },
    validationSchema,
    onSubmit: async values => {
      const configurations = values.sections.map((section, index) => ({
        designationId: JSON.stringify(section.approvalBy?.id) || '', // Map to approverDesignationId
        approvalSequenceLevel: index + 1 // Level is based on index (starting from 1)
      }))

      const params = {
        name: values.approvalType,
        description: 'description',
        branchId: 'string',
        approvalActionCategoryId: searchParams.get('categoryId'),
        configurations: configurations
      }

      if (isUpdateMode) {
        // Update the approval matrix
        dispatch(updateApprovalMatrix({ id: values.id, approvalMatrix: params })).unwrap()
      } else {
        try {
          // Create a new approval matrix
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

  const fetchOptions = async (id: number, name: string) => {
    try {
      const requestBody = {
        id: id,
        name: name
      }
      //await dispatch(getApprovalMatrixOptions()).unwrap()

      const tableId = searchParams.get('id') || ''
      const approvalType = searchParams.get('approvalType') || ''
      const numberOfLevels = searchParams.get('numberOfLevels') || '1'
      const approvalBy = searchParams.get('approvalBy') || '[]'

      if (isUpdateMode) {
        ApprovalMatrixFormik.setFieldValue('id', tableId)
        ApprovalMatrixFormik.setFieldValue('approvalType', approvalType)
        ApprovalMatrixFormik.setFieldValue('numberOfLevels', parseInt(numberOfLevels, 10))
        ApprovalMatrixFormik.setFieldValue(
          'sections',
          JSON.parse(approvalBy).map((approval: any) => ({
            approvalBy: approval // Prefill `approvalBy` field
          }))
        )
        
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
    const newSections = Array.from({ length: numberOfSections }, () => ({ approvalBy: null }))
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

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedSections = ApprovalMatrixFormik.values.sections.filter((_, i) => i !== deleteIndex)
      ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
      ApprovalMatrixFormik.setFieldValue('numberOfLevels', updatedSections.length) // Update number of levels
    }
    handleCloseDialog()
  }

  // Check if all sections are filled out
  const areAllSectionsFilled = ApprovalMatrixFormik.values.sections.every(section => section.approvalBy !== null)

  return (
    <form onSubmit={ApprovalMatrixFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Approval Process Form</h1>

      <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 6, mb: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, p: 4, boxShadow: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
          <FormControl fullWidth>
            <TextField
              label='Approval Type'
              id='approvalType'
              name='approvalType'
              variant='outlined'
              value={ApprovalMatrixFormik.values.approvalType}
              onChange={ApprovalMatrixFormik.handleChange}
              onBlur={ApprovalMatrixFormik.handleBlur}
              error={ApprovalMatrixFormik.touched.approvalType && Boolean(ApprovalMatrixFormik.errors.approvalType)}
              helperText={ApprovalMatrixFormik.touched.approvalType && ApprovalMatrixFormik.errors.approvalType}
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
              error={ApprovalMatrixFormik.touched.numberOfLevels && Boolean(ApprovalMatrixFormik.errors.numberOfLevels)}
              helperText={ApprovalMatrixFormik.touched.numberOfLevels && ApprovalMatrixFormik.errors.numberOfLevels}
              inputProps={{ min: 1, max: 10 }}
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
                  maxWidth: 645,
                  boxShadow: 1,
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <DragIndicatorIcon sx={{ mr: 2, color: '#666', cursor: 'grab' }} />
                <Typography variant='body1' sx={{ mr: 2 }}>
                  Approval {index + 1}:
                </Typography>
                <Autocomplete
                  value={section.approvalBy || null}
                  onChange={(_, value) => {
                    const updatedSections = [...ApprovalMatrixFormik.values.sections]
                    updatedSections[index].approvalBy = value
                    ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                  }}
                  options={Array.isArray(options) ? options : []}
                  getOptionLabel={option => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder='Approval by'
                      error={
                        ApprovalMatrixFormik.touched.sections?.[index]?.approvalBy &&
                        Boolean((ApprovalMatrixFormik.errors.sections?.[index] as any)?.approvalBy)
                      }
                      helperText={
                        ApprovalMatrixFormik.touched.sections?.[index]?.approvalBy &&
                        ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.approvalBy as string)
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
                void ApprovalMatrixFormik.submitForm();
              } else {
                handleAddSection();
              }
            }}
          >
            {sectionsVisible && areAllSectionsFilled ? (isUpdateMode ? 'Update' : 'Create') : 'Add Levels'}
          </Button>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this section? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}
export default AddNewApprovalMatrixGenerated
