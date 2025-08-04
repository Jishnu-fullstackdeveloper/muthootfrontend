export const API_ENDPOINTS = {
  fetchTrainers: '/trainers/getTrainers',
  fetchTrainerById: (empCode: string) => `/trainers/getTrainerById/${empCode}`,
  createTrainer: '/trainers',
  trainerLanguages: '/trainerlanguage/getTrainerLanguages',
  trainingTypes: '/training-type',
  fetchEmployeeByCode: '/employee'
}
