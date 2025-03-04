'use client'
import React, { useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography, Chip, Button } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

const CandidateTableList = () => {
  const router = useRouter()
  const columnHelper = createColumnHelper<any>()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [candidateIdToDelete, setCandidateIdToDelete] = useState<string | number | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const handlePageChange = (newPage: number) => {
    setPagination(prev => {
      const updatedPagination = { ...prev, pageIndex: newPage }

      console.log('Page Index:', updatedPagination.pageIndex)
      console.log('Page Size:', updatedPagination.pageSize)

      return updatedPagination
    })
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    const updatedPagination = { pageIndex: 0, pageSize: newPageSize }

    console.log('Page Index:', updatedPagination.pageIndex)
    console.log('Page Size:', updatedPagination.pageSize)
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
        header: 'NAME',
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
      columnHelper.accessor('jobPortal', {
        header: 'JOB PORTAL',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.jobPortal}
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
        header: 'ACTIONS',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => {
          const status = row.original.status
          let buttonLabel = 'Pending'
          let buttonColor: 'success' | 'error' | 'warning' = 'warning'

          if (status === 'Shortlisted') {
            buttonLabel = 'Shortlist'
            buttonColor = 'success'
          } else if (status === 'Rejected') {
            buttonLabel = 'Reject'
            buttonColor = 'error'
          }

          return (
            <div className='flex items-center'>
              <Tooltip title='View' placement='top'>
                <IconButton onClick={() => router.push(`candidate-management/view/${row.original.id}`)}>
                  <i className='tabler-eye text-textSecondary'></i>
                </IconButton>
              </Tooltip>
              <Button
                variant='tonal'
                color={buttonColor}
                size='small'
                onClick={() => {
                  if (status === 'Rejected') {
                    handleDeleteClick(row.original.id) // Trigger reject confirmation
                  } else {
                    console.log(`${buttonLabel} candidate:`, row.original.id)
                  }
                }}
              >
                {buttonLabel} <i className={`ml-1 tabler-${buttonLabel === 'Shortlist' ? 'check' : 'circle-minus'}`} />
              </Button>
            </div>
          )
        },
        enableSorting: false
      })
    ],
    [columnHelper, router]
  )

  const candidates = useMemo(
    () => [
      {
        id: 1,
        name: 'John Doe',
        appliedPost: 'Software Engineer',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        experience: 3,
        jobPortal: 'LinkedIn',
        atsScore: 85,
        status: 'Pending'
      },
      {
        id: 2,
        name: 'Jane Smith',
        appliedPost: 'Frontend Developer',
        email: 'jane.smith@example.com',
        phoneNumber: '987-654-3210',
        experience: 2,
        jobPortal: 'Indeed',
        atsScore: 70,
        status: 'Shortlisted'
      },
      {
        id: 3,
        name: 'Michael Johnson',
        appliedPost: 'Backend Developer',
        email: 'michael.johnson@example.com',
        phoneNumber: '555-666-7777',
        experience: 5,
        jobPortal: 'Glassdoor',
        atsScore: 90,
        status: 'Pending'
      },
      {
        id: 4,
        name: 'Emily Davis',
        appliedPost: 'UI/UX Designer',
        email: 'emily.davis@example.com',
        phoneNumber: '111-222-3333',
        experience: 4,
        jobPortal: 'Monster',
        atsScore: 60,
        status: 'Rejected'
      },
      {
        id: 5,
        name: 'Robert Brown',
        appliedPost: 'Data Scientist',
        email: 'robert.brown@example.com',
        phoneNumber: '444-555-6666',
        experience: 6,
        jobPortal: 'CareerBuilder',
        atsScore: 40,
        status: 'Pending'
      },
      {
        id: 6,
        name: 'Robert Downy Jr',
        appliedPost: 'Data Analyst',
        email: 'robert.downy@example.com',
        phoneNumber: '444-999-6666',
        experience: 5,
        jobPortal: 'LinkedIn',
        atsScore: 80,
        status: 'Shortlisted'
      }
    ],
    []
  )

  const tableData = useMemo(
    () => ({
      data: candidates,
      totalCount: candidates.length
    }),
    [candidates]
  )

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={tableData.data}
        totalCount={tableData.totalCount}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={candidateIdToDelete}
      />
    </div>
  )
}

export default CandidateTableList
