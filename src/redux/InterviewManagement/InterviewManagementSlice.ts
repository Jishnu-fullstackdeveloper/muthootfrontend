import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/interviewManagement'

// Thunks
export const fetchInterviewList = createAsyncThunk(
  'InterviewManagement/fetchInterviewList',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getInterview, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchInterviewById = createAsyncThunk(
  'InterviewManagement/fetchInterviewById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`${API_ENDPOINTS.getInterview}/${id}`)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch Interview'

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode || 500
      })
    }
  }
)

export const addNewInterview = createAsyncThunk<any, any>(
  'InterviewManagement/addNewInterview',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.addNewInterview, params)

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

export const updateInterviewDetails = createAsyncThunk<any, any>(
  'InterviewManagement/updateInterviewDetails',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.patch(`${API_ENDPOINTS.addNewInterview}/${params.id}`, params)

      return { ...response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Initial State
const initialState = {
  isInterviewLoading: false,
  InterviewSuccess: false,
  InterviewFailure: false,
  InterviewFailureMessage: '',
  selectedInterviewData: null,
  isInterviewByIdLoading: false,
  InterviewByIdSuccess: false,
  InterviewByIdFailure: false,
  InterviewByIdFailureMessage: '',
  addNewInterviewData: [],
  isAddInterviewLoading: false,
  addInterviewSuccess: false,
  addInterviewFailure: false,
  addInterviewFailureMessage: '',
  updateInterviewData: [],
  isUpdateInterviewLoading: false,
  updateInterviewSuccess: false,
  updateInterviewFailure: false,
  updateInterviewFailureMessage: ''
}

// Slice
const InterviewManagementSlice = createSlice({
  name: 'InterviewManagement',
  initialState,
  reducers: {
    fetchInterviewDismiss: state => {
      state.InterviewFailure = false
      state.InterviewFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder

      // fetchInterviewList
      .addCase(fetchInterviewList.pending, state => {
        state.isInterviewLoading = true
        state.InterviewSuccess = false
        state.InterviewFailure = false
      })
      .addCase(fetchInterviewList.fulfilled, (state, action) => {
        state.isInterviewLoading = false
        state.InterviewSuccess = true
        state.selectedInterviewData = action.payload
      })
      .addCase(fetchInterviewList.rejected, (state, action: any) => {
        state.isInterviewLoading = false
        state.InterviewFailure = true
        state.InterviewFailureMessage = action.payload?.message || 'Fetch failed'
      })

      // fetchInterviewById
      .addCase(fetchInterviewById.pending, state => {
        state.isInterviewByIdLoading = true
        state.InterviewByIdSuccess = false
        state.InterviewByIdFailure = false
      })
      .addCase(fetchInterviewById.fulfilled, (state, action) => {
        state.isInterviewByIdLoading = false
        state.InterviewByIdSuccess = true
        state.selectedInterviewData = action.payload
      })
      .addCase(fetchInterviewById.rejected, (state, action: any) => {
        state.isInterviewByIdLoading = false
        state.InterviewByIdFailure = true
        state.InterviewByIdFailureMessage = action.payload?.message?.join(', ') || 'Fetch failed'
      })

      // addNewInterview
      .addCase(addNewInterview.pending, state => {
        state.isAddInterviewLoading = true
        state.addInterviewSuccess = false
        state.addInterviewFailure = false
      })
      .addCase(addNewInterview.fulfilled, (state, action) => {
        state.isAddInterviewLoading = false
        state.addInterviewSuccess = true
        state.addNewInterviewData = action.payload
      })
      .addCase(addNewInterview.rejected, (state, action: any) => {
        state.isAddInterviewLoading = false
        state.addInterviewFailure = true
        state.addInterviewFailureMessage = action.payload?.message?.join(', ') || 'Creation failed'
      })

      // updateInterviewDetails
      .addCase(updateInterviewDetails.pending, state => {
        state.isUpdateInterviewLoading = true
        state.updateInterviewSuccess = false
        state.updateInterviewFailure = false
      })
      .addCase(updateInterviewDetails.fulfilled, (state, action) => {
        state.isUpdateInterviewLoading = false
        state.updateInterviewSuccess = true
        state.updateInterviewData = action.payload
      })
      .addCase(updateInterviewDetails.rejected, (state, action: any) => {
        state.isUpdateInterviewLoading = false
        state.updateInterviewFailure = true
        state.updateInterviewFailureMessage = action.payload?.message || 'Update failed'
      })
  }
})

export const { fetchInterviewDismiss } = InterviewManagementSlice.actions
export default InterviewManagementSlice.reducer
