export const API_ENDPOINTS = {
  getSchedulerConfigListUrl: '/scheduler-config',
  updateSchedulerConfigUrl: (id: string) => `/scheduler-config/${id}`,
  toggleSchedulerConfigUrl: (id: string) => `/scheduler-config/${id}/toggle`
}
