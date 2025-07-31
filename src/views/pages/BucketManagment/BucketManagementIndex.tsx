'use client'
import React from 'react'

import { usePathname } from 'next/navigation'

import AddOrEditBucket from '@/form/generatedForms/addBucket'

import BucketView from './BucketView'

const BucketManagementIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[4]
  const id = segments[5]

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditBucket mode={mode} id={id} />}
      {mode === 'view' && <BucketView mode={mode} id={id} />}
    </>
  )
}

export default BucketManagementIndex
