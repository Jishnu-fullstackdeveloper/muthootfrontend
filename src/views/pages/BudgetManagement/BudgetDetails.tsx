'use client'

import dynamic from 'next/dynamic'
import { usePathname, useSearchParams } from 'next/navigation'

// Dynamically import components to optimize loading
const NewBudgetRequest = dynamic(() => import('./NewBudgetRequest'), { ssr: false })
const ViewBudget = dynamic(() => import('./ViewBudget'), { ssr: false })

const BudgetDetails = () => {
  // Example: location.pathname = "/budget-management/add/new"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add", "edit", or "view"
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const jobTitle = segments[3]

  return (
    <>
      {mode === 'add' && <NewBudgetRequest mode={mode} id={id} />}
      {mode === 'view' && <ViewBudget mode={mode} id={id} jobTitle={jobTitle} />}
      {mode === 'department' && <ViewBudget mode={mode} id={id} jobTitle={jobTitle} />}
    </>
  )
}

export default BudgetDetails
