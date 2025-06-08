'use client'
import React from 'react'

import { usePathname } from 'next/navigation'

import DataUploadListingPage from './DataUpload/DataUploadListing'
import ApprovalCategoryForm from './ApprovalCategory/ApprovalCategoryForm'
import InterviewCustomizationPage from './InterviewCustomization/InterviewCustomizationList'
import OrganizationalMapping from './OrganizationalMapping/OrganizationalMapping'
import SchedulerPage from './Scheduler/Scheduler'
import ResignedXFactor from './ResignedXFactor/ResignedXFactor'
import VacancyXFactor from './VacancyXFactor/VacancyXFactor'

// import AddOrEditUser from '@/form/generatedForms/addNewUser' // Update this import path to match your project structure

const SystemManagementIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[2] // Will be 'add', 'edit', or 'view'
  const settings = segments[3] // Will be 'xfactor', 'data-upload', 'approval-category', or undefined

  return (
    <>
      {mode === 'add' || (mode === 'edit' && settings)}
      {mode === 'view' && settings === 'resigned-xfactor' && <ResignedXFactor formik={undefined} />}
      {mode === 'view' && settings === 'vacancy-xfactor' && <VacancyXFactor formik={undefined} />}
      {mode === 'view' && settings === 'data-upload' && <DataUploadListingPage />}
      {mode === 'view' && settings === 'approval-category' && <ApprovalCategoryForm />}
      {mode === 'view' && settings === 'interview-customization' && <InterviewCustomizationPage />}
      {mode === 'view' && settings === 'organizational-mapping' && <OrganizationalMapping />}

      {mode === 'view' && settings === 'scheduler' && <SchedulerPage />}
    </>
  )
}

export default SystemManagementIndex
