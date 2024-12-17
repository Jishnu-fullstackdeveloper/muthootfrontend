import AxiosLib from '@/lib/AxiosLib'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface FetchUserParams {
  search?: string
  filter?: Record<string, string | number>
  limit?: number
  page?: number
}

export const fetchUser = createAsyncThunk<any, FetchUserParams>(
  'fetch-user',
  async ({ search, filter, limit = 10, page = 1 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()

      if (search) params.append('search', search)
      if (filter) params.append('filter', JSON.stringify(filter))
      params.append('limit', limit.toString())
      params.append('page', page.toString())

      //   let api = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user?search=${search}`
      let api = process.env.NEXT_PUBLIC_API_BASE_URL + `/user?${params.toString()}`
      const response = await AxiosLib.get(
        api
        // `${process.env.NEXT_PUBLIC_API_BASE_URL}/user?${params.toString()}`
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data')
    }
  }
)

export const fetchUserbyId = createAsyncThunk<any, any>('/userbyid', async (params: any, { rejectWithValue }) => {
  console.log('id in slice', params)
  try {
    const response = await AxiosLib.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${params.id}`)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data')
  }
})

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState: {
    getUserBegin: false,
    getUserData: [],
    getUserError: false,
    getUserErrorMessage: '',
    getUserSuccess: false,
    getUserIdBegin: false,
    getUserIdData: {},
    getUserIdError: false,
    getUserIdErrorMessage: '',
    getUserIdSuccess: false
  },
  reducers: {
    clearUserData: state => {
      ;(state.getUserBegin = false),
        (state.getUserData = []),
        (state.getUserError = false),
        (state.getUserErrorMessage = ''),
        (state.getUserSuccess = false),
        (state.getUserIdBegin = false),
        (state.getUserIdData = {}),
        (state.getUserIdError = false),
        (state.getUserIdErrorMessage = ''),
        (state.getUserIdSuccess = false)
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUser.pending, state => {
      state.getUserBegin = true
      state.getUserIdBegin = true
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.getUserData = action.payload
      state.getUserBegin = false
      state.getUserSuccess = true
      state.getUserIdData = action.payload
      state.getUserIdBegin = false
      state.getUserIdSuccess = true
    })
    builder.addCase(fetchUser.rejected, (state, action: any) => {
      state.getUserBegin = false
      state.getUserErrorMessage = action.payload?.message
      state.getUserIdBegin = false
      state.getUserIdErrorMessage = action.payload?.message
    })
  }
})

// Export actions and reducer
export const { clearUserData } = userManagementSlice.actions
export default userManagementSlice.reducer
