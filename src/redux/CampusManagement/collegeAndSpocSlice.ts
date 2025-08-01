import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/campusManagement' // Adjust the import path as needed
//import type { CollegeAndSpocState } from '@/types/college'

// types/collegeCoordinator.ts
export interface College {
  id: string
  name: string
  college_code: string
  university_affiliation: string
  college_type: string
  location: string
  district: string
  pin_code: string
  full_address: string
  website_url: string
  spoc_name: string
  spoc_designation: string
  spoc_email: string
  spoc_alt_email: string
  spoc_mobile: string
  spoc_alt_phone: string
  spoc_linkedin: string
  spoc_whatsapp: string
  last_visited_date: string
  last_engagement_type: string
  last_feedback: string
  preferred_drive_months: string[]
  remarks: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
  status: 'Active' | 'Inactive' | 'Blocked'
}

export interface CollegeCoordinatorState {
  colleges: College[]
  totalCount: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  page: number
  limit: number
  search: string
  engagementType: string
  statusFilter: string
  isPrimary: boolean | null
  collegeId: string
}

const initialState: CollegeCoordinatorState = {
  colleges: [],
  totalCount: 0,
  status: 'idle',
  error: null,
  page: 1,
  limit: 10,
  search: '',
  engagementType: '',
  statusFilter: '',
  isPrimary: false,
  collegeId: ''
}

export const fetchColleges = createAsyncThunk(
  'college/fetchColleges',
  async (
    params: {
      page: number
      limit: number
      search?: string
      engagementType?: string
      status?: string
      isPrimary?: string
      collegeId?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getCollegeCoordinators, { params })
      const { data = [], page, limit, totalCount } = response.data || {}

      return {
        colleges: data.map((item: any) => ({
          ...item.college,
          id: item.collegeId,
          spoc_name: item.name,
          spoc_designation: item.designation,
          spoc_email: item.email,
          spoc_alt_email: item.alternateEmail,
          spoc_mobile: item.mobile,
          spoc_alt_phone: item.alternateMobile,
          spoc_linkedin: item.linkdin,
          spoc_whatsapp: item.whatsAppNumber,
          last_visited_date: item.lastVisitedDate,
          last_engagement_type: item.lastEngagementType,
          last_feedback: item.lastFeedback,
          remarks: item.remarks,
          status: item.status,
          created_by: item.createdBy,
          created_at: item.createdAt,
          updated_by: item.updatedBy,
          updated_at: item.updatedAt
        })),
        totalCount,
        page,
        limit
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch college data')
    }
  }
)

const collegeAndSpocSlice = createSlice({
  name: 'college',
  initialState,
  reducers: {
    resetCollegeState: state => {
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchColleges.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        const { colleges, totalCount, page, limit } = action.payload

        state.status = 'succeeded'
        state.colleges = colleges
        state.totalCount = totalCount
        state.page = page
        state.limit = limit
        state.error = null
      })
      .addCase(fetchColleges.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { resetCollegeState } = collegeAndSpocSlice.actions
export default collegeAndSpocSlice.reducer
