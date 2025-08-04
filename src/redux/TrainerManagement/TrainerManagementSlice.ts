import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/trainerManagementUrls'

export interface Language {
  id: number
  name: string
  code: string
}

export interface Training {
  id: number
  status: string
}

export interface Trainer {
  id: number
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
  empCode: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: string
  count: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  languages: Language[]
  trainings?: Training[]
}

export interface TrainingCounts {
  UPCOMING: number
  INPROGRESS: number
  COMPLETED: number
  CANCELLED: number
  total: number
}

export interface TrainerLanguage {
  id: number
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
  trainerId: number
  languageId: number
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface TrainingType {
  id: number
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
  name: string
  duration_days: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  officeEmailAddress: string
  mobileNumber: string
  companyStructure: {
    regionId: string
  }
}

export interface TrainerManagementState {
  trainersData: Trainer[]
  selectedTrainer: Trainer | null
  trainingCounts: TrainingCounts | null
  totalCount: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  page: number
  limit: number
  trainerLanguages: TrainerLanguage[]
  trainingTypes: TrainingType[]
  selectedEmployee: Employee | null // Added for storing fetched employee data
}

const initialState: TrainerManagementState = {
  trainersData: [],
  selectedTrainer: null,
  trainingCounts: null,
  totalCount: 0,
  status: 'idle',
  error: null,
  page: 1,
  limit: 10,
  trainerLanguages: [],
  trainingTypes: [],
  selectedEmployee: null // Initialize new state field
}

// Fetch trainers data
export const fetchTrainers = createAsyncThunk(
  'trainerManagement/fetchTrainers',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchTrainers, {
        params
      })

      const { data = [], total = 0, currentPage, limit } = response.data || {}

      return { data, totalCount: total, page: currentPage, limit }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trainers data')
    }
  }
)

// Fetch trainer by ID
export const fetchTrainerById = createAsyncThunk(
  'trainerManagement/fetchTrainerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchTrainerById(id))

      const { trainer, trainingCounts } = response.data.data || {}

      return { trainer, trainingCounts }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trainer data')
    }
  }
)

// Create a new trainer
export const createTrainer = createAsyncThunk(
  'trainerManagement/createTrainer',
  async (
    trainerData: {
      empCode: string
      firstName: string
      lastName: string
      email: string
      phone: string
      status: string
      count: number
      languages: number[]
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.createTrainer, trainerData)

      const { trainer } = response.data.data || {}

      return { trainer }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create trainer')
    }
  }
)

// Fetch trainer-language mappings
export const fetchTrainerLanguages = createAsyncThunk(
  'trainerManagement/fetchTrainerLanguages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.trainerLanguages)

      const { data = [] } = response.data || {}

      return { trainerLanguages: data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trainer-language data')
    }
  }
)

// Fetch training types
export const fetchTrainingTypes = createAsyncThunk(
  'trainerManagement/fetchTrainingTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.trainingTypes)

      const { data = [] } = response.data || {}

      return { trainingTypes: data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch training types data')
    }
  }
)

// Fetch employee by employeeCode
export const fetchEmployeeByCode = createAsyncThunk(
  'trainerManagement/fetchEmployeeByCode',
  async (employeeCode: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchEmployeeByCode, {
        params: { employeeCode }
      })

      const { data = [] } = response.data || {}
      const employee = data[0] || null // Take the first employee or null if empty

      return { employee }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee data')
    }
  }
)

const trainerManagementSlice = createSlice({
  name: 'trainerManagement',
  initialState,
  reducers: {
    resetTrainerManagementState: state => {
      state.status = 'idle'
      state.error = null
      state.trainersData = []
      state.selectedTrainer = null
      state.trainingCounts = null
      state.totalCount = 0
      state.page = 1
      state.limit = 10
      state.trainerLanguages = []
      state.trainingTypes = []
      state.selectedEmployee = null // Reset new state field
    }
  },
  extraReducers: builder => {
    builder

      // Fetch Trainers
      .addCase(fetchTrainers.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.trainersData = action.payload.data
        state.totalCount = action.payload.totalCount
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.error = null
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Fetch Trainer by ID
      .addCase(fetchTrainerById.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchTrainerById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selectedTrainer = action.payload.trainer
        state.trainingCounts = action.payload.trainingCounts
        state.error = null
      })
      .addCase(fetchTrainerById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Create Trainer
      .addCase(createTrainer.pending, state => {
        state.status = 'loading'
      })
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.trainersData.push(action.payload.trainer)
        state.totalCount += 1
        state.error = null
      })
      .addCase(createTrainer.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Fetch Trainer Languages
      .addCase(fetchTrainerLanguages.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchTrainerLanguages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.trainerLanguages = action.payload.trainerLanguages
        state.error = null
      })
      .addCase(fetchTrainerLanguages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Fetch Training Types
      .addCase(fetchTrainingTypes.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchTrainingTypes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.trainingTypes = action.payload.trainingTypes
        state.error = null
      })
      .addCase(fetchTrainingTypes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Fetch Employee by Code
      .addCase(fetchEmployeeByCode.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchEmployeeByCode.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selectedEmployee = action.payload.employee
        state.error = null
      })
      .addCase(fetchEmployeeByCode.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { resetTrainerManagementState } = trainerManagementSlice.actions
export default trainerManagementSlice.reducer
