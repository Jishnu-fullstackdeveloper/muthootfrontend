import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import recruitmentResignationReducer, {
  fetchResignationOverviewList,
  fetchRecruitmentRequestList,
  fetchRecruitmentRequestById,
  fetchResignationAPIDismiss,
  fetchRecruitmentRequestListDismiss,
  fetchRecruitmentRequestByIdDismiss
} from '../RecruitmentResignationSlice'
import AxiosLib from '@/lib/AxiosLib'

jest.mock('@/lib/AxiosLib')
const mockedAxios = AxiosLib as jest.Mocked<typeof AxiosLib>

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('RecruitmentResignationSlice', () => {
  const initialState = {
    fetchResignationOverviewListLoading: false,
    fetchResignationOverviewListSuccess: false,
    fetchResignationOverviewListData: [],
    fetchResignationOverviewListFailure: false,
    fetchResignationOverviewListFailureMessage: '',

    fetchRecruitmentRequestListLoading: false,
    fetchRecruitmentRequestListSuccess: false,
    fetchRecruitmentRequestListData: [],
    fetchRecruitmentRequestListFailure: false,
    fetchRecruitmentRequestListFailureMessage: '',

    fetchRecruitmentRequestByIdLoading: false,
    fetchRecruitmentRequestByIdSuccess: false,
    fetchRecruitmentRequestByIdData: null,
    fetchRecruitmentRequestByIdFailure: false,
    fetchRecruitmentRequestByIdFailureMessage: ''
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test Initial State
  describe('Initial State', () => {
    it('should return the initial state', () => {
      expect(recruitmentResignationReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })
  })

  // Test Reducers
  describe('Reducers', () => {
    it('should handle fetchResignationAPIDismiss', () => {
      const state = {
        ...initialState,
        fetchResignationOverviewListLoading: true,
        fetchResignationOverviewListSuccess: true,
        fetchResignationOverviewListFailure: true
      }

      const newState = recruitmentResignationReducer(state, fetchResignationAPIDismiss())
      expect(newState.fetchResignationOverviewListLoading).toBeFalsy()
      expect(newState.fetchResignationOverviewListSuccess).toBeFalsy()
      expect(newState.fetchResignationOverviewListFailure).toBeFalsy()
    })

    it('should handle fetchRecruitmentRequestListDismiss', () => {
      const state = {
        ...initialState,
        fetchRecruitmentRequestListLoading: true,
        fetchRecruitmentRequestListSuccess: true,
        fetchRecruitmentRequestListFailure: true
      }

      const newState = recruitmentResignationReducer(state, fetchRecruitmentRequestListDismiss())
      expect(newState.fetchRecruitmentRequestListLoading).toBeFalsy()
      expect(newState.fetchRecruitmentRequestListSuccess).toBeFalsy()
      expect(newState.fetchRecruitmentRequestListFailure).toBeFalsy()
    })

    it('should handle fetchRecruitmentRequestByIdDismiss', () => {
      const state = {
        ...initialState,
        fetchRecruitmentRequestByIdLoading: true,
        fetchRecruitmentRequestByIdSuccess: true,
        fetchRecruitmentRequestByIdFailure: true
      }

      const newState = recruitmentResignationReducer(state, fetchRecruitmentRequestByIdDismiss())
      expect(newState.fetchRecruitmentRequestByIdLoading).toBeFalsy()
      expect(newState.fetchRecruitmentRequestByIdSuccess).toBeFalsy()
      expect(newState.fetchRecruitmentRequestByIdFailure).toBeFalsy()
    })
  })

  // Test Async Thunks
  describe('Async Thunks', () => {
    describe('fetchResignationOverviewList', () => {
      it('should handle successful fetch', async () => {
        const mockData = [{ id: 1, name: 'Test' }]
        mockedAxios.get.mockResolvedValueOnce({ data: mockData })

        const store = mockStore(initialState)
        await store.dispatch(fetchResignationOverviewList('test-params') as any)

        const actions = store.getActions()
        expect(actions[0].type).toBe(fetchResignationOverviewList.pending.type)
        expect(actions[1].type).toBe(fetchResignationOverviewList.fulfilled.type)
        expect(actions[1].payload).toEqual(mockData)
      })

      it('should handle fetch failure', async () => {
        const errorMessage = 'Failed to fetch details!'
        mockedAxios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } })

        const store = mockStore(initialState)
        await store.dispatch(fetchResignationOverviewList('test-params') as any)

        const actions = store.getActions()
        expect(actions[0].type).toBe(fetchResignationOverviewList.pending.type)
        expect(actions[1].type).toBe(fetchResignationOverviewList.rejected.type)
        expect(actions[1].payload.message).toBe(errorMessage)
      })
    })

    describe('fetchRecruitmentRequestList', () => {
      it('should handle successful fetch', async () => {
        const mockData = [{ id: 1, designation: 'Engineer' }]
        mockedAxios.get.mockResolvedValueOnce({ data: mockData })

        const store = mockStore(initialState)
        await store.dispatch(fetchRecruitmentRequestList({ designationName: 'Engineer' }) as any)

        const actions = store.getActions()
        expect(actions[0].type).toBe(fetchRecruitmentRequestList.pending.type)
        expect(actions[1].type).toBe(fetchRecruitmentRequestList.fulfilled.type)
        expect(actions[1].payload).toEqual(mockData)
      })

      it('should handle fetch failure', async () => {
        const errorMessage = 'Failed to fetch recruitment requests!'
        mockedAxios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } })

        const store = mockStore(initialState)
        await store.dispatch(fetchRecruitmentRequestList({ designationName: 'Engineer' }) as any)

        const actions = store.getActions()
        expect(actions[0].type).toBe(fetchRecruitmentRequestList.pending.type)
        expect(actions[1].type).toBe(fetchRecruitmentRequestList.rejected.type)
        expect(actions[1].payload.message).toBe(errorMessage)
      })
    })

    describe('fetchRecruitmentRequestById', () => {
      it('should handle successful fetch', async () => {
        const mockData = { id: 1, details: 'Test Details' }
        mockedAxios.get.mockResolvedValueOnce({ data: mockData })

        const store = mockStore(initialState)
        await store.dispatch(fetchRecruitmentRequestById({ id: 1 }) as any)

        const actions = store.getActions()
        expect(actions[0].type).toBe(fetchRecruitmentRequestById.pending.type)
        expect(actions[1].type).toBe(fetchRecruitmentRequestById.fulfilled.type)
        expect(actions[1].payload).toEqual(mockData)
      })

      it('should handle fetch failure', async () => {
        const errorMessage = 'Failed to fetch recruitment request details!'
        mockedAxios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } })

        const store = mockStore(initialState)
        await store.dispatch(fetchRecruitmentRequestById({ id: 1 }) as any)

        const actions = store.getActions()
        expect(actions[0].type).toBe(fetchRecruitmentRequestById.pending.type)
        expect(actions[1].type).toBe(fetchRecruitmentRequestById.rejected.type)
        expect(actions[1].payload.message).toBe(errorMessage)
      })
    })
  })

  // Test Extra Reducers
  describe('Extra Reducers', () => {
    it('should handle pending states', () => {
      let state = recruitmentResignationReducer(initialState, fetchResignationOverviewList.pending)
      expect(state.fetchResignationOverviewListLoading).toBeTruthy()

      state = recruitmentResignationReducer(initialState, fetchRecruitmentRequestList.pending)
      expect(state.fetchRecruitmentRequestListLoading).toBeTruthy()

      state = recruitmentResignationReducer(initialState, fetchRecruitmentRequestById.pending)
      expect(state.fetchRecruitmentRequestByIdLoading).toBeTruthy()
    })

    it('should handle fulfilled states', () => {
      const mockData = [{ id: 1 }]
      let state = recruitmentResignationReducer(initialState, fetchResignationOverviewList.fulfilled(mockData, '', ''))
      expect(state.fetchResignationOverviewListSuccess).toBeTruthy()
      expect(state.fetchResignationOverviewListData).toEqual(mockData)

      state = recruitmentResignationReducer(
        initialState,
        fetchRecruitmentRequestList.fulfilled(mockData, '', { designationName: '' })
      )
      expect(state.fetchRecruitmentRequestListSuccess).toBeTruthy()
      expect(state.fetchRecruitmentRequestListData).toEqual(mockData)

      state = recruitmentResignationReducer(
        initialState,
        fetchRecruitmentRequestById.fulfilled(mockData[0], '', { id: 1 })
      )
      expect(state.fetchRecruitmentRequestByIdSuccess).toBeTruthy()
      expect(state.fetchRecruitmentRequestByIdData).toEqual(mockData[0])
    })

    it('should handle rejected states', () => {
      const error = { message: 'Error message' }
      let state = recruitmentResignationReducer(
        initialState,
        fetchResignationOverviewList.rejected(null, '', '', error)
      )
      expect(state.fetchResignationOverviewListFailure).toBeTruthy()
      expect(state.fetchResignationOverviewListFailureMessage).toBe(error.message)

      state = recruitmentResignationReducer(
        initialState,
        fetchRecruitmentRequestList.rejected(null, '', { designationName: '' }, error)
      )
      expect(state.fetchRecruitmentRequestListFailure).toBeTruthy()
      expect(state.fetchRecruitmentRequestListFailureMessage).toBe(error.message)

      state = recruitmentResignationReducer(
        initialState,
        fetchRecruitmentRequestById.rejected(null, '', { id: 1 }, error)
      )
      expect(state.fetchRecruitmentRequestByIdFailure).toBeTruthy()
      expect(state.fetchRecruitmentRequestByIdFailureMessage).toBe(error.message)
    })
  })
})
