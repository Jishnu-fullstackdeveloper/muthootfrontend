import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'

// Define the employee data type based on the API response
interface Employee {
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
    company: string
    branchCode: string | null
    department: string
    businessUnitFunction: string
  }
  managementHierarchy: {
    hrManagerCode: string
    l1ManagerCode: string
    l2ManagerCode: string
    matrixManagerCode: string
    functionalManagerCode: string
  }
  payrollDetails: {
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
    gender: string
    religion: string
    birthPlace: string
    bloodGroup: string
    citizenShip: string
    dateOfBirth: string
    marriageDate: string
    maritalStatus: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  businessUnit: { id: string; name: string }
  band: { id: string; name: string }
  grade: { id: string; name: string }
  designation: { id: string; name: string; departmentId: string }
  department: { id: string; name: string }
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
}

// Initial state
const initialState: EmployeeState = {
  employees: [],
  totalCount: 0,
  status: 'idle',
  error: null,
  selectedEmployee: null,
  selectedEmployeeStatus: 'idle',
  selectedEmployeeError: null
}

// Async thunk to fetch employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async ({ page, limit, search }: { page: number; limit: number; search?: string }) => {
    const response = await AxiosLib.get('/employee', {
      params: { page, limit, search }
    })

    return response.data
  }
)

// Async thunk to fetch a single employee by ID
export const fetchEmployeeById = createAsyncThunk('employees/fetchEmployeeById', async (id: string) => {
  const response = await AxiosLib.get(`/employee/${id}`)

  return response.data
})

// Async thunk to delete an employee
export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id: string) => {
  await AxiosLib.delete(`/api/employees/${id}`)

  return id
})

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

      // Delete employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(employee => employee.id !== action.payload)
        state.totalCount -= 1
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete employee'
      })
  }
})

export default employeeManagementSlice.reducer
