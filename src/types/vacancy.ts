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

export interface Vacancy {
  id: string // Updated to string to match "d35d4089-f927-4070-9d12-aafba89c97b8"
  deletedBy: string | null // Matches "null" in the response
  jobTitle: string // Added from "Senior Software Engineer"
  grade: string // Added from "E3"
  designation: string // Matches "SSE - Backend" (no rename needed)
  jobRole: string // Added from "Backend Developer"
  openings: number // Matches 4
  //businessRole: string // Matches "Platform Engineering"
  experienceMin: string // Matches 4
  experienceMax: string // Matches 8
  campusOrLateral: string // Updated spelling from "campusOrlateral" to match "Lateral"
  employeeCategory: string // Matches "Engineering"
  employeeType: string // Matches "Full-Time"
  hiringManager: string // Matches "Ravi Verma"
  startingDate: string // Matches "2025-04-10T09:00:00.000Z"
  closingDate: string // Matches "2025-05-10T18:00:00.000Z"
  company: string // Matches "NextGen Technologies"
  businessUnit: string // Matches "Technology Solutions"
  department: string // Matches "Software Development"
  territory: string // Matches "South" (note: typo in API as "teritory", should be "territory")
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
