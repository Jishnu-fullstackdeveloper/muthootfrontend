import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls'

// Define the Vacancy type based on the API response
interface Vacancy {
  id: string
  deletedBy: string | null
  districtName: string
  stateName: string
  zoneName: string
  regionName: string
  areaName: string
  branchesName: string
  businessUnitName: string
  employeeCategoryType: string
  departmentName: string
  designationName: string
  gradeName: string
  bandName: string
  metadata: any | null
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
}

const initialState: VacancyState = {
  vacancies: [],
  totalCount: 0,
  currentPage: 1,
  limit: 10,
  loading: false,
  error: null
}

// Async thunk to fetch vacancies
export const fetchVacancies = createAsyncThunk(
  'appMuthoot/fetchVacancies',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, {
        params: { page, limit }
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
    }
  }
)

const vacancySlice = createSlice({
  name: 'vacancy',
  initialState,
  reducers: {},
  extraReducers: builder => {
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
      })
  }
})

export default vacancySlice.reducer
