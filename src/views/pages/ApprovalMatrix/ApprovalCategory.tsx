'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, IconButton, Button, Card } from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

//import { useAppDispatch, useAppSelector } from '@/lib/hooks'
//import { fetchApprovalCategories } from '@/redux/approvalMatrixSlice'
import DynamicTable from '@/components/Table/dynamicTable' // Adjust the import path as needed

const ApprovalCategory = () => {
  //const dispatch = useAppDispatch()
  const router = useRouter()

  //const { approvalCategories, status } = useAppSelector(state => state.approvalMatrixReducer)

  // Pagination state
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0, // 0-based for Tanstack Table
    pageSize: 5
  })

  // Handle edit action
  const handleEdit = (rowData: any) => {
    const queryParams = new URLSearchParams({
      id: rowData.id.toString(),
      approvalCategory: rowData.name,
      numberOfLevels: '1', // Assuming 1 level for simplicity; adjust if multi-level
      designationType: rowData.designationType,
      designation: rowData.designation,
      grade: rowData.grade
    }).toString()

    router.push(`/approval-matrix/edit/edit-approval?${queryParams}`)
  }

  const sampleApprovalCategories = [
    {
      id: 1,
      name: 'Budget Approval',
      description: 'Approval process for budget allocations',
      designationType: 'Branch',
      designation: 'Manager',
      grade: 'Area Manager'
    },
    {
      id: 2,
      name: 'Project Approval',
      description: 'Approval for new project initiations',
      designationType: 'Branch',
      designation: 'Manager',
      grade: 'Area Manager'
    },
    {
      id: 3,
      name: 'Hiring Approval',
      description: 'Approval for new employee hiring',
      designationType: 'Corporate',
      designation: 'Manager',
      grade: 'Area Manager'
    },
    {
      id: 4,
      name: 'Expense Approval',
      description: 'Approval for expense reimbursements',
      designationType: 'Region',
      designation: 'Manager',
      grade: 'Area Manager'
    },
    {
      id: 5,
      name: 'Contract Approval',
      description: 'Approval for vendor contracts',
      designationType: 'Department',
      designation: 'Manager',
      grade: 'Area Manager'
    },
    {
      id: 6,
      name: 'Leave Approval',
      description: 'Approval for employee leave requests',
      designationType: 'Zone',
      designation: 'Supervisor',
      grade: 'Jr. Manager'
    }
  ]

  // Define columns for the table
  const columns: ColumnDef<any>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: info => info.getValue()
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      cell: info => info.getValue()
    },
    {
      id: 'designationType',
      header: 'Position Level',
      accessorKey: 'designationType',
      cell: info => info.getValue()
    },
    {
      id: 'designation',
      header: 'Designation',
      accessorKey: 'designation',
      cell: info => info.getValue()
    },
    {
      id: 'grade',
      header: 'Grade',
      accessorKey: 'grade',
      cell: info => info.getValue()
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <IconButton
            aria-label='view'
            onClick={e => {
              e.stopPropagation()
              handleView(row.original)
            }}
          >
            <i className='tabler-eye' />
          </IconButton>
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
          <IconButton aria-label='delete' sx={{ fontSize: 18 }}>
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

  // Fetch approval categories on page load or pagination change
  // useEffect(() => {
  //   dispatch(
  //     fetchApprovalCategories({
  //       page: paginationState.pageIndex + 1, // Convert to 1-based for API
  //       limit: paginationState.pageSize
  //     })
  //   )
  // }, [paginationState.pageIndex, paginationState.pageSize, dispatch])

  // Pagination handlers for DynamicTable
  const handlePageChange = (page: number) => {
    setPaginationState(prev => ({ ...prev, pageIndex: page }))
  }

  const handleRowsPerPageChange = (pageSize: number) => {
    setPaginationState({ pageIndex: 0, pageSize }) // Reset to first page on size change
  }

  return (
    <>
      <Box className='flex justify-between p-1 w-full'>
        <Card
          className='flex justify-between  w-full'
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
          <Typography variant='h4'>Approval Categories</Typography>
          <Button variant='contained' onClick={() => router.push(`/approval-matrix/add/new-approval`)}>
            <AddIcon sx={{ mr: 1, width: 17 }} /> New Approval
          </Button>
        </Card>
      </Box>

      {status === 'loading' ? (
        <Typography>Loading...</Typography>
      ) : (
        <DynamicTable
          columns={columns}
          data={sampleApprovalCategories}
          pagination={{
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </>
  )
}

export default ApprovalCategory
