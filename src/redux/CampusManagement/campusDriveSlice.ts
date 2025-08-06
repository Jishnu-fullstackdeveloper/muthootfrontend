/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/campusManagement'

export interface Job {
  id: string
  jobRole: string
  campusOrLateral: 'Campus' | 'Lateral'
  [key: string]: any
}

export interface CollegeDrive {
  id: string
  collegeId: string
  collegeCoordinatorId: string
  jobId: string | null // Updated to allow null
  jobRole: string
  driveDate: string
  expectedCandidates: number
  driveStatus: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled'
}

export interface CampusDrive {
  id: string
  job_role: string
  drive_date: string
  expected_candidates: number
  status: 'Active' | 'Inactive' | 'Completed' | 'Planned' | 'Ongoing' | 'Cancelled'
  college: string
  college_coordinator: string
  invite_status: 'Pending' | 'Sent' | 'Failed'
  response_status: 'Not Responded' | 'Interested' | 'Not Interested'
  spoc_notified_at: string
  remarks: string
}

export interface JobState {
  jobNames: { id: string; jobRole: string }[]
  jobRoles: string[]
  collegeDrive: CampusDrive | null
  collegeDrives: CampusDrive[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  collegeDriveStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  collegeDriveError: string | null
  page: number
  limit: number
  totalCount: number
}

const initialState: JobState = {
  jobNames: [],
  jobRoles: [],
  collegeDrive: null,
  collegeDrives: [],
  status: 'idle',
  collegeDriveStatus: 'idle',
  error: null,
  collegeDriveError: null,
  page: 1,
  limit: 10,
  totalCount: 0
}

export const fetchJobNames = createAsyncThunk(
  'job/fetchJobNames',
  async (
    params: {
      page: number
      limit: number
      campusOrLateral?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.jobManagement, {
        params: { ...params, campusOrLateral: 'Campus' }
      })

      const { data = [], page, limit, totalCount } = response.data || {}

      return {
        jobNames: data
          .filter((item: any) => item.campusOrLateral === 'Campus')
          .map((item: any) => ({
            id: item.id,
            jobRole: item.jobRole
          })),
        totalCount,
        page,
        limit
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job names')
    }
  }
)

export const fetchJobRoles = createAsyncThunk(
  'job/fetchJobRoles',
  async (
    params: {
      page: number
      limit: number
      name?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.jobRole, { params })
      const { data = [], page, limit, totalCount } = response.data || {}

      return {
        jobRoles: data.map((item: any) => item.name),
        totalCount,
        page,
        limit
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job roles')
    }
  }
)

export const createCollegeDrive = createAsyncThunk(
  'job/createCollegeDrive',
  async (
    driveData: {
      collegeId: string
      collegeCoordinatorId: string
      jobId: string | null // Updated to allow null
      jobRole: string
      driveDate: string
      expectedCandidates: number
      driveStatus: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled'
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.postCampusDrive, driveData)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create college drive')
    }
  }
)

export const updateCollegeDrive = createAsyncThunk(
  'job/updateCollegeDrive',
  async (
    {
      id,
      data
    }: {
      id: string
      data: {
        collegeId: string
        collegeCoordinatorId: string
        jobId: string | null
        jobRole: string
        driveDate: string
        expectedCandidates: number
        driveStatus: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled'
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.put(`${API_ENDPOINTS.postCampusDrive}?id=${id}`, data)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update college drive')
    }
  }
)

export const fetchCollegeDrives = createAsyncThunk(
  'job/fetchCollegeDrives',
  async (
    params: {
      page: number
      limit: number
      search?: string
      driveStatus?: string
      driveDate?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getCampusDrive, { params })
      const { data = [], page, limit, totalCount } = response.data || {}

      return {
        collegeDrives: data.map((item: any) => ({
          id: item.id,
          job_role: item.jobRole,
          drive_date: item.driveDate.split('T')[0], // Convert ISO 8601 to YYYY-MM-DD
          expected_candidates: item.expectedCandidates,
          status: item.driveStatus,
          college: item.college.collegeName,
          college_coordinator: item.collegeCoordinator.name,
          invite_status: 'Pending' as 'Pending' | 'Sent' | 'Failed', // Default, not in API
          response_status: 'Not Responded' as 'Not Responded' | 'Interested' | 'Not Interested', // Default, not in API
          spoc_notified_at: '', // Default, not in API
          remarks: '' // Default, not in API
        })),
        totalCount,
        page,
        limit
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch college drives')
    }
  }
)

export const fetchCollegeDriveById = createAsyncThunk(
  'job/fetchCollegeDriveById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`${API_ENDPOINTS.getCampusDrive}/${id}`)
      const item = response.data.data

      return {
        id: item.id,
        job_role: item.jobRole,
        drive_date: item.driveDate.split('T')[0], // Convert ISO 8601 to YYYY-MM-DD
        expected_candidates: item.expectedCandidates,
        status: item.driveStatus,
        college: item.college.collegeName,
        college_coordinator: item.collegeCoordinator.name,
        invite_status: 'Pending' as 'Pending' | 'Sent' | 'Failed', // Default, not in API
        response_status: 'Not Responded' as 'Not Responded' | 'Interested' | 'Not Interested', // Default, not in API
        spoc_notified_at: '', // Default, not in API
        remarks: '' // Default, not in API
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch college drive')
    }
  }
)

const campusDriveSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    resetCampusDriveState: state => {
      state.status = 'idle'
      state.collegeDriveStatus = 'idle'
      state.error = null
      state.collegeDriveError = null
    }
  },
  extraReducers: builder => {
    builder

      // Handle fetchJobNames
      .addCase(fetchJobNames.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchJobNames.fulfilled, (state, action) => {
        const { jobNames, totalCount, page, limit } = action.payload

        state.status = 'succeeded'
        state.jobNames = jobNames
        state.totalCount = totalCount
        state.page = page
        state.limit = limit
        state.error = null
      })
      .addCase(fetchJobNames.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        state.jobNames = []
      })

      // Handle fetchJobRoles
      .addCase(fetchJobRoles.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchJobRoles.fulfilled, (state, action) => {
        const { jobRoles, totalCount, page, limit } = action.payload

        state.status = 'succeeded'
        state.jobRoles = jobRoles
        state.totalCount = totalCount
        state.page = page
        state.limit = limit
        state.error = null
      })
      .addCase(fetchJobRoles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        state.jobRoles = []
      })

      // Handle createCollegeDrive
      .addCase(createCollegeDrive.pending, state => {
        state.collegeDriveStatus = 'loading'
      })
      .addCase(createCollegeDrive.fulfilled, (state, action) => {
        state.collegeDriveStatus = 'succeeded'
        state.collegeDrive = action.payload
        state.collegeDriveError = null
      })
      .addCase(createCollegeDrive.rejected, (state, action) => {
        state.collegeDriveStatus = 'failed'
        state.collegeDriveError = action.payload as string
      })

      // Handle updateCollegeDrive
      .addCase(updateCollegeDrive.pending, state => {
        state.collegeDriveStatus = 'loading'
      })
      .addCase(updateCollegeDrive.fulfilled, (state, action) => {
        state.collegeDriveStatus = 'succeeded'
        state.collegeDrive = action.payload
        state.collegeDriveError = null
      })
      .addCase(updateCollegeDrive.rejected, (state, action) => {
        state.collegeDriveStatus = 'failed'
        state.collegeDriveError = action.payload as string
      })

      // Handle fetchCollegeDrives
      .addCase(fetchCollegeDrives.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCollegeDrives.fulfilled, (state, action) => {
        const { collegeDrives, totalCount, page, limit } = action.payload

        state.status = 'succeeded'
        state.collegeDrives = collegeDrives
        state.totalCount = totalCount
        state.page = page
        state.limit = limit
        state.error = null
      })
      .addCase(fetchCollegeDrives.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        state.collegeDrives = []
      })

      // Handle fetchCollegeDriveById
      .addCase(fetchCollegeDriveById.pending, state => {
        state.collegeDriveStatus = 'loading'
        state.collegeDriveError = null
      })
      .addCase(fetchCollegeDriveById.fulfilled, (state, action) => {
        state.collegeDriveStatus = 'succeeded'
        state.collegeDrive = action.payload
        state.collegeDriveError = null
      })
      .addCase(fetchCollegeDriveById.rejected, (state, action) => {
        state.collegeDriveStatus = 'failed'
        state.collegeDriveError = action.payload as string
        state.collegeDrive = null
      })
  }
})

export const { resetCampusDriveState } = campusDriveSlice.actions
export default campusDriveSlice.reducer
