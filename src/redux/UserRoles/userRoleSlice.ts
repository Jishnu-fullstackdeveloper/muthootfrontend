'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/userRoles'

interface Pagination {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
}

export const fetchDesignationRole = createAsyncThunk(
  'userRoles/fetchDesignationRole',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationRole, {
        params: { page, limit }
      })

      return {
        data: response.data.data, // Assuming response.data.data contains the roles array
        pagination: response.data.pagination // Assuming response.data.pagination contains pagination info
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch designation roles' })
    }
  }
)

export const fetchDesignationRoleById = createAsyncThunk(
  'userManagement/fetchDesignationRoleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationRoleByIdUrl(id))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchGroupRole = createAsyncThunk('userRoles/fetchGroupRole', async (params: any, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(API_ENDPOINTS.getGroupRole, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch group roles' })
  }
})

export const fetchPermissions = createAsyncThunk(
  'userRoles/fetchPermissions',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getPermssions, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch permissions' })
    }
  }
)

export const fetchGroupRoleById = createAsyncThunk(
  'userManagement/fetchGroupRoleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getGroupRoleByIdUrl(id))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createGroupRole = createAsyncThunk<
  any,
  {
    designationRoles: string[]
    groupRole: string
    groupRoleDescription: string
    permissions: string[]
  },
  { rejectValue: { message: string | string[]; statusCode: number } }
>('userRoles/createGroupRole', async (params, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.post(API_ENDPOINTS.addGroupRole, {
      designationRoles: params.designationRoles,
      groupRole: params.groupRole,
      groupRoleDescription: params.groupRoleDescription,
      permissions: params.permissions
    })

    return response.data
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error)
    const errorMessage = error.response?.data?.message || 'Failed to create group role'

    return rejectWithValue({
      message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
      statusCode: error.response?.data?.statusCode || 500
    })
  }
})

export const updateGroupRole = createAsyncThunk<
  any,
  {
    id: string
    params: { designationRole: string; newGroupRoles?: string[] }
  }
>('userManagement/updateGroupRole', async ({ params }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.patch(API_ENDPOINTS.updateGroupRole, {
      designationRole: params.designationRole,
      ...(params.newGroupRoles !== undefined ? { newGroupRoles: params.newGroupRoles } : {})
    })

    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update group role'

    return rejectWithValue({
      message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
      statusCode: error.response?.data?.statusCode || 500
    })
  }
})

export const updateGroupRolePermission = createAsyncThunk<
  any,
  {
    id?: string
    params: { groupRole: string; newPermissions: string[] }
  },
  { rejectValue: { message: string | string[]; statusCode: number } }
>('userRoles/updateGroupPermission', async ({ params }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.patch(API_ENDPOINTS.updtaeGroupPermission, {
      groupRole: params.groupRole,
      newPermissions: params.newPermissions
    })

    return response.data
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error)
    const errorMessage = error.response?.data?.message || 'Failed to save group role'

    return rejectWithValue({
      message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
      statusCode: error.response?.data?.statusCode || 500
    })
  }
})

export const userRoleSlice = createSlice({
  name: 'userRoles',
  initialState: {
    designationRoleData: [],
    isDesignationRoleLoading: false,
    designationRoleSuccess: false,
    designationRoleFailure: false,
    designationRoleFailureMessage: '',
    pagination: null,
    
    selectedDesignationRoleData: null,
    isSelectedDesignationRoleLoading: false,
    selectedDesignationRoleSuccess: false,
    selectedDesignationRoleFailure: false,
    selectedDesignationRoleFailureMessage: '',
    groupRoleData: {
      data: [],
      totalCount: 0
    },
    isGroupRoleLoading: false,
    groupRoleSuccess: false,
    groupRoleFailure: false,
    groupRoleFailureMessage: '',
    permissionData: {
      data: [],
      totalCount: 0
    },
    isPermissionLoading: false,
    permissionSuccess: false,
    permissionFailure: false,
    permissionFailureMessage: '',
    selectedGroupRoleData: null,
    isSelectedGroupRoleLoading: false,
    selectedGroupRoleSuccess: false,
    selectedGroupRoleFailure: false,
    selectedGroupRoleFailureMessage: '',
    isGroupRoleUpdating: false,
    groupRoleUpdateSuccess: false,
    groupRoleUpdateFailure: false,
    groupRoleUpdateFailureMessage: '',
    isGroupRolePermissionUpdating: false,
    groupRolePermissionUpdateSuccess: false,
    groupRolePermissionUpdateFailure: false,
    groupRolePermissionUpdateFailureMessage: '',
    isGroupRoleCreating: false,
    groupRoleCreateSuccess: false,
    groupRoleCreateFailure: false,
    groupRoleCreateFailureMessage: ''
  },
  reducers: {
    fetchDesignationRoleDismiss: state => {
      state.isDesignationRoleLoading = false
      state.designationRoleSuccess = false
      state.designationRoleFailure = false
      state.designationRoleFailureMessage = ''
    },
    resetAddUserStatus: state => {
      state.designationRoleSuccess = false
      state.designationRoleFailure = false
      state.designationRoleFailureMessage = ''
    },
    resetGroupRoleUpdateStatus: state => {
      state.isGroupRoleUpdating = false
      state.groupRoleUpdateSuccess = false
      state.groupRoleUpdateFailure = false
      state.groupRoleUpdateFailureMessage = ''
    },
    resetUpdateState: state => {
      state.isGroupRolePermissionUpdating = false
      state.groupRolePermissionUpdateSuccess = false
      state.groupRolePermissionUpdateFailure = false
      state.groupRolePermissionUpdateFailureMessage = ''
    },
    resetGroupRoleCreateStatus: state => {
      state.isGroupRoleCreating = false
      state.groupRoleCreateSuccess = false
      state.groupRoleCreateFailure = false
      state.groupRoleCreateFailureMessage = ''
    }
  },
  extraReducers: builder => {
 
    builder
      .addCase(fetchDesignationRole.pending, state => {
        state.isDesignationRoleLoading = true
        state.designationRoleFailure = null
      })
      .addCase(fetchDesignationRole.fulfilled, (state, action) => {
        state.isDesignationRoleLoading = false
        state.designationRoleData = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchDesignationRole.rejected, (state, action) => {
        state.isDesignationRoleLoading = false
        state.designationRoleFailureMessage =
          (action.payload as any)?.message || 'Failed to fetch designation role'
      })

    builder
      .addCase(fetchDesignationRoleById.pending, state => {
        state.isSelectedDesignationRoleLoading = true
        state.selectedDesignationRoleSuccess = false
        state.selectedDesignationRoleFailure = false
        state.selectedDesignationRoleFailureMessage = ''
      })
      .addCase(fetchDesignationRoleById.fulfilled, (state, action) => {
        state.selectedDesignationRoleData = action.payload.data || null
        state.isSelectedDesignationRoleLoading = false
        state.selectedDesignationRoleSuccess = true
        state.selectedDesignationRoleFailure = false
        state.selectedDesignationRoleFailureMessage = ''
      })
      .addCase(fetchDesignationRoleById.rejected, (state, action) => {
        state.isSelectedDesignationRoleLoading = false
        state.selectedDesignationRoleData = null
        state.selectedDesignationRoleSuccess = false
        state.selectedDesignationRoleFailure = true
        state.selectedDesignationRoleFailureMessage =
          (action.payload as any)?.message || 'Failed to fetch designation role'
      })

    builder
      .addCase(fetchGroupRole.pending, state => {
        state.isGroupRoleLoading = true
        state.groupRoleSuccess = false
        state.groupRoleFailure = false
        state.groupRoleFailureMessage = ''
      })
      .addCase(fetchGroupRole.fulfilled, (state, action) => {
        state.groupRoleData = action.payload.data
        state.isGroupRoleLoading = false
        state.groupRoleSuccess = true
        state.groupRoleFailure = false
        state.groupRoleFailureMessage = ''
      })
      .addCase(fetchGroupRole.rejected, (state, action) => {
        state.isGroupRoleLoading = false
        state.groupRoleData = { data: [], totalCount: 0 }
        state.groupRoleFailure = true
        state.groupRoleFailureMessage = (action.payload as any)?.message || 'Failed to fetch group role data'
      })

    builder
      .addCase(fetchPermissions.pending, state => {
        state.isPermissionLoading = true
        state.permissionSuccess = false
        state.permissionFailure = false
        state.permissionFailureMessage = ''
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissionData = action.payload.data
        state.isPermissionLoading = false
        state.permissionSuccess = true
        state.permissionFailure = false
        state.permissionFailureMessage = ''
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.isPermissionLoading = false
        state.permissionData = { data: [], totalCount: 0 }
        state.permissionFailure = true
        state.permissionFailureMessage = (action.payload as any)?.message || 'Failed to fetch permissions'
      })

    builder
      .addCase(fetchGroupRoleById.pending, state => {
        state.isSelectedGroupRoleLoading = true
        state.selectedGroupRoleSuccess = false
        state.selectedGroupRoleFailure = false
        state.selectedGroupRoleFailureMessage = ''
      })
      .addCase(fetchGroupRoleById.fulfilled, (state, action) => {
        state.selectedGroupRoleData = action.payload.data || null
        state.isSelectedGroupRoleLoading = false
        state.selectedGroupRoleSuccess = true
        state.selectedGroupRoleFailure = false
        state.selectedGroupRoleFailureMessage = ''
      })
      .addCase(fetchGroupRoleById.rejected, (state, action) => {
        state.isSelectedGroupRoleLoading = false
        state.selectedGroupRoleData = null
        state.selectedGroupRoleSuccess = false
        state.selectedGroupRoleFailure = true
        state.selectedGroupRoleFailureMessage = (action.payload as any)?.message || 'Failed to fetch group role'
      })

    builder
      .addCase(updateGroupRole.pending, state => {
        state.isGroupRoleUpdating = true
        state.groupRoleUpdateSuccess = false
        state.groupRoleUpdateFailure = false
        state.groupRoleUpdateFailureMessage = ''
      })
      .addCase(updateGroupRole.fulfilled, state => {
        state.isGroupRoleUpdating = false
        state.groupRoleUpdateSuccess = true
        state.groupRoleUpdateFailure = false
        state.groupRoleUpdateFailureMessage = ''
      })
      .addCase(updateGroupRole.rejected, (state, action) => {
        state.isGroupRoleUpdating = false
        state.groupRoleUpdateSuccess = false
        state.groupRoleUpdateFailure = true
        state.groupRoleUpdateFailureMessage =
          (action.payload as any)?.message?.join(', ') || 'Failed to update group role'
      })

    builder
      .addCase(updateGroupRolePermission.pending, state => {
        state.isGroupRolePermissionUpdating = true
        state.groupRolePermissionUpdateSuccess = false
        state.groupRolePermissionUpdateFailure = false
        state.groupRolePermissionUpdateFailureMessage = ''
      })
      .addCase(updateGroupRolePermission.fulfilled, (state, action) => {
        state.isGroupRolePermissionUpdating = false
        state.groupRolePermissionUpdateSuccess = true
        state.groupRolePermissionUpdateFailure = false
        state.groupRolePermissionUpdateFailureMessage = ''
        state.selectedGroupRoleData = action.payload.data
      })
      .addCase(updateGroupRolePermission.rejected, (state, action) => {
        state.isGroupRolePermissionUpdating = false
        state.groupRolePermissionUpdateSuccess = false
        state.groupRolePermissionUpdateFailure = true
        state.groupRolePermissionUpdateFailureMessage =
          (action.payload as any)?.message?.join(', ') || 'Failed to update group role permissions'
      })

    builder
      .addCase(createGroupRole.pending, state => {
        state.isGroupRoleCreating = true
        state.groupRoleCreateSuccess = false
        state.groupRoleCreateFailure = false
        state.groupRoleCreateFailureMessage = ''
      })
      .addCase(createGroupRole.fulfilled, (state, action) => {
        state.isGroupRoleCreating = false
        state.groupRoleCreateSuccess = true
        state.groupRoleCreateFailure = false
        state.groupRoleCreateFailureMessage = ''
        state.groupRoleData.data = [...state.groupRoleData.data, action.payload.data]
        state.groupRoleData.totalCount += 1
      })
      .addCase(createGroupRole.rejected, (state, action) => {
        state.isGroupRoleCreating = false
        state.groupRoleCreateSuccess = false
        state.groupRoleCreateFailure = true
        state.groupRoleCreateFailureMessage =
          (action.payload as any)?.message?.join(', ') || 'Failed to create group role'
      })
  }
})

export const {
  fetchDesignationRoleDismiss,
  resetAddUserStatus,
  resetGroupRoleUpdateStatus,
  resetUpdateState,
  resetGroupRoleCreateStatus
} = userRoleSlice.actions

export default userRoleSlice.reducer
