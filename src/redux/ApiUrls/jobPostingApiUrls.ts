export const API_ENDPOINTS = {
  fetchJobPostingsUrl: '/job-management',
  fetchJobPostingsByIdUrl: (id: string) => `/job-management/${id}`,
  fetchCandidatesUrl: '/candidate-management'
}
