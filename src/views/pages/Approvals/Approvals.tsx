'use client'

import React, { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'

import type { Approvals } from '@/types/approvalDashboard'
import DynamicTable from '@/components/Table/dynamicTable'
import { ROUTES } from '@/utils/routes'

interface ApprovalManagementProps {
  approvals: Approvals[]
}

const ApprovalManagement = ({ approvals }: ApprovalManagementProps) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(ROUTES.APPROVALS_VACANCY_GROUP)
  }

  const columnHelper = createColumnHelper<Approvals>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Sl No',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>
      }),
      columnHelper.accessor('categoryName', {
        header: 'Approval Category',
        cell: ({ row }) => <Typography>{row.original.categoryName || '-'}</Typography>
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Typography>{row.original.description || '-'}</Typography>
      }),
      columnHelper.accessor('approvedCount', {
        header: 'Approved',
        cell: ({ row }) => <Typography>{row.original.approvedCount || '0'}</Typography>
      }),
      columnHelper.accessor('pendingCount', {
        header: 'Pending',
        cell: ({ row }) => <Typography>{row.original.pendingCount || '0'}</Typography>
      }),
      columnHelper.accessor('rejectedCount', {
        header: 'Rejected',
        cell: ({ row }) => <Typography>{row.original.rejectedCount || '0'}</Typography>
      }),
      columnHelper.accessor('moveTo', {
        header: 'Action',
        cell: () => (
          <Typography onClick={handleCardClick} sx={{ cursor: 'pointer', color: 'primary.main' }}>
               <i className='tabler-eye' style={{ fontSize: '20px' }} />
          </Typography>
        )
      })
    ],
    [columnHelper]
  )

  // State for pagination
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  // Handlers for pagination
  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex)
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageIndex(0) // Reset to first page when page size changes
  }

  // Slice data for client-side pagination
  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize
    const endIndex = startIndex + pageSize

    return approvals.slice(startIndex, endIndex)
  }, [approvals, pageIndex, pageSize])

  return (
    <Box className='mt-5'>
      <DynamicTable
        columns={columns}
        data={paginatedData}
        totalCount={approvals.length}
        pagination={{ pageIndex, pageSize }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableName='Approval List'
        loading={false}
        isRowCheckbox={false} // Disable row selection
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined} // onRowSelectionChange is omitted since row selection is not needed
        // sorting and onSortingChange are omitted since they were undefined in the original
        // initialState is omitted since it was undefined in the original
        // onPageCountChange is omitted since it's not needed for client-side pagination
      />
    </Box>
  )
}

export default ApprovalManagement
