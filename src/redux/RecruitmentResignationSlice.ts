import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates, constructUrlWithParams } from '@/utils/functions'

// Define parameters for fetchResignationOverviewList
interface FetchResignationOverviewParams {
  search?: string
  page: number
  limit: number
  designationName?: string // Optional for second page
  id?: string // Optional for third page
}

export const fetchResignationOverviewList = createAsyncThunk<any, FetchResignationOverviewParams>(
  'appTms/fetchTicketsList',
  async (params: FetchResignationOverviewParams, { rejectWithValue }) => {
    try {
      // Construct URL and params
      const { search, page, limit, designationName, id } = params
      const queryParams: Record<string, any> = { search, page, limit }

      // Add designationName for second page, id for third page
      if (designationName !== undefined) {
        queryParams.designationName = designationName
      } else if (id !== undefined) {
        queryParams.id = id
      }

      const url = constructUrlWithParams('/api/recruitment-request', queryParams)
      const response = await AxiosLib.get(url)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface FetchParams {
  search?: string
  page: number
  limit: number
  parentId?: number // Optional parent ID for hierarchy
}

export const fetchBusinessUnits = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchBusinessUnits',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/businessUnit', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchEmployeeCategoryType = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchEmployeeCategoryType',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/employeeCategoryType', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchDepartment = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchDepartment',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/department', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchDesignation = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchDesignation',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/designation', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchGrade = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchGrade',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/grade', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBand = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchBand',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/band', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchZone = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchZone',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/zone', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchRegion = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchRegion',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/region', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchArea = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchArea',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/area', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBranch = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchBranch',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/branch', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchState = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchState',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/state', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchDistrict = createAsyncThunk<any, FetchParams>(
  'recruitmentResignation/fetchDistrict',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const url = constructUrlWithParams('/district', params)
      const response = await AxiosLib.get(url)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface RecruitmentRequestPayload {
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
}

export const submitRecruitmentRequest = createAsyncThunk<any, RecruitmentRequestPayload>(
  'recruitmentResignation/submitRequest',
  async (requestData: RecruitmentRequestPayload, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/api/recruitment-request', requestData)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface ApproveRecruitmentPayload {
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
  metaData: Record<string, any> // Flexible object for metaData
}

export const approveRecruitment = createAsyncThunk<any, ApproveRecruitmentPayload>(
  'recruitmentResignation/approveRecruitment',
  async (requestData: ApproveRecruitmentPayload, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/vacancy', requestData)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const recruitmentResignationSlice = createSlice({
  name: 'recruitmentResignation',
  initialState: {
    fetchResignationOverviewListLoading: false,
    fetchResignationOverviewListSuccess: false,
    fetchResignationOverviewListData: [],
    fetchResignationOverviewListFailure: false,
    fetchResignationOverviewListFailureMessage: '',

    fetchBusinessUnitsLoading: false,
    fetchBusinessUnitsSuccess: false,
    fetchBusinessUnitsData: [],
    fetchBusinessUnitsFailure: false,
    fetchBusinessUnitsFailureMessage: '',

    fetchEmployeeCategoryTypeLoading: false,
    fetchEmployeeCategoryTypeSuccess: false,
    fetchEmployeeCategoryTypeData: [],
    fetchEmployeeCategoryTypeFailure: false,
    fetchEmployeeCategoryTypeFailureMessage: '',

    fetchDepartmentLoading: false,
    fetchDepartmentSuccess: false,
    fetchDepartmentData: [],
    fetchDepartmentFailure: false,
    fetchDepartmentFailureMessage: '',

    fetchDesignationLoading: false,
    fetchDesignationSuccess: false,
    fetchDesignationData: [],
    fetchDesignationFailure: false,
    fetchDesignationFailureMessage: '',

    fetchGradeLoading: false,
    fetchGradeSuccess: false,
    fetchGradeData: [],
    fetchGradeFailure: false,
    fetchGradeFailureMessage: '',

    fetchBandLoading: false,
    fetchBandSuccess: false,
    fetchBandData: [],
    fetchBandFailure: false,
    fetchBandFailureMessage: '',

    fetchZoneLoading: false,
    fetchZoneSuccess: false,
    fetchZoneData: [],
    fetchZoneFailure: false,
    fetchZoneFailureMessage: '',

    fetchRegionLoading: false,
    fetchRegionSuccess: false,
    fetchRegionData: [],
    fetchRegionFailure: false,
    fetchRegionFailureMessage: '',

    fetchAreaLoading: false,
    fetchAreaSuccess: false,
    fetchAreaData: [],
    fetchAreaFailure: false,
    fetchAreaFailureMessage: '',

    fetchBranchLoading: false,
    fetchBranchSuccess: false,
    fetchBranchData: [],
    fetchBranchFailure: false,
    fetchBranchFailureMessage: '',

    fetchStateLoading: false,
    fetchStateSuccess: false,
    fetchStateData: [],
    fetchStateFailure: false,
    fetchStateFailureMessage: '',

    fetchDistrictLoading: false,
    fetchDistrictSuccess: false,
    fetchDistrictData: [],
    fetchDistrictFailure: false,
    fetchDistrictFailureMessage: '',

    submitRecruitmentRequestLoading: false,
    submitRecruitmentRequestSuccess: false,
    submitRecruitmentRequestData: null,
    submitRecruitmentRequestFailure: false,
    submitRecruitmentRequestFailureMessage: '',

    approveRecruitmentLoading: false,
    approveRecruitmentSuccess: false,
    approveRecruitmentData: null,
    approveRecruitmentFailure: false,
    approveRecruitmentFailureMessage: ''
  },
  reducers: {
    fetchResignationAPIDismiss: state => {
      state.fetchResignationOverviewListLoading = false
      state.fetchResignationOverviewListSuccess = false
      state.fetchResignationOverviewListFailure = false
    },

    fetchBusinessUnitsDismiss: state => {
      state.fetchBusinessUnitsLoading = false
      state.fetchBusinessUnitsSuccess = false
      state.fetchBusinessUnitsFailure = false
    },

    fetchEmployeeCategoryTypeDismiss: state => {
      state.fetchEmployeeCategoryTypeLoading = false
      state.fetchEmployeeCategoryTypeSuccess = false
      state.fetchEmployeeCategoryTypeFailure = false
    },

    fetchDepartmentDismiss: state => {
      state.fetchDepartmentLoading = false
      state.fetchDepartmentSuccess = false
      state.fetchDepartmentFailure = false
    },

    fetchDesignationDismiss: state => {
      state.fetchDesignationLoading = false
      state.fetchDesignationSuccess = false
      state.fetchDesignationFailure = false
    },

    fetchGradeDismiss: state => {
      state.fetchGradeLoading = false
      state.fetchGradeSuccess = false
      state.fetchGradeFailure = false
    },

    fetchBandDismiss: state => {
      state.fetchBandLoading = false
      state.fetchBandSuccess = false
      state.fetchBandFailure = false
    },

    fetchZoneDismiss: state => {
      state.fetchZoneLoading = false
      state.fetchZoneSuccess = false
      state.fetchZoneFailure = false
    },

    fetchRegionDismiss: state => {
      state.fetchRegionLoading = false
      state.fetchRegionSuccess = false
      state.fetchRegionFailure = false
    },

    fetchAreaDismiss: state => {
      state.fetchAreaLoading = false
      state.fetchAreaSuccess = false
      state.fetchAreaFailure = false
    },

    fetchBranchDismiss: state => {
      state.fetchBranchLoading = false
      state.fetchBranchSuccess = false
      state.fetchBranchFailure = false
    },

    fetchStateDismiss: state => {
      state.fetchStateLoading = false
      state.fetchStateSuccess = false
      state.fetchStateFailure = false
    },

    fetchDistrictDismiss: state => {
      state.fetchDistrictLoading = false
      state.fetchDistrictSuccess = false
      state.fetchDistrictFailure = false
    },

    submitRecruitmentRequestDismiss: state => {
      state.submitRecruitmentRequestLoading = false
      state.submitRecruitmentRequestSuccess = false
      state.submitRecruitmentRequestFailure = false
    },

    approveRecruitmentDismiss: state => {
      state.approveRecruitmentLoading = false
      state.approveRecruitmentSuccess = false
      state.approveRecruitmentFailure = false
    }
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, fetchResignationOverviewList, 'fetchResignationOverviewList')
    handleAsyncThunkStates(builder, fetchBusinessUnits, 'fetchBusinessUnits')
    handleAsyncThunkStates(builder, fetchEmployeeCategoryType, 'fetchEmployeeCategoryType')
    handleAsyncThunkStates(builder, fetchDepartment, 'fetchDepartment')
    handleAsyncThunkStates(builder, fetchDesignation, 'fetchDesignation')
    handleAsyncThunkStates(builder, fetchGrade, 'fetchGrade')
    handleAsyncThunkStates(builder, fetchBand, 'fetchBand')
    handleAsyncThunkStates(builder, fetchZone, 'fetchZone')
    handleAsyncThunkStates(builder, fetchRegion, 'fetchRegion')
    handleAsyncThunkStates(builder, fetchArea, 'fetchArea')
    handleAsyncThunkStates(builder, fetchBranch, 'fetchBranch')
    handleAsyncThunkStates(builder, fetchState, 'fetchState')
    handleAsyncThunkStates(builder, fetchDistrict, 'fetchDistrict')
    handleAsyncThunkStates(builder, submitRecruitmentRequest, 'submitRecruitmentRequest')
    handleAsyncThunkStates(builder, approveRecruitment, 'approveRecruitment')
  }
})

export const {
  fetchResignationAPIDismiss,
  fetchBusinessUnitsDismiss,
  fetchEmployeeCategoryTypeDismiss,
  fetchDepartmentDismiss,
  fetchDesignationDismiss,
  fetchGradeDismiss,
  fetchBandDismiss,
  fetchZoneDismiss,
  fetchRegionDismiss,
  fetchAreaDismiss,
  fetchBranchDismiss,
  fetchStateDismiss,
  fetchDistrictDismiss,
  submitRecruitmentRequestDismiss,
  approveRecruitmentDismiss
} = recruitmentResignationSlice.actions

export default recruitmentResignationSlice.reducer
