// interviewData.ts

// Define the interface for the table data
export interface InterviewCustomization {
  id: string
  band: string[] // Changed to array for multiple selections
  businessUnit: string
  department: string[] // Changed to array for multiple selections
  designation: string[] // Changed to array for multiple selections
  levels: string[] // Changed to array for multiple selections
  aptitudeAvailable: 'Yes' | 'No'
}

// Sample data for the table
export const sampleCustomizationData: InterviewCustomization[] = [
  {
    id: '1',
    band: ['MM1'],
    businessUnit: 'Branch business',
    department: ['Branch business'],
    designation: ['Branch manager'],
    levels: ['Level 1'],
    aptitudeAvailable: 'Yes'
  },
  {
    id: '2',
    band: ['MM2'],
    businessUnit: 'Internal Audit',
    department: ['Gold Inspection'],
    designation: ['Gold Inspector'],
    levels: ['Level 3'],
    aptitudeAvailable: 'No'
  },
  {
    id: '3',
    band: ['MM3'],
    businessUnit: 'Branch business',
    department: ['Branch business'],
    designation: ['Cheif Business Officer'],
    levels: ['Level 2'],
    aptitudeAvailable: 'Yes'
  },
  {
    id: '4',
    band: ['MM4'],
    businessUnit: 'Internal Audit',
    department: ['Gold Inspection'],
    designation: ['Gold Inspector'],
    levels: ['Aptitude Test'],
    aptitudeAvailable: 'Yes'
  }
]

// Options for Autocomplete fields
export const bandOptions = ['MM1', 'MM2', 'MM3', 'MM4', 'MM5']
export const departmentOptions = ['Branch business', 'Gold Inspection']
export const designationOptions = [
  'Cheif Business Officer',
  'Senior Customer executive',
  'Gold Inspector',
  'Branch manager',
  'HR'
]
export const levelOptions = ['Level 1', 'Level 2', 'Level 3', 'Aptitude Test']
