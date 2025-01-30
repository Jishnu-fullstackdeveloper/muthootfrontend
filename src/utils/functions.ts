interface DecodedToken {
  [x: string]: any
  realm_access?: {
    roles?: string[]
  }
}

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export const isAdmin = (): boolean => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (!token) return false

    const decodedToken = decodeToken(token)
    if (!decodedToken?.realm_access?.roles) return false
    return decodedToken.realm_access.roles.includes('admin')
  }
  return false
}

export const setBusinessRoles = (val: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('business_roles', val)
  }
}

export const getBusinessRoles = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('business_roles')
  }
}

export const setConnqtRoles = (val: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('connqt_roles', val)
  }
}

export const getConnqtRoles = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('connqt_roles')
  }
}

export const removeAccessToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
  }
}

export const removeConnqtRoles = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('connqt_roles')
  }
}

export const removeBusinessRoles = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('business_roles')
  }
}

export const setAccessToken = (val: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', val)
  }
}

export const removeRefreshToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refresh_token')
  }
}

export const setRefreshToken = (val: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', val)
  }
}

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token')
  }
}

export const setUserId = (val: any) => {
  if (typeof window !== 'undefined') {
    return localStorage.setItem('user_id', val)
  }
}

export const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id')
  }
}

export const setMainBusinessName = (val: any) => {
  if (typeof window !== 'undefined') {
    return localStorage.setItem('business_name', val)
  }
}

export const getMainBusinessName = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('business_name')
  }
}

export const removeUserId = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_id')
  }
}

export const setJDManagementAddFormValues = (addFormikValues: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('AddNewJDFormValues', JSON.stringify(addFormikValues))
  }
}

export const getJDManagementAddFormValues = () => {
  if (typeof window !== 'undefined') {
    const savedValues = localStorage.getItem('AddNewJDFormValues')
    if (savedValues) {
      return JSON.parse(savedValues)
    }
  }
}

export const removeJDManagementAddFormValues = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('AddNewJDFormValues')
  }
}

export const setJDManagementFiltersToCookie = (JDManagementFilters: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('JDManagementFilters', JSON.stringify(JDManagementFilters))
  }
}

export const getJDManagementFiltersFromCookie = () => {
  if (typeof window !== 'undefined') {
    const savedValues = localStorage.getItem('JDManagementFilters')
    if (savedValues) {
      return JSON.parse(savedValues)
    }
  }
}

export const removeJDManagementFiltersFromCookie = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('JDManagementFilters')
  }
}

export const setVacancyManagementAddFormValues = (addFormikValues: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('AddNewVacancyFormValues', JSON.stringify(addFormikValues))
  }
}

export const getVacancyManagementAddFormValues = () => {
  if (typeof window !== 'undefined') {
    const savedValues = localStorage.getItem('AddNewVacancyFormValues')
    if (savedValues) {
      return JSON.parse(savedValues)
    }
  }
}

export const removeVacancyManagementAddFormValues = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('AddNewVacancyFormValues')
  }
}

export const setVacancyManagementFiltersToCookie = (VacancyManagementFilters: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('VacancyManagementFilters', JSON.stringify(VacancyManagementFilters))
  }
}

export const getVacancyManagementFiltersFromCookie = () => {
  if (typeof window !== 'undefined') {
    const savedValues = localStorage.getItem('VacancyManagementFilters')
    if (savedValues) {
      return JSON.parse(savedValues)
    }
  }
}

export const removeVacancyManagementFiltersFromCookie = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('VacancyManagementFilters')
  }
}

export const Logout = () => {
  removeAccessToken()
  removeRefreshToken()
  removeUserId()
  removeConnqtRoles()
  removeBusinessRoles()
}
