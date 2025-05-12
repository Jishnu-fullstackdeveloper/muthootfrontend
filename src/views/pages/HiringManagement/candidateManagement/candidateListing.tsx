'use client'

import React, { useState, useMemo } from 'react'

import { Typography, Card, MenuItem, Select } from '@mui/material'
import type { TableMeta } from '@tanstack/react-table'
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

// Define custom TableMeta interface to include updateData
interface CandidateTableMeta extends TableMeta<Candidate> {
  updateData: (rowIndex: number, columnId: string, value: any) => void
}

const CandidateListing = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'Shortlisted',
      appliedDate: '2025-05-01',
      gender: 'Male',
      appliedPortal: 'LinkedIn',
      minExperience: '2 years',
      maxExperience: '5 years',
      phoneNumber: '123-456-7890',
      match: '85%'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'L1',
      appliedDate: '2025-05-02',
      gender: 'Female',
      appliedPortal: 'Indeed',
      minExperience: '1 year',
      maxExperience: '3 years',
      phoneNumber: '234-567-8901',
      match: '90%'
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      status: 'Shortlisted',
      appliedDate: '2025-05-03',
      gender: 'Other',
      appliedPortal: 'Company Website',
      minExperience: '3 years',
      maxExperience: '6 years',
      phoneNumber: '345-678-9012',
      match: '78%'
    },
    {
      id: 4,
      name: 'Bob Brown',
      email: 'bob.brown@example.com',
      status: 'Rejected',
      appliedDate: '2025-05-04',
      gender: '',
      appliedPortal: 'Referral',
      minExperience: '0 years',
      maxExperience: '2 years',
      phoneNumber: '456-789-0123',
      match: '65%'
    },
    {
      id: 5,
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      status: 'L1',
      appliedDate: '2025-05-05',
      gender: 'Female',
      appliedPortal: 'Glassdoor',
      minExperience: '4 years',
      maxExperience: '7 years',
      phoneNumber: '567-890-1234',
      match: '82%'
    },
    {
      id: 6,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      status: 'Shortlisted',
      appliedDate: '2025-05-06',
      gender: 'Male',
      appliedPortal: 'LinkedIn',
      minExperience: '5 years',
      maxExperience: '8 years',
      phoneNumber: '678-901-2345',
      match: '88%'
    },
    {
      id: 7,
      name: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      status: 'Rejected',
      appliedDate: '2025-05-07',
      gender: 'Female',
      appliedPortal: 'Indeed',
      minExperience: '2 years',
      maxExperience: '4 years',
      phoneNumber: '789-012-3456',
      match: '70%'
    }
  ])

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
        cell: ({ row, table }) => (
          <Select
            value={statusOptions.includes(row.original.status) ? row.original.status : ''}
            onChange={e => {
              const newStatus = e.target.value

              table.options.meta?.updateData(row.index, 'status', newStatus)
              console.log(`Updated status for ${row.original.name} to ${newStatus}`)
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
    [columnHelper]
  )

  // Table meta to handle data updates
  const tableMeta: CandidateTableMeta = {
    updateData: (rowIndex: number, columnId: string, value: any) => {
      setCandidates(old => old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)))
    }
  }

  return (
    <div>
      <Card>
        <DynamicTable
          tableName='Candidate List'
          columns={columns}
          data={candidates.slice((page - 1) * limit, page * limit)}
          pagination={{ pageIndex: page - 1, pageSize: limit }}
          totalCount={candidates.length}
          onPageChange={newPage => setPage(newPage + 1)}
          onRowsPerPageChange={newPageSize => setLimit(newPageSize)}
          meta={tableMeta}
        />
      </Card>
    </div>
  )
}

export default CandidateListing

