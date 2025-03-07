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
export interface Vacancy {
  id: string
  designationName: string
  employeeCategoryType: string
  gradeName: string
  bandName: string
  businessUnitName: string
  branchesName: string
  departmentName: string
  createdAt: string
  updatedAt: string
  stateName: string
  districtName: string
  regionName: string
  zoneName: string
  areaName: string
  vacancyPositions?: number // Optional as it’s commented out in some places
  contactPerson?: string // Optional as it’s commented out
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
  mode: any
  id: any
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
