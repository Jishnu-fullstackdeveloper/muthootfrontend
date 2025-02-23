import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'

const initialState = {
  manualRequestLoading: false,
  manualRequestData: null,
  manualRequestError: null,
  manualRequestSuccess: false,
  manualRequestErrorMessage: ''
}

export const manualRecruitmentRequest = createAsyncThunk<any, any>(
  'appMuthoot/manualRecruitmentRequest',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/api/recruitment-request', { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const manualRecruitmentRequestSlice = createSlice({
  name: 'appMuthoot',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(manualRecruitmentRequest.pending, state => {
      state.manualRequestLoading = true
    })
    builder.addCase(manualRecruitmentRequest.fulfilled, (state, action) => {
      state.manualRequestLoading = false
      state.manualRequestSuccess = true
      state.manualRequestData = action.payload
    })
    builder.addCase(manualRecruitmentRequest.rejected, (state, action: any) => {
      state.manualRequestLoading = false
      state.manualRequestSuccess = false
      state.manualRequestError = true
      state.manualRequestErrorMessage = action?.payload?.message || 'Failed to fetch details!'
    })
  }
})

export default manualRecruitmentRequestSlice.reducer
