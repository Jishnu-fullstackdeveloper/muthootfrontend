import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib' // Ensure AxiosLib is configured correctly
import { API_ENDPOINTS } from './ApiUrls/approvalMatrixApiUrls'

// Define ApprovalMatrixState interface
interface ApprovalMatrixState {
  approvalCategories: any[] // Store the list of approval categories
  approvalMatrixData: any[] // Store the list of approval matrices
  status: 'idle' | 'loading' | 'succeeded' | 'failed' // For tracking API calls
  error: string | null // For error handling
  totalItems: number // Total number of approval matrices (for pagination)
  options: Array<{ id: number; name: string }>
  designations: Array<{ id: string; name: string }> // Store designations for autocomplete
  grades: Array<{ id: string; name: string }> // Store grades for autocomplete
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
  designations: [], // Initialize designations
  grades: [], // Initialize grades
  page: 1,
  limit: 10,
  totalPages: 10
}

//APPROVAL CATEGORIES
// Async thunk for fetching all approval categories with pagination
export const fetchApprovalCategories = createAsyncThunk(
  'apphrms/fetchApprovalCategories',
  async ({ page, limit, search }: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.APPROVAL_CATEGORIES, {
        params: { page, limit, search }
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

// Async thunk for creating a new approval category
export const createApprovalCategory = createAsyncThunk(
  'apphrms/createApprovalCategory',
  async ({ name, description }: { name: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.APPROVAL_CATEGORIES, { name, description })

      return response.data.data // Return the created category data (including id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create approval category')
    }
  }
)

// Async thunk for updating an approval category
export const updateApprovalCategory = createAsyncThunk(
  'apphrms/updateApprovalCategory',
  async ({ id, name, description }: { id: string; name: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.put(API_ENDPOINTS.APPROVAL_CATEGORIES_BY_ID(id), { name, description })

      return response.data.data // Return the updated category data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update approval category')
    }
  }
)

//APPROVAL MATRIX
// Async thunk for fetching all approval matrices with pagination
export const fetchApprovalMatrices = createAsyncThunk(
  'apphrms/fetchApprovalMatrices',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.APPROVAL_MATRICES, {
        params: { page, limit }
      })

      const { data = [], totalCount = 0, page: currentPage = 1, limit: pageLimit = 10 } = response.data || {}

      return {
        data, // Store the fetched approval matrices
        totalItems: totalCount,
        page: currentPage,
        limit: pageLimit
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
      const response = await AxiosLib.post(API_ENDPOINTS.APPROVAL_MATRICES, params)

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
      const response = await AxiosLib.put(API_ENDPOINTS.APPROVAL_MATRICES_BY_ID(id), approvalMatrix)

      return response.data.data // Return the updated approval matrix data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update approval matrix')
    }
  }
)

// Async thunk for deleting an approval matrix
export const deleteApprovalMatrix = createAsyncThunk(
  'apphrms/deleteApprovalMatrix',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.delete(API_ENDPOINTS.APPROVAL_MATRICES_BY_ID(id))

      return response.data.data // Return the deleted approval matrix data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete approval matrix')
    }
  }
)

// Async thunk for fetching designations
export const fetchDesignations = createAsyncThunk(
  'apphrms/fetchDesignations',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.DESIGNATIONS, {
        params: { page, limit }
      })

      return response.data.data // Return the array of designations
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations')
    }
  }
)

// Async thunk for fetching grades
export const fetchGrades = createAsyncThunk(
  'apphrms/fetchGrades',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.GRADES, {
        params: { page, limit }
      })

      return response.data.data // Return the array of grades
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades')
    }
  }
)

// Fetch approval matrix options
// export const getApprovalMatrixOptions = createAsyncThunk(
//   'apphrms/setApprovalMatrixOptions',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await AxiosLib.get('/appproval-actions/designations')

//       return response.data.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Error fetching approval matrix options')
//     }
//   }
// )

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
      })
      .addCase(fetchApprovalCategories.rejected, state => {
        state.status = 'failed'
      })

      // Create approval category
      .addCase(createApprovalCategory.pending, state => {
        state.status = 'loading'
      })
      .addCase(createApprovalCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.approvalCategories.push(action.payload) // Add new category to state
      })
      .addCase(createApprovalCategory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to create approval category'
      })

      // Update approval category
      .addCase(updateApprovalCategory.pending, state => {
        state.status = 'loading'
      })
      .addCase(updateApprovalCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.approvalCategories.findIndex(category => category.id === action.payload.id)

        if (index !== -1) {
          state.approvalCategories[index] = action.payload // Update the existing category
        }
      })
      .addCase(updateApprovalCategory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to update approval category'
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
      })
      .addCase(fetchApprovalMatrices.rejected, state => {
        state.status = 'failed'
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
        state.error = action.payload || 'Failed to update approval matrix'
      })

      // Delete approval matrix
      .addCase(deleteApprovalMatrix.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteApprovalMatrix.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded'
        state.approvalMatrixData = state.approvalMatrixData.filter(matrix => matrix.id !== action.payload.id)
      })
      .addCase(deleteApprovalMatrix.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to delete approval matrix'
      })

      // Fetch designations
      .addCase(fetchDesignations.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.designations = action.payload.map((item: any) => ({ id: item.id, name: item.name }))
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to fetch designations'
      })

      // Fetch grades
      .addCase(fetchGrades.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.grades = action.payload.map((item: any) => ({ id: item.id, name: item.name }))
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to fetch grades'
      })

    // Fetch approval matrix options
    // .addCase(getApprovalMatrixOptions.pending, state => {
    //   state.status = 'loading'
    // })
    // .addCase(getApprovalMatrixOptions.fulfilled, (state, action) => {
    //   state.status = 'succeeded' // Changed from 'idle' to 'succeeded' for better status tracking
    //   state.options = action.payload
    // })
    // .addCase(getApprovalMatrixOptions.rejected, (state, action) => {
    //   state.status = 'failed'
    //   state.error = (action.payload as string) || 'Error fetching approval matrix options'
    // })
  }
})

export default approvalMatrixSlice.reducer
