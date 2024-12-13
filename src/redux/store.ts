import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      loginReducer
    }
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
