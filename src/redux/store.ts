import { configureStore } from '@reduxjs/toolkit'

import loginReducer from './loginSlice'
import UserManagementReducer from './UserManagment/userManagementSlice'
import recruitmentResignationReducer from './RecruitmentResignationSlice'
import approvalMatrixReducer from './approvalMatrixSlice'
import manualRequestReducer from './manualRecruitmentRequestSlice'
import UserRoleReducer from './UserRoles/userRoleSlice'
import BucketManagementReducer from './BucketManagementSlice'
import branchManagementReducer from './BranchManagement/BranchManagementSlice'
import vacancyManagementReducer from './VacancyManagementAPI/vacancyManagementSlice'
import budgetManagementReducer from './BudgetManagement/BudgetManagementSlice'
import ResignedxFactorReducer from './ResignedXFactor/resignedXFactorSlice'
import VacancyXFactorReducer from './VacancyXFactor/vacancyXFactorSlice'
import employeeManagementReducer from './EmployeeManagement/employeeManagementSlice'
import approvalsReducer from './Approvals/approvalsSlice'
import resignationDataListingReducer from './ResignationDataListing/ResignationDataListingSlice'
import dataUploadReducer from './DataUpload/dataUploadSlice'
import JobPostingReducer from './JobPosting/jobListingSlice'
import JobPostingCustomizationReducer from './JobPosting/jobPostingCustomizationSlice'
import OrganizationalMappingReducer from './OrganizationalMapping/organizationalMappingSlice'
import schedulerManagementSliceReducer from './Scheduler/schedulerSlice'
import noticePeriodReducer from './NoticePeriod/noticePeriodSlice'
import positionBudgetMatrixReducer from './PositionBudgetMatrix/positionMatrixSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      loginReducer,
      UserManagementReducer,
      recruitmentResignationReducer,
      approvalMatrixReducer,
      manualRequestReducer,
      BucketManagementReducer,
      UserRoleReducer,
      branchManagementReducer,
      vacancyManagementReducer,
      budgetManagementReducer,
      ResignedxFactorReducer,
      VacancyXFactorReducer,
      employeeManagementReducer,
      approvalsReducer,
      resignationDataListingReducer,
      dataUploadReducer,
      JobPostingCustomizationReducer,
      JobPostingReducer,
      OrganizationalMappingReducer,
      schedulerManagementSliceReducer,
      noticePeriodReducer,
      positionBudgetMatrixReducer
    }
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
