'use client'

import dynamic from 'next/dynamic'
import { usePathname, useSearchParams } from 'next/navigation'

import PositionMatrixTable from './PositionMatrixTable'

// Dynamically import components to optimize loading
const NewBudgetRequest = dynamic(() => import('./NewBudgetRequest'), { ssr: false })
const ViewBudget = dynamic(() => import('./ViewBudget'), { ssr: false })

const BudgetDetails = () => {
  // Example: location.pathname = "/budget-management/add/new"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[4] // Extract "add", "edit", or "view"
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const jobTitle = segments[5]

  return (
    <>
      {mode === 'add' && <NewBudgetRequest mode={mode} id={id} />}
      {mode === 'view' && <ViewBudget mode={mode} id={id} jobTitle={jobTitle} /> && (
        <PositionMatrixTable designation={id} />
      )}
      {/* {mode === 'view' && <PositionMatrixTable id={id} />} */}
      {/* {mode === 'department' && <ViewBudget mode={mode} id={id} jobTitle={jobTitle} />} */}
    </>
  )
}

export default BudgetDetails
