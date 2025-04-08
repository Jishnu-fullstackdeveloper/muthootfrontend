/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { Box, IconButton, Typography } from '@mui/material'

// Components and Utils
import { createColumnHelper } from '@tanstack/react-table'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import DynamicTable from '@/components/Table/dynamicTable'

// Redux Imports
import { fetchBudgetDepartment } from '@/redux/BudgetManagement/BudgetManagementSlice' // Adjust the path
import type { RootState } from '@/redux/store' // Adjust the path

// Types
import type { BudgetDepartment } from '@/types/budget' // Adjust the path

type PaginationState = {
  pageIndex: number
  pageSize: number
  display_numbers_count: number
}

// Define column helper
const columnHelper = createColumnHelper<BudgetDepartment>()

const Department = () => {
  const router = useRouter()
  const dispatch = useAppDispatch() // Use AppDispatch to ensure proper typing

  // State for search
  const [search, setSearch] = useState<string>('')

  // State for pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  // Retrieve data from Redux store
  const {
    fetchBudgetDepartmentData,
    fetchBudgetDepartmentTotal,
    fetchBudgetDepartmentLoading,
    fetchBudgetDepartmentFailureMessage
  } = useAppSelector((state: RootState) => state.budgetManagementReducer)

  // Dispatch the thunk to fetch data when pagination or search changes
  useEffect(() => {
    dispatch(
      fetchBudgetDepartment({
        search: search || undefined,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
      })
    )
  }, [dispatch, pagination.pageIndex, pagination.pageSize, search])

  // Define pagination handlers
  const onPageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: newPage
    }))
  }

  const onRowsPerPageChange = (newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 10 // Reset to page 1 when page size changes
    }))
  }

  // Define columns for DynamicTable based on BudgetDepartment data
  const columns = [
    columnHelper.accessor('name', {
      header: 'DEPARTMENT NAME',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.name}
        </Typography>
      )
    }),
    columnHelper.accessor('positionCategories', {
      header: 'POSITIONS',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.positionCategories.map(pos => `${pos.designationName} (${pos.count})`).join(', ')}
        </Typography>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'CREATED AT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </Typography>
      )
    }),
    columnHelper.accessor('updatedAt', {
      header: 'UPDATED AT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </Typography>
      )
    }),
    columnHelper.accessor('id', {
      id: 'action',
      header: 'ACTION',
      meta: {
        className: 'sticky right-0'
      },
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => router.push(`/budget-management/view/${row.original.id}`)}>
            <i className='tabler-eye text-textSecondary'></i>
          </IconButton>
        </Box>
      ),
      enableSorting: false
    })
  ]

  return (
    <Box sx={{ mt: 6 }}>
      {fetchBudgetDepartmentLoading ? (
        <Typography>Loading...</Typography>
      ) : fetchBudgetDepartmentFailureMessage ? (
        <Typography color='error'>Error: {fetchBudgetDepartmentFailureMessage}</Typography>
      ) : (
        <DynamicTable
          columns={columns}
          data={fetchBudgetDepartmentData?.data || []}
          totalCount={fetchBudgetDepartmentData?.totalCount || 0}
          pagination={pagination} // Pass pagination state
          // onPaginationChange={setPagination} // Pass pagination change handler
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          tableName='Department Budget List'
        />
      )}
    </Box>
  )
}

export default Department
