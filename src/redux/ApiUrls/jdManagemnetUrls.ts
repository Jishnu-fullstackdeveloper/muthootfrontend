

export const API_ENDPOINTS = {
    getSkills: '/skill',
    getDesignation: '/designation',
    getDepartment: '/department',
    addNewJd:'/jd',
    getJd:'/jd',
    getJdById: (id: string) => `/jd/${id}`, 
    updateJd: `/jd`,
}
