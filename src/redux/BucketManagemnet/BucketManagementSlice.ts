import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/bucketManagement'

export const fetchJobRole = createAsyncThunk(
  'bucketManagement/fetchJobRole',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getJobRoleUrl, { params })

      return response
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBucket = createAsyncThunk(
  'bucketManagement/fetchBucket',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getBucketUrl, { params })

      return response
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBucketById = createAsyncThunk(
  'bucketManagement/fetchBucketById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`${API_ENDPOINTS.getBucketByID}/${id}`)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch bucket'

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode || 500
      })
    }
  }
)

export const addNewBucket = createAsyncThunk<any, any>(
  'bucketManagement/addNewBucket',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.addNewBucketUrl, params)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode
      })
    }
  }
)

export const updateBucket = createAsyncThunk<
  any,
  { id: string; params: { positionCategories: { jobRole: string; count: number }[] } }
>('bucketManagement/updateBucket', async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.put(`${API_ENDPOINTS.updateBucketUrl}?id=${id}`, {
      positionCategories: params.positionCategories
    })

    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update bucket'

    return rejectWithValue({
      message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
      statusCode: error.response?.data?.statusCode || 500
    })
  }
})

export const BucketManagementSlice = createSlice({
  name: 'BucketManagement',
  initialState: {
    jobRoleData: {
      data: [],
      totalCount: 0
    },
    isJobRoleLoading: false,
    jobRoleSuccess: false,
    jobRoleFailure: false,
    jobRoleFailureMessage: '',

    bucketData: {
      data: [],
      totalCount: 0
    },
    isBucketLoading: false,
    bucketSuccess: false,
    bucketFailure: false,
    bucketFailureMessage: '',
    selectedBucketData: null,
    isBucketByIdLoading: false,
    bucketByIdSuccess: false,
    bucketByIdFailure: false,
    bucketByIdFailureMessage: '',
    addNewBucketData: [],
    isAddBucketLoading: false,
    addBucketSuccess: false,
    addBucketFailure: false,
    addBucketFailureMessage: '',
    updateBucketData: [],
    isUpdateBucketLoading: false,
    updateBucketSuccess: false,
    updateBucketFailure: false,
    updateBucketFailureMessage: ''
  },
  reducers: {
    fetchBucketDismiss: state => {
      state.isBucketLoading = false
      state.bucketSuccess = false
      state.bucketFailure = false
      state.bucketFailureMessage = ''
      state.isBucketByIdLoading = false
      state.bucketByIdSuccess = false
      state.bucketByIdFailure = false
      state.bucketByIdFailureMessage = ''
      state.isUpdateBucketLoading = false
      state.updateBucketSuccess = false
      state.updateBucketFailure = false
      state.updateBucketFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchJobRole.pending, state => {
      state.isJobRoleLoading = true
    })
    builder.addCase(fetchJobRole.fulfilled, (state, action) => {
      state.jobRoleData = action?.payload?.data
      state.isJobRoleLoading = false
      state.jobRoleSuccess = true
    })
    builder.addCase(fetchJobRole.rejected, (state, action: any) => {
      state.isJobRoleLoading = false
      state.jobRoleData = { data: [], totalCount: 0 }
      state.jobRoleFailure = true
      state.jobRoleFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    // Fetch Bucket List
    builder.addCase(fetchBucket.pending, state => {
      state.isBucketLoading = true
    })
    builder.addCase(fetchBucket.fulfilled, (state, action) => {
      state.bucketData = action?.payload?.data
      state.isBucketLoading = false
      state.bucketSuccess = true
    })
    builder.addCase(fetchBucket.rejected, (state, action: any) => {
      state.isBucketLoading = false
      state.bucketData.data = []
      state.bucketFailure = true
      state.bucketFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    // Fetch Bucket by ID
    builder.addCase(fetchBucketById.pending, state => {
      state.isBucketByIdLoading = true
      state.bucketByIdSuccess = false
      state.bucketByIdFailure = false
      state.bucketByIdFailureMessage = ''
    })
    builder.addCase(fetchBucketById.fulfilled, (state, action) => {
      state.selectedBucketData = action.payload.data
      state.isBucketByIdLoading = false
      state.bucketByIdSuccess = true
    })
    builder.addCase(fetchBucketById.rejected, (state, action: any) => {
      state.isBucketByIdLoading = false
      state.bucketByIdSuccess = false
      state.bucketByIdFailure = true
      state.bucketByIdFailureMessage = action.payload?.message || 'Failed to fetch bucket'
    })

    // Add New Bucket
    builder.addCase(addNewBucket.pending, state => {
      state.isAddBucketLoading = true
      state.addBucketSuccess = false
      state.addBucketFailure = false
      state.addBucketFailureMessage = ''
    })
    builder.addCase(addNewBucket.fulfilled, state => {
      state.isAddBucketLoading = false
      state.addBucketSuccess = true
      state.addBucketFailure = false
    })
    builder.addCase(addNewBucket.rejected, (state, action: any) => {
      state.isAddBucketLoading = false
      state.addBucketSuccess = false
      state.addBucketFailure = true
      state.addBucketFailureMessage = action.payload?.message || 'Failed to add bucket'
    })

    // Update Bucket
    builder.addCase(updateBucket.pending, state => {
      state.isUpdateBucketLoading = true
      state.updateBucketSuccess = false
      state.updateBucketFailure = false
      state.updateBucketFailureMessage = ''
    })
    builder.addCase(updateBucket.fulfilled, state => {
      state.isUpdateBucketLoading = false
      state.updateBucketSuccess = true
      state.updateBucketFailure = false
    })
    builder.addCase(updateBucket.rejected, (state, action: any) => {
      state.isUpdateBucketLoading = false
      state.updateBucketSuccess = false
      state.updateBucketFailure = true
      state.updateBucketFailureMessage = action.payload?.message || 'Failed to update bucket'
    })
  }
})

export const { fetchBucketDismiss } = BucketManagementSlice.actions
export default BucketManagementSlice.reducer
