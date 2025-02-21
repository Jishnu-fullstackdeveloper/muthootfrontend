// import AxiosLib from '@/lib/AxiosLib'
// import { userRoleData } from '@/shared/userRoleData'
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// interface FetchUserRoleParams {
//   search?: string
//   filter?: Record<string, string | number>
//   limit?: number
//   page?: number
// }

// export const fetchUserRole = createAsyncThunk<any, FetchUserRoleParams>(
//   '/roles',
//   async ({ search, filter, limit = 10, page = 1 }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams()

//       if (search) params.append('search', search)
//       if (filter) params.append('filter', JSON.stringify(filter))
//       params.append('limit', limit.toString())
//       params.append('page', page.toString())

//       const response = await AxiosLib.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/roles?${params.toString()}`)
//       return response.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch user role data')
//     }
//   }
// )

// export const fetchUserRolebyId = createAsyncThunk<any, any>('/rolesbyid', async (params: any, { rejectWithValue }) => {
//   console.log('id in slice', params)
//   try {
//     const response = await AxiosLib.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/roles/${params.id}`)
//     return response.data
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to fetch user role data')
//   }
// })

// const userRoleSlice = createSlice({
//   name: 'userRole',
//   initialState: {
//     getUserRoleBegin: false,
//     getUserRoleData: userRoleData,
//     getUserRoleError: false,
//     getUserRoleErrorMessage: '',
//     getUserRoleSuccess: false,
//     getUserRoleIdBegin: false,
//     getUserRoleIdData: {},
//     getUserRoleIdError: false,
//     getUserRoleIdErrorMessage: '',
//     getUserRoleIdSuccess: false
//   },
//   reducers: {
//     clearUserData: state => {
//       ;(state.getUserRoleBegin = false),
//         (state.getUserRoleData = []),
//         (state.getUserRoleError = false),
//         (state.getUserRoleErrorMessage = ''),
//         (state.getUserRoleSuccess = false),
//         (state.getUserRoleIdBegin = false),
//         (state.getUserRoleIdData = {}),
//         (state.getUserRoleIdError = false),
//         (state.getUserRoleIdErrorMessage = ''),
//         (state.getUserRoleIdSuccess = false)
//     }
//   },
//   extraReducers: builder => {
//     builder.addCase(fetchUserRole.pending, state => {
//       state.getUserRoleBegin = true
//       state.getUserRoleIdBegin = true
//     })
//     builder.addCase(fetchUserRole.fulfilled, (state, action) => {
//       state.getUserRoleData = action.payload
//       state.getUserRoleBegin = false
//       state.getUserRoleSuccess = true
//       state.getUserRoleIdData = action.payload
//       state.getUserRoleIdBegin = false
//       state.getUserRoleIdSuccess = true
//     })
//     builder.addCase(fetchUserRole.rejected, (state, action: any) => {
//       state.getUserRoleBegin = false
//       state.getUserRoleErrorMessage = action.payload?.message
//       state.getUserRoleIdBegin = false
//       state.getUserRoleIdErrorMessage = action.payload?.message
//     })
//   }
// })

// // Export actions and reducer
// export const { clearUserData } = userRoleSlice.actions
// export default userRoleSlice.reducer
