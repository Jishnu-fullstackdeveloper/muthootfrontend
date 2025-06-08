import React, { useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography, Chip, Button, Box } from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'

import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

// Import candidates data from the separate file
import { candidatesData } from '@/utils/sampleData/VacancyManagement/VacancyCanTableData'

const CandidateListingTableView = () => {
  const router = useRouter()
  const columnHelper = createColumnHelper<any>()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [candidateIdToDelete, setCandidateIdToDelete] = useState<string | number | null>(null)

  // Pagination state lifted to the parent component
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const handlePageChange = (newPage: number) => {
    setPagination(prev => {
      const updatedPagination = { ...prev, pageIndex: newPage }

      console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex

      console.log('Page Size:', updatedPagination.pageSize) // Log pageSize

      return updatedPagination
    })
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    const updatedPagination = { pageIndex: 0, pageSize: newPageSize }

    console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex

    console.log('Page Size:', updatedPagination.pageSize) // Log pageSize

    setPagination(updatedPagination)
  }

  const handleDeleteClick = (id: string | number) => {
    setCandidateIdToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = (id?: string | number) => {
    if (id) {
      console.log('Rejecting candidate with ID:', id)
    }

    setDeleteModalOpen(false)
  }

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'CANDIDATE NAME',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.name}
          </Typography>
        )
      }),

      columnHelper.accessor('appliedPost', {
        header: 'APPLIED POST',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.appliedPost}
          </Typography>
        )
      }),

      columnHelper.accessor('email', {
        header: 'EMAIL',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.email}
          </Typography>
        )
      }),

      columnHelper.accessor('phoneNumber', {
        header: 'PHONE NUMBER',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.phoneNumber}
          </Typography>
        )
      }),

      columnHelper.accessor('experience', {
        header: 'EXPERIENCE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.experience} years
          </Typography>
        )
      }),

      columnHelper.accessor('atsScore', {
        header: 'ATS SCORE',
        cell: ({ row }) => (
          <Chip
            label={`${row.original.atsScore}%`}
            color={row.original.atsScore > 75 ? 'success' : row.original.atsScore > 50 ? 'warning' : 'error'}
            size='small'
            sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}
          />
        )
      }),

      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/candidate/view/${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>

            <Tooltip title='Shortlist' placement='top'>
              {/* <IconButton onClick={() => console.log('Shortlisting candidate:', row.original.id)}>
              <i className='tabler-check text-green-500 text-[22px]' />
            </IconButton> */}
              <Button
                variant='tonal'
                color='success'
                size='small'
                onClick={() => console.log('Shortlisting candidate:', row.original.id)}
              >
                Shortlist <i className='ml-1 tabler-check' />
              </Button>
            </Tooltip>

            <Tooltip title='Reject' placement='top' className='ml-2'>
              {/* <IconButton onClick={() => handleDeleteClick(row.original.id)}>
              <i className='tabler-trash text-red-500'></i>
            </IconButton> */}
              <Button variant='tonal' color='error' size='small' onClick={() => handleDeleteClick(row.original.id)}>
                Reject <i className='ml-1 tabler-circle-minus'></i>
              </Button>
            </Tooltip>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, router]
  )

  // Removed the sample data from here as it’s now imported from candidatesData.ts

  return (
    <Box>
      <DynamicTable
        columns={columns}
        data={candidatesData}
        pagination={pagination} // Pass pagination state
        // onPaginationChange={setPagination} // Pass pagination change handler
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={0}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={candidateIdToDelete}
      />
    </Box>
  )
}

export default CandidateListingTableView
