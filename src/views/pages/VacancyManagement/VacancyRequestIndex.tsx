'use client'

import React from 'react'

import dynamic from 'next/dynamic'

import { usePathname, useSearchParams } from 'next/navigation'

// const GeneratedAddVacancyForm = dynamic(() => import('@/form/generatedForms/addVacancy'), { ssr: false })

const VacancyRequestDetail = dynamic(() => import('./VacancyRequestDetail'), { ssr: false })

const VacancyRequestIndex = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[4] // Extract "add, view or edit"
  //const id = segments[3] // Extract "id"
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const vacancy_tab = segments[5]

  return <>{mode === 'view' && <VacancyRequestDetail />}</>
}

export default VacancyRequestIndex
