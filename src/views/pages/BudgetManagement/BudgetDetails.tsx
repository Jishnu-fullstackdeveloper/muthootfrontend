// 'use client'

// import dynamic from 'next/dynamic'
// import { usePathname } from 'next/navigation'

// // Dynamically import components to optimize loading
// const NewBudgetRequest = dynamic(() => import('./NewBudgetRequest'), { ssr: false })
// const ViewBudget = dynamic(() => import('./ViewBudget'), { ssr: false })

// const BudgetDetails = () => {
//   // Example: location.pathname = "/budget-management/add/new"
//   const pathname = usePathname() // Gets the full pathname
//   const segments = pathname.split('/') // Split by "/"
//   const mode = segments[2] // Extract "add", "edit", or "view"
//   const id = segments[3] // Extract "id"

//   return (
//     <>
//       {(mode === 'add' || mode === 'edit') && (
//         <NewBudgetRequest mode={mode} id={id} />
//       )}
//       {mode === 'view' && <ViewBudget mode={mode} id={id} />}
//     </>
//   )
// }

// export default BudgetDetails
