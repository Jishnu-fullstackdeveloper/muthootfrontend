import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'

export const getBranchList = createAsyncThunk<any, { search: string; page: number; limit: number }>(
  'branchManagement/getBranchList',
  async ({ search, page, limit }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/branch`, {
        params: {
          search,
          page,
          limit
        }
      })

      
return response.data // Assuming the API returns the data directly
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Create the slice
export const branchManagementSlice = createSlice({
  name: 'branchManagement',
  initialState: {
    branchListLoading: false,
    branchListSuccess: false,
    branchListData: [],
    branchListTotal: 0,
    branchListFailure: false,
    branchListFailureMessage: ''
  },
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    // Use the helper function for the getBranchList thunk
    handleAsyncThunkStates(builder, getBranchList, 'branchList')
  }
})

export const {} = branchManagementSlice.actions
export default branchManagementSlice.reducer
