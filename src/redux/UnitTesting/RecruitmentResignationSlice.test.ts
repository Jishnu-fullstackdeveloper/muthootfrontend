import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'

import recruitmentResignationReducer, { fetchResignationOverviewList } from '../RecruitmentResignationSlice'
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
      // const state = {
      //   // ...initialState,
      //   fetchResignationOverviewListLoading: true,
      //   fetchResignationOverviewListSuccess: true,
      //   fetchResignationOverviewListFailure: true
      // }
      // const newState = recruitmentResignationReducer(state, fetchResignationAPIDismiss())
      // expect(newState.fetchResignationOverviewListLoading).toBeFalsy()
      // expect(newState.fetchResignationOverviewListSuccess).toBeFalsy()
      // expect(newState.fetchResignationOverviewListFailure).toBeFalsy()
    })

    it('should handle fetchRecruitmentRequestListDismiss', () => {})

    it('should handle fetchRecruitmentRequestByIdDismiss', () => {})
  })

  // Test Async Thunks
  describe('Async Thunks', () => {
    describe('fetchResignationOverviewList', () => {
      it('should handle successful fetch', async () => {
        const mockData = [{ id: 1, name: 'Test' }]

        mockedAxios.get.mockResolvedValueOnce({ data: mockData })

        const store = mockStore(initialState)

        // await store.dispatch(fetchResignationOverviewList('test-params') as any)

        const actions = store.getActions()

        expect(actions[0].type).toBe(fetchResignationOverviewList.pending.type)
        expect(actions[1].type).toBe(fetchResignationOverviewList.fulfilled.type)
        expect(actions[1].payload).toEqual(mockData)
      })

      it('should handle fetch failure', async () => {
        const errorMessage = 'Failed to fetch details!'

        mockedAxios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } })

        const store = mockStore(initialState)

        // await store.dispatch(fetchResignationOverviewList('test-params') as any)

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

        // await store.dispatch(fetchRecruitmentRequestList({ designationName: 'Engineer' }) as any)

        const actions = store.getActions()

        expect(actions[1].payload).toEqual(mockData)
      })

      it('should handle fetch failure', async () => {
        const errorMessage = 'Failed to fetch recruitment requests!'

        mockedAxios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } })

        const store = mockStore(initialState)

        // await store.dispatch(fetchRecruitmentRequestList({ designationName: 'Engineer' }) as any)

        const actions = store.getActions()

        expect(actions[1].payload.message).toBe(errorMessage)
      })
    })

    describe('fetchRecruitmentRequestById', () => {
      it('should handle successful fetch', async () => {
        const mockData = { id: 1, details: 'Test Details' }

        mockedAxios.get.mockResolvedValueOnce({ data: mockData })

        const store = mockStore(initialState)

        // await store.dispatch(fetchRecruitmentRequestById({ id: 1 }) as any)

        const actions = store.getActions()

        expect(actions[1].payload).toEqual(mockData)
      })

      it('should handle fetch failure', async () => {
        const errorMessage = 'Failed to fetch recruitment request details!'

        mockedAxios.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } })

        const store = mockStore(initialState)

        // await store.dispatch(fetchRecruitmentRequestById({ id: 1 }) as any)

        const actions = store.getActions()

        expect(actions[1].payload.message).toBe(errorMessage)
      })
    })
  })

  // Test Extra Reducers
  describe('Extra Reducers', () => {
    it('should handle pending states', () => {})

    it('should handle fulfilled states', () => {})

    it('should handle rejected states', () => {})
  })
})
