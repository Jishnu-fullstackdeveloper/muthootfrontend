import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlice'
import userManagementReducer from './userManagementSlice'
import userRoleReducer from './userRoleSlice'
import recruitmentResignationReducer from './RecruitmentResignationSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      loginReducer,
      userManagementReducer,
      userRoleReducer,
      recruitmentResignationReducer
    }
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
