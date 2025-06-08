import React, { useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography } from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'

import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

const JobListingTableView = ({ jobs }: any) => {
  const router = useRouter()
  const columnHelper = createColumnHelper<any>()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [jobIdToDelete, setJobIdToDelete] = useState<string | number | null>(null)

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
    setJobIdToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = (id?: string | number) => {
    if (id) {
      // Perform the delete operation here

      console.log('Deleting job with ID:', id)

      // After deletion, you might want to refresh the data or remove the item from the list
    }

    setDeleteModalOpen(false)
  }

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: 'JOB TITLE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.title}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('job_type', {
        header: 'JOB TYPE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.job_type}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('job_role', {
        header: 'JOB ROLE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.job_role}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('experience', {
        header: 'EXPERIENCE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.experience}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('education', {
        header: 'EDUCATION',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.education}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('skills', {
        header: 'SKILLS',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-wrap gap-2'>
              {row.original.skills.map((skill: string, index: number) => (
                <Typography key={index} className='font-medium'>
                  {skill}
                </Typography>
              ))}
            </div>
          </div>
        )
      }),

      columnHelper.accessor('salary_range', {
        header: 'SALARY RANGE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.salary_range}
              </Typography>
            </div>
          </div>
        )
      }),

      // columnHelper.accessor('location', {
      //   header: 'LOCATION',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-4'>
      //       <div className='flex flex-col'>
      //         <Typography color='text.primary' className='font-medium'>
      //           {row.original.location}
      //         </Typography>
      //       </div>
      //     </div>
      //   )
      // }),

      // columnHelper.accessor('job_placement', {
      //   header: 'JOB PLACEMENT',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-4'>
      //       <div className='flex flex-col'>
      //         <Typography color='text.primary' className='font-medium'>
      //           {row.original.job_placement}
      //         </Typography>
      //       </div>
      //     </div>
      //   )
      // }),

      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: {
          className: 'sticky right-0'
        },
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/jd-management/view/${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>

            <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/jd-management/edit/${row.original.id}`)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete' placement='top'>
              <IconButton onClick={() => handleDeleteClick(row.original.id)}>
                <i className='tabler-trash text-textSecondary'></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, router]
  )

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={jobs}
        pagination={pagination} // Pass pagination state
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
        id={jobIdToDelete}
      />
    </div>
  )
}

export default JobListingTableView
