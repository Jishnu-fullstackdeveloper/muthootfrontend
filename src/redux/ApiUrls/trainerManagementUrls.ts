export const API_ENDPOINTS = {
  fetchTrainers: '/trainers/getTrainers',
  fetchTrainerById: (id: string) => `/trainers/getTrainerById/${id}`,
  createTrainer: '/trainers',
  trainerLanguages: '/trainerlanguage/getTrainerLanguages',
  trainingTypes: '/training-type',
  fetchEmployeeByCode: '/employee'
}
