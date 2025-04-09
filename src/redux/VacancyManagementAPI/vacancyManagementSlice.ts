// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// import AxiosLib from '@/lib/AxiosLib'
// import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls'

// // Define the Vacancy type based on the API response
// interface Vacancy {
//   id: string
//   deletedBy: string | null
//   districtName: string
//   stateName: string
//   zoneName: string
//   regionName: string
//   areaName: string
//   branchesName: string
//   businessUnitName: string
//   employeeCategoryType: string
//   departmentName: string
//   designationName: string
//   gradeName: string
//   bandName: string
//   metadata: any | null
//   createdAt: string
//   updatedAt: string
//   deletedAt: string | null
// }

// interface VacancyState {
//   vacancies: Vacancy[]
//   totalCount: number
//   currentPage: number
//   limit: number
//   loading: boolean
//   error: string | null
// }

// const initialState: VacancyState = {
//   vacancies: [],
//   totalCount: 0,
//   currentPage: 1,
//   limit: 10,
//   loading: false,
//   error: null
// }

// // Async thunk to fetch vacancies
// export const fetchVacancies = createAsyncThunk(
//   'appMuthoot/fetchVacancies',
//   async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
//     try {
//       const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, {
//         params: { page, limit }
//       })

//       return response.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
//     }
//   }
// )

// const vacancySlice = createSlice({
//   name: 'vacancy',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchVacancies.pending, state => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchVacancies.fulfilled, (state, action) => {
//         state.loading = false
//         state.vacancies = action.payload.data
//         state.totalCount = action.payload.totalCount
//         state.currentPage = action.payload.currentPage
//         state.limit = action.payload.limit
//       })
//       .addCase(fetchVacancies.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   }
// })

// export default vacancySlice.reducer

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { vacancyList } from '@/utils/sampleData/VacancyManagement/VacancyListingData'

// // Define the Vacancy type (you can move this to a types file)
// export interface Vacancy {
//   id: number
//   designation: string
//   openings: number
//   businessRole: string
//   experienceMin: number
//   experienceMax: number
//   campusOrlateral: string
//   employeeCategory: string
//   employeeType: string
//   hiringManager: string
//   startingDate: string
//   closingDate: string
//   company: string
//   businessUnit: string
//   department: string
//   territory: string
//   zone: string
//   region: string
//   area: string
//   cluster: string
//   branch: string
//   branchCode: string
//   city: string
//   state: string
//   origin: string
// }

// interface VacancyState {
//   vacancies: Vacancy[]
//   loading: boolean
//   error: string | null
//   totalCount: number
// }

// const initialState: VacancyState = {
//   vacancies: [],
//   loading: false,
//   error: null,
//   totalCount: 0
// }

// export const fetchVacancies = createAsyncThunk(
//   'vacancies/fetchVacancies',
//   async ({ page, limit }: { page: number; limit: number }) => {
//     await new Promise(resolve => setTimeout(resolve, 1000))
//     const start = (page - 1) * limit
//     const end = start + limit
//     return {
//       ...vacancyList,
//       data: vacancyList.data.slice(start, end)
//     }
//   }
// )

// // Slice
// const vacancyManagementSlice = createSlice({
//   name: 'vacancyManagement',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchVacancies.pending, state => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchVacancies.fulfilled, (state, action) => {
//         state.loading = false
//         state.vacancies = action.payload.data
//         state.totalCount = action.payload.totalCount
//       })
//       .addCase(fetchVacancies.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message || 'Failed to fetch vacancies'
//       })
//   }
// })

// export default vacancyManagementSlice.reducer

// 'use client'
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import AxiosLib from '@/lib/AxiosLib' // Custom Axios utility
// import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls' // API endpoint definitions

// // Define the Vacancy type based on API response
// export interface Vacancy {
//   id: string // Changed to string to match API
//   deletedBy: string | null
//   jobTitle: string
//   grade: string
//   designation: string
//   jobRole: string
//   openings: number
//   businessRole: string
//   experienceMin: number
//   experienceMax: number
//   campusOrLateral: string // Adjusted casing to match API
//   employeeCategory: string
//   employeeType: string
//   hiringManager: string
//   startingDate: string
//   closingDate: string
//   company: string
//   businessUnit: string
//   department: string
//   teritory: string // Note: API has "teritory" (typo?), adjust if corrected in real API
//   zone: string
//   region: string
//   area: string
//   cluster: string
//   branch: string
//   branchCode: string
//   city: string
//   state: string
//   origin: string
//   metaData: {
//     project: string
//     priority: string
//   }
//   createdAt: string
//   updatedAt: string
//   deletedAt: string | null
// }

// interface VacancyState {
//   vacancies: Vacancy[]
//   totalCount: number
//   currentPage: number
//   limit: number
//   loading: boolean
//   error: string | null
// }

// const initialState: VacancyState = {
//   vacancies: [],
//   totalCount: 0,
//   currentPage: 1,
//   limit: 6, // Matches your VacancyListingPage limit
//   loading: false,
//   error: null
// }

// // Async thunk to fetch vacancies
// export const fetchVacancies = createAsyncThunk(
//   'vacancyManagement/fetchVacancies', // Updated namespace to match your slice
//   async ({ page, limit, search = '' }: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
//     try {
//       const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, {
//         params: { page, limit, search } // Query parameters
//       })

//       const data = response.data

//       // Validate the response structure (assuming it matches your provided API response)
//       if (data.status !== 'Success' || !Array.isArray(data.data)) {
//         throw new Error(data.message || 'Invalid API response')
//       }

//       return {
//         data: data.data, // Array of vacancies
//         totalCount: data.totalCount, // Total number of vacancies
//         currentPage: parseInt(data.currentPage, 10), // Convert to number
//         limit: parseInt(data.limit, 10) // Convert to number
//       }
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
//     }
//   }
// )

// // Slice
// const vacancyManagementSlice = createSlice({
//   name: 'vacancyManagement',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchVacancies.pending, state => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchVacancies.fulfilled, (state, action) => {
//         state.loading = false
//         state.vacancies = action.payload.data
//         state.totalCount = action.payload.totalCount
//         state.currentPage = action.payload.currentPage
//         state.limit = action.payload.limit
//       })
//       .addCase(fetchVacancies.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   }
// })

// export default vacancyManagementSlice.reducer

// 'use client'
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import AxiosLib from '@/lib/AxiosLib' // Custom Axios utility
// import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls' // API endpoint definitions

// // Define the Vacancy type based on API response
// export interface Vacancy {
//   id: string
//   deletedBy: string | null
//   jobTitle: string
//   grade: string
//   designation: string
//   jobRole: string
//   openings: number
//   businessRole: string
//   experienceMin: number
//   experienceMax: number
//   campusOrLateral: string
//   employeeCategory: string
//   employeeType: string
//   hiringManager: string
//   startingDate: string
//   closingDate: string
//   company: string
//   businessUnit: string
//   department: string
//   teritory: string // Note: API has "teritory" (typo?), adjust if corrected in real API
//   zone: string
//   region: string
//   area: string
//   cluster: string
//   branch: string
//   branchCode: string
//   city: string
//   state: string
//   origin: string
//   metaData: {
//     project: string
//     priority: string
//   }
//   createdAt: string
//   updatedAt: string
//   deletedAt: string | null
// }

// interface VacancyState {
//   vacancies: Vacancy[]
//   totalCount: number
//   currentPage: number
//   limit: number
//   loading: boolean
//   error: string | null
//   selectedVacancy: Vacancy | null // Added to store single vacancy
//   selectedVacancyLoading: boolean // Added for single vacancy loading state
//   selectedVacancyError: string | null // Added for single vacancy error state
// }

// const initialState: VacancyState = {
//   vacancies: [],
//   totalCount: 0,
//   currentPage: 1,
//   limit: 6,
//   loading: false,
//   error: null,
//   selectedVacancy: null, // Initialize as null
//   selectedVacancyLoading: false,
//   selectedVacancyError: null
// }

// // Async thunk to fetch all vacancies
// export const fetchVacancies = createAsyncThunk(
//   'vacancyManagement/fetchVacancies',
//   async ({ page, limit, search = '' }: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
//     try {
//       const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, {
//         params: { page, limit, search }
//       })

//       const data = response.data

//       if (data.status !== 'Success' || !Array.isArray(data.data)) {
//         throw new Error(data.message || 'Invalid API response')
//       }

//       return {
//         data: data.data,
//         totalCount: data.totalCount,
//         currentPage: parseInt(data.currentPage, 10) || page,
//         limit: parseInt(data.limit, 10) || limit
//       }
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
//     }
//   }
// )

// // Async thunk to fetch a single vacancy by ID
// export const fetchVacancyById = createAsyncThunk(
//   'vacancyManagement/fetchVacancyById',
//   async (_id: string, { rejectWithValue }) => {
//     try {
//       //const response = await AxiosLib.get(`${API_ENDPOINTS.vacancyListingApi}/${id}`)
//       const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingById)

//       const data = response.data

//       if (data.status !== 'Success' || !data.data) {
//         throw new Error(data.message || 'Invalid API response')
//       }

//       return data.data // Return the single vacancy object
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy')
//     }
//   }
// )

// // Slice
// const vacancyManagementSlice = createSlice({
//   name: 'vacancyManagement',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     // Fetch all vacancies
//     builder
//       .addCase(fetchVacancies.pending, state => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchVacancies.fulfilled, (state, action) => {
//         state.loading = false
//         state.vacancies = action.payload.data
//         state.totalCount = action.payload.totalCount
//         state.currentPage = action.payload.currentPage
//         state.limit = action.payload.limit
//       })
//       .addCase(fetchVacancies.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//       // Fetch single vacancy by ID
//       .addCase(fetchVacancyById.pending, state => {
//         state.selectedVacancyLoading = true
//         state.selectedVacancyError = null
//       })
//       .addCase(fetchVacancyById.fulfilled, (state, action) => {
//         state.selectedVacancyLoading = false
//         state.selectedVacancy = action.payload
//       })
//       .addCase(fetchVacancyById.rejected, (state, action) => {
//         state.selectedVacancyLoading = false
//         state.selectedVacancyError = action.payload as string
//       })
//   }
// })

// export default vacancyManagementSlice.reducer

'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AxiosLib from '@/lib/AxiosLib' // Custom Axios utility
import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls' // API endpoint definitions

// Define the Vacancy type based on API response
export interface Vacancy {
  id: string
  deletedBy: string | null
  jobTitle: string
  grade: string
  designation: string
  jobRole: string
  openings: number
  businessRole: string
  experienceMin: number
  experienceMax: number
  campusOrLateral: string
  employeeCategory: string
  employeeType: string
  hiringManager: string
  startingDate: string
  closingDate: string
  company: string
  businessUnit: string
  department: string
  teritory: string // Note: API has "teritory" (typo?), adjust if corrected in real API
  zone: string
  region: string
  area: string
  cluster: string
  branch: string
  branchCode: string
  city: string
  state: string
  origin: string
  metaData: {
    project: string
    priority: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface VacancyState {
  vacancies: Vacancy[]
  totalCount: number
  currentPage: number
  limit: number
  loading: boolean
  error: string | null
  selectedVacancy: Vacancy | null // Add state for single vacancy
  selectedVacancyLoading: boolean // Loading state for single vacancy
  selectedVacancyError: string | null // Error state for single vacancy
}

const initialState: VacancyState = {
  vacancies: [],
  totalCount: 0,
  currentPage: 1,
  limit: 6,
  loading: false,
  error: null,
  selectedVacancy: null,
  selectedVacancyLoading: false,
  selectedVacancyError: null
}

// Async thunk to fetch vacancies
export const fetchVacancies = createAsyncThunk(
  'vacancyManagement/fetchVacancies',
  async ({ page, limit, search = '' }: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, {
        params: { page, limit, search }
      })

      const data = response.data

      if (data.status !== 'Success' || !Array.isArray(data.data)) {
        throw new Error(data.message || 'Invalid API response')
      }

      return {
        data: data.data,
        totalCount: data.totalCount,
        currentPage: parseInt(data.currentPage, 10),
        limit: parseInt(data.limit, 10)
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
    }
  }
)

// Async thunk to fetch a single vacancy by ID
// Async thunk to fetch a single vacancy by ID
export const fetchVacancyById = createAsyncThunk(
  'vacancyManagement/fetchVacancyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/vacancy/${id}`)
      console.log('API Response for ID', id, ':', response.data) // Debug API response
      const data = response.data

      if (data.status !== 'Success' || !data.data) {
        throw new Error(data.message || 'Invalid API response')
      }

      return data.data // Return the vacancy object
    } catch (error: any) {
      console.error('API Error for ID', id, ':', error.message) // Debug API error
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy')
    }
  }
)

// Slice
const vacancyManagementSlice = createSlice({
  name: 'vacancyManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Existing fetchVacancies cases
    builder
      .addCase(fetchVacancies.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.loading = false
        state.vacancies = action.payload.data
        state.totalCount = action.payload.totalCount
        state.currentPage = action.payload.currentPage
        state.limit = action.payload.limit
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // New fetchVacancyById cases
      .addCase(fetchVacancyById.pending, state => {
        state.selectedVacancyLoading = true
        state.selectedVacancyError = null
        console.log('Fetching vacancy...') // Debug pending state
      })
      .addCase(fetchVacancyById.fulfilled, (state, action) => {
        state.selectedVacancyLoading = false
        state.selectedVacancy = action.payload
        console.log('Selected Vacancy Updated:', action.payload) // Debug fulfilled state
      })
      .addCase(fetchVacancyById.rejected, (state, action) => {
        state.selectedVacancyLoading = false
        state.selectedVacancyError = action.payload as string
        console.log('Fetch Vacancy Failed:', action.payload) // Debug rejected state
      })
  }
})

export default vacancyManagementSlice.reducer
