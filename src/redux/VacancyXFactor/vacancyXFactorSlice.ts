import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/xFactor' // Adjusted to point to XFactor API endpoints

export const fetchVacancyXFactor = createAsyncThunk(
  'xFactor/fetchVacancyXFactor',
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getVacancyXfactorUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

export const fetchDesignation = createAsyncThunk(
  'designation/fetchDesignation',
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

// export const createXFactor = createAsyncThunk(
//   'xFactor/createXFactor',
//   async (params: { data: { designationName: string; xFactor: number }[] }, { rejectWithValue }) => {
//     try {
//       const response = await AxiosLib.post(API_ENDPOINTS.createXfactorUrl, params)

//       return response.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'An error occurred while creating X-Factor')
//     }
//   }
// )

export const updateVacancyXFactor = createAsyncThunk(
  'xFactor/updateVacancyXFactor',
  async ({ id, data }: { id: string; data: { designationName: string; xFactor: number } }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.put(API_ENDPOINTS.UpdateVacancyXfactorUrl(id), data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred while updating X-Factor')
    }
  }
)

export const xFactorSlice = createSlice({
  name: 'xFactor',
  initialState: {
    vacancyXFactorData: [],
    totalCount: 0, // Total number of records
    isVacancyXFactorLoading: false,
    vacancyXFactorSuccess: false,
    vacancyXFactorFailure: false,
    vacancyXFactorFailureMessage: '',

    designationData: [],
    isDesignationLoading: false,
    designationSuccess: false,
    designationFailure: false,
    designationFailureMessage: '',

    isCreatingXFactor: false,
    createXFactorSuccess: false,
    createXFactorFailure: false,
    createXFactorFailureMessage: ''
  },
  reducers: {
    resetXFactorState: state => {
      state.isVacancyXFactorLoading = false
      state.vacancyXFactorSuccess = false
      state.vacancyXFactorFailure = false
      state.vacancyXFactorFailureMessage = ''
      state.createXFactorSuccess = false
      state.createXFactorFailure = false
      state.createXFactorFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVacancyXFactor.pending, state => {
        state.isVacancyXFactorLoading = true
      })
      .addCase(fetchVacancyXFactor.fulfilled, (state, action) => {
        state.vacancyXFactorData = action.payload.data
        state.totalCount = action.payload.pagination.totalItems // Extract totalItems from the API response
        state.isVacancyXFactorLoading = false
        state.vacancyXFactorSuccess = true
      })
      .addCase(fetchVacancyXFactor.rejected, (state, action) => {
        state.isVacancyXFactorLoading = false
        state.vacancyXFactorFailure = true
        state.vacancyXFactorFailureMessage =
          (action.payload && typeof action.payload === 'object' && 'message' in action.payload
            ? (action.payload as { message?: string }).message
            : undefined) || 'Failed to fetch X-Factor data'
      })

      .addCase(fetchDesignation.pending, state => {
        state.isDesignationLoading = true
        state.designationSuccess = false
        state.designationFailure = false
        state.designationFailureMessage = ''
      })
      .addCase(fetchDesignation.fulfilled, (state, action) => {
        state.isDesignationLoading = false
        state.designationSuccess = true
        state.designationData = action.payload.data
      })

      .addCase(fetchDesignation.rejected, (state, action) => {
        state.isDesignationLoading = false
        state.designationFailure = true
        state.designationFailureMessage =
          (action.payload && typeof action.payload === 'object' && 'message' in action.payload
            ? (action.payload as { message?: string }).message
            : undefined) || 'Failed to fetch Designation data'
      })

    // .addCase(createXFactor.pending, state => {
    //   state.isCreatingXFactor = true
    //   state.createXFactorSuccess = false
    //   state.createXFactorFailure = false
    //   state.createXFactorFailureMessage = ''
    // })
    // .addCase(createXFactor.fulfilled, (state, action) => {
    //   state.isCreatingXFactor = false
    //   state.createXFactorSuccess = true
    //   state.resignedXFactorData.push(action.payload) // Add the new X-Factor to the list
    // })
    // .addCase(createXFactor.rejected, (state, action) => {
    //   state.isCreatingXFactor = false
    //   state.createXFactorFailure = true
    //   state.createXFactorFailureMessage = action.payload || 'Failed to create X-Factor'
    // })
  }
})

export const { resetXFactorState } = xFactorSlice.actions
export default xFactorSlice.reducer
