import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { DATA_UPLOADS_ENDPOINT, CREATE_UPLOAD_ENDPOINT, UPLOAD_CATEGORIES_ENDPOINT } from '../ApiUrls/dataUploadApiUrls'
import type { DataUploadState } from '@/types/dataUpload'

//import { DataUpload } from '@/types/dataUpload'

const initialState: DataUploadState = {
  uploads: [],
  totalCount: 0,
  status: 'idle',
  uploadStatus: 'idle',
  categories: [],
  categoriesStatus: 'idle',
  error: null,
  uploadError: null,
  categoriesError: null,
  page: 1
}

export const fetchDataUploads = createAsyncThunk(
  'dataUpload/fetchDataUploads',
  async ({ page, limit, search }: { page: number; limit: number; search: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(DATA_UPLOADS_ENDPOINT, {
        params: { page, limit, search }
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch data uploads')
    }
  }
)

export const createDataUpload = createAsyncThunk(
  'dataUpload/createDataUpload',
  async ({ file, type }: { file: File; type: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      formData.append('file', file)
      formData.append('type', type)

      const response = await AxiosLib.post(CREATE_UPLOAD_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload file')
    }
  }
)

export const fetchUploadCategories = createAsyncThunk(
  'dataUpload/fetchUploadCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(UPLOAD_CATEGORIES_ENDPOINT)

      // Extract only the 'type' values from the response
      const categories = response.data.data.map((item: { type: string }) => item.type)

      return categories
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upload categories')
    }
  }
)

const dataUploadSlice = createSlice({
  name: 'dataUpload',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDataUploads.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchDataUploads.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.uploads = action.payload.data
        state.totalCount = action.payload.totalCount
        state.page = parseInt(action.payload.page, 10)
        state.error = null
      })
      .addCase(fetchDataUploads.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(createDataUpload.pending, state => {
        state.uploadStatus = 'loading'
        state.uploadError = null
      })
      .addCase(createDataUpload.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded'
        state.uploads.push(action.payload.data) // Add new upload to the list
        state.totalCount += 1
        state.uploadError = null
      })
      .addCase(createDataUpload.rejected, (state, action) => {
        state.uploadStatus = 'failed'
        state.uploadError = action.payload as string
      })
      .addCase(fetchUploadCategories.pending, state => {
        state.categoriesStatus = 'loading'
        state.categoriesError = null
      })
      .addCase(fetchUploadCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded'
        state.categories = action.payload
        state.categoriesError = null
      })
      .addCase(fetchUploadCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed'
        state.categoriesError = action.payload as string
      })
  }
})

export default dataUploadSlice.reducer
