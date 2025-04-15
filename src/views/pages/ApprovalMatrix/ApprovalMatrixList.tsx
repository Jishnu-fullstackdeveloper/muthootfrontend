'use client'
import React, { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, IconButton, Button, Card, TextField } from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchApprovalCategories, fetchApprovalMatrices, deleteApprovalMatrix } from '@/redux/approvalMatrixSlice'
import DynamicTable from '@/components/Table/dynamicTable' // Adjust the import path as needed
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog' // Import the ConfirmModal
import type { ApprovalMatrixFormValues, Section } from '@/types/approvalMatrix'

const ApprovalMatrixList = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { approvalMatrixData, status, totalItems } = useAppSelector(state => state.approvalMatrixReducer)

  // Pagination state (0-based for table)
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Changed to 0-based index for table compatibility
    pageSize: 5
  })

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [matrixIdToDelete, setMatrixIdToDelete] = useState<string | null>(null)

  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Fetch all approval matrices on initial load
  useEffect(() => {
    // Fetch all data by setting a high limit (e.g., 1000) or adjust based on your API's max limit
    dispatch(
      fetchApprovalMatrices({
        page: 1, // Fetch from the first page
        limit: 1000 // Set a high limit to get all data; adjust as needed
      })
    )
  }, [dispatch])

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
            level: 0 // We'll use the max level as numberOfLevels
          }
        }
        acc[categoryId].designations.push(item.designation)
        acc[categoryId].grades.push(item.grade)
        acc[categoryId].level = Math.max(acc[categoryId].level, item.level) // Update max level
        return acc
      },
      {} as Record<string, any>
    )

    let groupedArray = Object.values(grouped)

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
    return groupedData.slice(startIndex, endIndex)
  }, [groupedData, pagination.pageIndex, pagination.pageSize])

  // Handle edit action
  const handleEdit = (rowData: any) => {
    const designations = rowData.designations.map((designation: string, index: number) => ({
      id: `${rowData.id}-${index}`, // Generate a unique ID for each designation
      name: designation
    }))
    const grades = rowData.grades.map((grade: string, index: number) => ({
      id: `${rowData.id}-${index}`, // Generate a unique ID for each grade
      name: grade
    }))

    const queryParams = new URLSearchParams({
      id: rowData.id.toString(),
      approvalCategoryId: rowData.approvalCategories.id, // Pass approvalCategoryId correctly
      approvalCategory: rowData.approvalCategories.name, // Use nested approvalCategories.name
      numberOfLevels: rowData.level === 0 ? '1' : rowData.level.toString(), // Adjust level for edit
      description: rowData.approvalCategories.description, // Use nested description
      designationName: JSON.stringify(designations), // Pass designations as JSON string
      grade: JSON.stringify(grades) // Pass grades as JSON string
    }).toString()

    router.push(`/approval-matrix/edit/edit-approval?${queryParams}`)
  }

  // Handle delete action (open modal)
  const handleDelete = (id: string) => {
    setMatrixIdToDelete(id)
    setDeleteModalOpen(true)
  }

  // Handle delete confirmation from modal
  const handleDeleteConfirm = async (id?: string | null) => {
    if (id) {
      try {
        await dispatch(deleteApprovalMatrix(id)).unwrap()
        // No need to manually update state here; Redux slice handles it
        // Removed alert for success
      } catch (error) {
        console.error('Delete failed:', error)
        // Removed alert for failure
      }
    }
    setDeleteModalOpen(false)
    setMatrixIdToDelete(null) // Reset the ID after action
  }

  // Define columns for the table
  const columns: ColumnDef<any>[] = [
    {
      id: 'approvalCategory',
      header: 'Approval Category',
      accessorKey: 'approvalCategories.name', // Access nested property
      cell: info => info.getValue()
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'approvalCategories.description', // Access nested property
      cell: info => info.getValue()
    },
    {
      id: 'numberOfLevels',
      header: 'Number of Levels',
      accessorKey: 'level',
      cell: info => (info.getValue() === 0 ? 1 : info.getValue()) // Handle level 0 as 1
    },
    {
      id: 'designation',
      header: 'Designation',
      accessorKey: 'designations',
      cell: ({ row }) =>
        Array.isArray(row.original.designations) && row.original.designations.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {row.original.designations.map((designation: string, index: number) => (
              <li key={index}>
                <Typography variant='body2'>{designation}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant='body2'>No Designation</Typography>
        )
    },
    {
      id: 'grade',
      header: 'Grade',
      accessorKey: 'grades',
      cell: ({ row }) =>
        Array.isArray(row.original.grades) && row.original.grades.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {row.original.grades.map((grade: string, index: number) => (
              <li key={index}>
                <Typography variant='body2'>{grade}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant='body2'>No Grade</Typography>
        )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <IconButton
            aria-label='edit'
            sx={{ fontSize: 18 }}
            onClick={e => {
              e.stopPropagation()
              handleEdit(row.original)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label='delete'
            sx={{ fontSize: 18 }}
            onClick={e => {
              e.stopPropagation()
              handleDelete(row.original.id)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  // Handle view action
  const handleView = (rowData: any) => {
    router.push(`/approval-matrix/view/${rowData.id}?id=${rowData.id}`)
  }

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

  // Calculate the total number of grouped rows for pagination
  const groupedTotalCount = groupedData.length

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
          />
          <Button
            variant='contained'
            size='small' // Reduces the height to a smaller predefined size
            onClick={() => router.push(`/approval-matrix/add/new-approval`)}
            sx={{ padding: '6px 16px' }} // Optional: Fine-tune padding to match TextField height
          >
            <AddIcon sx={{ mr: 1, width: 16 }} /> {/* Reduced icon size slightly */}
            New Approval
          </Button>
        </Card>
      </Box>

      {status === 'loading' ? (
        <Typography>Loading...</Typography>
      ) : (
        <DynamicTable
          columns={columns}
          data={paginatedGroupedData} // Use paginated grouped data
          pagination={pagination} // Pass 0-based pagination directly
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageCountChange={handlePageCountChange} // Added for consistency
          totalCount={groupedTotalCount} // Use total grouped count
          tableName='Approvals Listing'
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={matrixIdToDelete}
      />
    </>
  )
}

export default ApprovalMatrixList
