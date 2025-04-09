// types.ts
import type { RefObject } from 'react'

import type { TextFieldProps } from '@mui/material/TextField'

// Type for viewMode state
export type ViewMode = 'grid' | 'list' | 'table'

// Interface for filter state (both selectedFilters and appliedFilters)
export interface VacancyFilters {
  location: string[]
  department: string[]
  employmentType: string[]
  experience: string[]
  skills: string[]
  salaryRange: [number, number]
  jobRole: string
}

// Interface for pagination state
export interface PaginationState {
  page: number
  limit: number
  display_numbers_count: number
}

// Interface for vacancy data structure
// export interface Vacancy {
//   id: string
//   designationName: string
//   employeeCategoryType: string
//   gradeName: string
//   bandName: string
//   businessUnitName: string
//   branchesName: string
//   departmentName: string
//   createdAt: string
//   updatedAt: string
//   stateName: string
//   districtName: string
//   regionName: string
//   zoneName: string
//   areaName: string
//   vacancyPositions?: number // Optional as it’s commented out in some places
//   contactPerson?: string // Optional as it’s commented out
// }

// export interface Vacancy {
//   id: number // Changed from string to number based on the data
//   designation: string // Renamed from designationName to match the data
//   openings: number // Added to match vacancyPositions-like field
//   businessRole: string // Added as a new field
//   experienceMin: number // Added for minimum experience
//   experienceMax: number // Added for maximum experience
//   campusOrlateral: string // Added to indicate campus or lateral hiring
//   employeeCategory: string // Renamed from employeeCategoryType to match the data
//   employeeType: string // Added for employment type (e.g., Full-Time)
//   hiringManager: string // Renamed from contactPerson to match the data
//   startingDate: string // Added for vacancy start date
//   closingDate: string // Added for vacancy closing date
//   company: string // Added for company name
//   businessUnit: string // Renamed from businessUnitName to match the data
//   department: string // Renamed from departmentName to match the data
//   territory: string // Added for territory
//   zone: string // Renamed from zoneName to match the data
//   region: string // Renamed from regionName to match the data
//   area: string // Renamed from areaName to match the data
//   cluster: string // Added for cluster
//   branch: string // Renamed from branchesName to match the data (singular)
//   branchCode: string // Added for branch code
//   city: string // Added for city
//   state: string // Renamed from stateName to match the data
//   origin: string // Added for origin of the posting
// }

export interface Vacancy {
  id: string // Updated to string to match "d35d4089-f927-4070-9d12-aafba89c97b8"
  deletedBy: string | null // Matches "null" in the response
  jobTitle: string // Added from "Senior Software Engineer"
  grade: string // Added from "E3"
  designation: string // Matches "SSE - Backend" (no rename needed)
  jobRole: string // Added from "Backend Developer"
  openings: number // Matches 4
  businessRole: string // Matches "Platform Engineering"
  experienceMin: number // Matches 4
  experienceMax: number // Matches 8
  campusOrLateral: string // Updated spelling from "campusOrlateral" to match "Lateral"
  employeeCategory: string // Matches "Engineering"
  employeeType: string // Matches "Full-Time"
  hiringManager: string // Matches "Ravi Verma"
  startingDate: string // Matches "2025-04-10T09:00:00.000Z"
  closingDate: string // Matches "2025-05-10T18:00:00.000Z"
  company: string // Matches "NextGen Technologies"
  businessUnit: string // Matches "Technology Solutions"
  department: string // Matches "Software Development"
  teritory: string // Matches "South" (note: typo in API as "teritory", should be "territory")
  zone: string // Matches "South Central"
  region: string // Matches "Hyderabad Region"
  area: string // Matches "Gachibowli Area"
  cluster: string // Matches "Tech Park Cluster"
  branch: string // Matches "Hyderabad Main Office"
  branchCode: string // Matches "HYD001"
  city: string // Matches "Hyderabad"
  state: string // Matches "Telangana"
  origin: string // Matches "MANUAL"
  metaData: {
    project: string // Matches "Phoenix"
    priority: string // Matches "High"
  }
  createdAt: string // Matches "2025-04-08T05:33:33.482Z"
  updatedAt: string // Matches "2025-04-08T05:33:33.482Z"
  deletedAt: string | null // Matches "null"
}

// Props for DebouncedInput component
export interface DebouncedInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

// Type for selectedTabs state
export type SelectedTabs = { [key: string]: number }

//Details of a particular vacancy listing types
export type Props = {
  mode: string
  id: string
  vacancyTab: string
}

export interface VacancyData {
  title: string
  grade: string
  jobType: string
  experience: string
  branch: string
  city: string
  numberOfOpenings: number
  noOfApplicants: number
  noOfFilledPositions: number
  shortlisted: number
  startDate: string
  endDate: string
  contactPerson: string
  jobDescription: string
  roleSummary: string
  roleDetails: { label: string; value: string }[]
  keySkillsAttributes: { label: string; value: string }[]
  stateRegion: string
  zone: string
  educationalQualification: string
  salaryDetails: string
  skills: string[]
  documentsRequired: string[]
  interviewRounds: number
  interviewDetails: string[]
  approvals: string
}

export interface VacancyRefs {
  jobDetailRef: RefObject<HTMLDivElement>
  candidateListRef: RefObject<HTMLDivElement>
}

//addVacancy form types

export interface VacancyFormValues {
  vacancyTitle: string
  jobType: string
  jobDescription: string
  numberOfOpenings: string
  branch: string
  city: string
  stateOrRegion: string
  country: string
  educationalQualification: string
  experienceInYears: string
  skillsNeeded: string
  salaryRange: string
  additionalBenefits: string
  vacancyStartDate: string
  vacancyEndDate: string
  contactPerson: string
  vacancyStatus: string
}
