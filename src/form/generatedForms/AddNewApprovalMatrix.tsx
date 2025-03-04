'use client'
import React, { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Autocomplete, IconButton, Typography, Button, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { createNewApprovalMatrix, updateApprovalMatrix } from '@/redux/approvalMatrixSlice'
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

type SubSection = {
  designationType: { id: number; name: string } | null
  designation: { id: number; name: string } | null
  grade: { id: number; name: string } | null
}

type Section = {
  designationType: { id: number; name: string } | null
  designation: { id: number; name: string } | null
  grade: { id: number; name: string } | null
  subSections: SubSection[]
}

const validationSchema = Yup.object({
  approvalCategory: Yup.string().required('Approval Category is required'),
  numberOfLevels: Yup.number()
    .required('Number of Levels is required')
    .min(1, 'Number of Levels must be at least 1')
    .max(10, 'Number of Levels cannot exceed 10'),
  sections: Yup.array()
    .of(
      Yup.object().shape({
        designationType: Yup.object()
          .shape({
            id: Yup.number().required('Invalid option selected'),
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Approval By is required'),
        designation: Yup.object()
          .shape({
            id: Yup.number().required('Invalid option selected'),
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Approval Role is required'),
        grade: Yup.object()
          .shape({
            id: Yup.number().required('Invalid option selected'),
            name: Yup.string().required('Invalid option selected')
          })
          .nullable()
          .required('Department is required'),
        subSections: Yup.array().of(
          Yup.object().shape({
            designationType: Yup.object()
              .shape({
                id: Yup.number().required('Invalid option selected'),
                name: Yup.string().required('Invalid option selected')
              })
              .nullable()
              .required('Sub Approval By is required'),
            designation: Yup.object()
              .shape({
                id: Yup.number().required('Invalid option selected'),
                name: Yup.string().required('Invalid option selected')
              })
              .nullable()
              .required('Sub Approval Role is required'),
            grade: Yup.object()
              .shape({
                id: Yup.number().required('Invalid option selected'),
                name: Yup.string().required('Invalid option selected')
              })
              .nullable()
              .required('Sub Department is required')
          })
        )
      })
    )
    .min(1, 'At least one section is required')
})

const AddNewApprovalMatrixGenerated: React.FC = () => {
  const [sectionsVisible, setSectionsVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [subDeleteDialogOpen, setSubDeleteDialogOpen] = useState(false)
  const [subDeleteIndex, setSubDeleteIndex] = useState<{ sectionIndex: number; subIndex: number } | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isUpdateMode = Boolean(searchParams.get('id'))

  useAppSelector(state => state.approvalMatrixReducer)

  const ApprovalMatrixFormik = useFormik({
    initialValues: {
      id: '',
      approvalCategory: '',
      numberOfLevels: 1,
      sections: [] as Section[],
      draggingIndex: null as number | null
    },
    validationSchema,
    onSubmit: async values => {
      const configurations = values.sections.map((section, index) => ({
        designationTypeId: JSON.stringify(section.designationType?.id) || '',
        approvalSequenceLevel: index + 1,
        designationId: JSON.stringify(section.designation?.id) || '',
        gradeId: JSON.stringify(section.grade?.id) || '',
        subApprovals: section.subSections.map(sub => ({
          designationTypeId: JSON.stringify(sub.designationType?.id) || '',
          designationId: JSON.stringify(sub.designation?.id) || '',
          gradeId: JSON.stringify(sub.grade?.id) || ''
        }))
      }))

      const params = {
        name: values.approvalCategory,
        description: 'description',
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
  const fetchOptions = async (_id: number, p0: string) => {
    try {
      const tableId = searchParams.get('id') || ''
      const approvalCategory = searchParams.get('approvalCategory') || ''
      const numberOfLevels = searchParams.get('numberOfLevels') || '1'
      const designationTypeName = searchParams.get('designationType') || ''
      const designationName = searchParams.get('designation') || ''
      const gradeName = searchParams.get('grade') || ''

      if (isUpdateMode) {
        // Find matching options based on name
        const designationTypeOption = positionLevelOptions.find(opt => opt.name === designationTypeName) || null
        const designationOption = designationOptions.find(opt => opt.name === designationName) || null
        const gradeOption = gradeOptions.find(opt => opt.name === gradeName) || null

        ApprovalMatrixFormik.setFieldValue('id', tableId)
        ApprovalMatrixFormik.setFieldValue('approvalCategory', approvalCategory)
        ApprovalMatrixFormik.setFieldValue('numberOfLevels', parseInt(numberOfLevels, 10))
        ApprovalMatrixFormik.setFieldValue('sections', [
          {
            designationType: designationTypeOption,
            designation: designationOption,
            grade: gradeOption,
            subSections: []
          }
        ])
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
      designationType: null,
      designation: null,
      grade: null,
      subSections: []
    }))

    ApprovalMatrixFormik.setFieldValue('sections', newSections)
    setSectionsVisible(true)
  }

  const handleAddSubSection = (sectionIndex: number) => {
    const updatedSections = [...ApprovalMatrixFormik.values.sections]

    updatedSections[sectionIndex].subSections.push({
      designationType: null,
      designation: null,
      grade: null
    })
    ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
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
      ApprovalMatrixFormik.setFieldValue('numberOfLevels', updatedSections.length)
    }

    handleCloseDialog()
  }

  const handleOpenSubDeleteDialog = (sectionIndex: number, subIndex: number) => {
    setSubDeleteIndex({ sectionIndex, subIndex })
    setSubDeleteDialogOpen(true)
  }

  const handleCloseSubDeleteDialog = () => {
    setSubDeleteDialogOpen(false)
    setSubDeleteIndex(null)
  }

  const handleConfirmSubDelete = () => {
    if (subDeleteIndex !== null) {
      const updatedSections = [...ApprovalMatrixFormik.values.sections]

      updatedSections[subDeleteIndex.sectionIndex].subSections = updatedSections[
        subDeleteIndex.sectionIndex
      ].subSections.filter((_, i) => i !== subDeleteIndex.subIndex)
      ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
    }

    handleCloseSubDeleteDialog()
  }

  const areAllSectionsFilled = ApprovalMatrixFormik.values.sections.every(
    section =>
      section.designationType !== null &&
      section.designation !== null &&
      section.grade !== null &&
      section.subSections.every(sub => sub.designationType !== null && sub.designation !== null && sub.grade !== null)
  )

  const positionLevelOptions = [
    { id: 1, name: 'Branch' },
    { id: 2, name: 'Area' },
    { id: 3, name: 'Zone' },
    { id: 4, name: 'Region' },
    { id: 5, name: 'Department' },
    { id: 6, name: 'Corporate level' }
  ]

  const designationOptions = [
    { id: 1, name: 'Manager' },
    { id: 2, name: 'Supervisor' },
    { id: 3, name: 'Director' }
  ]

  const gradeOptions = [
    { id: 1, name: 'Senior HR' },
    { id: 2, name: 'Jr. Manager' },
    { id: 3, name: 'Area Manager' }
  ]

  return (
    <form onSubmit={ApprovalMatrixFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Approval Process Form</h1>

      <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 6, mb: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, p: 4, boxShadow: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
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
              helperText={ApprovalMatrixFormik.touched.approvalCategory && ApprovalMatrixFormik.errors.approvalCategory}
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
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    width: '100%',
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
                    value={section.designationType || null}
                    onChange={(_, value) => {
                      const updatedSections = [...ApprovalMatrixFormik.values.sections]

                      updatedSections[index].designationType = value
                      ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                    }}
                    options={positionLevelOptions} //options={Array.isArray(options) ? options : []}
                    getOptionLabel={option => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder='Position Level'
                        error={
                          ApprovalMatrixFormik.touched.sections?.[index]?.designationType &&
                          Boolean((ApprovalMatrixFormik.errors.sections?.[index] as any)?.designationType)
                        }
                        helperText={
                          ApprovalMatrixFormik.touched.sections?.[index]?.designationType &&
                          ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.designationType as string)
                        }
                      />
                    )}
                    sx={{ width: 350, mr: 2 }}
                  />
                  <Autocomplete
                    value={section.designation || null}
                    onChange={(_, value) => {
                      const updatedSections = [...ApprovalMatrixFormik.values.sections]

                      updatedSections[index].designation = value
                      ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                    }}
                    options={designationOptions}
                    getOptionLabel={option => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder='Designation'
                        error={
                          ApprovalMatrixFormik.touched.sections?.[index]?.designation &&
                          Boolean((ApprovalMatrixFormik.errors.sections?.[index] as any)?.designation)
                        }
                        helperText={
                          ApprovalMatrixFormik.touched.sections?.[index]?.designation &&
                          ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.designation as string)
                        }
                      />
                    )}
                    sx={{ width: 350, mr: 2 }}
                  />
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
                    sx={{ width: 350, mr: 2 }}
                  />
                  <IconButton onClick={() => handleAddSubSection(index)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {/* Subsections */}
                {section.subSections.map((subSection, subIndex) => (
                  <Box
                    key={subIndex}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      pl: 25,
                      width: '100%',

                      //bgcolor: '#f5f5f5',
                      borderRadius: 1
                    }}
                  >
                    {/* <Typography variant='body2' sx={{ mr: 2 }}>
                    Sub Level {subIndex + 1}:
                  </Typography> */}
                    <Autocomplete
                      value={subSection.designationType || null}
                      onChange={(_, value) => {
                        const updatedSections = [...ApprovalMatrixFormik.values.sections]

                        updatedSections[index].subSections[subIndex].designationType = value
                        ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                      }}
                      options={positionLevelOptions}
                      getOptionLabel={option => option.name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Position Level'
                          error={
                            ApprovalMatrixFormik.touched.sections?.[index]?.subSections?.[subIndex]?.designationType &&
                            Boolean(
                              (ApprovalMatrixFormik.errors.sections?.[index] as any)?.subSections?.[subIndex]
                                ?.designationType
                            )
                          }
                          helperText={
                            ApprovalMatrixFormik.touched.sections?.[index]?.subSections?.[subIndex]?.designationType &&
                            ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.subSections?.[subIndex]
                              ?.designationType as string)
                          }
                        />
                      )}
                      sx={{ width: 350, mr: 2 }}
                    />
                    <Autocomplete
                      value={subSection.designation || null}
                      onChange={(_, value) => {
                        const updatedSections = [...ApprovalMatrixFormik.values.sections]

                        updatedSections[index].subSections[subIndex].designation = value
                        ApprovalMatrixFormik.setFieldValue('sections', updatedSections)
                      }}
                      options={designationOptions}
                      getOptionLabel={option => option.name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Designation'
                          error={
                            ApprovalMatrixFormik.touched.sections?.[index]?.subSections?.[subIndex]?.designation &&
                            Boolean(
                              (ApprovalMatrixFormik.errors.sections?.[index] as any)?.subSections?.[subIndex]
                                ?.designation
                            )
                          }
                          helperText={
                            ApprovalMatrixFormik.touched.sections?.[index]?.subSections?.[subIndex]?.designation &&
                            ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.subSections?.[subIndex]
                              ?.designation as string)
                          }
                        />
                      )}
                      sx={{ width: 350, mr: 2 }}
                    />
                    <Autocomplete
                      value={subSection.grade || null}
                      onChange={(_, value) => {
                        const updatedSections = [...ApprovalMatrixFormik.values.sections]

                        updatedSections[index].subSections[subIndex].grade = value
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
                            ApprovalMatrixFormik.touched.sections?.[index]?.subSections?.[subIndex]?.grade &&
                            Boolean(
                              (ApprovalMatrixFormik.errors.sections?.[index] as any)?.subSections?.[subIndex]?.grade
                            )
                          }
                          helperText={
                            ApprovalMatrixFormik.touched.sections?.[index]?.subSections?.[subIndex]?.grade &&
                            ((ApprovalMatrixFormik.errors.sections?.[index] as any)?.subSections?.[subIndex]
                              ?.grade as string)
                          }
                        />
                      )}
                      sx={{ width: 350, mr: 2 }}
                    />
                    {/* <IconButton onClick={() => handleAddSubSection(index)}>
                    <AddIcon />
                  </IconButton> */}
                    <IconButton onClick={() => handleOpenSubDeleteDialog(index, subIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
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

      {/* Main Section Delete Dialog */}
      <ConfirmModal
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title='Confirm Deletion'
        description='Are you sure you want to delete this section? This action cannot be undone.'
        id={deleteIndex ?? undefined} // Pass deleteIndex as id
      />

      {/* Sub-Section Delete Modal */}
      <ConfirmModal
        open={subDeleteDialogOpen}
        onClose={handleCloseSubDeleteDialog}
        onConfirm={handleConfirmSubDelete}
        title='Confirm Sub-Approval Deletion'
        description='Are you sure you want to delete this sub-approval? This action cannot be undone.'

        // No id passed here since we use subDeleteIndex directly
      />
    </form>
  )
}

export default AddNewApprovalMatrixGenerated
