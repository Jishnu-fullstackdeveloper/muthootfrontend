'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'
import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls'
import type {
  VacancyListResponse,
  VacancyDetailsResponse,
  VacancyRequestListResponse,
  VacancyRequestGroupByDesignationResponse,
  UpdateVacancyRequestStatusResponse,
  AutoApproveVacancyRequestsResponse,
  VacancyManagementState
} from '@/types/vacancyManagement'

// Thunk for fetching vacancy list
export const fetchVacancies = createAsyncThunk<VacancyListResponse, { page: number; limit: number; search?: string }>(
  'vacancyManagement/fetchVacancies',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit }

      if (search) params.search = search.trim()

      console.log('Sending API request for vacancies with params:', params)
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, { params })

      console.log('API Response for vacancies:', response.data)

      return response.data
    } catch (error: any) {
      console.error('Fetch Vacancies Error:', error)

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
    }
  }
)

// Thunk for fetching a single vacancy by ID
export const fetchVacancyById = createAsyncThunk<VacancyDetailsResponse, { id: string }>(
  'vacancyManagement/fetchVacancyById',
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log('Sending API request for vacancy ID:', id)
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingById.replace(':id', id))

      console.log('API Response for vacancy ID', id, ':', response.data)

      return response.data
    } catch (error: any) {
      console.error('API Error for vacancy ID', id, ':', error.message)

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy')
    }
  }
)

// Thunk for fetching vacancy requests
export const fetchVacancyRequests = createAsyncThunk<
  VacancyRequestListResponse,
  {
    page: number
    limit: number
    search?: string
    employeeId?: string
    id?: string
    designationId?: string
    departmentId?: string
    branchIds?: string[]
    status?: string
    approvalId?: string
    approverId?: string
    areaIds?: string[]
    regionIds?: string[]
    zoneIds?: string[]
    territoryIds?: string[]
  }
>(
  'vacancyManagement/fetchVacancyRequests',
  async (
    {
      page,
      limit,
      search,
      employeeId,
      id,
      designationId,
      departmentId,
      branchIds,
      status,
      approvalId,
      approverId,
      areaIds,
      regionIds,
      zoneIds,
      territoryIds
    },
    { rejectWithValue }
  ) => {
    try {
      const params: {
        page: number
        limit: number
        search?: string
        employeeId?: string
        id?: string
        designationId?: string
        departmentId?: string
        branchIds?: string[]
        status?: string
        approvalId?: string
        approverId?: string
        areaIds?: string[]
        regionIds?: string[]
        zoneIds?: string[]
        territoryIds?: string[]
      } = { page, limit }

      if (search) params.search = search.trim()
      if (employeeId) params.employeeId = employeeId
      if (id) params.id = id
      if (designationId) params.designationId = designationId
      if (departmentId) params.departmentId = departmentId
      if (branchIds && branchIds.length > 0) params.branchIds = branchIds
      if (status) params.status = status
      if (approvalId) params.approvalId = approvalId
      if (approverId) params.approverId = approverId
      if (areaIds && areaIds.length > 0) params.areaIds = areaIds
      if (regionIds && regionIds.length > 0) params.regionIds = regionIds
      if (zoneIds && zoneIds.length > 0) params.zoneIds = zoneIds
      if (territoryIds && territoryIds.length > 0) params.territoryIds = territoryIds

      const response = await AxiosLib.get(API_ENDPOINTS.vacancyRequestUrl, { params })

      console.log(params, 'ssss')

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy requests')
    }
  }
)

// Thunk for fetching vacancy requests grouped by designation
export const fetchVacancyRequestsGroupByDesignation = createAsyncThunk<
  VacancyRequestGroupByDesignationResponse,
  {
    page: number
    limit: number
    search?: string
    branchIds?: string[]
    areaIds?: string[]
    regionIds?: string[]
    zoneIds?: string[]
    territoryIds?: string[]
  }
>(
  'vacancyManagement/fetchVacancyRequestsGroupByDesignation',
  async ({ page, limit, search, branchIds, areaIds, regionIds, zoneIds, territoryIds }, { rejectWithValue }) => {
    try {
      const params: {
        page: number
        limit: number
        search?: string
        branchIds?: string[]
        areaIds?: string[]
        regionIds?: string[]
        zoneIds?: string[]
        territoryIds?: string[]
      } = { page, limit }

      if (search) params.search = search.trim()
      if (branchIds && branchIds.length > 0) params.branchIds = branchIds
      if (areaIds && areaIds.length > 0) params.areaIds = areaIds
      if (regionIds && regionIds.length > 0) params.regionIds = regionIds
      if (zoneIds && zoneIds.length > 0) params.zoneIds = zoneIds
      if (territoryIds && territoryIds.length > 0) params.territoryIds = territoryIds

      console.log('Sending API request for vacancy requests grouped by designation with params:', params)
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyRequestGroupByDesignation, { params })

      console.log('API Response for vacancy requests grouped by designation:', response.data)

      return response.data
    } catch (error: any) {
      console.error('Fetch Vacancy Requests Group By Designation Error:', error)

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy requests grouped by designation')
    }
  }
)

// Thunk for updating vacancy request status
export const updateVacancyRequestStatus = createAsyncThunk<
  UpdateVacancyRequestStatusResponse,
  { id: string; approverId: string; status: string; notes: string }
>('vacancyManagement/updateVacancyRequestStatus', async ({ id, approverId, status, notes }, { rejectWithValue }) => {
  try {
    const requestBody = { approverId, status, notes }

    console.log('Sending API request to update vacancy request status for ID:', id, 'with body:', requestBody)
    const response = await AxiosLib.put(API_ENDPOINTS.updateVacancyRequestStatusUrl(id), requestBody)

    console.log('API Response for updating vacancy request status:', response.data)

    return response.data
  } catch (error: any) {
    console.error('Update Vacancy Request Status Error:', error)

    return rejectWithValue(error.response?.data?.message || 'Failed to update vacancy request status')
  }
})

// Thunk for auto-approving vacancy requests
export const autoApproveVacancyRequests = createAsyncThunk<AutoApproveVacancyRequestsResponse, void>(
  'vacancyManagement/autoApproveVacancyRequests',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Sending API request to auto-approve vacancy requests')
      const response = await AxiosLib.get(API_ENDPOINTS.autoApproveVacancyRequestsUrl)

      console.log('API Response for auto-approve vacancy requests:', response.data)

      return response.data
    } catch (error: any) {
      console.error('Auto-Approve Vacancy Requests Error:', error)

      return rejectWithValue(error.response?.data?.message || 'Failed to auto-approve vacancy requests')
    }
  }
)

// Create the slice
export const vacancyManagementSlice = createSlice({
  name: 'vacancyManagement',
  initialState: {
    vacancyListLoading: false,
    vacancyListSuccess: false,
    vacancyListData: null,
    vacancyListTotal: 0,
    vacancyListFailure: false,
    vacancyListFailureMessage: '',
    vacancyDetailsLoading: false,
    vacancyDetailsSuccess: false,
    vacancyDetailsData: null,
    vacancyDetailsFailure: false,
    vacancyDetailsFailureMessage: '',
    vacancyRequestListLoading: false,
    vacancyRequestListSuccess: false,
    vacancyRequestListData: null,
    vacancyRequestListTotal: 0,
    vacancyRequestListFailure: false,
    vacancyRequestListFailureMessage: '',
    vacancyRequestGroupByDesignationLoading: false,
    vacancyRequestGroupByDesignationSuccess: false,
    vacancyRequestGroupByDesignationData: null,
    vacancyRequestGroupByDesignationTotal: 0,
    vacancyRequestGroupByDesignationFailure: false,
    vacancyRequestGroupByDesignationFailureMessage: '',
    updateVacancyRequestStatusLoading: false,
    updateVacancyRequestStatusSuccess: false,
    updateVacancyRequestStatusData: null,
    updateVacancyRequestStatusFailure: false,
    updateVacancyRequestStatusFailureMessage: '',
    autoApproveVacancyRequestsLoading: false,
    autoApproveVacancyRequestsSuccess: false,
    autoApproveVacancyRequestsData: null,
    autoApproveVacancyRequestsFailure: false,
    autoApproveVacancyRequestsFailureMessage: ''
  } as VacancyManagementState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, fetchVacancies, 'vacancyList')
    handleAsyncThunkStates(builder, fetchVacancyById, 'vacancyDetails')
    handleAsyncThunkStates(builder, fetchVacancyRequests, 'vacancyRequestList')
    handleAsyncThunkStates(builder, fetchVacancyRequestsGroupByDesignation, 'vacancyRequestGroupByDesignation')
    handleAsyncThunkStates(builder, updateVacancyRequestStatus, 'updateVacancyRequestStatus')
    handleAsyncThunkStates(builder, autoApproveVacancyRequests, 'autoApproveVacancyRequests')
  }
})

export const {} = vacancyManagementSlice.actions
export default vacancyManagementSlice.reducer
