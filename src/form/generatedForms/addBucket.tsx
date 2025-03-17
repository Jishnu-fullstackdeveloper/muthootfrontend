'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, IconButton, Autocomplete } from '@mui/material'

import AddIcon from '@mui/icons-material/AddCircleOutline'
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline'

import DynamicButton from '@/components/Button/dynamicButton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  addNewBucket,
  getTurnOverCode,
  updateBucketList,
  addNewTurnoverCode,
  fetchBucketDetails,
  fetchDesignationList,
  fetchGradeList
} from '@/redux/BucketManagementSlice'
import TurnOverModal from '@/views/pages/BucketManagment/TurnOverModal'

type Props = {
  mode: any
  id: any
}

const AddOrEditBucket: React.FC<Props> = ({ mode, id }) => {
  const [designations, setDesignations] = useState<any[]>([{ name: '', count: 1, grade: '' }])
  const [modalData, setModalData] = useState(null)
  const [selectedTurnover, setSelectedTurnover] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [selectedTurnoverCode, setSelectedTurnoverCode] = useState('')

  modalData
  showDeleteModal
  hoveredRow

  useEffect(() => {
    if (mode === 'edit') {
      dispatch(fetchBucketDetails(id))
    }
  }, [])

  const handleRadioChange = (turnoverCode: string) => {
    setSelectedTurnoverCode(turnoverCode) 
    console.log('Selected Turnover Code:', turnoverCode)
  }

  const [isEditMode, setIsEditMode] = useState(false)
  const [turnoverCode, setTurnoverCode] = useState('')

  const [modalState, setModalState] = useState({
    showTurnOverModal: false,
    showAddNewTurnoverModal: false
  })

  const {
    turnoverListData,
    fetchBucketDetailsData,
    fetchBucketDetailsSuccess,
    updateBucketListSuccess,
    designationData,
    gradeData
  } = useAppSelector((state: any) => state.BucketManagementReducer)

  const [data, setData] = useState([{ turnoverID: 1, turnoverCode: 'ABC123' }])
  const dispatch = useAppDispatch()

  const handleClickTurnover = (item: any) => {
    setModalData(item)
    setModalState({ ...modalState, showTurnOverModal: true })

    const params = {
      page: 1,
      limit: 10
    }

    dispatch(getTurnOverCode(params))
  }

  const getDesignationDatas = () => {
    const params = {
      page: 1,
      limit: 10
    }

    dispatch(fetchDesignationList(params))
  }

  const getGradeDatas = () => {
    const params = {
      page: 1,
      limit: 10
    }

    dispatch(fetchGradeList(params))
  }

  console.log(gradeData, 'Grade Datas', designationData)

  useEffect(() => {
    getDesignationDatas()
    getGradeDatas()
  }, [])

  const handleAddNewTurnover = () => {
    setIsEditMode(false)
    setTurnoverCode('')
    setModalState({ ...modalState, showAddNewTurnoverModal: true })
  }

  const handleEditTurnover = (item: any) => {
    console.log(item)
    setIsEditMode(true)
    setSelectedTurnover(item)
    setTurnoverCode(item.turnoverCode)
    setModalState({ ...modalState, showAddNewTurnoverModal: true })
  }

  const submitselectedTurnoverCode = (item: any) => {
    item
    setTurnoverCode(selectedTurnoverCode)
    bucketFormik.setFieldValue('turnoverCode', selectedTurnoverCode)
    setModalState({ ...modalState, showTurnOverModal: false })
  }

  const handleSaveNewTurnover = () => {
    if (!turnoverCode.trim()) {
      alert('Please provide a turnover code')

      return
    } else {
      const params = {
        turnover: turnoverCode
      }

      dispatch(addNewTurnoverCode(params))
    }

    if (isEditMode && selectedTurnover) {
      console.log('Editing turnover: ', selectedTurnover)

      const updatedData = data.map(item =>
        item.turnoverID === selectedTurnover.turnoverID ? { ...item, turnoverCode: turnoverCode } : item
      )

      setData(updatedData)
    } else {
      const newTurnover = {
        turnoverID: data.length + 1,
        turnoverCode: turnoverCode
      }

      setData([...data, newTurnover])
    }

    // Close the modal after saving
    setModalState({ ...modalState, showAddNewTurnoverModal: false })
    setTurnoverCode('')
  }

  const handleCancelNewTurnover = () => {
    setModalState({ ...modalState, showAddNewTurnoverModal: false })
  }

  const handleCloseTurnoverModal = () => {
    setModalState({ ...modalState, showTurnOverModal: false })
  }

  const handleOpenDeleteModal = (item: any) => {
    setSelectedTurnover(item)
    setShowDeleteModal(true)
  }

  const bucketFormik = useFormik({
    initialValues: {
      bucketName: '',
      turnoverCode: '',
      note: '',
      designations: [{ name: '', count: 1, grade: '' }]
    },
    validationSchema: Yup.object().shape({
      bucketName: Yup.string().required('Bucket Name is required'),
      turnoverCode: Yup.string().required('Turnover Code is required'),
      designations: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required('Designation is required'),
            count: Yup.number().required('Role Count is required').min(1, 'Role Count must be at least 1'),
            grade: Yup.string().required('Grade is required')
          })
        )
        .min(1, 'At least one designation is required')
    }),

    onSubmit: values => {
      const finalTurnoverCode = selectedTurnoverCode || turnoverCode

      const sanitizedDesignations = values.designations.map(designation => ({
        designationName: designation.name?.trim(),
        count: designation.count || 1,
        grade: designation.grade?.trim()
      }))

      const invalidDesignations = sanitizedDesignations.some(d => !d.designationName)

      if (invalidDesignations) {
        alert('All designation names must be filled.')

        return
      }

      const params: any = {
        name: values.bucketName.toUpperCase(),
        positionCategories: sanitizedDesignations,
        turnoverCode: finalTurnoverCode,
        notes: values.note,
        ...(mode === 'edit' && { id })
      }

      if (mode === 'edit') {
        dispatch(updateBucketList(params))
      } else {
        dispatch(addNewBucket(params))
      }

      router.push('/bucket-management')
    }
  })

  useEffect(() => {
    if (fetchBucketDetailsSuccess && fetchBucketDetailsData) {
      console.log('fetchBucketDetailsData', fetchBucketDetailsData)

      // Set field values for name, turnoverCode, and note
      bucketFormik.setFieldValue('bucketName', fetchBucketDetailsData?.name)
      bucketFormik.setFieldValue('turnoverCode', fetchBucketDetailsData?.turnoverCode)
      bucketFormik.setFieldValue('note', fetchBucketDetailsData?.notes)
      setTurnoverCode(fetchBucketDetailsData?.turnoverCode)

      // Transform positionCategories into the required format for designations
      const tempDesignations = fetchBucketDetailsData?.positionCategories?.map((item: any) => ({
        name: item.name || '',
        count: item.count || 1,
        grade: item.grade || ''
      }))

      // Update designations state and formik field value
      setDesignations(tempDesignations)
      bucketFormik.setFieldValue('designations', tempDesignations)
    }
  }, [fetchBucketDetailsSuccess, fetchBucketDetailsData, updateBucketListSuccess])

  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  return (
    <form onSubmit={bucketFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Bucket Management Form</h1>
      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Bucket Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          <FormControl fullWidth margin='normal'>
            <label htmlFor='bucketName' className='block text-sm font-medium text-gray-700'>
              Bucket Name *
            </label>
            <TextField
              label='Bucket Name *'
              id='bucketName'
              name='bucketName'
              value={bucketFormik.values.bucketName}
              onChange={bucketFormik.handleChange}
              onBlur={bucketFormik.handleBlur}
              error={!!bucketFormik.errors.bucketName && bucketFormik.touched.bucketName}
              helperText={bucketFormik.errors.bucketName}
            />
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <label htmlFor='turnoverCode' className='block text-sm font-medium text-gray-700'>
              Turnover Code
            </label>
            <div style={{ flexDirection: 'row' }}>
              <TextField
                value={bucketFormik.values.turnoverCode}
                onClick={() => handleClickTurnover(data[0])}
                onChange={bucketFormik.handleChange}
                onFocus={() => bucketFormik.setFieldTouched('turnoverCode', true)}
                id='turnoverCode'
                name='turnoverCode'
                error={bucketFormik.touched.turnoverCode && Boolean(bucketFormik.errors.turnoverCode)}
                helperText={
                  bucketFormik.touched.turnoverCode && bucketFormik.errors.turnoverCode
                    ? String(bucketFormik.errors.turnoverCode)
                    : undefined
                }
                InputProps={{
                  readOnly: true
                }}
              />
            </div>

            {/* New Turnover Modal */}
            <TurnOverModal
              showNewTurnoverModal={modalState?.showAddNewTurnoverModal}
              handleCancelNewTurnover={handleCancelNewTurnover}
              isEditMode={isEditMode}
              turnoverCode={turnoverCode}
              selectedTurnoverCode={selectedTurnoverCode}
              setTurnoverCode={setTurnoverCode}
              handleSaveNewTurnover={handleSaveNewTurnover}
              handleAddNewTurnover={handleAddNewTurnover}
              showTurnOverModal={modalState?.showTurnOverModal}
              turnoverListData={turnoverListData}
              setHoveredRow={setHoveredRow}
              handleEditTurnover={handleEditTurnover}
              handleOpenDeleteModal={handleOpenDeleteModal}
              setSelectedTurnoverCode={setSelectedTurnoverCode}
              handleCloseTurnoverModal={handleCloseTurnoverModal}
              handleRadioChange={handleRadioChange}
              submitselectedTurnoverCode={submitselectedTurnoverCode}
            />
          </FormControl>
        </div>

        <div className='grid grid-cols-2 gap-4'></div>

        <div>
          <label htmlFor='designation' className='block text-sm font-medium text-gray-700'>
            Designation
          </label>
          {designations?.map((designation, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '16px',
                marginTop: 10,
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div style={{ width: '300px' }}>
                <Autocomplete
                  options={designationData}
                  getOptionLabel={option => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={designationData.find(item => item.name === designation.name) || null}
                  onChange={(e, value) => {
                    const selectedName = value ? value.name.trim() : ''

                    const newDesignations = [...designations]

                    newDesignations[index].name = selectedName // Update the name
                    setDesignations(newDesignations)
                    bucketFormik.setFieldValue('designations', newDesignations) // Sync with Formik
                  }}
                  renderInput={params => {
                    const isDuplicate =
                      designation.name && designations.some((d, i) => d.name === designation.name && i !== index)

                    const showRequiredError = bucketFormik.touched.designations?.[index]?.name && !designation.name // Check if the field is touched and empty

                    const showError = isDuplicate || showRequiredError // Combine errors

                    return (
                      <TextField
                        {...params}
                        label={`Designation ${index + 1}`}
                        error={showError}
                        helperText={
                          isDuplicate
                            ? 'Duplicate designation selected' // Duplicate error message
                            : showRequiredError
                              ? 'Designation is required' // Required field error message
                              : undefined
                        }
                      />
                    )
                  }}
                />
              </div>

              <div style={{ width: '150px', marginLeft: '10px' }}>
                <TextField
                  label='Role Count'
                  type='number'
                  value={designation.count === '' ? '' : designation.count} // Allow empty value
                  onChange={e => {
                    const value = e.target.value
                    const newDesignations = [...designations]

                    newDesignations[index].count = value === '' ? '' : parseInt(value, 10) || 1 // Ensure valid number
                    setDesignations(newDesignations)
                    bucketFormik.setFieldValue('designations', newDesignations) // Sync with Formik
                  }}
                  error={
                    !!(
                      typeof bucketFormik.errors.designations[index] === 'object' &&
                      bucketFormik.errors.designations[index]?.count
                    )
                  }
                  helperText={
                    bucketFormik.errors.designations &&
                    typeof bucketFormik.errors.designations[index] === 'object' &&
                    bucketFormik.errors.designations[index]?.count
                      ? bucketFormik.errors.designations[index].count
                      : undefined
                  }
                  fullWidth
                />
              </div>

              <div style={{ width: '300px', marginLeft: '10px' }}>
                <Autocomplete
                  options={gradeData || []}
                  getOptionLabel={option => option.grade || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={gradeData.find(item => item.name === designation.name) || null}
                  onChange={(e, value) => {
                    const selectedName = value ? value.name.trim() : ''

                    const newDesignations = [...designations]

                    newDesignations[index].grade = selectedName // Update the name
                    setDesignations(newDesignations)
                    bucketFormik.setFieldValue('designations', newDesignations) // Sync with Formik
                  }}
                  renderInput={params => {
                    const isDuplicate =
                      designation.grade && designations.some((d, i) => d.grade === designation.grade && i !== index)

                    const showRequiredError = bucketFormik.touched.designations?.[index]?.grade && !designation.grade // Check if the field is touched and empty

                    const showError = isDuplicate || showRequiredError // Combine errors

                    return (
                      <TextField
                        {...params}
                        label={`Grade ${index + 1}`}
                        error={showError}
                        helperText={
                          isDuplicate
                            ? 'Duplicate grade selected' // Duplicate error message
                            : showRequiredError
                              ? 'Grade is required' // Required field error message
                              : undefined
                        }
                      />
                    )
                  }}
                />
              </div>

              {designations.length > 1 && index > 0 && (
                <IconButton
                  color='secondary'
                  onClick={() => setDesignations(designations.filter((_, i) => i !== index))}
                >
                  <RemoveIcon />
                </IconButton>
              )}

              {index === designations.length - 1 && (
                <IconButton
                  color='primary'
                  onClick={() => setDesignations([...designations, { name: '', count: 1, grade: '' }])}
                >
                  <AddIcon />
                </IconButton>
              )}
            </div>
          ))}
        </div>

        <FormControl fullWidth margin='normal'>
          <label htmlFor='note' className='block text-sm font-medium text-gray-700'>
            Note
          </label>
          <TextField
            id='note'
            name='note'
            multiline
            rows={4}
            value={bucketFormik.values.note}
            onChange={bucketFormik.handleChange}
            onFocus={() => bucketFormik.setFieldTouched('note', true)}
            error={bucketFormik.touched.note && Boolean(bucketFormik.errors.note)}
            helperText={bucketFormik.touched.note && bucketFormik.errors.note ? bucketFormik.errors.note : undefined}
          />
        </FormControl>
      </fieldset>

      {/* Submit and Cancel Buttons */}
      <div className='flex justify-end space-x-4'>
        <DynamicButton
          type='button'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          onClick={handleCancel}
        >
          Cancel
        </DynamicButton>

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Save
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditBucket
