'use client'
import React from 'react'

import { usePathname } from 'next/navigation'

import AddOrEditBucket from '@/form/generatedForms/addBucket'
import BucketView from './BucketView'

// Define interfaces for component props
interface AddOrEditBucketProps {
  mode: 'add' | 'edit'
  id: string
}

interface BucketViewProps {
  mode: string
  id: string
}

// Type the components explicitly
const TypedAddOrEditBucket: React.FC<AddOrEditBucketProps> = AddOrEditBucket
const TypedBucketView: React.FC<BucketViewProps> = BucketView

const BucketManagementIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[2]
  const id = segments[3]

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <TypedAddOrEditBucket mode={mode as 'add' | 'edit'} id={id} />}
      {mode === 'view' && <TypedBucketView mode={mode} id={id} />}
    </>
  )
}

export default BucketManagementIndex
