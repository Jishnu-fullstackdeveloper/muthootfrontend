// interviewCandidatesData.ts

export interface InterviewCandidate {
  profileMatchPercent: number
  jobId: string
  id: string
  candidateName: string
  email: string
  mobileNumber: string
  designationApplied: string
  screeningStatus: 'Shortlisted' | 'Rejected' | 'Pending' | 'Interviewed'
  interviewDate?: string
}

export const staticCandidates: InterviewCandidate[] = [
  {
    id: '1',
    candidateName: 'John Doe',
    jobId: 'J001',
    email: 'john.doe@example.com',
    mobileNumber: '+1234567890',
    designationApplied: 'Software Engineer',
    screeningStatus: 'Shortlisted',
    interviewDate: '2025-05-10T00:00:00Z',
    profileMatchPercent: 52
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    jobId: 'J002',
    email: 'jane.smith@example.com',
    mobileNumber: '+1987654321',
    designationApplied: 'Product Manager',
    screeningStatus: 'Pending',
    interviewDate: '2025-05-11T00:00:00Z',
    profileMatchPercent: 80
  },
  {
    id: '3',
    candidateName: 'Alice Johnson',
    jobId: 'J003',
    email: 'alice.johnson@ex.com',
    mobileNumber: '+1123456789',
    designationApplied: 'UI/UX Designer',
    screeningStatus: 'Rejected',
    interviewDate: '2025-05-12T00:00:00Z',
    profileMatchPercent: 74
  },
  {
    id: '4',
    candidateName: 'Bob Wilson',
    jobId: 'J004',
    email: 'bob.wilson@example.com',
    mobileNumber: '+1098765432',
    designationApplied: 'Data Analyst',
    screeningStatus: 'Interviewed',
    interviewDate: '2025-05-13T00:00:00Z',
    profileMatchPercent: 92
  },
  {
    id: '5',
    candidateName: 'Emma Brown',
    jobId: 'J005',
    email: 'emmabrown@ex.com',
    mobileNumber: '+1345678901',
    designationApplied: 'DevOps Engineer',
    screeningStatus: 'Shortlisted',
    interviewDate: '2025-05-14T00:00:00Z',
    profileMatchPercent: 80
  },
  {
    id: '6',
    candidateName: 'Michael Lee',
    jobId: 'J006',
    email: 'michael.lee@example.com',
    mobileNumber: '+1789012345',
    designationApplied: 'QA Engineer',
    screeningStatus: 'Pending',
    interviewDate: '2025-05-15T00:00:00Z',
    profileMatchPercent: 65
  },
  {
    id: '7',
    candidateName: 'Sarah Davis',
    jobId: 'J007',
    email: 'sarah.davis@example.com',
    mobileNumber: '+1567890123',
    designationApplied: 'Backend Developer',
    screeningStatus: 'Rejected',
    interviewDate: '2025-05-16T00:00:00Z',
    profileMatchPercent: 40
  }
]
