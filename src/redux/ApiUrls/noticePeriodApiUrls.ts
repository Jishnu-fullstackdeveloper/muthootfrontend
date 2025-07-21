export const API_ENDPOINTS = {
  getNoticePeriodUrl: '/notice-period-range',
  updateNoticePeriodUrl: (id: string) => `/notice-period-range?id=${id}`,
  createNoticePeriodUrl: '/notice-period-range',
  deleteNoticePeriodUrl: (id: string) => `/notice-period-range?id=${id}`
}
