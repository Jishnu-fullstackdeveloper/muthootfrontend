'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import InterviewDetailedPage from '../InterviewDetailedView'

const InterviewRoute = () => {
  const pathname = usePathname()

  const segments = pathname.split('/')
  const mode = segments[3]

  return <>{mode === 'view' && <InterviewDetailedPage />}</>
}

export default InterviewRoute
