import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import AxiosLib from '@/lib/AxiosLib'

interface positionCategories {
  designationName: string
  count: number
}

interface UpdateBucketListParams {
  id: number
  name: string
  turnoverCode: string
  positionCategories: positionCategories[]
  notes: string
  existingTurnoverCode: string
  grade: Grade[]
}

interface Grade {
  grade: string
}

export const fetchDesignationList = createAsyncThunk<any, any>(
  'appMuthoot/fetchDesignationList',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/designation', {
        params
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchGradeList = createAsyncThunk<any, any>(
  'appMuthoot/fetchGradeList',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/grade', {
        params
      })

      console.log('response', response.data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

//Bucket API

export const fetchBucketList = createAsyncThunk<any, any>(
  'appMuthoot/fetchBucketList',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/bucket', {
        params
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchBucketDetails = createAsyncThunk<any, any>(
  'appMuthoot/fetchBucketDetails',
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/bucket/${id}`)

      return response.data.data || []
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)

export const addNewBucket = createAsyncThunk<any, any>(
  'appMuthoot/addNewBucket',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/bucket', params)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)

export const updateBucketList = createAsyncThunk<any, UpdateBucketListParams>(
  'appMuthoot/updateBucketList',
  async (params, { rejectWithValue }) => {
    try {
      const turnoverCode = params.turnoverCode || params.existingTurnoverCode || ''

      const requestData = {
        id: params.id,
        name: params.name.toLowerCase(),
        positionCategories: params.positionCategories,
        turnoverCode: turnoverCode,
        notes: params.notes
      }

      const response = await AxiosLib.patch(`/bucket/${params.id}`, requestData)

      return response.data
    } catch (error: any) {
      if (error.response) {
        console.error('API Error Response:', error.response)

        return rejectWithValue(error.response.data)
      } else if (error.request) {
        console.error('No response from server:', error.request)

        return rejectWithValue({ message: 'No response from server. Please try again later.' })
      } else {
        console.error('Unexpected error:', error)

        return rejectWithValue({ message: 'Unexpected error occurred.' })
      }
    }
  }
)

export const deleteBucket = createAsyncThunk<any, string>(
  'appMuthoot/deleteBucket',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.delete(`/bucket/${id}`)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error deleting the bucket')
    }
  }
)

// Turnover Code API

export const getTurnOverCode = createAsyncThunk<any, any>(
  'appMuthoot/getTurnOverCode',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/turnover', {
        params
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const addNewTurnoverCode = createAsyncThunk<any, any>(
  'appMuthoot/AddTurnoverCode',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/turnover', params)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)

export const BucketManagementSlice: any = createSlice({
  name: 'BucketManagement',
  initialState: {
    gradeData: [],
    isFetchGradeListLoading: false,
    fetchGradeListSuccess: false,
    fetchGradeListFailure: false,
    fetchGradeListFailureMessage: '',

    designationData: [],
    isFetchDesignationListLoading: false,
    fetchDesignationListSuccess: false,
    fetchDesignationListFailure: false,
    fetchDesignationListFailureMessage: '',

    bucketListData: [],
    isBucketListLoading: false,
    bucketListSuccess: false,
    bucketListFailure: false,
    bucketListFailureMessage: '',

    fetchBucketDetailsData: [],
    isFetchBucketDetailsLoading: false,
    fetchBucketDetailsSuccess: false,
    fetchBucketDetailsFailure: false,
    fetchBucketDetailsFailureMessage: '',

    updateBucketList: [],
    isUpdateBucketListLoading: false,
    updateBucketListSuccess: false,
    updateBucketListFailure: false,
    updateBucketListFailureMessage: '',

    deleteBucketList: [],
    isDeleteBucketListLoading: false,
    deleteBucketListSuccess: false,
    deleteBucketListFailure: false,
    deleteBucketListFailureMessage: '',

    turnoverListData: [],
    isTurnoverListLoading: false,
    turnoverListSuccess: false,
    turnoverListFailure: false,
    turnoverListFailureMessage: '',
    totalTurnoverCount: 0
  },
  reducers: {
    fetchBucketDismiss: state => {
      ;(state.isFetchBucketDetailsLoading = false),
        (state.fetchBucketDetailsSuccess = false),
        (state.fetchBucketDetailsFailure = false),
        (state.fetchBucketDetailsFailureMessage = '')
    }
  },
  extraReducers: builder => {
    //fetch Grade List
    builder.addCase(fetchGradeList.pending, state => {
      state.isFetchGradeListLoading = true
    })
    builder.addCase(fetchGradeList.fulfilled, (state, action) => {
      state.gradeData = action?.payload?.data
      state.isFetchGradeListLoading = false
      state.bucketListSuccess = true
    })
    builder.addCase(fetchGradeList.rejected, (state, action: any) => {
      state.isFetchGradeListLoading = false
      state.gradeData = []
      state.fetchGradeListFailure = true
      state.fetchGradeListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //fetch Designation List
    builder.addCase(fetchDesignationList.pending, state => {
      state.isFetchDesignationListLoading = true
    })
    builder.addCase(fetchDesignationList.fulfilled, (state, action) => {
      state.designationData = action?.payload?.data
      state.isFetchDesignationListLoading = false
      state.bucketListSuccess = true
    })
    builder.addCase(fetchDesignationList.rejected, (state, action: any) => {
      state.isFetchDesignationListLoading = false
      state.designationData = []
      state.fetchDesignationListFailure = true
      state.fetchDesignationListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Fetch Bucket List
    builder.addCase(fetchBucketList.pending, state => {
      state.isBucketListLoading = true
    })
    builder.addCase(fetchBucketList.fulfilled, (state, action) => {
      state.bucketListData = action.payload
      state.isBucketListLoading = false
    })
    builder.addCase(fetchBucketList.rejected, (state, action: any) => {
      state.isBucketListLoading = false
      state.bucketListData = []
      state.bucketListFailure = true
      state.bucketListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Fetch Bucket Details
    builder.addCase(fetchBucketDetails.pending, state => {
      state.isFetchBucketDetailsLoading = true
    })
    builder.addCase(fetchBucketDetails.fulfilled, (state, action) => {
      state.fetchBucketDetailsData = action.payload
      state.isFetchBucketDetailsLoading = false
      state.fetchBucketDetailsSuccess = true
    })
    builder.addCase(fetchBucketDetails.rejected, (state, action: any) => {
      state.isFetchBucketDetailsLoading = false
      state.fetchBucketDetailsData = []
      state.fetchBucketDetailsFailure = true
      state.fetchBucketDetailsFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Update Bucket details
    builder.addCase(updateBucketList.pending, state => {
      state.isUpdateBucketListLoading = true
    })
    builder.addCase(updateBucketList.fulfilled, (state, action) => {
      state.updateBucketList = action.payload
      state.isUpdateBucketListLoading = false
      state.updateBucketListSuccess = true
    })
    builder.addCase(updateBucketList.rejected, (state, action: any) => {
      state.isUpdateBucketListLoading = false
      state.updateBucketList = []
      state.updateBucketListFailure = true
      state.updateBucketListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    //Delete Bucket List
    builder.addCase(deleteBucket.pending, state => {
      state.isDeleteBucketListLoading = true
    })
    builder.addCase(deleteBucket.fulfilled, (state, action) => {
      state.deleteBucketList = action.payload
      state.isDeleteBucketListLoading = false
      state.deleteBucketListSuccess = true
    })
    builder.addCase(deleteBucket.rejected, (state, action: any) => {
      state.isDeleteBucketListLoading = false
      state.deleteBucketList = []
      state.deleteBucketListFailure = true
      state.deleteBucketListFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    builder.addCase(getTurnOverCode.pending, state => {
      state.isTurnoverListLoading = true
    })
    builder.addCase(getTurnOverCode.fulfilled, (state, action) => {
      state.turnoverListData = action.payload.data
      state.totalTurnoverCount = action.payload.totalCount

      state.isTurnoverListLoading = false
    })
    builder.addCase(getTurnOverCode.rejected, (state, action: any) => {
      state.isTurnoverListLoading = false
      state.turnoverListData = []
      state.turnoverListFailure = true
      state.turnoverListFailureMessage = action?.payload?.message || 'Listing Failed'
    })
  }
})

// export const { setIsLoggedIn, LoginDataDismiss } = BucketManagementSlice.actions
export default BucketManagementSlice.reducer
