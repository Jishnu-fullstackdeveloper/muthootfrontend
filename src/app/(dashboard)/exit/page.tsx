'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { ROUTES } from '@/utils/routes'

const Page = () => {
  const router = useRouter()

  router.push(ROUTES.EXIT.RESIGNED_EMPLOYEE)

  return <div></div>
}

export default Page
