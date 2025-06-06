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
  totalCount?: any
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

export interface VacancyRequestGroupByDesignation {
  designationId: string
  designationName: string
  departmentId: string
  departmentName: string
  branchName: string
  count: number
}

export interface VacancyRequestGroupByDesignationResponse {
  success: boolean
  message: string
  data: VacancyRequestGroupByDesignation[]
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
  totalCount?: any
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
  vacancyRequestGroupByDesignationLoading: boolean
  vacancyRequestGroupByDesignationSuccess: boolean
  vacancyRequestGroupByDesignationData: VacancyRequestGroupByDesignation[] | null
  vacancyRequestGroupByDesignationTotal: number
  vacancyRequestGroupByDesignationFailure: boolean
  vacancyRequestGroupByDesignationFailureMessage: string
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
