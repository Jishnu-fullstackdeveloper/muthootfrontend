import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'

// Define interfaces for the branch data
interface Branch {
  id: string
  name: string
  branchCode: string
  turnoverCode: string
  bucketName: string
  branchStatus: string
  areaId: string
  districtId: string
  stateId: string
  createdAt: string
  updatedAt: string
  bucket: {
    id: string
    name: string
    positionCategories: {
      designationName: string
      count: number
      grade: string
    }[]
    turnoverCode: string
    notes: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  area: {
    id: string
    name: string
    regionId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  district: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  state: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

interface BranchDetailsResponse {
  status: string
  message: string
  data: Branch
}

interface BranchListResponse {
  status: string
  message: string
  totalCount: number
  data: Branch[]
  page: number
  limit: number
}

// Define interfaces for the employee data
interface Employee {
  id: string
  employeeCode: string
  title: string
  firstName: string
  middleName: string
  lastName: string
  officeEmailAddress: string
  personalEmailAddress: string
  mobileNumber: string
  businessUnitId: string
  resignedEmployeeId: string | null
  departmentId: string
  gradeId: string
  bandId: string
  designationId: string
  employeeDetails: {
    position: string
    experience: string
  }
  companyStructure: {
    structure: string
  }
  managementHierarchy: {
    hierarchy: string
  }
  payrollDetails: {
    tax: string
    salary: string
  }
  address: {
    city: string
    street: string
    country: string
  }
  emergencyContact: {
    name: string
    contact: string
    relation: string
  }
  experienceDetails: {
    previousCompany: string
    yearsOfExperience: number
  }
  personalDetails: {
    dob: string
    nationality: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  band: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  businessUnit: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  grade: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  designation: {
    id: string
    name: string
    departmentId: string
    type: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  department: {
    id: string
    name: string
    employeeCategoryTypeId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

interface EmployeeListResponse {
  status: string
  message: string
  totalCount: number
  data: Employee[]
  page: number
  limit: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BranchManagementState {
  branchListLoading: false
  branchListSuccess: false
  branchListData: Branch[]
  branchListTotal: number
  branchListFailure: false
  branchListFailureMessage: string
  branchDetailsLoading: false
  branchDetailsSuccess: false
  branchDetailsData: Branch | null
  branchDetailsFailure: false
  branchDetailsFailureMessage: string
  employeeListLoading: false
  employeeListSuccess: false
  employeeListData: Employee[] | null
  employeeListTotal: number
  employeeListFailure: false
  employeeListFailureMessage: string
}

// Thunk for fetching branch list
export const getBranchList = createAsyncThunk<
  BranchListResponse,
  { search: string; page: number; limit: number; branchStatus?: string }
>('branchManagement/getBranchList', async ({ search, page, limit, branchStatus }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(`/branch`, {
      params: {
        search,
        page,
        limit,
        branchStatus // Add branchStatus to the params
      }
    })

    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// Thunk for fetching branch details
export const getBranchDetails = createAsyncThunk<BranchDetailsResponse, { id: string }>(
  'branchManagement/getBranchDetails',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/branch/${id}`)

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk for fetching employee details with branchId
export const getEmployeeDetailsWithBranchId = createAsyncThunk<
  EmployeeListResponse,
  { branchId: string; page: number; limit: number }
>('branchManagement/getEmployeeDetailsWithBranchId', async ({ branchId, page, limit }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(`/employee-branch/employee/${branchId}`, {
      params: {
        page,
        limit
      }
    })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// Create the slice
export const branchManagementSlice = createSlice({
  name: 'branchManagement',
  initialState: {
    branchListLoading: false,
    branchListSuccess: false,
    branchListData: [],
    branchListTotal: 0,
    branchListFailure: false,
    branchListFailureMessage: '',
    branchDetailsLoading: false,
    branchDetailsSuccess: false,
    branchDetailsData: null,
    branchDetailsFailure: false,
    branchDetailsFailureMessage: '',
    employeeListLoading: false,
    employeeListSuccess: false,
    employeeListData: null,
    employeeListTotal: 0,
    employeeListFailure: false,
    employeeListFailureMessage: ''
  },
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    // Use the helper function for the getBranchList thunk
    handleAsyncThunkStates(builder, getBranchList, 'branchList')

    // Use the helper function for the getBranchDetails thunk
    handleAsyncThunkStates(builder, getBranchDetails, 'branchDetails')

    // Use the helper function for the getEmployeeDetailsWithBranchId thunk
    handleAsyncThunkStates(builder, getEmployeeDetailsWithBranchId, 'employeeList')
  }
})

export const {} = branchManagementSlice.actions
export default branchManagementSlice.reducer
