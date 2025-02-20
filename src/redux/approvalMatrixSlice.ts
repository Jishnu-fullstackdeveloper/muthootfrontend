import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib' // Ensure AxiosLib is configured correctly

// Define SectionConfig interface

// interface SectionConfig {
//   designationId: string
//   approvalSequenceLevel: number
// }

// Define ApprovalMatrixState interface
interface ApprovalMatrixState {
  approvalCategories: any[] // Store the list of approval categories
  approvalMatrixData: any[] // Store the list of approval matrices
  status: 'idle' | 'loading' | 'succeeded' | 'failed' // For tracking API calls
  error: string | null // For error handling
  totalItems: number // Total number of approval matrices (for pagination)
  options: Array<{ id: number; name: string }>
  page: number
  limit: number
  totalPages: number
}

// Initial state
const initialState: ApprovalMatrixState = {
  approvalCategories: [],
  approvalMatrixData: [],
  status: 'idle',
  error: null,
  totalItems: 0,
  options: [],
  page: 1,
  limit: 10,
  totalPages: 10
}

//APPROVAL CATEGORIES
// Async thunk for fetching all approval categories with pagination
export const fetchApprovalCategories = createAsyncThunk(
  'apphrms/fetchApprovalCategories',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/approval-action-categories', {
        params: { page, limit }
      })

      const { items = [], meta = {} } = response.data || {} // Extracting `items`

      return {
        data: items, // Store the extracted `items`
        totalItems: meta.total || 0,
        page: meta.page?.page || 1, // Fixing incorrect `meta.page`
        limit: meta.limit || 10
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch approval categories')
    }
  }
)

//APPROVAL MATRIX
// Async thunk for fetching all approval matrices with pagination
export const fetchApprovalMatrices = createAsyncThunk(
  'apphrms/fetchApprovalMatrices',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('approval-actions', {
        params: { page, limit }
      })

      const { items = [], meta = {} } = response.data || {} // Extracting `items`

      return {
        data: items, // Store the extracted `items`
        totalItems: meta.total || 0,
        page: meta.page?.page || 1, // Fixing incorrect `meta.page`
        limit: meta.limit || 10
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch approval matrices')
    }
  }
)

// Create approval matrix (new)
export const createNewApprovalMatrix = createAsyncThunk(
  'apphrms/createNewApprovalMatrix',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('approval-actions', params)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create approval matrix')
    }
  }
)

// Update an approval matrix
export const updateApprovalMatrix = createAsyncThunk(
  'apphrms/updateApprovalMatrix',
  async ({ id, approvalMatrix }: { id: string; approvalMatrix: any }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.patch(`approval-actions/${id}`, { approvalMatrix })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Update failed' })
    }
  }
)

// Async thunk for deleting an approval matrix
export const deleteApprovalMatrix = createAsyncThunk(
  'apphrms/deleteApprovalMatrix',
  async (id: string, { rejectWithValue }) => {
    try {
      await AxiosLib.delete(`approval-actions/${id}`)

      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete approval matrix')
    }
  }
)

// set options for autocomplete/dropdown
// export const setApprovalMatrixOptions = createAsyncThunk(
//   'apphrms/setApprovalMatrixOptions',
//   async (requestData: RequestOptionsPayload, { rejectWithValue }) => {
//     try {
//       // Send requestData directly in the body, not as params
//       const response = await AxiosLib.post('/api/recruitment-request/options', requestData)
//       return response.data.data
//     } catch (error: any) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

export const getApprovalMatrixOptions = createAsyncThunk(
  'apphrms/setApprovalMatrixOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/appproval-actions/designations')

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching approval matrix options')
    }
  }
)

// Slice definition
const approvalMatrixSlice = createSlice({
  name: 'approvalMatrix',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      // Fetch approval categories
      .addCase(fetchApprovalCategories.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchApprovalCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.approvalCategories = action.payload.data // Corrected assignment
        state.totalItems = action.payload.totalItems
        state.page = action.payload.page
        state.limit = action.payload.limit

        //state.totalPages = action.payload.totalPages
      })
      .addCase(fetchApprovalCategories.rejected, state => {
        state.status = 'failed'

        //state.error = action.payload
      })

      // Fetch approval matrices
      .addCase(fetchApprovalMatrices.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchApprovalMatrices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.approvalMatrixData = action.payload.data // Corrected assignment
        state.totalItems = action.payload.totalItems
        state.page = action.payload.page
        state.limit = action.payload.limit

        //state.totalPages = action.payload.totalPages
      })
      .addCase(fetchApprovalMatrices.rejected, state => {
        state.status = 'failed'

        //state.error = action.payload
      })

      // Create new approval matrix
      .addCase(createNewApprovalMatrix.pending, state => {
        state.status = 'loading'
      })
      .addCase(createNewApprovalMatrix.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.approvalMatrixData.push(action.payload)
      })
      .addCase(createNewApprovalMatrix.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })

      // Update approval matrix
      .addCase(updateApprovalMatrix.pending, state => {
        state.status = 'loading'
      })
      .addCase(updateApprovalMatrix.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        const index = state.approvalMatrixData.findIndex(matrix => matrix.id === action.payload.id)

        if (index !== -1) {
          state.approvalMatrixData[index] = action.payload
        }
      })
      .addCase(updateApprovalMatrix.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })

      // Delete approval matrix
      .addCase(deleteApprovalMatrix.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteApprovalMatrix.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded'
        state.approvalMatrixData = state.approvalMatrixData.filter(matrix => matrix.id !== action.payload)
      })
      .addCase(deleteApprovalMatrix.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to delete approval matrix'
      })

      // Fetch approval matrix options
      .addCase(getApprovalMatrixOptions.pending, state => {
        state.status = 'loading'
      })
      .addCase(getApprovalMatrixOptions.fulfilled, (state, action) => {
        state.status = 'succeeded' // Changed from 'idle' to 'succeeded' for better status tracking
        state.options = action.payload
      })
      .addCase(getApprovalMatrixOptions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Error fetching approval matrix options'
      })
  }
})

export default approvalMatrixSlice.reducer
