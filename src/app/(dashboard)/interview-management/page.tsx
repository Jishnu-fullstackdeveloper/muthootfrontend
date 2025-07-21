'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
const page = () => {
  const router = useRouter()
  router.push('/interview-management/candidates-list')
  return <div></div>
}

export default page
