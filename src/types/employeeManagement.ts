export interface Employee {
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
    noticePeriod: number
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
    adharNo: number
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
  department: {
    employeeCategoryTypeId: any
    id: string
    name: string
  }
}

export interface EmployeeState {
  employees: Employee[]
  totalCount: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  selectedEmployee: Employee | null
  selectedEmployeeStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  selectedEmployeeError: string | null
}
