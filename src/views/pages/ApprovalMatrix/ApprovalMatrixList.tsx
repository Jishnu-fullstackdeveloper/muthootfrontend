'use client'
import React, { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, Card, TextField, InputAdornment, Tooltip, IconButton, CircularProgress } from '@mui/material' //IconButton //Tooltip
import SearchIcon from '@mui/icons-material/Search'

//import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

//import EditIcon from '@mui/icons-material/Edit'
//import DeleteIcon from '@mui/icons-material/Delete'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchApprovalMatrices } from '@/redux/approvalMatrixSlice' //deleteApprovalMatrix
import DynamicTable from '@/components/Table/dynamicTable' // Adjust the import path as needed
//import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog' // Import the ConfirmModal
//import type { ApprovalMatrixFormValues, Section } from '@/types/approvalMatrix'
import { ROUTES } from '@/utils/routes'

// Import types from the new file
import type {
  ApprovalMatrix,
  GroupedCategory,
  FormattedData,
  PaginatedGroupedData,
  PaginationState
} from '@/types/approvalMatrix' // Adjust the path as needed
import DynamicButton from '@/components/Button/dynamicButton'

const ApprovalMatrixList = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const columnHelper = createColumnHelper<FormattedData>()

  const { approvalMatrixData, status } = useAppSelector(state => state.approvalMatrixReducer) //totalItems
  // const { approvalMatrixData, status } = useAppSelector(
  //   (state: { approvalMatrixReducer: ApprovalMatrixState }) => state.approvalMatrixReducer
  // )

  // Pagination state (0-based for table)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Changed to 0-based index for table compatibility
    pageSize: 5
  })

  // Sorting state to control table sorting (initialize as empty to prevent default sorting)
  const [sorting, setSorting] = useState<SortingState>([])

  // State for delete confirmation modal
  //const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  //const [matrixIdsToDelete, setMatrixIdsToDelete] = useState<string[]>([]) // Changed to array to store multiple IDs

  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>('')

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // useEffect(() => {
  //   // Clear the previous timeout
  //   if (debounceTimeout.current) {
  //     clearTimeout(debounceTimeout.current)
  //   }

  //   // Set a new timeout
  //   debounceTimeout.current = setTimeout(() => {
  //     if (searchQuery.trim() === '') {
  //       // Fetch all matrices when search is cleared
  //       dispatch(
  //         fetchApprovalMatrices({
  //           page: 1,
  //           limit: 1000
  //         })
  //       )
  //     } else {
  //       // Fetch categories for search
  //       dispatch(
  //         fetchApprovalCategories({
  //           page: 1,
  //           limit: 1000,
  //           search: searchQuery
  //         })
  //       )
  //     }
  //   }, 300) // 300ms delay - adjust as needed

  //   // Cleanup function to clear timeout if component unmounts
  //   return () => {
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current)
  //     }
  //   }
  // }, [searchQuery, dispatch])

  // useEffect(() => {
  //   // Clear the previous timeout
  //   if (debounceTimeout.current) {
  //     clearTimeout(debounceTimeout.current)
  //   }

  //   // Set a new timeout
  //   debounceTimeout.current = setTimeout(() => {
  //     // Fetch categories with or without search query
  //     dispatch(
  //       fetchApprovalCategories({
  //         page: 1,
  //         limit: 1000,
  //         search: searchQuery.trim() === '' ? undefined : searchQuery
  //       })
  //     )
  //   }, 300) // 300ms delay - adjust as needed

  //   // Cleanup function to clear timeout if component unmounts
  //   return () => {
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current)
  //     }
  //   }
  // }, [searchQuery, dispatch])

  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      // Fetch matrices with or without search query
      dispatch(
        fetchApprovalMatrices({
          page: 1,
          limit: 1000
        })
      )
    }, 300)

    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchQuery, dispatch, router]) // Add router to trigger fetch on navigation

  // Process the approvalMatrices to format data for the table and filter based on search query
  const groupedData = React.useMemo((): FormattedData[] => {
    // If approvalMatrixData is not an array, return an empty array
    if (!Array.isArray(approvalMatrixData)) {
      return []
    }

    // Group approval matrices by approvalCategoryId
    const groupedByCategory = approvalMatrixData.reduce(
      (acc: Record<string, GroupedCategory>, matrix: ApprovalMatrix) => {
        const categoryId = matrix.approvalCategoryId

        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: categoryId,
            approvalCategories: matrix.approvalCategories,
            matrices: []
          }
        }

        acc[categoryId].matrices.push(matrix)

        return acc
      },
      {}
    )

    // Convert grouped data into the format required by the table
    const formattedData: FormattedData[] = Object.values(groupedByCategory).map((group: GroupedCategory) => ({
      id: group.id,
      approvalCategories: {
        id: group?.approvalCategories?.id,
        name: group?.approvalCategories?.name,
        description: group?.approvalCategories?.description
      },
      approver: group.matrices ? group.matrices.map((matrix: ApprovalMatrix) => matrix.approver || 'No Approver') : [],
      grades: group.matrices ? group.matrices.map((matrix: ApprovalMatrix) => matrix.grade || 'No Grade') : [],
      level:
        group.matrices && group.matrices.length > 0
          ? Math.max(...group.matrices.map((matrix: ApprovalMatrix) => matrix.level || 0))
          : 0,
      matrixIds: group.matrices ? group.matrices.map((matrix: ApprovalMatrix) => matrix.id) : []
    }))

    // Filter based on search query
    if (searchQuery.trim() === '') {
      return formattedData
    }

    return formattedData.filter((group: FormattedData) =>
      group.approvalCategories.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [approvalMatrixData, searchQuery])

  // Slice the grouped data for client-side pagination
  const paginatedGroupedData = React.useMemo((): PaginatedGroupedData => {
    const startIndex = pagination.pageIndex * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize

    console.log(groupedData)

    return {
      data: groupedData.slice(startIndex, endIndex),
      totalCount: groupedData.length
    }
  }, [groupedData, pagination.pageIndex, pagination.pageSize])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const handleEdit = (rowData: any) => {
  //   const designations = rowData.designations.map((designation: string, index: number) => ({
  //     id: `${rowData.matrixIds[index]}-${index}`, // Use matrix ID for unique designation ID
  //     name: designation
  //   }))

  //   const grades = rowData.grades.map((grade: string, index: number) => ({
  //     id: `${rowData.matrixIds[index]}-${index}`, // Use matrix ID for unique grade ID
  //     name: grade
  //   }))

  //   const queryParams = new URLSearchParams({
  //     id: rowData.matrixIds.join(','), // Pass all matrix IDs as a comma-separated string
  //     approvalCategoryId: rowData.approvalCategories.id,
  //     approvalCategory: rowData.approvalCategories.name,
  //     numberOfLevels: rowData.level === 0 ? '1' : rowData.level.toString(),
  //     description: rowData.approvalCategories.description,
  //     designationName: JSON.stringify(designations),
  //     grade: JSON.stringify(grades)
  //   }).toString()

  //   router.push(`/system-management/approval-matrix/edit/edit-approval?${queryParams}`)
  // }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const handleEdit = (rowData: FormattedData) => {
  //   // Map the approvers to the designation or level format expected by the form
  //   const designations = rowData.approver.map((approver: string, index: number) => ({
  //     id: `${rowData.matrixIds[index]}-${index}`, // Use matrix ID for unique designation ID
  //     name: approver === 'No Approver' ? '' : approver
  //   }))

  //   const grades = rowData.grades.map((grade: string, index: number) => ({
  //     id: `${rowData.matrixIds[index]}-${index}`, // Use matrix ID for unique grade ID
  //     name: grade === 'No Grade' ? '' : grade
  //   }))

  //   const queryParams = new URLSearchParams({
  //     id: rowData.matrixIds.join(','), // Pass all matrix IDs as a comma-separated string
  //     approvalCategoryId: rowData.approvalCategories.id,
  //     approvalCategory: rowData.approvalCategories.name,
  //     numberOfLevels: rowData.level === 0 ? '1' : rowData.level.toString(),
  //     description: rowData.approvalCategories.description,
  //     designationName: JSON.stringify(designations), // Pass approvers as designations
  //     grade: JSON.stringify(grades)
  //   }).toString()

  //   router.push(`/system-management/approval-matrix/edit/edit-approval?${queryParams}`)
  // }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEdit = async (rowData: FormattedData) => {
    try {
      // Fetch approval category details to get the approverType
      const response = await dispatch(fetchApprovalCategoryById(rowData.approvalCategories.id)).unwrap()
      const approverType = response.approverType || 'Designation' // Default to 'Designation' if not found

      // Map the approvers to the format expected by the form
      const approvers = rowData.approver.map((approver: string, index: number) => ({
        id: `${rowData.matrixIds[index]}-${index}`, // Use matrix ID for unique ID
        name: approver === 'No Approver' ? '' : approver
      }))

      const grades = rowData.grades.map((grade: string, index: number) => ({
        id: `${rowData.matrixIds[index]}-${index}`, // Use matrix ID for unique grade ID
        name: grade === 'No Grade' ? '' : grade
      }))

      const queryParams = new URLSearchParams({
        id: rowData.matrixIds.join(','), // Pass all matrix IDs as a comma-separated string
        approvalCategoryId: rowData?.approvalCategories?.id,
        approvalCategory: rowData?.approvalCategories?.name,
        numberOfLevels: rowData.level === 0 ? '1' : rowData.level.toString(),
        description: rowData?.approvalCategories?.description,

        // Conditionally pass either designationName or level based on approverType
        ...(approverType === 'Level'
          ? { level: JSON.stringify(approvers) }
          : { designationName: JSON.stringify(approvers) }),
        grade: JSON.stringify(grades)
      }).toString()

      router.push(ROUTES.SYSTEM_MANAGEMENT.APPROVAL_MATRIX_EDIT(queryParams))
    } catch (error) {
      console.error('Error fetching approval category details:', error)

      // Fallback behavior in case of error
      const approvers = rowData.approver.map((approver: string, index: number) => ({
        id: `${rowData.matrixIds[index]}-${index}`,
        name: approver === 'No Approver' ? '' : approver
      }))

      const grades = rowData.grades.map((grade: string, index: number) => ({
        id: `${rowData.matrixIds[index]}-${index}`,
        name: grade === 'No Grade' ? '' : grade
      }))

      const queryParams = new URLSearchParams({
        id: rowData.matrixIds.join(','),
        approvalCategoryId: rowData.approvalCategories.id,
        approvalCategory: rowData.approvalCategories.name,
        numberOfLevels: rowData.level === 0 ? '1' : rowData.level.toString(),
        description: rowData.approvalCategories.description,
        designationName: JSON.stringify(approvers),
        level: JSON.stringify(approvers),
        grade: JSON.stringify(grades)
      }).toString()

      router.push(ROUTES.SYSTEM_MANAGEMENT.APPROVAL_MATRIX_EDIT(queryParams))
    }
  }

  // // Handle delete action (open modal)
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const handleDelete = (rowData: any) => {
  //   // Collect all matrix IDs for the given approvalCategoryId
  //   const matrixIds =
  //     groupedData.find((group: any) => group.approvalCategories.id === rowData.approvalCategories.id)?.matrixIds || []

  //   setMatrixIdsToDelete(matrixIds)
  //   setDeleteModalOpen(true)
  // }

  // const handleDeleteConfirm = async () => {
  //   if (matrixIdsToDelete.length > 0) {
  //     try {
  //       // Delete all matrices with the collected IDs
  //       await Promise.all(matrixIdsToDelete.map(id => dispatch(deleteApprovalMatrix(id)).unwrap()))

  //       // Fetch updated data after deletion to refresh the table
  //       await dispatch(fetchApprovalMatrices({ page: 1, limit: 1000 }))
  //     } catch (error) {
  //       console.error('Delete failed:', error)
  //     }
  //   }

  //   setDeleteModalOpen(false)
  //   setMatrixIdsToDelete([]) // Reset the IDs after action
  // }

  // Define columns for the table
  const columns = React.useMemo<ColumnDef<FormattedData, any>[]>(
    () => [
      columnHelper.accessor('approvalCategories.name', {
        header: 'APPROVAL CATEGORY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.approvalCategories?.name}</Typography>
      }),
      columnHelper.accessor('approvalCategories.description', {
        header: 'DESCRIPTION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.approvalCategories?.description}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('level', {
        header: 'NUMBER OF LEVELS',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.level === 0 ? 1 : row.original?.level}</Typography>
        )
      }),

      // columnHelper.accessor('approver', {
      //   header: 'APPROVER',
      //   cell: ({ row }) => {
      //     // eslint-disable-next-line react-hooks/rules-of-hooks
      //     const [showAll, setShowAll] = useState(false)
      //     const approvers = Array.isArray(row.original.approver) ? row.original.approver : []
      //     const displayedApprovers = showAll ? approvers : approvers.slice(0, 2)

      //     return (
      //       <Box>
      //         <ul style={{ margin: 0, paddingLeft: '20px' }}>
      //           {displayedApprovers.length > 0 ? (
      //             displayedApprovers.map((approver: string, index: number) => (
      //               <li key={index}>
      //                 <Typography color='text.primary' variant='body2'>
      //                   {approver}
      //                 </Typography>
      //               </li>
      //             ))
      //           ) : (
      //             <Typography color='text.primary' variant='body2'>
      //               No Designation
      //             </Typography>
      //           )}
      //           {approvers.length > 2 && (
      //             <Typography
      //               color='primary'
      //               variant='body2'
      //               sx={{ cursor: 'pointer', mt: 1 }}
      //               onClick={() => setShowAll(!showAll)}
      //             >
      //               {showAll ? 'Show Less' : 'Show More'}
      //             </Typography>
      //           )}
      //         </ul>
      //         {/* {approvers.length > 2 && (
      //           <Typography
      //             color='primary'
      //             variant='body2'
      //             sx={{ cursor: 'pointer', textDecoration: 'underline', mt: 1 }}
      //             onClick={() => setShowAll(!showAll)}
      //           >
      //             {showAll ? 'Show Less' : 'Show More'}
      //           </Typography>
      //         )} */}
      //       </Box>
      //     )
      //   }
      // }),

      // columnHelper.accessor('grades', {
      //   header: 'GRADE',
      //   cell: ({ row }) => {
      //     // eslint-disable-next-line react-hooks/rules-of-hooks
      //     const [showAll, setShowAll] = useState(false)
      //     const grades = Array.isArray(row.original.grades) ? row.original.grades : []
      //     const displayedGrades = showAll ? grades : grades.slice(0, 2)

      //     return (
      //       <Box>
      //         <ul style={{ margin: 0, paddingLeft: '20px' }}>
      //           {displayedGrades.length > 0 ? (
      //             displayedGrades.map((grade: string, index: number) => (
      //               <li key={index}>
      //                 <Typography color='text.primary' variant='body2'>
      //                   {grade}
      //                 </Typography>
      //               </li>
      //             ))
      //           ) : (
      //             <Typography color='text.primary' variant='body2'>
      //               No Grade
      //             </Typography>
      //           )}
      //           {grades.length > 2 && (
      //             <Typography
      //               color='primary'
      //               variant='body2'
      //               sx={{ cursor: 'pointer', mt: 1 }}
      //               onClick={() => setShowAll(!showAll)}
      //             >
      //               {showAll ? 'Show Less' : 'Show More'}
      //             </Typography>
      //           )}
      //         </ul>
      //         {/* {grades.length > 2 && (
      //           <Typography
      //             color='primary'
      //             variant='body2'
      //             sx={{ cursor: 'pointer', textDecoration: 'underline', mt: 1, ml: 5 }}
      //             onClick={() => setShowAll(!showAll)}
      //           >
      //             {showAll ? 'Show Less' : 'Show More'}
      //           </Typography>
      //         )} */}
      //       </Box>
      //     )
      //   }
      // }),

      columnHelper.accessor('approver', {
        header: 'APPROVER',
        cell: ({ row }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [showAll, setShowAll] = useState(false)
          const approvers = Array.isArray(row.original.approver) ? row.original.approver : []

          // Transform approvers to remove underscores for display
          const displayedApprovers = (showAll ? approvers : approvers.slice(0, 2)).map(approver =>
            approver === 'No Approver' ? approver : approver.replace(/_/g, ' ')
          )

          return (
            <Box>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {displayedApprovers.length > 0 ? (
                  displayedApprovers.map((approver: string, index: number) => (
                    <li key={index}>
                      <Typography color='text.primary' variant='body2'>
                        {approver}
                      </Typography>
                    </li>
                  ))
                ) : (
                  <Typography color='text.primary' variant='body2'>
                    No Designation
                  </Typography>
                )}
                {approvers.length > 2 && (
                  <Typography
                    color='primary'
                    variant='body2'
                    sx={{ cursor: 'pointer', mt: 1 }}
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? 'Show Less' : 'Show More'}
                  </Typography>
                )}
              </ul>
            </Box>
          )
        }
      }),

      columnHelper.accessor('action', {
        header: 'ACTIONS',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            {/* <Tooltip title='View' placement='top'>
              <IconButton onClick={() => handleView(row.original)} sx={{ fontSize: 18 }} aria-label='view'>
                <VisibilityIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip title='Edit' placement='top'>
              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  handleEdit(row.original)
                }}
                sx={{ fontSize: 18 }}
                aria-label='edit'
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title='Delete' placement='top'>
              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  handleDelete(row.original)
                }}
                sx={{ fontSize: 18 }}
                aria-label='delete'
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip> */}
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, handleEdit]
  )

  // Pagination handlers for DynamicTable
  const handlePageChange = (newPage: number) => {
    setPagination((prev: PaginationState) => ({
      ...prev,
      pageIndex: newPage
    }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({
      pageIndex: 0, // Reset to first page when rows per page changes
      pageSize: newPageSize
    })
  }

  const handlePageCountChange = (newPageCount: number) => {
    console.log('Page Count:', newPageCount)
  }

  return (
    <>
      <Box className='flex justify-between p-1 w-full'>
        <Card
          className='flex justify-between w-full'
          sx={{
            mb: 4,
            position: 'sticky',
            top: 70,
            zIndex: 10,
            backgroundColor: 'white',
            height: 'auto',
            padding: 5
          }}
        >
          {/* Search Bar */}
          <TextField
            label='Search by approval categories'
            variant='outlined'
            size='small' // Reduces the height to a smaller predefined size
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            sx={{ width: '300px', mr: 2 }} // Margin-right to separate from the button
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <DynamicButton
            label='New Approval'
            variant='contained'
            icon={<AddIcon />}
            position='start'
            onClick={() => router.push(ROUTES.SYSTEM_MANAGEMENT.APPROVAL_MATRIX_ADD)}
            children='New Approval'
          />
        </Card>
      </Box>

      {status === 'loading' && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'failed' && <Typography align='center'>No data found</Typography>}
      {status === 'succeeded' && (
        <DynamicTable
          columns={columns}
          data={paginatedGroupedData.data} // Use paginated grouped data
          totalCount={paginatedGroupedData.totalCount} // Use total grouped count
          pagination={pagination} // Pass 0-based pagination directly
          sorting={sorting} // Pass sorting state to control table sorting
          onSortingChange={setSorting} // Handle sorting changes
          initialState={{ sorting: [] }} // Ensure no default sorting
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageCountChange={handlePageCountChange} // Added for consistency
          tableName='Approvals Listing'
        />
      )}

      {/* Delete Confirmation Modal */}
      {/* <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={matrixIdsToDelete[0] || null} // Pass the first ID for compatibility with ConfirmModal
      /> */}
    </>
  )
}

export default ApprovalMatrixList
