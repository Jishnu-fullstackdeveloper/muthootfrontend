import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'
import { API_ENDPOINTS } from '../ApiUrls/branch'

import type {
  BranchListResponse,
  BranchDetailsResponse,
  EmployeeListResponse,
  BranchManagementState,
  AreaListResponse,
  ResignedEmployeesResponse,
  BranchReportResponse,
  VacancyReportResponse,
  BubblePositionResponse,
  VacancyResponse
} from '@/types/branch'

// Thunk for fetching branch list
export const getBranchList = createAsyncThunk<
  BranchListResponse,
  {
    page: number
    limit: number
    search?: string
    areaId?: string
    districtId?: string
    stateId?: string
    clusterId?: string
    cityId?: string
    branchCode?: string
    bucketNames?: string[]
  }
>(
  'branchManagement/getBranchList',
  async (
    { page, limit, search, areaId, districtId, stateId, clusterId, cityId, branchCode, bucketNames },
    { rejectWithValue }
  ) => {
    try {
      const params: {
        page: number
        limit: number
        search?: string
        areaId?: string
        districtId?: string
        stateId?: string
        clusterId?: string
        cityId?: string
        branchCode?: string
        bucketNames?: string[]
      } = { page, limit }

      if (search) params.search = search
      if (areaId) params.areaId = areaId
      if (districtId) params.districtId = districtId
      if (stateId) params.stateId = stateId
      if (clusterId) params.clusterId = clusterId
      if (cityId) params.cityId = cityId
      if (branchCode) params.branchCode = branchCode
      if (bucketNames && bucketNames.length > 0) params.bucketNames = bucketNames

      const response = await AxiosLib.get(API_ENDPOINTS.getBranchListUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk for fetching branch details
export const getBranchDetails = createAsyncThunk<BranchDetailsResponse, { id: string }>(
  'branchManagement/getBranchDetails',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getBranchDetailsUrl(id))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk for fetching employee details with branchId
export const getEmployeeDetailsWithBranchId = createAsyncThunk<
  EmployeeListResponse,
  { branchId: string; page: number; limit: number }
>('branchManagement/getEmployeeDetailsWithBranchId', async ({ branchId, page, limit }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(API_ENDPOINTS.getEmployeeDetailsWithBranchIdUrl(branchId), {
      params: {
        page,
        limit
      }
    })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// Thunk for fetching area list
export const fetchArea = createAsyncThunk<
  AreaListResponse,
  { search?: string; page: number; limit: number; regionId?: string }
>('branchManagement/fetchArea', async ({ search, page, limit, regionId }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; regionId?: string } = { page, limit }

    if (search) params.search = search
    if (regionId) params.regionId = regionId

    const response = await AxiosLib.get(API_ENDPOINTS.fetchArea, { params })

    // Format the response to match AreaListResponse
    return {
      status: response.data.status,
      message: response.data.message,
      totalCount: response.data.totalCount,
      data: response.data.data,
      currentPage: response.data.currentPage,
      limit: response.data.limit
    }
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// Thunk for fetching resigned employees
export const fetchResignedEmployees = createAsyncThunk<
  ResignedEmployeesResponse,
  { id: string; date: string; page: number; limit: number }
>('branchManagement/fetchResignedEmployees', async ({ id, date, page, limit }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(API_ENDPOINTS.fetchResignedEmployeesUrl(id), {
      params: {
        date,
        page,
        limit
      }
    })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// Thunk for fetching branch report
export const fetchBranchReport = createAsyncThunk<BranchReportResponse, { filterKey: string; filterValue: string }>(
  'branchManagement/fetchBranchReport',
  async ({ filterKey, filterValue }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchBranchReportUrl, {
        params: {
          filterKey,
          filterValue
        }
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk for fetching vacancy report
export const fetchVacancyReport = createAsyncThunk<VacancyReportResponse, { filterKey: string; filterValue: string }>(
  'branchManagement/fetchVacancyReport',
  async ({ filterKey, filterValue }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchVacancyReportUrl, {
        params: {
          filterKey,
          filterValue
        }
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk for fetching bubble positions
export const fetchBubblePositions = createAsyncThunk<BubblePositionResponse, { branchId: string }>(
  'branchManagement/fetchBubblePositions',
  async ({ branchId }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchBubblePositionsUrl(branchId))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk for fetching vacancies
export const fetchVacancies = createAsyncThunk<VacancyResponse, { branchId: string }>(
  'branchManagement/fetchVacancies',
  async ({ branchId }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchVacanciesUrl(branchId))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Create the slice
export const branchManagementSlice = createSlice({
  name: 'branchManagement',
  initialState: {
    branchListLoading: false,
    branchListSuccess: false,
    branchListData: null,
    branchListTotal: 0,
    branchListFailure: false,
    branchListFailureMessage: '',
    branchDetailsLoading: false,
    branchDetailsSuccess: false,
    branchDetailsData: null,
    branchDetailsFailure: false,
    branchDetailsFailureMessage: '',
    employeeListLoading: false,
    employeeListSuccess: false,
    employeeListData: null,
    employeeListTotal: 0,
    employeeListFailure: false,
    employeeListFailureMessage: '',
    fetchAreaLoading: false,
    fetchAreaSuccess: false,
    fetchAreaData: null,
    fetchAreaTotal: 0,
    fetchAreaFailure: false,
    fetchAreaFailureMessage: '',
    resignedEmployeesLoading: false,
    resignedEmployeesSuccess: false,
    resignedEmployeesData: null,
    resignedEmployeesTotal: 0,
    resignedEmployeesFailure: false,
    resignedEmployeesFailureMessage: '',
    fetchBranchReportLoading: false,
    fetchBranchReportSuccess: false,
    fetchBranchReportData: null,
    fetchBranchReportFailure: false,
    fetchBranchReportFailureMessage: '',
    fetchVacancyReportLoading: false,
    fetchVacancyReportSuccess: false,
    fetchVacancyReportData: null,
    fetchVacancyReportFailure: false,
    fetchVacancyReportFailureMessage: '',
    fetchBubblePositionsLoading: false,
    fetchBubblePositionsSuccess: false,
    fetchBubblePositionsData: null,
    fetchBubblePositionsFailure: false,
    fetchBubblePositionsFailureMessage: '',
    fetchVacanciesLoading: false,
    fetchVacanciesSuccess: false,
    fetchVacanciesData: null,
    fetchVacanciesFailure: false,
    fetchVacanciesFailureMessage: ''
  } as BranchManagementState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, getBranchList, 'branchList')
    handleAsyncThunkStates(builder, getBranchDetails, 'branchDetails')
    handleAsyncThunkStates(builder, getEmployeeDetailsWithBranchId, 'employeeList')
    handleAsyncThunkStates(builder, fetchArea, 'fetchArea')
    handleAsyncThunkStates(builder, fetchResignedEmployees, 'resignedEmployees')
    handleAsyncThunkStates(builder, fetchBranchReport, 'fetchBranchReport')
    handleAsyncThunkStates(builder, fetchVacancyReport, 'fetchVacancyReport')
    handleAsyncThunkStates(builder, fetchBubblePositions, 'fetchBubblePositions')
    handleAsyncThunkStates(builder, fetchVacancies, 'fetchVacancies')
  }
})

export const {} = branchManagementSlice.actions
export default branchManagementSlice.reducer
