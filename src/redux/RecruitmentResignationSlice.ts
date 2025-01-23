import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AxiosLib from '@/lib/AxiosLib'

/**
 * @author Siyad M
 * @description Fetches the resignation overview list using Axios.
 * @function fetchResignationOverviewList
 * @param {string} params
 */

export const fetchResignationOverviewList = createAsyncThunk<any, any>(
  'appTms/fetchTicketsList',
  async (params: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('business/ticket', {
        params
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const recruitmentResignationSlice = createSlice({
  name: 'appMuthoot',
  initialState: {
    fetchResignationOverviewListLoading: false,
    fetchResignationOverviewListSuccess: false,
    fetchResignationOverviewListData: [],
    fetchResignationOverviewListFailure: false,
    fetchResignationOverviewListFailureMessage: ''
  },
  reducers: {
    fetchResignationAPIDismiss: state => {
      state.fetchResignationOverviewListLoading = false
      state.fetchResignationOverviewListSuccess = false
      state.fetchResignationOverviewListFailure = false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchResignationOverviewList.pending, state => {
      state.fetchResignationOverviewListLoading = true
    })
    builder.addCase(fetchResignationOverviewList.fulfilled, (state, action) => {
      state.fetchResignationOverviewListLoading = false
      state.fetchResignationOverviewListSuccess = true
      state.fetchResignationOverviewListData = action.payload
    })
    builder.addCase(fetchResignationOverviewList.rejected, (state, action: any) => {
      state.fetchResignationOverviewListLoading = false
      state.fetchResignationOverviewListSuccess = false
      state.fetchResignationOverviewListFailure = true
      state.fetchResignationOverviewListFailureMessage = action?.payload?.message || 'Failed to fetch details!'
    })
  }
})

export const { fetchResignationAPIDismiss } = recruitmentResignationSlice.actions

export default recruitmentResignationSlice.reducer
