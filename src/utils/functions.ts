export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
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

export const Logout = () => {
  removeAccessToken()
  removeRefreshToken()
  removeUserId()
  removeConnqtRoles()
  removeBusinessRoles()
}
