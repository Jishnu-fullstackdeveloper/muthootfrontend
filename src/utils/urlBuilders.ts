import { ROUTES } from '@/utils/routes'

export const buildVacancyRequestURL = ({
  designation,
  department,
  grade,
  locationName,
  locationType
}: {
  designation: string
  department: string
  grade?: string
  locationName: string
  locationType: 'BRANCH' | 'CLUSTER' | 'AREA' | 'REGION' | 'ZONE' | 'TERRITORY'
}) => {
  // Create empty values for all location types
  const locations = {
    branch: '',
    cluster: '',
    area: '',
    region: '',
    zone: '',
    territory: ''
  }

  // Assign the locationName only to the matching key
  locations[locationType.toLowerCase() as keyof typeof locations] = locationName

  return ROUTES.APPROVALS_VACANCY_REQUEST({
    designation,
    department,
    grade,
    branch: locations.branch,
    cluster: locations.cluster,
    area: locations.area,
    region: locations.region,
    zone: locations.zone,
    territory: locations.territory,
    locationType
  })
}

export const buildVacancyListURL = ({
  designation,
  department,
  grade,
  locationName,
  locationType
}: {
  designation: string
  department: string
  grade?: string
  locationName: string
  locationType: 'BRANCH' | 'CLUSTER' | 'AREA' | 'REGION' | 'ZONE' | 'TERRITORY'
}) => {
  // Create empty values for all location types
  const locations = {
    branch: '',
    cluster: '',
    area: '',
    region: '',
    zone: '',
    territory: ''
  }

  // Assign the locationName only to the matching key
  locations[locationType.toLowerCase() as keyof typeof locations] = locationName

  return ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_LIST_VIEW({
    designation,
    department,
    grade,
    branch: locations.branch,
    cluster: locations.cluster,
    area: locations.area,
    region: locations.region,
    zone: locations.zone,
    territory: locations.territory,
    locationType
  })
}
