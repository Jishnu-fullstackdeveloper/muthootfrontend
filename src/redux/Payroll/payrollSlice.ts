// payrollSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// Get the base URL from environment variable with fallback
const PAYROLL_API_BASE_URL = process.env.NEXT_PUBLIC_PAYROLL_API_BASE_URL || 'https://payroll-dev.gnxsolutions.app'
const EMPLOYEE_CODES_URL = `${PAYROLL_API_BASE_URL}/api/v1/maker/employee-codes/`
const PAYROLL_CONFIGS_URL = `${PAYROLL_API_BASE_URL}/api/v1/maker/maker-payroll-configs/`
const UPLOAD_MANUAL_PAYROLL_URL = `${PAYROLL_API_BASE_URL}/api/v1/maker/upload-manual-payroll/`
// Types for the new endpoints
interface PayrollConfig {
  payroll_config_id: string
  name: string
  type: string
  input_type: 'manual' | 'bulk'
  department: string
}
interface PayrollConfigsResponse {
  employee_id: string
  employee_code: string
  employee_name: string
  total_configs: number
  departments: string[]
  payroll_configs: PayrollConfig[]
}
interface UploadManualPayrollResponse {
  message: string
  task_id: string
  status_endpoint: string
  progress_endpoint: string
}
interface UploadManualPayrollPayload {
  date: string
  incentive_type: string
  entries: Array<{
    employee_code: string
    amount: string
    remarks: string
    attachment?: File
  }>
}
export const fetchPayrollConfigs = createAsyncThunk<PayrollConfigsResponse, string>(
  'payrollConfigs/fetchPayrollConfigs',
  async (employeeCode: string, { rejectWithValue }) => {
    try {
      const url = `${PAYROLL_CONFIGS_URL}?employee_code=${employeeCode}`
      const response = await axios.get(url)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const fetchEmployeeCodes = createAsyncThunk<string[]>(
  'payrollConfigs/fetchEmployeeCodes',
  async (_, { rejectWithValue }) => {
    try {
      // Check for invalid URL before the call
      if (!EMPLOYEE_CODES_URL || EMPLOYEE_CODES_URL.includes('undefined')) {
        throw new Error('Invalid API URL configuration')
      }
      const response = await axios.get(EMPLOYEE_CODES_URL, {
        withCredentials: true
      })

      // Extract the array of employee codes, assuming response.data.data holds the array
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data
      } else {
        // Return empty array if data format is unexpected
        return []
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch employee codes')
    }
  }
)
export const uploadManualPayroll = createAsyncThunk<UploadManualPayrollResponse, UploadManualPayrollPayload>(
  'payrollConfigs/uploadManualPayroll',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('date', payload.date)
      formData.append('incentive_type', payload.incentive_type)

      payload.entries.forEach((entry, index) => {
        formData.append(`entries[${index}][employee_code]`, entry.employee_code)
        formData.append(`entries[${index}][amount]`, entry.amount)
        formData.append(`entries[${index}][remarks]`, entry.remarks)
        if (entry.attachment) {
          formData.append(`entries[${index}][attachment]`, entry.attachment)
        }
      })

      const response = await axios.post(UPLOAD_MANUAL_PAYROLL_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to upload manual payroll')
    }
  }
)

// Redux Slice State
interface PayrollState {
  payrollConfigs: PayrollConfigsResponse | null
  employeeCodes: string[]
  loading: boolean
  error: string | null
  employeeCodesLoading: boolean
  employeeCodesError: string | null
  uploadManualPayrollLoading: boolean
  uploadManualPayrollError: string | null
  uploadManualPayrollResponse: UploadManualPayrollResponse | null
}

const initialState: PayrollState = {
  payrollConfigs: null,
  employeeCodes: [],
  loading: false,
  error: null,
  employeeCodesLoading: false,
  employeeCodesError: null,
  uploadManualPayrollLoading: false,
  uploadManualPayrollError: null,
  uploadManualPayrollResponse: null
}

const payrollConfigsSlice = createSlice({
  name: 'payrollConfigs',
  initialState,
  reducers: {
    // Reducer to clear a specific slice of the state
    clearPayrollData: state => {
      state.payrollConfigs = null
      state.error = null
    },
    clearEmployeeCodes: state => {
      state.employeeCodes = []
      state.employeeCodesError = null
    },
    clearUploadManualPayroll: state => {
      state.uploadManualPayrollLoading = false
      state.uploadManualPayrollError = null
      state.uploadManualPayrollResponse = null
    }
  },
  extraReducers: builder => {
    builder
      // fetchPayrollConfigs cases
      .addCase(fetchPayrollConfigs.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayrollConfigs.fulfilled, (state, action) => {
        state.loading = false
        state.payrollConfigs = action.payload
      })
      .addCase(fetchPayrollConfigs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // fetchEmployeeCodes cases
      .addCase(fetchEmployeeCodes.pending, state => {
        state.employeeCodesLoading = true
        state.employeeCodesError = null
      })
      .addCase(fetchEmployeeCodes.fulfilled, (state, action) => {
        state.employeeCodesLoading = false
        // Store the array of employee codes directly, with a fallback
        state.employeeCodes = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchEmployeeCodes.rejected, (state, action) => {
        state.employeeCodesLoading = false
        state.employeeCodesError = action.payload as string
      })
      // uploadManualPayroll cases
      .addCase(uploadManualPayroll.pending, state => {
        state.uploadManualPayrollLoading = true
        state.uploadManualPayrollError = null
        state.uploadManualPayrollResponse = null
      })
      .addCase(uploadManualPayroll.fulfilled, (state, action) => {
        state.uploadManualPayrollLoading = false
        state.uploadManualPayrollResponse = action.payload
      })
      .addCase(uploadManualPayroll.rejected, (state, action) => {
        state.uploadManualPayrollLoading = false
        state.uploadManualPayrollError = action.payload as string
      })
  }
})
// Selectors
// A selector type is needed to access the slice state under the assumed key 'payrollConfigs'
type RootState = {
  payrollConfigs: PayrollState
}
export const selectPayrollData = (state: RootState) => state.payrollConfigs.payrollConfigs
export const selectLoading = (state: RootState) => state.payrollConfigs.loading
export const selectError = (state: RootState) => state.payrollConfigs.error
export const selectEmployeeCodes = (state: RootState) => state.payrollConfigs.employeeCodes
export const selectEmployeeCodesLoading = (state: RootState) => state.payrollConfigs.employeeCodesLoading
export const selectEmployeeCodesError = (state: RootState) => state.payrollConfigs.employeeCodesError
export const selectUploadManualPayrollLoading = (state: RootState) => state.payrollConfigs.uploadManualPayrollLoading
export const selectUploadManualPayrollError = (state: RootState) => state.payrollConfigs.uploadManualPayrollError
export const selectUploadManualPayrollResponse = (state: RootState) => state.payrollConfigs.uploadManualPayrollResponse
export const { clearPayrollData, clearEmployeeCodes, clearUploadManualPayroll } = payrollConfigsSlice.actions
export default payrollConfigsSlice.reducer
