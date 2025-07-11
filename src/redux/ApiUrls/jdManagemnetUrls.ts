
export const API_ENDPOINTS = {
    getJobRole: '/jobRole',
    getDesignation: '/designation',
    getDepartment: '/department',
    addNewJd:'/jd',
    getJd:'/jd',
    getJdById: (id: string) => `/jd/${id}`, 
}
