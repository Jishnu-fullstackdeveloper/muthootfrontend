'use client'

import React, { useMemo } from 'react'

import { Typography, Card, MenuItem, Select } from '@mui/material'
// import type { TableMeta } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'

interface Candidate {
  id: number
  name: string
  email: string
  status: string
  appliedDate: string
  gender?: string
  appliedPortal?: string
  minExperience?: string
  maxExperience?: string
  phoneNumber?: string
  match?: string
}

// interface CandidateTableMeta extends TableMeta<Candidate> {
//   updateData: (rowIndex: number, columnId: string, value: any) => void
// }

interface CandidateListingProps {
  data: Candidate[]
  page: number
  limit: number
  totalCount: number
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
  updateCandidateStatus: (candidateId: number, newStatus: string) => void
}

const CandidateListing = ({
  data,
  page,
  limit,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  updateCandidateStatus
}: CandidateListingProps) => {
  const statusOptions = ['Shortlisted', 'Rejected', 'L1']
  const columnHelper = createColumnHelper<Candidate>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Candidate Name',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      }),
      columnHelper.accessor('appliedPortal', {
        header: 'Applied Portal - Source',
        cell: ({ row }) => <Typography>{row.original.appliedPortal || 'N/A'}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('appliedDate', {
        header: 'Applied Date',
        cell: ({ row }) => <Typography>{row.original.appliedDate}</Typography>
      }),
      columnHelper.accessor('minExperience', {
        header: 'Min Experience',
        cell: ({ row }) => <Typography>{row.original.minExperience || 'N/A'}</Typography>
      }),
      columnHelper.accessor('maxExperience', {
        header: 'Max Experience',
        cell: ({ row }) => <Typography>{row.original.maxExperience || 'N/A'}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Select
            value={statusOptions.includes(row.original.status) ? row.original.status : ''}
            onChange={e => {
              const newStatus = e.target.value

              updateCandidateStatus(row.original.id, newStatus)
            }}
            displayEmpty
            fullWidth
            sx={{ minWidth: 120, padding: '4px' }}
          >
            <MenuItem value='' disabled>
              Select Status
            </MenuItem>
            {statusOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Phone Number',
        cell: ({ row }) => <Typography>{row.original.phoneNumber || 'N/A'}</Typography>
      }),
      columnHelper.accessor('match', {
        header: 'Match',
        cell: ({ row }) => <Typography>{row.original.match || 'N/A'}</Typography>
      })
    ],
    [columnHelper, updateCandidateStatus]
  )

  // const tableMeta: CandidateTableMeta = {
  //   updateData: (rowIndex: number, columnId: string, value: any) => {
  //     const candidateId = data[rowIndex].id

  //     updateCandidateStatus(candidateId, value)
  //   }
  // }

  return (
    <Card>
      <DynamicTable
        tableName='Candidate List'
        columns={columns}
        data={data}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        totalCount={totalCount}
        onPageChange={newPage => onPageChange(newPage + 1)}
        onRowsPerPageChange={onRowsPerPageChange}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
    </Card>
  )
}

export default CandidateListing
