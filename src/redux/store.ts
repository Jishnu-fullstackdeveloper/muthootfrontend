import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlice'
import userManagementReducer from './userManagementSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      loginReducer,
      userManagementReducer
    }
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
