'use client'
import { Console } from 'console'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, IconButton, InputAdornment, Autocomplete, Tooltip, Card , Modal, Box, Button } from '@mui/material'

import AddIcon from '@mui/icons-material/AddCircleOutline'

import RemoveIcon from '@mui/icons-material/RemoveCircleOutline'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import DynamicButton from '@/components/Button/dynamicButton'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  addNewBucket,
  getTurnOverCode,
  updateBucketList,
  addNewTurnoverCode,
  fetchBucketDetails,
  fetchDesignationList
} from '@/redux/BucketManagementSlice'
import TurnOverModal from '@/views/pages/BucketManagment/TurnOverModal'

type Props = {
  mode: any
  id: any
}
interface DataItem {
  id: number
  turnover: number
  code: string
}

const AddOrEditBucket: React.FC<Props> = ({ mode, id }) => {
  const [error, setError] = useState<string>('')
  const [warning, setWarning] = useState<string>('')
  const [designations, setDesignations] = useState<any[]>([{ name: '', count: 1 }])
  const [modalData, setModalData] = useState(null)
  const [selectedTurnover, setSelectedTurnover] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [selectedTurnoverCode, setSelectedTurnoverCode] = useState('')
  const [designationOptions, setDesignationOptions] = useState()

  useEffect(() => {
    if (mode === 'edit') {
      dispatch(fetchBucketDetails(id))
    }
  }, [])

  const handleRadioChange = (turnoverCode: string) => {
    setSelectedTurnoverCode(turnoverCode) // Update state with selected turnover code
    console.log('Selected Turnover Code:', turnoverCode)
  }

  const [isEditMode, setIsEditMode] = useState(false)
  const [turnoverCode, setTurnoverCode] = useState('')

  const [modalState, setModalState] = useState({
    showTurnOverModal: false,
    showAddNewTurnoverModal: false
  })

  const { turnoverListData, fetchBucketDetailsData, isFetchBucketDetailsLoading, fetchBucketDetailsSuccess } =
    useAppSelector((state: any) => state.BucketManagementReducer)

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


  const { bucketListData, deleteBucketListSuccess, designationData } = useAppSelector(
    (state: any) => state.BucketManagementReducer
  )

  const getDesignationDatas = () => {
    const params = {
      page: 1,
      limit: 100
    }

    dispatch(fetchDesignationList(params))
  }

  useEffect(() => {
    getDesignationDatas()
  }, [])

  useEffect(() => {
    console.log('designationData', designationData)
  }, [designationData])

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
    setTurnoverCode(selectedTurnoverCode)
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
        turnoverID: data.length + 1, // Ensure unique turnoverID, adjust logic if needed
        turnoverCode: turnoverCode
      }

      console.log('dataaaa', newTurnover)
      setData([...data, newTurnover])
    }

    // Close the modal after saving
    setModalState({ ...modalState, showAddNewTurnoverModal: false })
    setTurnoverCode('') // Clear the turnoverCode input after save
  }

  const handleCancelNewTurnover = () => {
    setModalState({ ...modalState, showAddNewTurnoverModal: false })
  }

  const handleCloseTurnoverModal = () => {
    setModalState({ ...modalState, showTurnOverModal: false })
  }

  const handleDeleteTurnover = () => {
    const updatedData = data.filter(item => item.turnoverID !== selectedTurnover?.turnoverID)

    setData(updatedData)
    setShowDeleteModal(false)
  }

  const handleOpenDeleteModal = (item: any) => {
    setSelectedTurnover(item)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
  }

  // Inside Formik initialization
  const bucketFormik = useFormik({
    initialValues: {
      bucketName: '',
      turnoverCode: '',
      turnoverId: '',
      note: '',
      designations: [{ designationName: '', count: 1 }]
    },
    validationSchema: Yup.object().shape({
      bucketName: Yup.string().required('Bucket Name is required'),
      note: Yup.string(),
      designations: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required('Designation is required'),
          count: Yup.number().required('Role Count is required').min(1)
        })
      )
      .min(1, 'At least one designation is required')
    
    }),

    onSubmit: values => {
      const sanitizedDesignations = values.designations.map(designation => ({
        designationName: designation.name?.trim(), // Ensure no empty or whitespace-only values
        count: designation.count || 1
      }));
    
      // Check if any designationName is empty
      const invalidDesignations = sanitizedDesignations.some(d => !d.designationName);

      if (invalidDesignations) {
        alert('All designation names must be filled.');
        
return;
      }
    
      const params: any = {
        name: values.bucketName,
        positionCategories: sanitizedDesignations,
        turnoverCode: selectedTurnoverCode,
        notes: values.note,
        ...(mode === 'edit' && { id }) // Add id for edit mode
      };
    
      if (mode === 'edit') {
        dispatch(updateBucketList(params));
      } else {
        dispatch(addNewBucket(params));
      }

      router.push('/bucket-management');
    }
    
  })

  console.log('designationsSSS', bucketFormik.values.designations)

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
        count: item.count || 1
      }))

      // Update designations state and formik field value
      setDesignations(tempDesignations)
      bucketFormik.setFieldValue('designations', tempDesignations)
      console.log('ssssssssss', bucketFormik, tempDesignations)
    }
  }, [fetchBucketDetailsSuccess, fetchBucketDetailsData])

  // const handleBucketSubmit = (event: React.FormEvent) => {
  //   event.preventDefault() // Prevent default form submission
  //   // handleSaveNewBucket() // Call the function to save the new bucket
  // }
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = event?.target?.value
    const newDesignations = [...designations]

    if (value === '') {
      newDesignations[index].count = ''
      setWarning('')
      setError('')
    } else if (parseInt(value, 10) === 0) {
      setError('Value cannot be zero')
      setWarning('')
      newDesignations[index].count = ''
    } else {
      setError('')
      setWarning('')
      newDesignations[index].count = parseInt(value, 10)
    }

    setDesignations(newDesignations)
    console.log('designationData:', designations)
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
              id='bucketName'
              name='bucketName'
              type='text'
              value={bucketFormik.values.bucketName}
              onChange={bucketFormik.handleChange}
              onFocus={() => bucketFormik.setFieldTouched('bucketName', true)}
              error={bucketFormik.touched.bucketName && Boolean(bucketFormik.errors.bucketName)}
              helperText={
                bucketFormik.touched.bucketName && bucketFormik.errors.bucketName
                  ? String(bucketFormik.errors.bucketName)
                  : undefined
              }
            />
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <label htmlFor='turnoverCode' className='block text-sm font-medium text-gray-700'>
              Turnover Code
            </label>
            <div style={{ flexDirection: 'row' }}>
              <TextField
                onClick={() => handleClickTurnover(data[0])}
                value={turnoverCode}
                InputProps={{
                  readOnly: true
                }}
                sx={{ paddingRight: '10px' }}
                id='turnoverCode'
                name='turnoverCode'
                onChange={bucketFormik.handleChange}
                onFocus={() => bucketFormik.setFieldTouched('turnoverCode', true)}
                error={bucketFormik.touched.turnoverCode && Boolean(bucketFormik.errors.turnoverCode)}
                helperText={
                  bucketFormik.touched.turnoverCode && bucketFormik.errors.turnoverCode
                    ? String(bucketFormik.errors.turnoverCode)
                    : undefined
                }
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
                
                options={designationData} // Pass the array of objects as options
                getOptionLabel={option => option.name || ''} // Display the `name` field in the dropdown
                isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by `id` to avoid mismatches
                value={designationData.find(item => item.name === designation.name) || null} // Find the corresponding object based on the name
                onChange={(e, value) => {
                  const newDesignations = [...designations];

                  newDesignations[index].name = value ? value.name.trim() : ''; // Ensure trimmed value
                  setDesignations(newDesignations);
                  bucketFormik.setFieldValue('designations', newDesignations); // Sync with Formik
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={`Designation ${index + 1}`}
                    error={!!(bucketFormik.touched.designations && bucketFormik.errors.designations)}
                    helperText={
                      bucketFormik.touched.designations && bucketFormik.errors.designations
                        ? String(bucketFormik.errors.designations)
                        : undefined
                    }
                  />
                )}
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
                  onBlur={() => {
                    if (designation.count === '') {
                      const newDesignations = [...designations]

                      newDesignations[index].count = 1 // Default to 1
                      setDesignations(newDesignations)
                    }
                  }}
                  error={!!(bucketFormik.touched.designations && bucketFormik.errors.designations)}
                  helperText={bucketFormik.errors.designations ? String(bucketFormik.errors.designations) : undefined}
                  fullWidth
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
                <IconButton color='primary' onClick={() => setDesignations([...designations, { name: '', count: 1 }])}>
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






// ** Axios Imports
import AxiosLib from '@/lib/AxiosLib'

export const fetchDesignationList = createAsyncThunk<any, any>(
  'appMuthoot/fetchDesignationList',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/designation', {
        params
      })

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

//Bucket API

export const fetchBucketList = createAsyncThunk<any, any>(
  'appMuthoot/fetchBucketList',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/bucket', {
        params
      })

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBucketDetails = createAsyncThunk<any, any>(
  'appMuthoot/fetchBucketDetails',
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/bucket/${id}`)

      
return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)

export const addNewBucket = createAsyncThunk<any, any>(
  'appMuthoot/addNewBucket',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/bucket', params)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)

export const updateBucketList = createAsyncThunk<
  any,
  { bucketName: string; turnoverCode: any; Designation: any; note: string }
>('appMuthoot/updateBucketList', async (params: any, { rejectWithValue }) => {
  try {
    const requestData = {
      id: params.id,
      name: params.bucketName.toLowerCase(),
      positionCategories: params.Designation,
      turnoverCode: params.turnoverCode,
      notes: params.note
    }

    const response = await AxiosLib.patch(`/bucket/${id}`, requestData)

    
return response
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data)
    } else if (error.request) {
      return rejectWithValue({ message: 'No response from server. Please try again later.' })
    } else {
      return rejectWithValue({ message: 'Unexpected error occurred.' })
    }
  }
})

export const deleteBucket = createAsyncThunk<any, string>(
  'appMuthoot/deleteBucket',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.delete(`/bucket/${id}`)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error deleting the bucket')
    }
  }
)

// Turnover Code API

export const getTurnOverCode = createAsyncThunk<any, any>(
  'appMuthoot/getTurnOverCode',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/turnover', {
        params
      })

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const addNewTurnoverCode = createAsyncThunk<any, any>(
  'appMuthoot/AddTurnoverCode',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/turnover', params)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)

export const BucketManagementSlice: any = createSlice({
  name: 'BucketManagement',
  initialState: {
    designationData: [],
    isBucketListLoading: false,
    bucketListSuccess: false,
    bucketListFailure: false,
    bucketListFailureMessage: '',

    bucketListData: [],
    isFetchDesignationListLoading: false,
    fetchDesignationListSuccess: false,
    fetchDesignationListFailure: false,
    fetchDesignationListFailureMessage: '',

    fetchBucketDetailsData: [],
    isFetchBucketDetailsLoading: false,
    fetchBucketDetailsSuccess: false,
    fetchBucketDetailsFailure: false,
    fetchBucketDetailsFailureMessage: '',

    updateBucketList: [],
    isUpdateBucketListLoading: false,
    updateBucketListSuccess: false,
    updateBucketListFailure: false,
    updateBucketListFailureMessage: '',

    deleteBucketList: [],
    isDeleteBucketListLoading: false,
    deleteBucketListSuccess: false,
    deleteBucketListFailure: false,
    deleteBucketListFailureMessage: '',

    turnoverListData: [],
    isTurnoverListLoading: false,
    turnoverListSuccess: false,
    turnoverListFailure: false,
    turnoverListFailureMessage: '',
    totalTurnoverCount: 0
  },
  reducers: {
    fetchBucketDismiss: state => {
      ;(state.isFetchBucketDetailsLoading = false),
        (state.fetchBucketDetailsSuccess = false),
        (state.fetchBucketDetailsFailure = false),
        (state.fetchBucketDetailsFailureMessage = '')
    }
  },
  extraReducers: builder => {
    //fetch Designation List
    builder.addCase(fetchDesignationList.pending, state => {
      state.isFetchDesignationListLoading = true
    })
    builder.addCase(fetchDesignationList.fulfilled, (state, action) => {
      state.designationData = action?.payload?.data
      state.isFetchDesignationListLoading = false
      state.bucketListSuccess = true
    })
    builder.addCase(fetchDesignationList.rejected, (state, action: any) => {
      state.isFetchDesignationListLoading = false
      state.designationData = []
      state.fetchDesignationListFailure = true
      state.fetchDesignationListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Fetch Bucket List
    builder.addCase(fetchBucketList.pending, state => {
      state.isBucketListLoading = true
    })
    builder.addCase(fetchBucketList.fulfilled, (state, action) => {
      state.bucketListData = action.payload
      state.isBucketListLoading = false
    })
    builder.addCase(fetchBucketList.rejected, (state, action: any) => {
      state.isBucketListLoading = false
      state.bucketListData = []
      state.bucketListFailure = true
      state.bucketListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Fetch Bucket Details
    builder.addCase(fetchBucketDetails.pending, state => {
      state.isFetchBucketDetailsLoading = true
    })
    builder.addCase(fetchBucketDetails.fulfilled, (state, action) => {
      state.fetchBucketDetailsData = action.payload
      state.isFetchBucketDetailsLoading = false
      state.fetchBucketDetailsSuccess = true
    })
    builder.addCase(fetchBucketDetails.rejected, (state, action: any) => {
      state.isFetchBucketDetailsLoading = false
      state.fetchBucketDetailsData = []
      state.fetchBucketDetailsFailure = true
      state.fetchBucketDetailsFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Update Bucket List
    builder.addCase(updateBucketList.pending, state => {
      state.isUpdateBucketListLoading = true
    })
    builder.addCase(updateBucketList.fulfilled, (state, action) => {
      state.updateBucketList = action.payload
      state.isUpdateBucketListLoading = false
      state.updateBucketListSuccess = true
    })
    builder.addCase(updateBucketList.rejected, (state, action: any) => {
      state.isUpdateBucketListLoading = false
      state.updateBucketList = []
      state.updateBucketListFailure = true
      state.updateBucketListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Delete Bucket List
    builder.addCase(deleteBucket.pending, state => {
      state.isDeleteBucketListLoading = true
    })
    builder.addCase(deleteBucket.fulfilled, (state, action) => {
      state.deleteBucketList = action.payload
      state.isDeleteBucketListLoading = false
      state.deleteBucketListSuccess = true
    })
    builder.addCase(deleteBucket.rejected, (state, action: any) => {
      state.isDeleteBucketListLoading = false
      state.deleteBucketList = []
      state.deleteBucketListFailure = true
      state.deleteBucketListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    builder.addCase(getTurnOverCode.pending, state => {
      state.isTurnoverListLoading = true
    })
    builder.addCase(getTurnOverCode.fulfilled, (state, action) => {
      state.turnoverListData = action.payload.data
      state.totalTurnoverCount = action.payload.totalCount

      state.isTurnoverListLoading = false
    })
    builder.addCase(getTurnOverCode.rejected, (state, action: any) => {
      state.isTurnoverListLoading = false
      state.turnoverListData = []
      state.turnoverListFailure = true
      state.turnoverListFailureMessage = action?.payload?.message || 'Listing Failed'
    })
  }
})

// export const { setIsLoggedIn, LoginDataDismiss } = BucketManagementSlice.actions
export default BucketManagementSlice.reducer

