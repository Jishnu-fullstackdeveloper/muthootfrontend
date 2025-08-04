'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'

import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls'

import { handleAsyncThunkStates } from '@/utils/functions'

import type {
  VacancyListResponse,
  VacancyDetailsResponse,
  VacancyRequestListResponse,
  VacancyRequestGroupByDesignationResponse,
  VacancyGroupByDesignationResponse,
  UpdateVacancyRequestStatusResponse,
  UpdateVacancyStatusResponse,
  AutoApproveVacancyRequestsResponse,
  VacancyManagementState
} from '@/types/vacancyManagement'

// Thunk for fetching vacancy list
export const fetchVacancies = createAsyncThunk<
  VacancyListResponse,
  {
    page: number
    limit: number
    search?: string
    status?: 'PENDING' | 'APPROVED' | 'FREEZED'
    jobTitle?: string
    employeeCode?: string
    grade?: string[]
    designation?: string[]
    jobRole?: string[]
    employeeCategory?: string[]
    employeeType?: string[]
    hiringManager?: string[]
    company?: 'Muthoot Papachan' | 'Muthoot Fincorp Ltd.'
    businessUnit?: string[]
    department?: string[]
    territory?: string[]
    zone?: string[]
    region?: string[]
    area?: string[]
    cluster?: string[]
    branch?: string[]
    city?: string[]
    band?: string[]
    origin?: 'MANUAL' | 'RESIGNED' | 'ABSCONDING' | 'BUDGETUPDATE'
  }
>(
  'vacancyManagement/fetchVacancies',
  async (
    {
      page,
      limit,
      search,
      status,
      jobTitle,
      employeeCode,
      grade,
      designation,
      jobRole,
      employeeCategory,
      employeeType,
      hiringManager,
      company,
      businessUnit,
      department,
      territory,
      zone,
      region,
      area,
      cluster,
      branch,
      city,
      band,
      origin
    },
    { rejectWithValue }
  ) => {
    try {
      const params: {
        page: number
        limit: number
        search?: string
        status?: string
        jobTitle?: string
        employeeCode?: string
        grade?: string[]
        designation?: string[]
        jobRole?: string[]
        employeeCategory?: string[]
        employeeType?: string[]
        hiringManager?: string[]
        company?: string
        businessUnit?: string[]
        department?: string[]
        territory?: string[]
        zone?: string[]
        region?: string[]
        area?: string[]
        cluster?: string[]
        branch?: string[]
        city?: string[]
        band?: string[]
        origin?: string
      } = { page, limit }

      if (search) params.search = search.trim()
      if (status) params.status = status
      if (jobTitle) params.jobTitle = jobTitle
      if (employeeCode) params.employeeCode = employeeCode
      if (grade && grade.length > 0) params.grade = grade
      if (designation && designation.length > 0) params.designation = designation
      if (jobRole && jobRole.length > 0) params.jobRole = jobRole
      if (employeeCategory && employeeCategory.length > 0) params.employeeCategory = employeeCategory
      if (employeeType && employeeType.length > 0) params.employeeType = employeeType
      if (hiringManager && hiringManager.length > 0) params.hiringManager = hiringManager
      if (company) params.company = company
      if (businessUnit && businessUnit.length > 0) params.businessUnit = businessUnit
      if (department && department.length > 0) params.department = department
      if (territory && territory.length > 0) params.territory = territory
      if (zone && zone.length > 0) params.zone = zone
      if (region && region.length > 0) params.region = region
      if (area && area.length > 0) params.area = area
      if (cluster && cluster.length > 0) params.cluster = cluster
      if (branch && branch.length > 0) params.branch = branch
      if (city && city.length > 0) params.city = city
      if (band && band.length > 0) params.band = band
      if (origin) params.origin = origin

      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
    }
  }
)

// Thunk for fetching a single vacancy by ID
export const fetchVacancyById = createAsyncThunk<VacancyDetailsResponse, { id: string }>(
  'vacancyManagement/fetchVacancyById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingById.replace(':id', id))

      return response.data
    } catch (error: any) {
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

      const response = await AxiosLib.get(API_ENDPOINTS.vacancyRequestGroupByDesignation, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy requests grouped by designation')
    }
  }
)

// Thunk for fetching vacancies grouped by designation
export const fetchVacanciesGroupByDesignation = createAsyncThunk<
  VacancyGroupByDesignationResponse,
  {
    page: number
    limit: number
    search?: string
    locationType: 'BRANCH' | 'CLUSTER' | 'AREA' | 'REGION' | 'ZONE' | 'TERRITORY'
    status?: 'PENDING' | 'APPROVED' | 'FREEZED'
  }
>(
  'vacancyManagement/fetchVacanciesGroupByDesignation',
  async ({ page, limit, search, locationType, status }, { rejectWithValue }) => {
    try {
      const params: {
        page: number
        limit: number
        search?: string
        locationType: string
        status?: string
      } = { page, limit, locationType }

      if (search) params.search = search.trim()
      if (status) params.status = status

      const response = await AxiosLib.get(API_ENDPOINTS.vacancyGroupByDesignation, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies grouped by designation')
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

    const response = await AxiosLib.put(API_ENDPOINTS.updateVacancyRequestStatusUrl(id), requestBody)

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to update vacancy request status')
  }
})

// Thunk for updating vacancy status
export const updateVacancyStatus = createAsyncThunk<
  UpdateVacancyStatusResponse,
  {
    ids: string[]
    status: 'PENDING' | 'APPROVED' | 'FREEZED'
    notes?: string
    designation?: any
    branchName?: any
    areaName?: any
    regionName?: any
    zoneName?: any
    department?: any
  }
>('vacancyManagement/updateVacancyStatus', async (params, { rejectWithValue }) => {
  try {
    const { ids, status, notes, designation, branchName, areaName, regionName, zoneName, department } = params

    const requestBody = {
      ids,
      status,
      notes,
      designation: designation,
      branchName: branchName,
      areaName: areaName,
      regionName: regionName,
      zoneName: zoneName,
      department: department
    }

    const response = await AxiosLib.put(API_ENDPOINTS.vacancyStatusUpdate, requestBody)

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to update vacancy status')
  }
})

// Thunk for auto-approving vacancy requests
export const autoApproveVacancyRequests = createAsyncThunk<AutoApproveVacancyRequestsResponse, void>(
  'vacancyManagement/autoApproveVacancyRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.autoApproveVacancyRequestsUrl)

      return response.data
    } catch (error: any) {
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
    vacancyGroupByDesignationLoading: false,
    vacancyGroupByDesignationSuccess: false,
    vacancyGroupByDesignationData: null,
    vacancyGroupByDesignationTotal: 0,
    vacancyGroupByDesignationFailure: false,
    vacancyGroupByDesignationFailureMessage: '',
    updateVacancyRequestStatusLoading: false,
    updateVacancyRequestStatusSuccess: false,
    updateVacancyRequestStatusData: null,
    updateVacancyRequestStatusFailure: false,
    updateVacancyRequestStatusFailureMessage: '',
    updateVacancyStatusLoading: false,
    updateVacancyStatusSuccess: false,
    updateVacancyStatusData: null,
    updateVacancyStatusFailure: false,
    updateVacancyStatusFailureMessage: '',
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
    handleAsyncThunkStates(builder, fetchVacanciesGroupByDesignation, 'vacancyGroupByDesignation')
    handleAsyncThunkStates(builder, updateVacancyRequestStatus, 'updateVacancyRequestStatus')
    handleAsyncThunkStates(builder, updateVacancyStatus, 'updateVacancyStatus')
    handleAsyncThunkStates(builder, autoApproveVacancyRequests, 'autoApproveVacancyRequests')
  }
})

export const {} = vacancyManagementSlice.actions
export default vacancyManagementSlice.reducer
