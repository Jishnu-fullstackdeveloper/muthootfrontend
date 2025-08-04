'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { ROUTES } from '@/utils/routes'

const Page = () => {
  const router = useRouter()

  router.push(ROUTES.HIRING_MANAGEMENT.INTERVIEW_MANAGEMENT)

  return <div></div>
}

export default Page
