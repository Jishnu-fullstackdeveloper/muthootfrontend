'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

// import CandidateListing from './JobDetails/candidateListing'
import CandidateDetails from './candidateManagement/candidateDetails'
import JobDetails from './JobPosting/JobDetails/jobDetails'
import CollegeDetails from './CampusManagement/College/CollegeDetailView'

// import InterviewDetailedPage from './InterviewManagement/InterviewDetailedView'

const HiringManagementIndex = () => {
  const pathname = usePathname()

  const segments = pathname.split('/')
  const mode = segments[3]

  return (
    <>
      {/* {/* {(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditUserRole  mode={mode} id={id} />} */}
      {mode === 'view' && <JobDetails />}
      {mode === 'candidate' && <CandidateDetails />}
      {mode === 'college' && <CollegeDetails />}
      {/* {mode === 'interview' && <InterviewDetailedPage />} */}
    </>
  )
}

export default HiringManagementIndex
