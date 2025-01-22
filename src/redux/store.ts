import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlice'
import userManagementReducer from './userManagementSlice'
import userRoleReducer from './userRoleSlice'
import approvalMatrixReducer from './approvalMatrixSlice'


export const makeStore = () =>
  configureStore({
    reducer: {
      loginReducer,
      userManagementReducer,
      userRoleReducer,
      approvalMatrixReducer

    }
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
