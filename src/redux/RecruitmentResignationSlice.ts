import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AxiosLib from '@/lib/AxiosLib'

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
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

interface RequestOptionsPayload {
  id: number
  name: string
}

export const fetchRecruitMentRequestOptions = createAsyncThunk<any, RequestOptionsPayload>(
  'recruitmentResignation/fetchRequestOptions',
  async (requestData: RequestOptionsPayload, { rejectWithValue }) => {
    try {
      // Send requestData directly in the body, not as params
      const response = await AxiosLib.post('/api/recruitment-request/options', requestData)
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

export const fetchRecruitmentRequestList = createAsyncThunk<any, { designationName: string }>(
  'appTms/fetchRequestList',
  async ({ designationName }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/api/recruitment-request/${designationName}`)
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

// Helper function to handle async thunk states
const handleAsyncThunkStates = (builder: any, thunk: any, statePrefix: string) => {
  builder
    .addMatcher(
      action => action.type === thunk.pending.type,
      state => {
        state[`${statePrefix}Loading`] = true
        state[`${statePrefix}Success`] = false
        state[`${statePrefix}Failure`] = false
        state[`${statePrefix}FailureMessage`] = ''
      }
    )
    .addMatcher(
      action => action.type === thunk.fulfilled.type,
      (state, action) => {
        state[`${statePrefix}Loading`] = false
        state[`${statePrefix}Success`] = true
        state[`${statePrefix}Data`] = action.payload
      }
    )
    .addMatcher(
      action => action.type === thunk.rejected.type,
      (state, action: any) => {
        state[`${statePrefix}Loading`] = false
        state[`${statePrefix}Success`] = false
        state[`${statePrefix}Failure`] = true
        state[`${statePrefix}FailureMessage`] = action?.payload?.message || 'Failed to submit request!'
      }
    )
}

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

    fetchRecruitmentRequestOptionsLoading: false,
    fetchRecruitmentRequestOptionsSuccess: false,
    fetchRecruitmentRequestOptionsData: null,
    fetchRecruitmentRequestOptionsFailure: false,
    fetchRecruitmentRequestOptionsFailureMessage: '',

    submitRecruitmentRequestLoading: false,
    submitRecruitmentRequestSuccess: false,
    submitRecruitmentRequestData: null,
    submitRecruitmentRequestFailure: false,
    submitRecruitmentRequestFailureMessage: '',

    submitRequestDecisionLoading: false,
    submitRequestDecisionSuccess: false,
    submitRequestDecisionData: null,
    submitRequestDecisionFailure: false,
    submitRequestDecisionFailureMessage: ''
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
    fetchRecruitmentRequestOptionsDismiss: state => {
      state.fetchRecruitmentRequestOptionsLoading = false
      state.fetchRecruitmentRequestOptionsSuccess = false
      state.fetchRecruitmentRequestOptionsFailure = false
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
    }
  },
  // extraReducers: builder => {
  //   builder.addCase(fetchResignationOverviewList.pending, state => {
  //     state.fetchResignationOverviewListLoading = true
  //   })
  //   builder.addCase(fetchResignationOverviewList.fulfilled, (state, action) => {
  //     state.fetchResignationOverviewListLoading = false
  //     state.fetchResignationOverviewListSuccess = true
  //     state.fetchResignationOverviewListData = action.payload
  //   })
  //   builder.addCase(fetchResignationOverviewList.rejected, (state, action: any) => {
  //     state.fetchResignationOverviewListLoading = false
  //     state.fetchResignationOverviewListSuccess = false
  //     state.fetchResignationOverviewListFailure = true
  //     state.fetchResignationOverviewListFailureMessage = action?.payload?.message || 'Failed to fetch details!'
  //   })

  //   builder.addCase(fetchRecruitmentRequestList.pending, state => {
  //     state.fetchRecruitmentRequestListLoading = true
  //   })
  //   builder.addCase(fetchRecruitmentRequestList.fulfilled, (state, action) => {
  //     state.fetchRecruitmentRequestListLoading = false
  //     state.fetchRecruitmentRequestListSuccess = true
  //     state.fetchRecruitmentRequestListData = action.payload
  //   })
  //   builder.addCase(fetchRecruitmentRequestList.rejected, (state, action: any) => {
  //     state.fetchRecruitmentRequestListLoading = false
  //     state.fetchRecruitmentRequestListSuccess = false
  //     state.fetchRecruitmentRequestListFailure = true
  //     state.fetchRecruitmentRequestListFailureMessage =
  //       action?.payload?.message || 'Failed to fetch recruitment requests!'
  //   })

  //   builder.addCase(fetchRecruitmentRequestById.pending, state => {
  //     state.fetchRecruitmentRequestByIdLoading = true
  //   })
  //   builder.addCase(fetchRecruitmentRequestById.fulfilled, (state, action) => {
  //     state.fetchRecruitmentRequestByIdLoading = false
  //     state.fetchRecruitmentRequestByIdSuccess = true
  //     state.fetchRecruitmentRequestByIdData = action.payload
  //   })
  //   builder.addCase(fetchRecruitmentRequestById.rejected, (state, action: any) => {
  //     state.fetchRecruitmentRequestByIdLoading = false
  //     state.fetchRecruitmentRequestByIdSuccess = false
  //     state.fetchRecruitmentRequestByIdFailure = true
  //     state.fetchRecruitmentRequestByIdFailureMessage =
  //       action?.payload?.message || 'Failed to fetch recruitment request details!'
  //   })

  //   builder.addCase(fetchRecruitMentRequestOptions.pending, state => {
  //     state.fetchRecruitmentRequestOptionsLoading = true
  //     state.fetchRecruitmentRequestOptionsSuccess = false
  //     state.fetchRecruitmentRequestOptionsFailure = false
  //     state.fetchRecruitmentRequestOptionsFailureMessage = ''
  //   })
  //   builder.addCase(fetchRecruitMentRequestOptions.fulfilled, (state, action) => {
  //     state.fetchRecruitmentRequestOptionsLoading = false
  //     state.fetchRecruitmentRequestOptionsSuccess = true
  //     state.fetchRecruitmentRequestOptionsData = action.payload
  //   })
  //   builder.addCase(fetchRecruitMentRequestOptions.rejected, (state, action: any) => {
  //     state.fetchRecruitmentRequestOptionsLoading = false
  //     state.fetchRecruitmentRequestOptionsSuccess = false
  //     state.fetchRecruitmentRequestOptionsFailure = true
  //     state.fetchRecruitmentRequestOptionsFailureMessage = action?.payload?.message || 'Failed to submit request!'
  //   })
  // }
  extraReducers: builder => {
    // Use the helper function for each thunk
    handleAsyncThunkStates(builder, fetchRecruitMentRequestOptions, 'fetchRecruitmentRequestOptions')
    handleAsyncThunkStates(builder, fetchResignationOverviewList, 'fetchResignationOverviewList')
    handleAsyncThunkStates(builder, fetchRecruitmentRequestList, 'fetchRecruitmentRequestList')
    handleAsyncThunkStates(builder, fetchRecruitmentRequestById, 'fetchRecruitmentRequestById')
    handleAsyncThunkStates(builder, submitRecruitmentRequest, 'submitRecruitmentRequest')
    handleAsyncThunkStates(builder, submitRequestDecision, 'submitRequestDecision')
  }
})

export const {
  fetchResignationAPIDismiss,
  fetchRecruitmentRequestListDismiss,
  fetchRecruitmentRequestByIdDismiss,
  fetchRecruitmentRequestOptionsDismiss,
  submitRecruitmentRequestDismiss,
  submitRequestDecisionDismiss
} = recruitmentResignationSlice.actions

export default recruitmentResignationSlice.reducer
