'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib' // Custom Axios utility
import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls' // API endpoint definitions

// Define the Vacancy type based on API response
export interface Vacancy {
  territory: string
  id: string
  deletedBy: string | null
  jobTitle: string
  grade: string
  designation: string
  jobRole: string
  openings: number
  businessRole: string
  experienceMin: number
  experienceMax: number
  campusOrLateral: string
  employeeCategory: string
  employeeType: string
  hiringManager: string
  startingDate: string
  closingDate: string
  company: string
  businessUnit: string
  department: string
  teritory: string // Note: API has "teritory" (typo?), adjust if corrected in real API
  zone: string
  region: string
  area: string
  cluster: string
  branch: string
  branchCode: string
  city: string
  state: string
  origin: string
  metaData: {
    project: string
    priority: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface VacancyState {
  vacancies: Vacancy[]
  totalCount: number
  currentPage: number
  limit: number
  loading: boolean
  error: string | null
  selectedVacancy: Vacancy | null // Add state for single vacancy
  selectedVacancyLoading: boolean // Loading state for single vacancy
  selectedVacancyError: string | null // Error state for single vacancy
}

const initialState: VacancyState = {
  vacancies: [],
  totalCount: 0,
  currentPage: 1,
  limit: 6,
  loading: false,
  error: null,
  selectedVacancy: null,
  selectedVacancyLoading: false,
  selectedVacancyError: null
}

// Async thunk to fetch vacancies
export const fetchVacancies = createAsyncThunk(
  'vacancyManagement/fetchVacancies',
  async ({ page, limit, search = '' }: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      console.log('Sending API request with params:', { page, limit, search }) // Debug log

      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, {
        params: { page, limit, search: search.trim() || undefined } // Ensure empty search is not sent
      })

      console.log('API Response:', response.data) // Debug API response
      const data = response.data

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response: No data received')
      }

      const vacancies = Array.isArray(data.data) ? data.data : []
      const totalCount = Number.isInteger(data.totalCount) ? data.totalCount : 0
      const currentPage = Number.isInteger(parseInt(data.currentPage, 10)) ? parseInt(data.currentPage, 10) : page
      const responseLimit = Number.isInteger(parseInt(data.limit, 10)) ? parseInt(data.limit, 10) : limit

      return {
        data: vacancies as Vacancy[],
        totalCount,
        currentPage,
        limit: responseLimit
      }
    } catch (error: any) {
      console.error('Fetch Vacancies Error:', error)

      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch vacancies')
    }
  }
)

// Async thunk to fetch a single vacancy by ID
export const fetchVacancyById = createAsyncThunk(
  'vacancyManagement/fetchVacancyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/vacancy/${id}`)

      console.log('API Response for ID', id, ':', response.data) // Debug API response
      const data = response.data

      if (data.status !== 'Success' || !data.data) {
        throw new Error(data.message || 'Invalid API response')
      }

      return data.data // Return the vacancy object
    } catch (error: any) {
      console.error('API Error for ID', id, ':', error.message) // Debug API error

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy')
    }
  }
)

// Slice
const vacancyManagementSlice = createSlice({
  name: 'vacancyManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Existing fetchVacancies cases
    builder
      .addCase(fetchVacancies.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.loading = false
        state.vacancies = action.payload.data
        state.totalCount = action.payload.totalCount
        state.currentPage = action.payload.currentPage
        state.limit = action.payload.limit
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.vacancies = [] // Clear vacancies on error
        state.totalCount = 0
      })

      // New fetchVacancyById cases
      .addCase(fetchVacancyById.pending, state => {
        state.selectedVacancyLoading = true
        state.selectedVacancyError = null
        console.log('Fetching vacancy...') // Debug pending state
      })
      .addCase(fetchVacancyById.fulfilled, (state, action) => {
        state.selectedVacancyLoading = false
        state.selectedVacancy = action.payload
        console.log('Selected Vacancy Updated:', action.payload) // Debug fulfilled state
      })
      .addCase(fetchVacancyById.rejected, (state, action) => {
        state.selectedVacancyLoading = false
        state.selectedVacancyError = action.payload as string
        console.log('Fetch Vacancy Failed:', action.payload) // Debug rejected state
      })
  }
})

export default vacancyManagementSlice.reducer
