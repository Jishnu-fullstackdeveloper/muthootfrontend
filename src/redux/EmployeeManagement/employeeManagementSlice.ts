import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/employeeApiUrls'

// Define interfaces for the new API responses
interface Territory {
  id: string
  name: string
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface Zone {
  id: string
  name: string
  territoryId: string
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  territory: Territory
}

interface Region {
  id: string
  name: string
  zoneId: string
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  zone: Zone
}

interface Area {
  id: string
  name: string
  regionId: string
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  region: Region
}

interface Cluster {
  id: string
  name: string
  areaId: string
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface Branch {
  id: string
  name: string
  branchCode: string
  bucketName: string
  clusterId: string
  districtId: string
  stateId: string
  cityId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  district: {
    id: string
    name: string
    deletedBy: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  state: {
    id: string
    name: string
    deletedBy: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  cluster: Cluster
  city: { id: string; name: string; deletedBy: string | null; createdAt: string; updatedAt: string }
  branchBucket: {
    id: string
    name: string
    positionCategories: { designationName: string; count: number }[]
    deletedBy: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

// Define the employee data type based on the API response
interface Employee {
  jobRole: any
  resignationDetails: any
  id: string
  employeeCode: string
  title: string | null
  firstName: string
  middleName: string | null
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
    noticePeriod: string
    band: string
    grade: string
    groupDOJ: string
    designation: string
    dateOfJoining: string
    employmentType: string
    confirmationDate: string
    employmentStatus: string
    confirmationStatus: string
  }
  companyStructure: {
    territory: string
    zone: string
    region: string
    cluster: string
    branch: string
    area: string
    company: string
    branchCode: string | null
    department: string
    businessUnitFunction: string
    territoryId: string // Added to ensure type safety
    zoneId: string
    regionId: string
    areaId: string
    clusterId: string
    branchId: string
  }
  managementHierarchy: {
    l1Manager: string
    l2Manager: string
    hrManager: string
    functionHead: string
    practiceHead: string
    functionalManager: string
    hrManagerCode: string
    l1ManagerCode: string
    l2ManagerCode: string
    matrixManagerCode: string
    functionalManagerCode: string
  }
  payrollDetails: {
    foodCardNo: string
    npsAccountNo: string
    esiNo: string
    panNo: string
    bankName: string
    ifscCode: string
    uanNumber: string
    pfAccountNo: string
    pfApplicable: boolean
    pfGrossLimit: string
    bankAccountNo: string
    esiApplicable: boolean
    lwfApplicable: boolean
  }
  address: {
    residenceState: string
    state: string
    permanentCity: string
    residenceCity: string
    permanentCountry: string
    residenceCountry: string
    permanentLandline: string
    residenceLandline: string
    cityClassification: string
    permanentPostalCode: string
    residencePostalCode: string
    permanentAddressLine1: string
    permanentAddressLine2: string
    permanentAddressLine3: string
    permanentAddressLine4: string
    permanentAddressLine5: string
    residenceAddressLine1: string
    residenceAddressLine2: string
    residenceAddressLine3: string
    residenceAddressLine4: string
    residenceAddressLine5: string
  }
  emergencyContact: {
    emergencyContactName: string
    emergencyContactMobilePhone: string
    emergencyContactRelationship: string
  }
  experienceDetails: {
    ageYYMM: string
    retirementDate: string
    totalExperience: string
    currentCompanyExperience: string
  }
  personalDetails: {
    isDisability: any
    typeOfDisability: string
    nameAsPerAdhaar: string
    aadharNumber: string
    gender: string
    religion: string
    birthPlace: string
    bloodGroup: string
    citizenShip: string
    dateOfBirth: string
    marriageDate: string
    maritalStatus: string
    adharNo: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  businessUnit: { id: string; name: string }
  band: { id: string; name: string }
  grade: { id: string; name: string }
  designation: { id: string; name: string; departmentId: string }
  department: {
    employeeCategoryTypeId: any
    id: string
    name: string
  }
}

// State interface
interface EmployeeState {
  employees: Employee[]
  totalCount: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  selectedEmployee: Employee | null
  selectedEmployeeStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  selectedEmployeeError: string | null
  territory: Territory | null
  territoryStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  territoryError: string | null
  zone: Zone | null
  zoneStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  zoneError: string | null
  region: Region | null
  regionStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  regionError: string | null
  area: Area | null
  areaStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  areaError: string | null
  cluster: Cluster | null
  clusterStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  clusterError: string | null
  branch: Branch | null
  branchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  branchError: string | null
  adharNo?: string
}

// Initial state
const initialState: EmployeeState = {
  employees: [],
  totalCount: 0,
  status: 'idle',
  error: null,
  selectedEmployee: null,
  selectedEmployeeStatus: 'idle',
  selectedEmployeeError: null,
  territory: null,
  territoryStatus: 'idle',
  territoryError: null,
  zone: null,
  zoneStatus: 'idle',
  zoneError: null,
  region: null,
  regionStatus: 'idle',
  regionError: null,
  area: null,
  areaStatus: 'idle',
  areaError: null,
  cluster: null,
  clusterStatus: 'idle',
  clusterError: null,
  branch: null,
  branchStatus: 'idle',
  branchError: null
}

// Async thunk to fetch employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (
    {
      page,
      limit,
      search,
      employeeCode,
      employeeCodes,
      jobRoleId,
      isResigned,
      resignationDateFrom,
      departmentId,
      designationId
    }: {
      page: number
      limit: number
      search?: string
      employeeCode?: string
      employeeCodes?: string[]
      jobRoleId?: string
      isResigned?: boolean
      resignationDateFrom?: string
      departmentId?: string
      designationId?: string
    },
    { rejectWithValue }
  ) => {
    try {
      // Construct query parameters, including only provided optional parameters
      const params: Record<string, any> = {
        page,
        limit
      }

      if (search) params.search = search
      if (employeeCode) params.employeeCode = employeeCode
      if (employeeCodes && employeeCodes.length > 0) params.employeeCodes = employeeCodes // Send as array for multiple query parameters
      if (jobRoleId) params.jobRoleId = jobRoleId
      if (isResigned !== undefined) params.isResigned = isResigned
      if (resignationDateFrom) params.resignationDateFrom = resignationDateFrom
      if (departmentId) params.departmentId = departmentId
      if (designationId) params.designationId = designationId

      const response = await AxiosLib.get(API_ENDPOINTS.EMPLOYEES, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch employee data')
    }
  }
)

// Async thunk to fetch a single employee by ID
export const fetchEmployeeById = createAsyncThunk('employees/fetchEmployeeById', async (id: string) => {
  const response = await AxiosLib.get(API_ENDPOINTS.EMPLOYEE_BY_ID(id))

  return response.data
})

// New async thunks for fetching Territory, Zone, Region, Area, Cluster, and Branch
export const fetchTerritoryById = createAsyncThunk('employees/fetchTerritoryById', async (id: string) => {
  const response = await AxiosLib.get(`/territory/${id}`)

  return response.data
})

export const fetchZoneById = createAsyncThunk('employees/fetchZoneById', async (id: string) => {
  const response = await AxiosLib.get(`/zone/${id}`)

  return response.data
})

export const fetchRegionById = createAsyncThunk('employees/fetchRegionById', async (id: string) => {
  const response = await AxiosLib.get(`/region/${id}`)

  return response.data
})

export const fetchAreaById = createAsyncThunk('employees/fetchAreaById', async (id: string) => {
  const response = await AxiosLib.get(`/area/${id}`)

  return response.data
})

export const fetchClusterById = createAsyncThunk('employees/fetchClusterById', async (id: string) => {
  const response = await AxiosLib.get(`/cluster/${id}`)

  return response.data
})

export const fetchBranchById = createAsyncThunk('employees/fetchBranchById', async (id: string) => {
  const response = await AxiosLib.get(`/branch/${id}`)

  return response.data
})

// Async thunk to delete an employee
// export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id: string) => {
//   await AxiosLib.delete(`/api/employees/${id}`)

//   return id
// })

const employeeManagementSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      // Fetch employees
      .addCase(fetchEmployees.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.employees = action.payload.data
        state.totalCount = action.payload.totalCount
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch employees'
      })

      // Fetch employee by ID
      .addCase(fetchEmployeeById.pending, state => {
        state.selectedEmployeeStatus = 'loading'
        state.selectedEmployeeError = null
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.selectedEmployeeStatus = 'succeeded'
        state.selectedEmployee = action.payload.data
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.selectedEmployeeStatus = 'failed'
        state.selectedEmployeeError = action.error.message || 'Failed to fetch employee'
      })

      // Fetch Territory by ID
      .addCase(fetchTerritoryById.pending, state => {
        state.territoryStatus = 'loading'
        state.territoryError = null
      })
      .addCase(fetchTerritoryById.fulfilled, (state, action) => {
        state.territoryStatus = 'succeeded'
        state.territory = action.payload.data
      })
      .addCase(fetchTerritoryById.rejected, (state, action) => {
        state.territoryStatus = 'failed'
        state.territoryError = action.error.message || 'Failed to fetch territory'
      })

      // Fetch Zone by ID
      .addCase(fetchZoneById.pending, state => {
        state.zoneStatus = 'loading'
        state.zoneError = null
      })
      .addCase(fetchZoneById.fulfilled, (state, action) => {
        state.zoneStatus = 'succeeded'
        state.zone = action.payload.data
      })
      .addCase(fetchZoneById.rejected, (state, action) => {
        state.zoneStatus = 'failed'
        state.zoneError = action.error.message || 'Failed to fetch zone'
      })

      // Fetch Region by ID
      .addCase(fetchRegionById.pending, state => {
        state.regionStatus = 'loading'
        state.regionError = null
      })
      .addCase(fetchRegionById.fulfilled, (state, action) => {
        state.regionStatus = 'succeeded'
        state.region = action.payload.data
      })
      .addCase(fetchRegionById.rejected, (state, action) => {
        state.regionStatus = 'failed'
        state.regionError = action.error.message || 'Failed to fetch region'
      })

      // Fetch Area by ID
      .addCase(fetchAreaById.pending, state => {
        state.areaStatus = 'loading'
        state.areaError = null
      })
      .addCase(fetchAreaById.fulfilled, (state, action) => {
        state.areaStatus = 'succeeded'
        state.area = action.payload.data
      })
      .addCase(fetchAreaById.rejected, (state, action) => {
        state.areaStatus = 'failed'
        state.areaError = action.error.message || 'Failed to fetch area'
      })

      // Fetch Cluster by ID
      .addCase(fetchClusterById.pending, state => {
        state.clusterStatus = 'loading'
        state.clusterError = null
      })
      .addCase(fetchClusterById.fulfilled, (state, action) => {
        state.clusterStatus = 'succeeded'
        state.cluster = action.payload.data
      })
      .addCase(fetchClusterById.rejected, (state, action) => {
        state.clusterStatus = 'failed'
        state.clusterError = action.error.message || 'Failed to fetch cluster'
      })

      // Fetch Branch by ID
      .addCase(fetchBranchById.pending, state => {
        state.branchStatus = 'loading'
        state.branchError = null
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.branchStatus = 'succeeded'
        state.branch = action.payload.data
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        state.branchStatus = 'failed'
        state.branchError = action.error.message || 'Failed to fetch branch'
      })

    // Delete employee
    //   .addCase(deleteEmployee.fulfilled, (state, action) => {
    //     state.employees = state.employees.filter(employee => employee.id !== action.payload)
    //     state.totalCount -= 1
    //   })
    //   .addCase(deleteEmployee.rejected, (state, action) => {
    //     state.error = action.error.message || 'Failed to delete employee'
    //   })
  }
})

export default employeeManagementSlice.reducer
