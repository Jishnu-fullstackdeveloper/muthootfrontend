'use client'

import React from 'react'

import dynamic from 'next/dynamic'

import { usePathname } from 'next/navigation' //useSearchParams

// const GeneratedAddVacancyForm = dynamic(() => import('@/form/generatedForms/addVacancy'), { ssr: false })

const JobVacancyView = dynamic(() => import('../ViewVacancy'), { ssr: false })

const AddNewVacancy = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[4] // Extract "add, view or edit"
  //const id = segments[3] // Extract "id"
  // const searchParams = useSearchParams()
  // const id = searchParams.get('id')
  // const vacancy_tab = segments[5]

  return (
    <>
      {/* {(mode === 'add' || mode === 'edit') && (
        <>
          <GeneratedAddVacancyForm mode={mode} id={id} />
        </>
      )} */}

      {mode === 'view' && <JobVacancyView vacancyTab={'vacancy-details'} />}
    </>
  )
}

export default AddNewVacancy
