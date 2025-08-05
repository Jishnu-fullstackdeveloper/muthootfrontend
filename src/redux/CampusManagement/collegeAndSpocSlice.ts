/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/campusManagement'

export interface College {
  id: string
  coordinatorId: string
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
  collegeList: { id: string; collegeName: string }[]
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
  collegeList: [],
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

export const fetchCollegeList = createAsyncThunk(
  'college/fetchCollegeList',
  async (
    params: {
      page: number
      limit: number
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get('/college', { params })
      const { data = [], page, limit, totalCount } = response.data || {}

      return {
        collegeList: data.map((item: any) => ({
          id: item.id,
          collegeName: item.collegeName
        })),
        totalCount,
        page,
        limit
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch college list')
    }
  }
)

export const fetchCollegeById = createAsyncThunk(
  'college/fetchCollegeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/college/${id}`)
      const collegeData = response.data?.data || {}

      return {
        id: collegeData.id,
        collegeName: collegeData.collegeName,
        collegeCode: collegeData.collegeCode,
        universityAffiliation: collegeData.universityAffiliation,
        collegeType: collegeData.collegeType,
        location: collegeData.location,
        district: collegeData.district,
        pinCode: collegeData.pinCode,
        fullAddress: collegeData.fullAddress,
        websiteUrl: collegeData.websiteUrl,
        prefferedDriveMonths: collegeData.prefferedDriveMonths || [],
        spoc: {
          name: collegeData.spoc?.name,
          designation: collegeData.spoc?.designation,
          email: collegeData.spoc?.email,
          alternateEmail: collegeData.spoc?.alternateEmail,
          mobile: collegeData.spoc?.mobile,
          alternateMobile: collegeData.spoc?.alternateMobile,
          linkdin: collegeData.spoc?.linkdin,
          whatsAppNumber: collegeData.spoc?.whatsAppNumber,
          lastVisitedDate: collegeData.spoc?.lastVisitedDate,
          lastEngagementType: collegeData.spoc?.lastEngagementType,
          lastFeedback: collegeData.spoc?.lastFeedback,
          remarks: collegeData.spoc?.remarks
        },
        status: collegeData.status || 'Active',
        created_by: collegeData.createdBy,
        created_at: collegeData.createdAt,
        updated_by: collegeData.updatedBy,
        updated_at: collegeData.updatedAt
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch college data')
    }
  }
)

export const fetchCollegeCoordinatorById = createAsyncThunk(
  'college/fetchCollegeCoordinatorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/college-coordinator/${id}`)
      const coordinatorData = response.data?.data || {}

      return {
        id: coordinatorData.collegeId,
        coordinatorId: coordinatorData.id,
        name: coordinatorData.college?.collegeName || '',
        college_code: coordinatorData.college?.collegeCode || '',
        university_affiliation: coordinatorData.college?.universityAffiliation || '',
        college_type: coordinatorData.college?.collegeType || '',
        location: coordinatorData.college?.location || '',
        district: coordinatorData.college?.district || '',
        pin_code: coordinatorData.college?.pinCode || '',
        full_address: coordinatorData.college?.fullAddress || '',
        website_url: coordinatorData.college?.websiteUrl || '',
        spoc_name: coordinatorData.name || '',
        spoc_designation: coordinatorData.designation || '',
        spoc_email: coordinatorData.email || '',
        spoc_alt_email: coordinatorData.alternateEmail || '',
        spoc_mobile: coordinatorData.mobile || '',
        spoc_alt_phone: coordinatorData.alternateMobile || '',
        spoc_linkedin: coordinatorData.linkdin || '',
        spoc_whatsapp: coordinatorData.whatsAppNumber || '',
        last_visited_date: coordinatorData.lastVisitedDate || '',
        last_engagement_type: coordinatorData.lastEngagementType || '',
        last_feedback: coordinatorData.lastFeedback || '',
        preferred_drive_months: coordinatorData.college?.prefferedDriveMonths || [],
        remarks: coordinatorData.remarks || '',
        created_by: coordinatorData.createdBy || '',
        created_at: coordinatorData.createdAt || '',
        updated_by: coordinatorData.updatedBy || '',
        updated_at: coordinatorData.updatedAt || '',
        status: coordinatorData.status || 'Active'
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch college coordinator')
    }
  }
)

export const addCollege = createAsyncThunk(
  'college/addCollege',
  async (
    collegeData: {
      collegeName: string
      collegeCode: string
      universityAffiliation: string
      collegeType: string
      location: string
      district: string
      pinCode: string
      fullAddress: string
      websiteUrl: string
      prefferedDriveMonths: string[]
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.createCollege, collegeData)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add college')
    }
  }
)

export const updateCollege = createAsyncThunk(
  'college/updateCollege',
  async (
    {
      id,
      data
    }: {
      id: string
      data: {
        collegeName: string
        collegeCode: string
        universityAffiliation: string
        collegeType: string
        location: string
        district: string
        pinCode: string
        fullAddress: string
        websiteUrl: string
        prefferedDriveMonths: string[]
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.put(`/college?id=${id}`, data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update college')
    }
  }
)

export const addCollegeCoordinator = createAsyncThunk(
  'college/addCollegeCoordinator',
  async (
    coordinatorData: {
      collegeId: string
      name: string
      designation: string
      email: string
      alternateEmail: string
      mobile: string
      alternateMobile: string
      linkdin: string
      whatsAppNumber: string
      lastVisitedDate: string
      isPrimary: boolean
      lastEngagementType: string
      lastFeedback: string
      remarks: string
      status: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.createCollegeCoordinator, coordinatorData)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add college coordinator')
    }
  }
)

export const updateCollegeCoordinator = createAsyncThunk(
  'college/updateCollegeCoordinator',
  async (
    {
      id,
      data
    }: {
      id: string
      data: {
        collegeId: string
        name: string
        designation: string
        email: string
        alternateEmail: string
        mobile: string
        alternateMobile: string
        linkdin: string
        whatsAppNumber: string
        lastVisitedDate: string
        isPrimary: boolean
        lastEngagementType: string
        lastFeedback: string
        remarks: string
        status: string
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.put(`/college-coordinator?id=${id}`, data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update college coordinator')
    }
  }
)

export const deleteCollegeCoordinator = createAsyncThunk(
  'college/deleteCollegeCoordinator',
  async (coordinatorId: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.delete(`/college-coordinator?id=${coordinatorId}`)

      return { coordinatorId, ...response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete college coordinator')
    }
  }
)

export const fetchCollegeCoordinators = createAsyncThunk(
  'college/fetchCollegeCoordinators',
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
          coordinatorId: item.id,
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
      .addCase(fetchCollegeList.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCollegeList.fulfilled, (state, action) => {
        const { collegeList, totalCount, page, limit } = action.payload

        state.status = 'succeeded'
        state.collegeList = collegeList
        state.totalCount = totalCount
        state.page = page
        state.limit = limit
        state.error = null
      })
      .addCase(fetchCollegeList.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(fetchCollegeById.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCollegeById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.collegeId = action.payload.id
        state.error = null
      })
      .addCase(fetchCollegeById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(fetchCollegeCoordinatorById.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCollegeCoordinatorById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.colleges = [action.payload]
        state.collegeId = action.payload.id
        state.error = null
      })
      .addCase(fetchCollegeCoordinatorById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(fetchCollegeCoordinators.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCollegeCoordinators.fulfilled, (state, action) => {
        const { colleges, totalCount, page, limit } = action.payload

        state.status = 'succeeded'
        state.colleges = colleges
        state.totalCount = totalCount
        state.page = page
        state.limit = limit
        state.error = null
      })
      .addCase(fetchCollegeCoordinators.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(addCollege.pending, state => {
        state.status = 'loading'
      })
      .addCase(addCollege.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.colleges.push(action.payload)
        state.error = null
      })
      .addCase(addCollege.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(updateCollege.pending, state => {
        state.status = 'loading'
      })
      .addCase(updateCollege.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const updatedCollege = action.payload
        const index = state.colleges.findIndex(college => college.id === updatedCollege.id)

        if (index !== -1) {
          state.colleges[index] = { ...state.colleges[index], ...updatedCollege }
        }

        state.error = null
      })
      .addCase(updateCollege.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(addCollegeCoordinator.pending, state => {
        state.status = 'loading'
      })
      .addCase(addCollegeCoordinator.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(addCollegeCoordinator.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(updateCollegeCoordinator.pending, state => {
        state.status = 'loading'
      })
      .addCase(updateCollegeCoordinator.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(updateCollegeCoordinator.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(deleteCollegeCoordinator.pending, state => {
        state.status = 'loading'
      })
      .addCase(deleteCollegeCoordinator.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.colleges = state.colleges.filter(college => college.coordinatorId !== action.payload.coordinatorId)
        state.totalCount = state.totalCount - 1
        state.error = null
      })
      .addCase(deleteCollegeCoordinator.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { resetCollegeState } = collegeAndSpocSlice.actions
export default collegeAndSpocSlice.reducer
