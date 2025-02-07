'use client'
import AddOrEditBucket from '@/form/generatedForms/addBucket'
import { usePathname } from 'next/navigation'
import React from 'react'
import BucketView from './BucketView'

const BucketManagementIndex = () => {
  const pathname = usePathname() 
  const segments = pathname.split('/') 
  const mode = segments[2] 
  const id = segments[3] 

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditBucket mode={mode} id={id} />}
      {mode === 'view' && <BucketView mode={mode} id={id} />}
    </>
  )
}


export default BucketManagementIndex
