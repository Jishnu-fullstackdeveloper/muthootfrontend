import { configureStore } from '@reduxjs/toolkit'

import loginReducer from './loginSlice'
import UserManagementReducer from './userManagementSlice'
import recruitmentResignationReducer from './RecruitmentResignationSlice'
import approvalMatrixReducer from './approvalMatrixSlice'
import manualRequestReducer from './manualRecruitmentRequestSlice'
import UserRoleReducer from './userRoleSlice'
import BucketManagementReducer from './BucketManagementSlice'

import vacancyManagementReducer from './VacancyManagementAPI/vacancyManagementSlice'

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
      vacancyManagementReducer
    }
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
