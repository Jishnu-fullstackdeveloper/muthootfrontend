import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'

/**
 * @author Siyad M
 * @description Fetches the resignation overview list using Axios.
 * @function fetchResignationOverviewList
 * @param {string} params
 */

export const fetchResignationOverviewList = createAsyncThunk<any, any>(
  'appTms/fetchTicketsList',
  async (params: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/api/recruitment-request/group', {
        params
      })

      
return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchHierarchyData = createAsyncThunk<any, string>(
  'recruitmentResignation/fetchHierarchyData',
  async (hierarchyName: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/api/recruitment-request/hierarchyData/${hierarchyName}`)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface EmployeeHierarchyOptionsPayload {
  id: number
  hierarchyId: number
  page: number
  limit: number
}

export const fetchEmployeeHierarchyOptions = createAsyncThunk<any, EmployeeHierarchyOptionsPayload>(
  'recruitmentResignation/fetchEmployeeHierarchyOptions',
  async (requestData: EmployeeHierarchyOptionsPayload, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/api/recruitment-request/employeeHierarchyOptions', requestData)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface CorporateHierarchyOptionsPayload {
  id: number
  hierarchyId: number
  page: number
  limit: number
}

export const fetchCorporateHierarchyOptions = createAsyncThunk<any, CorporateHierarchyOptionsPayload>(
  'recruitmentResignation/fetchCorporateHierarchyOptions',
  async (requestData: CorporateHierarchyOptionsPayload, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/api/recruitment-request/corporateHierarchyOptions', requestData)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface RecruitmentRequestPayload {
  gradeId: number
  branchId: number
  employeeCategoryTypeId: number
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

interface RequestDecisionPayload {
  id: number | string
  approvalStatus: 'APPROVED' | 'REJECTED'
  approverId: number | string
}

export const submitRequestDecision = createAsyncThunk<any, RequestDecisionPayload>(
  'recruitmentResignation/submitDecision',
  async (requestData: RequestDecisionPayload, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.patch(`/approval-requests/${requestData.id}/status`, {
        approverId: requestData.approverId,
        approvalStatus: requestData.approvalStatus
      })

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface RequestListParams {
  designationName: string
  page: number
  limit: number
}

export const fetchRecruitmentRequestList = createAsyncThunk<any, RequestListParams>(
  'appTms/fetchRequestList',
  async ({ designationName, page, limit }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/api/recruitment-request', {
        params: {
          designationName,
          page,
          limit
        }
      })

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchRecruitmentRequestById = createAsyncThunk<any, { id: string | number }>(
  'appTms/fetchRequestById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/api/recruitment-request/id/${id}`)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const recruitmentResignationSlice = createSlice({
  name: 'appMuthoot',
  initialState: {
    fetchResignationOverviewListLoading: false,
    fetchResignationOverviewListSuccess: false,
    fetchResignationOverviewListData: [],
    fetchResignationOverviewListFailure: false,
    fetchResignationOverviewListFailureMessage: '',

    fetchRecruitmentRequestListLoading: false,
    fetchRecruitmentRequestListSuccess: false,
    fetchRecruitmentRequestListData: [],
    fetchRecruitmentRequestListFailure: false,
    fetchRecruitmentRequestListFailureMessage: '',

    fetchRecruitmentRequestByIdLoading: false,
    fetchRecruitmentRequestByIdSuccess: false,
    fetchRecruitmentRequestByIdData: null,
    fetchRecruitmentRequestByIdFailure: false,
    fetchRecruitmentRequestByIdFailureMessage: '',

    fetchEmployeeHierarchyOptionsLoading: false,
    fetchEmployeeHierarchyOptionsSuccess: false,
    fetchEmployeeHierarchyOptionsData: null,
    fetchEmployeeHierarchyOptionsFailure: false,
    fetchEmployeeHierarchyOptionsFailureMessage: '',

    fetchCorporateHierarchyOptionsLoading: false,
    fetchCorporateHierarchyOptionsSuccess: false,
    fetchCorporateHierarchyOptionsData: null,
    fetchCorporateHierarchyOptionsFailure: false,
    fetchCorporateHierarchyOptionsFailureMessage: '',

    submitRecruitmentRequestLoading: false,
    submitRecruitmentRequestSuccess: false,
    submitRecruitmentRequestData: null,
    submitRecruitmentRequestFailure: false,
    submitRecruitmentRequestFailureMessage: '',

    submitRequestDecisionLoading: false,
    submitRequestDecisionSuccess: false,
    submitRequestDecisionData: null,
    submitRequestDecisionFailure: false,
    submitRequestDecisionFailureMessage: '',

    fetchHierarchyDataLoading: false,
    fetchHierarchyDataSuccess: false,
    fetchHierarchyDataData: null,
    fetchHierarchyDataFailure: false,
    fetchHierarchyDataFailureMessage: ''
  },
  reducers: {
    fetchResignationAPIDismiss: state => {
      state.fetchResignationOverviewListLoading = false
      state.fetchResignationOverviewListSuccess = false
      state.fetchResignationOverviewListFailure = false
    },
    fetchRecruitmentRequestListDismiss: state => {
      state.fetchRecruitmentRequestListLoading = false
      state.fetchRecruitmentRequestListSuccess = false
      state.fetchRecruitmentRequestListFailure = false
    },
    fetchRecruitmentRequestByIdDismiss: state => {
      state.fetchRecruitmentRequestByIdLoading = false
      state.fetchRecruitmentRequestByIdSuccess = false
      state.fetchRecruitmentRequestByIdFailure = false
    },
    fetchEmployeeHierarchyOptionsDismiss: state => {
      state.fetchEmployeeHierarchyOptionsLoading = false
      state.fetchEmployeeHierarchyOptionsSuccess = false
      state.fetchEmployeeHierarchyOptionsFailure = false
    },

    fetchCorporateHierarchyOptionsDismiss: state => {
      state.fetchCorporateHierarchyOptionsLoading = false
      state.fetchCorporateHierarchyOptionsSuccess = false
      state.fetchCorporateHierarchyOptionsFailure = false
    },

    submitRecruitmentRequestDismiss: state => {
      state.submitRecruitmentRequestLoading = false
      state.submitRecruitmentRequestSuccess = false
      state.submitRecruitmentRequestFailure = false
    },
    submitRequestDecisionDismiss: state => {
      state.submitRequestDecisionLoading = false
      state.submitRequestDecisionSuccess = false
      state.submitRequestDecisionFailure = false
    },
    fetchHierarchyDataDismiss: state => {
      state.fetchHierarchyDataLoading = false
      state.fetchHierarchyDataSuccess = false
      state.fetchHierarchyDataFailure = false
    }
  },

  extraReducers: builder => {
    // Use the helper function for each thunk
    handleAsyncThunkStates(builder, fetchEmployeeHierarchyOptions, 'fetchEmployeeHierarchyOptions')
    handleAsyncThunkStates(builder, fetchCorporateHierarchyOptions, 'fetchCorporateHierarchyOptions')
    handleAsyncThunkStates(builder, fetchResignationOverviewList, 'fetchResignationOverviewList')
    handleAsyncThunkStates(builder, fetchRecruitmentRequestList, 'fetchRecruitmentRequestList')
    handleAsyncThunkStates(builder, fetchRecruitmentRequestById, 'fetchRecruitmentRequestById')
    handleAsyncThunkStates(builder, submitRecruitmentRequest, 'submitRecruitmentRequest')
    handleAsyncThunkStates(builder, submitRequestDecision, 'submitRequestDecision')
    handleAsyncThunkStates(builder, fetchHierarchyData, 'fetchHierarchyData')
  }
})

export const {
  fetchResignationAPIDismiss,
  fetchRecruitmentRequestListDismiss,
  fetchRecruitmentRequestByIdDismiss,
  fetchEmployeeHierarchyOptionsDismiss,
  fetchCorporateHierarchyOptionsDismiss,
  submitRecruitmentRequestDismiss,
  submitRequestDecisionDismiss,
  fetchHierarchyDataDismiss
} = recruitmentResignationSlice.actions

export default recruitmentResignationSlice.reducer
