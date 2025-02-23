/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/recruitment-management/overview')
  }, [])

  return <div></div>
}

export default page
