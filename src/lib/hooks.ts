import { useDispatch, useSelector, useStore, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch, AppStore } from '@/redux/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>() //this is previously came here
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
