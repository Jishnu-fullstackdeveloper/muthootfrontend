import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'
import { API_ENDPOINTS } from '../ApiUrls/budget'
import type {
  BudgetDepartmentResponse,
  BudgetManagementState,
  BudgetIncreaseRequestResponse,
  BudgetIncreaseRequestListResponse,
  BudgetIncreaseRequestApproveRejectResponse,
  BudgetIncreaseRequestDetailResponse,
  BudgetIncreaseRequest,
  JobRoleResponse,
  EmployeeResponse,
  BusinessUnitResponse,
  EmployeeCategoryTypeResponse,
  DepartmentResponse,
  DesignationResponse,
  GradeResponse,
  ZoneResponse,
  RegionResponse,
  AreaResponse,
  BranchResponse,
  StateResponse,
  ApprovalCategoryResponse,
  TerritoryResponse,
  ClusterResponse,
  CityResponse
} from '@/types/budget'

// Existing thunks (unchanged)
export const fetchBudgetDepartment = createAsyncThunk<
  BudgetDepartmentResponse,
  { search?: string; page: number; limit: number }
>('budgetManagement/fetchBudgetDepartment', async ({ search, page, limit }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string } = { page, limit }

    if (search) params.search = search
    const response = await AxiosLib.get(API_ENDPOINTS.fetchBudgetDepartmentUrl, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const createBudgetIncreaseRequest = createAsyncThunk<BudgetIncreaseRequestResponse, BudgetIncreaseRequest>(
  'budgetManagement/createBudgetIncreaseRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.budgetIncreaseRequestUrl, requestData)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBudgetIncreaseRequestList = createAsyncThunk<
  BudgetIncreaseRequestListResponse,
  { page: number; limit: number; search?: string; status?: 'APPROVED' | 'REJECTED' | 'PENDING' }
>('budgetManagement/fetchBudgetIncreaseRequestList', async ({ page, limit, search, status }, { rejectWithValue }) => {
  try {
    const params = { page, limit, search, status }

    if (search) params.search = search
    if (status) params.status = status
    const response = await AxiosLib.get(API_ENDPOINTS.budgetIncreaseRequestListUrl, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const approveRejectBudgetIncreaseRequest = createAsyncThunk<
  BudgetIncreaseRequestApproveRejectResponse,
  { approvalRequestId: string; status: string; approverId: string; approverDesignation: string }
>(
  'budgetManagement/approveRejectBudgetIncreaseRequest',
  async ({ approvalRequestId, status, approverId, approverDesignation }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.put(
        `${API_ENDPOINTS.budgetIncreaseRequestApproveRejectUrl}${approvalRequestId}`,
        { status, approverId, approverDesignation }
      )

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBudgetIncreaseRequestById = createAsyncThunk<BudgetIncreaseRequestDetailResponse, { id: string }>(
  'budgetManagement/fetchBudgetIncreaseRequestById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`${API_ENDPOINTS.budgetIncreaseRequestDetailUrl}/${id}`)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchJobRole = createAsyncThunk<JobRoleResponse, { page: number; limit: number; search?: string }>(
  'budgetManagement/fetchJobRole',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit }

      if (search) params.search = search
      const response = await AxiosLib.get(`${API_ENDPOINTS.jobRoleUrl}`, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchEmployee = createAsyncThunk<
  EmployeeResponse,
  { page: number; limit: number; search?: string; employeeCode?: string }
>('budgetManagement/fetchEmployee', async ({ page, limit, search, employeeCode }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; employeeCode?: string } = { page, limit }

    if (search) params.search = search
    if (employeeCode) params.employeeCode = employeeCode
    const response = await AxiosLib.get(`${API_ENDPOINTS.employeeUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchBusinessUnit = createAsyncThunk<
  BusinessUnitResponse,
  { page: number; limit: number; search?: string }
>('budgetManagement/fetchBusinessUnit', async ({ page, limit, search }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string } = { page, limit }

    if (search) params.search = search
    const response = await AxiosLib.get(`${API_ENDPOINTS.businessUnitUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchEmployeeCategoryType = createAsyncThunk<
  EmployeeCategoryTypeResponse,
  { page: number; limit: number; search?: string; businessUnitId?: string }
>(
  'budgetManagement/fetchEmployeeCategoryType',
  async ({ page, limit, search, businessUnitId }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string; businessUnitId?: string } = { page, limit }

      if (search) params.search = search
      if (businessUnitId) params.businessUnitId = businessUnitId
      const response = await AxiosLib.get(`${API_ENDPOINTS.employeeCategoryTypeUrl}`, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchDepartment = createAsyncThunk<
  DepartmentResponse,
  { page: number; limit: number; search?: string; employeeCategoryId?: string }
>('budgetManagement/fetchDepartment', async ({ page, limit, search, employeeCategoryId }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; employeeCategoryId?: string } = { page, limit }

    if (search) params.search = search
    if (employeeCategoryId) params.employeeCategoryId = employeeCategoryId
    const response = await AxiosLib.get(`${API_ENDPOINTS.departmentUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchDesignation = createAsyncThunk<
  DesignationResponse,
  { page: number; limit: number; search?: string; type?: 'branch' | 'area'; departmentId?: string }
>('budgetManagement/fetchDesignation', async ({ page, limit, search, type, departmentId }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; type?: 'branch' | 'area'; departmentId?: string } = {
      page,
      limit
    }

    if (search) params.search = search
    if (type) params.type = type
    if (departmentId) params.departmentId = departmentId
    const response = await AxiosLib.get(`${API_ENDPOINTS.designationUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchGrade = createAsyncThunk<GradeResponse, { page: number; limit: number; search?: string }>(
  'budgetManagement/fetchGrade',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit }

      if (search) params.search = search
      const response = await AxiosLib.get(`${API_ENDPOINTS.gradeUrl}`, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchZone = createAsyncThunk<
  ZoneResponse,
  { page: number; limit: number; search?: string; territoryId?: string }
>('budgetManagement/fetchZone', async ({ page, limit, search, territoryId }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; territoryId?: string } = { page, limit }

    if (search) params.search = search
    if (territoryId) params.territoryId = territoryId
    const response = await AxiosLib.get(`${API_ENDPOINTS.zoneUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchRegion = createAsyncThunk<
  RegionResponse,
  { page: number; limit: number; search?: string; zoneId?: string }
>('budgetManagement/fetchRegion', async ({ page, limit, search, zoneId }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; zoneId?: string } = { page, limit }

    if (search) params.search = search
    if (zoneId) params.zoneId = zoneId
    const response = await AxiosLib.get(`${API_ENDPOINTS.regionUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchArea = createAsyncThunk<
  AreaResponse,
  { page: number; limit: number; search?: string; regionId?: string }
>('budgetManagement/fetchArea', async ({ page, limit, search, regionId }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; regionId?: string } = { page, limit }

    if (search) params.search = search
    if (regionId) params.regionId = regionId
    const response = await AxiosLib.get(`${API_ENDPOINTS.areaUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// New thunks for Territory, Cluster, and City
export const fetchTerritory = createAsyncThunk<TerritoryResponse, { page: number; limit: number; search?: string }>(
  'budgetManagement/fetchTerritory',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit }

      if (search) params.search = search
      const response = await AxiosLib.get(`${API_ENDPOINTS.territoryUrl}`, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchCluster = createAsyncThunk<
  ClusterResponse,
  { page: number; limit: number; search?: string; areaId?: string }
>('budgetManagement/fetchCluster', async ({ page, limit, search, areaId }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string; areaId?: string } = { page, limit }

    if (search) params.search = search
    if (areaId) params.areaId = areaId
    const response = await AxiosLib.get(`${API_ENDPOINTS.clusterUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchBranch = createAsyncThunk<
  BranchResponse,
  {
    page: number
    limit: number
    search?: string
    areaId?: string
    districtId?: string
    stateId?: string
    clusterId?: string
  }
>(
  'budgetManagement/fetchBranch',
  async ({ page, limit, search, areaId, districtId, stateId, clusterId }, { rejectWithValue }) => {
    try {
      const params: {
        page: number
        limit: number
        search?: string
        areaId?: string
        districtId?: string
        stateId?: string
        clusterId?: string
      } = {
        page,
        limit
      }

      if (search) params.search = search
      if (areaId) params.areaId = areaId
      if (districtId) params.districtId = districtId
      if (stateId) params.stateId = stateId
      if (clusterId) params.clusterId = clusterId
      const response = await AxiosLib.get(`${API_ENDPOINTS.branchUrl}`, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchCity = createAsyncThunk<CityResponse, { page: number; limit: number; search?: string }>(
  'budgetManagement/fetchCity',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit }

      if (search) params.search = search
      const response = await AxiosLib.get(`${API_ENDPOINTS.cityUrl}`, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchState = createAsyncThunk<StateResponse, { page: number; limit: number; search?: string }>(
  'budgetManagement/fetchState',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit }

      if (search) params.search = search
      const response = await AxiosLib.get(`${API_ENDPOINTS.stateUrl}`, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchApprovalCategories = createAsyncThunk<
  ApprovalCategoryResponse,
  { page: number; limit: number; search?: string }
>('budgetManagement/fetchApprovalCategories', async ({ page, limit, search }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string } = { page, limit }

    if (search) params.search = search
    const response = await AxiosLib.get(`${API_ENDPOINTS.approvalCategoriesUrl}`, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// Create the slice
export const budgetManagementSlice = createSlice({
  name: 'budgetManagement',
  initialState: {
    fetchBudgetDepartmentLoading: false,
    fetchBudgetDepartmentSuccess: false,
    fetchBudgetDepartmentData: null,
    fetchBudgetDepartmentTotal: 0,
    fetchBudgetDepartmentFailure: false,
    fetchBudgetDepartmentFailureMessage: '',
    createBudgetIncreaseRequestLoading: false,
    createBudgetIncreaseRequestSuccess: false,
    createBudgetIncreaseRequestData: null,
    createBudgetIncreaseRequestFailure: false,
    createBudgetIncreaseRequestFailureMessage: '',
    fetchBudgetIncreaseRequestListLoading: false,
    fetchBudgetIncreaseRequestListSuccess: false,
    fetchBudgetIncreaseRequestListData: null,
    fetchBudgetIncreaseRequestListTotal: 0,
    fetchBudgetIncreaseRequestListFailure: false,
    fetchBudgetIncreaseRequestListFailureMessage: '',
    approveRejectBudgetIncreaseRequestLoading: false,
    approveRejectBudgetIncreaseRequestSuccess: false,
    approveRejectBudgetIncreaseRequestData: null,
    approveRejectBudgetIncreaseRequestFailure: false,
    approveRejectBudgetIncreaseRequestFailureMessage: '',
    fetchBudgetIncreaseRequestByIdLoading: false,
    fetchBudgetIncreaseRequestByIdSuccess: false,
    fetchBudgetIncreaseRequestByIdData: null,
    fetchBudgetIncreaseRequestByIdFailure: false,
    fetchBudgetIncreaseRequestByIdFailureMessage: '',
    fetchJobRoleLoading: false,
    fetchJobRoleSuccess: false,
    fetchJobRoleData: null,
    fetchJobRoleTotal: 0,
    fetchJobRoleFailure: false,
    fetchJobRoleFailureMessage: '',
    fetchEmployeeLoading: false,
    fetchEmployeeSuccess: false,
    fetchEmployeeData: null,
    fetchEmployeeTotal: 0,
    fetchEmployeeFailure: false,
    fetchEmployeeFailureMessage: '',
    fetchBusinessUnitLoading: false,
    fetchBusinessUnitSuccess: false,
    fetchBusinessUnitData: null,
    fetchBusinessUnitTotal: 0,
    fetchBusinessUnitFailure: false,
    fetchBusinessUnitFailureMessage: '',
    fetchEmployeeCategoryTypeLoading: false,
    fetchEmployeeCategoryTypeSuccess: false,
    fetchEmployeeCategoryTypeData: null,
    fetchEmployeeCategoryTypeTotal: 0,
    fetchEmployeeCategoryTypeFailure: false,
    fetchEmployeeCategoryTypeFailureMessage: '',
    fetchDepartmentLoading: false,
    fetchDepartmentSuccess: false,
    fetchDepartmentData: null,
    fetchDepartmentTotal: 0,
    fetchDepartmentFailure: false,
    fetchDepartmentFailureMessage: '',
    fetchDesignationLoading: false,
    fetchDesignationSuccess: false,
    fetchDesignationData: null,
    fetchDesignationTotal: 0,
    fetchDesignationFailure: false,
    fetchDesignationFailureMessage: '',
    fetchGradeLoading: false,
    fetchGradeSuccess: false,
    fetchGradeData: null,
    fetchGradeTotal: 0,
    fetchGradeFailure: false,
    fetchGradeFailureMessage: '',
    fetchZoneLoading: false,
    fetchZoneSuccess: false,
    fetchZoneData: null,
    fetchZoneTotal: 0,
    fetchZoneFailure: false,
    fetchZoneFailureMessage: '',
    fetchRegionLoading: false,
    fetchRegionSuccess: false,
    fetchRegionData: null,
    fetchRegionTotal: 0,
    fetchRegionFailure: false,
    fetchRegionFailureMessage: '',
    fetchAreaLoading: false,
    fetchAreaSuccess: false,
    fetchAreaData: null,
    fetchAreaTotal: 0,
    fetchAreaFailure: false,
    fetchAreaFailureMessage: '',
    fetchTerritoryLoading: false,
    fetchTerritorySuccess: false,
    fetchTerritoryData: null,
    fetchTerritoryTotal: 0,
    fetchTerritoryFailure: false,
    fetchTerritoryFailureMessage: '',
    fetchClusterLoading: false,
    fetchClusterSuccess: false,
    fetchClusterData: null,
    fetchClusterTotal: 0,
    fetchClusterFailure: false,
    fetchClusterFailureMessage: '',
    fetchBranchLoading: false,
    fetchBranchSuccess: false,
    fetchBranchData: null,
    fetchBranchTotal: 0,
    fetchBranchFailure: false,
    fetchBranchFailureMessage: '',
    fetchCityLoading: false,
    fetchCitySuccess: false,
    fetchCityData: null,
    fetchCityTotal: 0,
    fetchCityFailure: false,
    fetchCityFailureMessage: '',
    fetchStateLoading: false,
    fetchStateSuccess: false,
    fetchStateData: null,
    fetchStateTotal: 0,
    fetchStateFailure: false,
    fetchStateFailureMessage: '',
    fetchApprovalCategoriesLoading: false,
    fetchApprovalCategoriesSuccess: false,
    fetchApprovalCategoriesData: null,
    fetchApprovalCategoriesTotal: 0,
    fetchApprovalCategoriesFailure: false,
    fetchApprovalCategoriesFailureMessage: ''
  } as BudgetManagementState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, fetchBudgetDepartment, 'fetchBudgetDepartment')
    handleAsyncThunkStates(builder, createBudgetIncreaseRequest, 'createBudgetIncreaseRequest')
    handleAsyncThunkStates(builder, fetchBudgetIncreaseRequestList, 'fetchBudgetIncreaseRequestList')
    handleAsyncThunkStates(builder, approveRejectBudgetIncreaseRequest, 'approveRejectBudgetIncreaseRequest')
    handleAsyncThunkStates(builder, fetchBudgetIncreaseRequestById, 'fetchBudgetIncreaseRequestById')
    handleAsyncThunkStates(builder, fetchJobRole, 'fetchJobRole')
    handleAsyncThunkStates(builder, fetchEmployee, 'fetchEmployee')
    handleAsyncThunkStates(builder, fetchBusinessUnit, 'fetchBusinessUnit')
    handleAsyncThunkStates(builder, fetchEmployeeCategoryType, 'fetchEmployeeCategoryType')
    handleAsyncThunkStates(builder, fetchDepartment, 'fetchDepartment')
    handleAsyncThunkStates(builder, fetchDesignation, 'fetchDesignation')
    handleAsyncThunkStates(builder, fetchGrade, 'fetchGrade')
    handleAsyncThunkStates(builder, fetchZone, 'fetchZone')
    handleAsyncThunkStates(builder, fetchRegion, 'fetchRegion')
    handleAsyncThunkStates(builder, fetchArea, 'fetchArea')
    handleAsyncThunkStates(builder, fetchTerritory, 'fetchTerritory')
    handleAsyncThunkStates(builder, fetchCluster, 'fetchCluster')
    handleAsyncThunkStates(builder, fetchBranch, 'fetchBranch')
    handleAsyncThunkStates(builder, fetchCity, 'fetchCity')
    handleAsyncThunkStates(builder, fetchState, 'fetchState')
    handleAsyncThunkStates(builder, fetchApprovalCategories, 'fetchApprovalCategories')
  }
})

export const {} = budgetManagementSlice.actions
export default budgetManagementSlice.reducer
