// types/NoticePeriodTypes.ts
export interface NoticePeriodRow {
  id: string
  minimumDays: number
  maximumDays: number
  xFactor: number
  Action?: any
}

export interface TempNoticePeriod {
  minimumDays: string
  maximumDays: string
  xFactor: string
}

export interface NoticePeriodState {
  resignedData: any[]
  resignedTotalCount: number
  resignedStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  vacancyData: any[]
  vacancyTotalCount: number
  vacancyStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  updateResponse: any
  createResponse: any
  deleteResponse: any
  page: number
  limit: number
}
