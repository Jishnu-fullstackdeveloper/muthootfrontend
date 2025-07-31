'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { ROUTES } from '@/utils/routes'

const Page = () => {
  const router = useRouter()

  router.push(ROUTES.ONBOARD.DOCUMENT_VERIFICATION)

  return <div></div>
}

export default Page
