'use client'
import React, { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, Button, Card, TextField, InputAdornment } from '@mui/material' //IconButton //Tooltip
import SearchIcon from '@mui/icons-material/Search'

//import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'

//import EditIcon from '@mui/icons-material/Edit'
//import DeleteIcon from '@mui/icons-material/Delete'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchApprovalCategories, fetchApprovalMatrices } from '@/redux/approvalMatrixSlice' //deleteApprovalMatrix
import DynamicTable from '@/components/Table/dynamicTable' // Adjust the import path as needed
//import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog' // Import the ConfirmModal
//import type { ApprovalMatrixFormValues, Section } from '@/types/approvalMatrix'

const ApprovalMatrixList = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const columnHelper = createColumnHelper<any>()

  const { approvalMatrixData, status } = useAppSelector(state => state.approvalMatrixReducer) //totalItems

  // Pagination state (0-based for table)
  const [pagination, setPagination] = useState({
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

  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      if (searchQuery.trim() === '') {
        // Fetch all matrices when search is cleared
        dispatch(
          fetchApprovalMatrices({
            page: 1,
            limit: 1000
          })
        )
      } else {
        // Fetch categories for search
        dispatch(
          fetchApprovalCategories({
            page: 1,
            limit: 1000,
            search: searchQuery
          })
        )
      }
    }, 300) // 300ms delay - adjust as needed

    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchQuery, dispatch])

  // Process the approvalMatrixData to group by approvalCategoryId and filter based on search query
  const groupedData = React.useMemo(() => {
    const grouped = approvalMatrixData.reduce(
      (acc, item) => {
        const categoryId = item.approvalCategoryId

        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: item.id, // Use the first item's ID for simplicity
            approvalCategories: item.approvalCategories,
            designations: [],
            grades: [],
            level: 0, // We'll use the max level as numberOfLevels
            matrixIds: [] // Store all matrix IDs for this category
          }
        }

        acc[categoryId].designations.push(item.designation)
        acc[categoryId].grades.push(item.grade)
        acc[categoryId].level = Math.max(acc[categoryId].level, item.level) // Update max level
        acc[categoryId].matrixIds.push(item.id) // Collect matrix ID

        return acc
      },
      {} as Record<string, any>
    )

    const groupedArray = Object.values(grouped)

    // Filter based on search query
    if (searchQuery.trim() === '') {
      return groupedArray
    }

    // Filter approvalMatrixData based on approvalCategories.name
    return groupedArray.filter((group: any) =>
      group.approvalCategories.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [approvalMatrixData, searchQuery])

  // Slice the grouped data for client-side pagination
  const paginatedGroupedData = React.useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize

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

  //   router.push(`/approval-matrix/edit/edit-approval?${queryParams}`)
  // }

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
  const columns = React.useMemo<ColumnDef<any, any>[]>(
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
      columnHelper.accessor('designations', {
        header: 'DESIGNATION',
        cell: ({ row }) =>
          Array.isArray(row.original.designations) && row.original.designations.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {row.original.designations.map((designation: string, index: number) => (
                <li key={index}>
                  <Typography color='text.primary' variant='body2'>
                    {designation}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography color='text.primary' variant='body2'>
              No Designation
            </Typography>
          )
      }),
      columnHelper.accessor('grades', {
        header: 'GRADE',
        cell: ({ row }) =>
          Array.isArray(row.original.grades) && row.original.grades.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {row.original.grades.map((grade: string, index: number) => (
                <li key={index}>
                  <Typography color='text.primary' variant='body2'>
                    {grade}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography color='text.primary' variant='body2'>
              No Grade
            </Typography>
          )
      })

      // columnHelper.accessor('action', {
      //   header: 'ACTIONS',
      //   meta: { className: 'sticky right-0' },
      //   cell: ({ row }) => (
      //     <Box className='flex items-center'>
      //       {/* <Tooltip title='View' placement='top'>
      //         <IconButton onClick={() => handleView(row.original)} sx={{ fontSize: 18 }} aria-label='view'>
      //           <VisibilityIcon />
      //         </IconButton>
      //       </Tooltip> */}
      //       <Tooltip title='Edit' placement='top'>
      //         <IconButton
      //           onClick={e => {
      //             e.stopPropagation()
      //             handleEdit(row.original)
      //           }}
      //           sx={{ fontSize: 18 }}
      //           aria-label='edit'
      //         >
      //           <EditIcon />
      //         </IconButton>
      //       </Tooltip>
      //       <Tooltip title='Delete' placement='top'>
      //         <IconButton
      //           onClick={e => {
      //             e.stopPropagation()
      //             handleDelete(row.original)
      //           }}
      //           sx={{ fontSize: 18 }}
      //           aria-label='delete'
      //         >
      //           <DeleteIcon />
      //         </IconButton>
      //       </Tooltip>
      //     </Box>
      //   ),
      //   enableSorting: false
      // })
    ],
    [columnHelper]
  )

  // Pagination handlers for DynamicTable
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
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
            onChange={e => setSearchQuery(e.target.value)}
            sx={{ width: '400px', mr: 2 }} // Margin-right to separate from the button
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant='contained'
            size='small' // Reduces the height to a smaller predefined size
            onClick={() => router.push(`/system-management/approval-matrix/add/new-approval`)}
            sx={{ padding: '6px 16px' }} // Optional: Fine-tune padding to match TextField height
          >
            <AddIcon sx={{ mr: 1, width: 16 }} /> {/* Reduced icon size slightly */}
            New Approval
          </Button>
        </Card>
      </Box>

      {status === 'loading' && <Typography>Loading...</Typography>}
      {status === 'failed' && <Typography color='error'>Error: Failed to load data</Typography>}
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
