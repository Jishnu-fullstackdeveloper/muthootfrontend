import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/jdManagemnetUrls'

interface UpdateJdPayload {
  id: string
  params: {
    jobRoleId: string
    approvalStatus: string
    details: {
      roleSpecification: {
        roleTitle: string
        employeeInterviewed: string
        reportsTo: string
        companyName: string
        functionOrDepartment: string
        writtenBy: string
        approvedByJobholder: string
        approvedBySuperior: string
        dateWritten: string
      }[]
      roleSummary: string
      keyResponsibilities: { title: string; description: string }[]
      keyChallenges: string
      keyDecisions: string
      keyInteractions: { internalStakeholders: string; externalStakeholders: string }[]
      keyRoleDimensions: {
        portfolioSize: string
        geographicalCoverage: string
        teamSize: string
        totalTeamSize: string
      }[]
      skillsAndAttributesType: string
      skillsAndAttributesDetails: {
        factor: string
        competency: { value: string }[]
        definition: { value: string }[]
        behavioural_attributes: { value: string }[]
      }[]
      educationAndExperience: {
        minimumQualification: string
        experienceDescription: string
      }[]
      organizationChart: {
        organizationChart: {
          id: string
          name: string
          parentId: string
          children: {
            id: string
            name: string
            parentId: string
            children: any[] // Recursive structure
          }[]
        }
      }
    }
    meta?: object
  }
}

// export const fetchJobRole = createAsyncThunk(
//   'jdManagement/fetchJobRole', async (params: any, { rejectWithValue }) => {
//   try {
//     const response = await AxiosLib.get(API_ENDPOINTS.getJobRole, { params })

//     return response.data
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data || { message: 'Failed to fetch job roles' })
//   }
// })
export const fetchJobRole = createAsyncThunk('jdManagement/fetchJobRole', async (params: any, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(API_ENDPOINTS.getJobRole, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch job roles' })
  }
})

export const fetchDesignation = createAsyncThunk(
  'jdManagement/fetchDesignation',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignation, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch job roles' })
    }
  }
)

export const fetchDepartment = createAsyncThunk(
  'jdManagement/fetchDepartment',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDepartment, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch job roles' })
    }
  }
)

export const addNewJd = createAsyncThunk<any, any>(
  'jdManagement/addNewJd',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.addNewJd, params)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage]
      })
    }
  }
)

export const fetchJd = createAsyncThunk(
  'jdManagement/fetchJd',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getJd, { params })

      console.log('API Response:', response.data)

      return response.data
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message)

      return rejectWithValue(error.response?.data || { message: 'Failed to fetch job roles' })
    }
  }
)

export const fetchJdById = createAsyncThunk('jdManagement/fetchJdById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(API_ENDPOINTS.getJdById(id))

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const updateJd = createAsyncThunk<any, UpdateJdPayload>(
  'jdManagement/updateJd',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      // Construct the URL with the id as a query parameter
      const url = `${API_ENDPOINTS.updateJd}?id=${encodeURIComponent(id)}`

      // Send only the params object in the request body
      const response = await AxiosLib.put(url, params)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update JD'

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode || 500
      })
    }
  }
)

export const jdManagementSlice = createSlice({
  name: 'jdManagement',
  initialState: {
    jdData: [],
    totalCount: 0,
    isJdLoading: false,
    jdSuccess: false,
    jdFailure: false,
    jdFailureMessage: '',

    jobRoleData: [],
    isJobRoleLoading: false,
    jobRoleSuccess: false,
    jobRoleFailure: false,
    jobRoleFailureMessage: '',

    designationData: [],
    isDesignationLoading: false,
    designationSuccess: false,
    designationFailure: false,
    designationFailureMessage: '',

    departmentData: [],
    isDepartmentLoading: false,
    departmentSuccess: false,
    departmentFailure: false,
    departmentFailureMessage: '',

    addNewJdData: [],
    isAddJdLoading: false,
    addJdSuccess: false,
    addJdFailure: false,
    addJdFailureMessage: '',

    selectedJd: null, // To store user data for editing
    isSelectedJdLoading: false,
    selectedJdSuccess: false,
    selectedJdFailure: false,
    selectedJdFailureMessage: ''
  },

  reducers: {
    fetchJdDismiss: state => {
      state.isJdLoading = false
      state.jdSuccess = false
      state.jdFailure = false
      state.jdFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchJd.pending, state => {
        state.isJdLoading = true
        state.jdSuccess = false
        state.jdFailure = false
        state.jdFailureMessage = ''
      })
      .addCase(fetchJd.fulfilled, (state, action) => {
        state.jdData = action.payload?.data || []
        state.totalCount = action.payload?.totalCount || 0
        state.isJdLoading = false
        state.jdSuccess = true
        state.jdFailure = false
        state.jdFailureMessage = ''
      })
      .addCase(fetchJd.rejected, (state, action: any) => {
        state.jdData = []
        state.totalCount = 0
        state.isJdLoading = false
        state.jdSuccess = false
        state.jdFailure = true
        state.jdFailureMessage = action.payload?.message || 'Failed to fetch job roles'
      })

    builder.addCase(fetchJdById.pending, state => {
      state.isSelectedJdLoading = true
      state.selectedJdSuccess = false
      state.selectedJdFailure = false
      state.selectedJdFailureMessage = ''
    })
    builder.addCase(fetchJdById.fulfilled, (state, action) => {
      state.selectedJd = action?.payload?.data
      state.isSelectedJdLoading = false
      state.selectedJdSuccess = true
      state.selectedJdFailure = false
    })
    builder.addCase(fetchJdById.rejected, (state, action: any) => {
      state.isSelectedJdLoading = false
      state.selectedJd = null
      state.selectedJdSuccess = false
      state.selectedJdFailure = true
      state.selectedJdFailureMessage = action?.payload?.message || 'Failed to fetch user'
    })
    builder.addCase(fetchJobRole.pending, state => {
      state.isJobRoleLoading = true
      state.jobRoleSuccess = false
      state.jobRoleFailure = false
      state.jobRoleFailureMessage = ''
    })
    builder.addCase(fetchJobRole.fulfilled, (state, action) => {
      state.jobRoleData = action.payload?.data || []
      state.isJobRoleLoading = false
      state.jobRoleSuccess = true
      state.jobRoleFailure = false
      state.jobRoleFailureMessage = ''
    })
    builder.addCase(fetchJobRole.rejected, (state, action: any) => {
      state.jobRoleData = []
      state.isJobRoleLoading = false
      state.jobRoleSuccess = false
      state.jobRoleFailure = true
      state.jobRoleFailureMessage = action.payload?.message || 'Failed to fetch job roles'
    })

    builder.addCase(fetchDesignation.pending, state => {
      state.isDesignationLoading = true
      state.designationSuccess = false
      state.designationFailure = false
      state.designationFailureMessage = ''
    })
    builder.addCase(fetchDesignation.fulfilled, (state, action) => {
      state.designationData = action.payload?.data || []
      state.isDesignationLoading = false
      state.designationSuccess = true
      state.designationFailure = false
      state.designationFailureMessage = ''
    })

    builder.addCase(fetchDesignation.rejected, (state, action: any) => {
      state.designationData = []
      state.isDesignationLoading = false
      state.designationSuccess = false
      state.designationFailure = true
      state.designationFailureMessage = action.payload?.message || 'Failed to fetch designations'
    })

    builder.addCase(fetchDepartment.rejected, (state, action: any) => {
      state.departmentData = []
      state.isDepartmentLoading = false
      state.departmentSuccess = false
      state.departmentFailure = true
      state.departmentFailureMessage = action.payload?.message || 'Failed to fetch departments'
    })

    builder.addCase(fetchDepartment.pending, state => {
      state.isDepartmentLoading = true
      state.departmentSuccess = false
      state.departmentFailure = false
      state.departmentFailureMessage = ''
    })
    builder.addCase(fetchDepartment.fulfilled, (state, action) => {
      state.departmentData = action.payload?.data || []
      state.isDepartmentLoading = false
      state.departmentSuccess = true
      state.departmentFailure = false
      state.departmentFailureMessage = ''
    })

    builder.addCase(addNewJd.pending, state => {
      state.isAddJdLoading = true
      state.addJdSuccess = false
      state.addJdFailure = false
      state.addJdFailureMessage = ''
    })
    builder.addCase(addNewJd.fulfilled, (state, action) => {
      state.addNewJdData = action.payload?.data || []
      state.isAddJdLoading = false
      state.addJdSuccess = true
      state.addJdFailure = false
      state.addJdFailureMessage = ''
    })
    builder.addCase(addNewJd.rejected, (state, action: any) => {
      state.addNewJdData = []
      state.isAddJdLoading = false
      state.addJdSuccess = false
      state.addJdFailure = true
      state.addJdFailureMessage = action.payload?.message || 'Failed to add new JD'
    })
  }
})

export const { fetchJdDismiss } = jdManagementSlice.actions
export default jdManagementSlice.reducer
