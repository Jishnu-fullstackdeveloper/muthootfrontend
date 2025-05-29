export const API_ENDPOINTS = {
  vacancyListingApi: `/vacancy`,
  vacancyListingById: `/vacancy/:id`, // Added endpoint with :id placeholder
  vacancyRequestUrl: '/vacancy-request',
  vacancyRequestGroupByDesignation: '/vacancy-request/group-by-designation',
  updateVacancyRequestStatusUrl: (id: string) => `/vacancy-request/status?id=${id}`,
  autoApproveVacancyRequestsUrl: '/vacancy-request/auto-approve'
}
