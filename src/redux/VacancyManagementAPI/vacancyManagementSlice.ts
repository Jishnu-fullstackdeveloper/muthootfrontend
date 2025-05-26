'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'
import { API_ENDPOINTS } from '../ApiUrls/vacancyApiUrls'

// Define types for API responses and state
export interface Vacancy {
  status: string
  territory: string
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

export interface VacancyListResponse {
  success: boolean
  message: string
  data: Vacancy[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface VacancyDetailsResponse {
  success: boolean
  message: string
  data: Vacancy
}

export interface VacancyRequest {
  id: string
  deletedBy: string | null
  employeeId: string
  designationId: string
  departmentId: string
  branchId: string
  status: string
  origin: string
  approvalId: string
  approverId: string
  approvalStatus: Array<{ [key: string]: { status: string; approverId: string } }>
  autoApprovalDate: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  employees: {
    id: string
    deletedBy: string | null
    employeeCode: string
    title: string
    firstName: string
    middleName: string | null
    lastName: string
    officeEmailAddress: string
    personalEmailAddress: string
    mobileNumber: string
    businessUnitId: string
    departmentId: string
    gradeId: string
    bandId: string
    designationId: string
    employeeDetails: {
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
      areaId: string
      zoneId: string
      company: string
      branchId: string
      regionId: string
      clusterId: string
      branchCode: string
      department: string
      territoryId: string
      businessUnitFunction: string
    }
    managementHierarchy: {
      hrManager: string
      l1Manager: string
      l2Manager: string
      functionHead: string
      practiceHead: string
      hrManagerCode: string
      l1ManagerCode: string
      l2ManagerCode: string
      functionalManager: string
      matrixManagerCode: string
      functionalManagerCode: string
    }
    payrollDetails: {
      esiNo: string
      panNo: string
      bankName: string
      ifscCode: string
      uanNumber: string
      foodCardNo: string
      pfAccountNo: string
      npsAccountNo: string
      pfApplicable: boolean
      pfGrossLimit: string
      bankAccountNo: string
      esiApplicable: boolean
      lwfApplicable: boolean
    }
    address: {
      state: string
      permanentCity: string
      residenceCity: string
      residenceState: string
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
      gender: string
      adharNo: string
      religion: string
      birthPlace: string
      bloodGroup: string
      citizenShip: string
      dateOfBirth: string
      isDisability: boolean
      marriageDate: string
      maritalStatus: string
      nameAsPerAdhaar: string
      typeOfDisability: string
    }
    jobRoleId: string
    resignationDetails: {
      lwd: string
      notes: string
      noticePeriod: string
      dateOfResignation: string
      relievingDateAsPerNotice: string
    }
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  designations: {
    id: string
    deletedBy: string | null
    name: string
    departmentId: string
    type: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  departments: {
    id: string
    deletedBy: string | null
    name: string
    employeeCategoryTypeId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  branches: {
    id: string
    deletedBy: string | null
    name: string
    branchCode: string
    bucketName: string
    clusterId: string
    districtId: string
    stateId: string
    cityId: string
    createdAt: string
    updatedAt: string
  }
}

export interface VacancyRequestListResponse {
  success: boolean
  message: string
  data: VacancyRequest[]
  totalCount: number
  page: number
  limit: number
}

export interface UpdateVacancyRequestStatusResponse {
  success: boolean
  message: string
  data: any // Assuming the response data structure is not specified
}

export interface AutoApproveVacancyRequestsResponse {
  success: boolean
  message: string
  data: any[]
}

export interface VacancyManagementState {
  vacancyListLoading: boolean
  vacancyListSuccess: boolean
  vacancyListData: Vacancy[] | null
  vacancyListTotal: number
  vacancyListFailure: boolean
  vacancyListFailureMessage: string
  vacancyDetailsLoading: boolean
  vacancyDetailsSuccess: boolean
  vacancyDetailsData: Vacancy | null
  vacancyDetailsFailure: boolean
  vacancyDetailsFailureMessage: string
  vacancyRequestListLoading: boolean
  vacancyRequestListSuccess: boolean
  vacancyRequestListData: VacancyRequest[] | null
  vacancyRequestListTotal: number
  vacancyRequestListFailure: boolean
  vacancyRequestListFailureMessage: string
  updateVacancyRequestStatusLoading: boolean
  updateVacancyRequestStatusSuccess: boolean
  updateVacancyRequestStatusData: any | null
  updateVacancyRequestStatusFailure: boolean
  updateVacancyRequestStatusFailureMessage: string
  autoApproveVacancyRequestsLoading: boolean
  autoApproveVacancyRequestsSuccess: boolean
  autoApproveVacancyRequestsData: any[] | null
  autoApproveVacancyRequestsFailure: boolean
  autoApproveVacancyRequestsFailureMessage: string
}

// Thunk for fetching vacancy list
export const fetchVacancies = createAsyncThunk<VacancyListResponse, { page: number; limit: number; search?: string }>(
  'vacancyManagement/fetchVacancies',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit }
      if (search) params.search = search.trim()

      console.log('Sending API request for vacancies with params:', params)
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingApi, { params })

      console.log('API Response for vacancies:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Fetch Vacancies Error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancies')
    }
  }
)

// Thunk for fetching a single vacancy by ID
export const fetchVacancyById = createAsyncThunk<VacancyDetailsResponse, { id: string }>(
  'vacancyManagement/fetchVacancyById',
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log('Sending API request for vacancy ID:', id)
      const response = await AxiosLib.get(API_ENDPOINTS.vacancyListingById.replace(':id', id))

      console.log('API Response for vacancy ID', id, ':', response.data)
      return response.data
    } catch (error: any) {
      console.error('API Error for vacancy ID', id, ':', error.message)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy')
    }
  }
)

// Thunk for fetching vacancy requests
export const fetchVacancyRequests = createAsyncThunk<
  VacancyRequestListResponse,
  {
    page: number
    limit: number
    search?: string
    employeeId?: string
    id?: string
    designationId?: string
    departmentId?: string
    branchId?: string
    status?: string
    approvalId?: string
    approverId?: string
  }
>(
  'vacancyManagement/fetchVacancyRequests',
  async (
    { page, limit, search, employeeId, id, designationId, departmentId, branchId, status, approvalId, approverId },
    { rejectWithValue }
  ) => {
    try {
      const params: {
        page: number
        limit: number
        search?: string
        employeeId?: string
        id?: string
        designationId?: string
        departmentId?: string
        branchId?: string
        status?: string
        approvalId?: string
        approverId?: string
      } = { page, limit }

      if (search) params.search = search.trim()
      if (employeeId) params.employeeId = employeeId
      if (id) params.id = id
      if (designationId) params.designationId = designationId
      if (departmentId) params.departmentId = departmentId
      if (branchId) params.branchId = branchId
      if (status) params.status = status
      if (approvalId) params.approvalId = approvalId
      if (approverId) params.approverId = approverId

      console.log('Sending API request for vacancy requests with params:', params)
      const response = await AxiosLib.get('/vacancy-request', { params })

      console.log('API Response for vacancy requests:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Fetch Vacancy Requests Error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy requests')
    }
  }
)

// Thunk for updating vacancy request status
export const updateVacancyRequestStatus = createAsyncThunk<
  UpdateVacancyRequestStatusResponse,
  { id: string; approverId: string; status: string }
>('vacancyManagement/updateVacancyRequestStatus', async ({ id, approverId, status }, { rejectWithValue }) => {
  try {
    const requestBody = { approverId, status }
    console.log('Sending API request to update vacancy request status for ID:', id, 'with body:', requestBody)
    const response = await AxiosLib.put(`/vacancy-request/status?id=${id}`, requestBody)

    console.log('API Response for updating vacancy request status:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Update Vacancy Request Status Error:', error)
    return rejectWithValue(error.response?.data?.message || 'Failed to update vacancy request status')
  }
})

// Thunk for auto-approving vacancy requests
export const autoApproveVacancyRequests = createAsyncThunk<AutoApproveVacancyRequestsResponse, void>(
  'vacancyManagement/autoApproveVacancyRequests',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Sending API request to auto-approve vacancy requests')
      const response = await AxiosLib.get('/vacancy-request/auto-approve')

      console.log('API Response for auto-approve vacancy requests:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Auto-Approve Vacancy Requests Error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to auto-approve vacancy requests')
    }
  }
)

// Create the slice
export const vacancyManagementSlice = createSlice({
  name: 'vacancyManagement',
  initialState: {
    vacancyListLoading: false,
    vacancyListSuccess: false,
    vacancyListData: null,
    vacancyListTotal: 0,
    vacancyListFailure: false,
    vacancyListFailureMessage: '',
    vacancyDetailsLoading: false,
    vacancyDetailsSuccess: false,
    vacancyDetailsData: null,
    vacancyDetailsFailure: false,
    vacancyDetailsFailureMessage: '',
    vacancyRequestListLoading: false,
    vacancyRequestListSuccess: false,
    vacancyRequestListData: null,
    vacancyRequestListTotal: 0,
    vacancyRequestListFailure: false,
    vacancyRequestListFailureMessage: '',
    updateVacancyRequestStatusLoading: false,
    updateVacancyRequestStatusSuccess: false,
    updateVacancyRequestStatusData: null,
    updateVacancyRequestStatusFailure: false,
    updateVacancyRequestStatusFailureMessage: '',
    autoApproveVacancyRequestsLoading: false,
    autoApproveVacancyRequestsSuccess: false,
    autoApproveVacancyRequestsData: null,
    autoApproveVacancyRequestsFailure: false,
    autoApproveVacancyRequestsFailureMessage: ''
  } as VacancyManagementState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, fetchVacancies, 'vacancyList')
    handleAsyncThunkStates(builder, fetchVacancyById, 'vacancyDetails')
    handleAsyncThunkStates(builder, fetchVacancyRequests, 'vacancyRequestList')
    handleAsyncThunkStates(builder, updateVacancyRequestStatus, 'updateVacancyRequestStatus')
    handleAsyncThunkStates(builder, autoApproveVacancyRequests, 'autoApproveVacancyRequests')
  }
})

export const {} = vacancyManagementSlice.actions
export default vacancyManagementSlice.reducer
