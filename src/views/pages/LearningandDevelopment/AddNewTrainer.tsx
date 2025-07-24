'use client'

import React from 'react'

// import { usePathname } from 'next/navigation'

// import dynamic from 'next/dynamic'

import AddNewTrainer from '@/form/generatedForms/addNewTrainer'

const AddNewTrainerPage = () => {
  // const pathname = usePathname() // Gets the full pathname
  // const segments = pathname.split('/') // Split by "/"
  // const mode = segments[2] // Extract "add, view or edit"
  // const id = segments[3] // Extract "id"

  return (
    <>
      <AddNewTrainer />

      {/* {mode === 'view' && <ViewJd mode={mode} id={id} />} */}
    </>
  )
}

export default AddNewTrainerPage
