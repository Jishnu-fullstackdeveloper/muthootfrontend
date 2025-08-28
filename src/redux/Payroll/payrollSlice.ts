import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/maker/maker-payroll-configs/`

// Async thunk
export const fetchPayrollConfigs = createAsyncThunk<any, any>(
  'payrollConfigs/fetchPayrollConfigs',
  async (employeeCode: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?employee_code=${employeeCode}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const payrollConfigsSlice = createSlice({
  name: 'payrollConfigs',
  initialState: {
    payrollConfigs: null, // <-- one state object for employee + configs
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPayrollConfigs.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayrollConfigs.fulfilled, (state, action) => {
        state.loading = false
        state.payrollConfigs = action.payload
        console.log(action.payload, 'action')
      })
      .addCase(fetchPayrollConfigs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

// Selectors
export const selectPayrollData = state => state.payrollConfigs.data
export const selectLoading = state => state.payrollConfigs.loading
export const selectError = state => state.payrollConfigs.error

export default payrollConfigsSlice.reducer
