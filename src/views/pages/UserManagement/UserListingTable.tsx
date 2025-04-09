'use client'

import React, { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import { Box, Card, IconButton, Typography } from '@mui/material'

import DynamicTable from '@/components/Table/dynamicTable'

interface Role {
  id: string
  name: string
  permissions: { id: string; name: string; description: string }[]
}

interface User {
  userId: string
  firstName?: string
  lastName?: string
  middleName?: string
  email?: string
  employeeCode?: string
  status?: string
  source?: string
  roles?: string[] | Role[]
  role?: string
  designation?: string
}

interface UserTableProps {
  data: User[]
  page: number
  limit: number
  totalCount: number
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
  handleEdit: (id: string) => void
  handleView: (role: any) => void
}

const UserTable = ({
  data,
  page,
  limit,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  handleEdit,
  handleView
}: UserTableProps) => {
  const columnHelper = createColumnHelper<User>()

  const toTitleCase = (str: string) =>
    str.toString()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const columns = useMemo(
    () => [
      
      columnHelper.accessor('employeeCode', {
        header: 'Employee Code',
        cell: ({ row }) => row.original.employeeCode || 'N/A'
      }),
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: ({ row }) => row.original.firstName || 'N/A'
      }),
      columnHelper.accessor('middleName', {
        header: 'Middle Name',
        cell: ({ row }) => row.original.middleName || '-'
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: ({ row }) => row.original.lastName || 'N/A'
      }),
      columnHelper.accessor('roles', {
        header: 'Role',
        cell: ({ row }) =>
          Array.isArray(row.original.roles) && row.original.roles.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {row.original.roles.map((role, index) => (
                <li key={index}>
                  <Typography
                    variant='body2'
                  >
                    {'name' in role ? role.name : role }
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant='body2'>{row.original.role || 'No Role'}</Typography>
          )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography color={row.original.status?.toLowerCase() === 'active' ? 'success.main' : 'error.main'}>
            {row.original.status || 'N/A'}
          </Typography>
        )
      }),
      columnHelper.display({
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => handleEdit(row.original.userId)} title='Edit' sx={{ fontSize: '20px' }}>
              <i className='tabler-edit' />
            </IconButton>
          </Box>
        )
      }),
      columnHelper.accessor('source', {
        header: 'Source',
        cell: ({ row }) => row.original.source || 'N/A'
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => row.original.email || 'N/A'
      }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: ({ row }) => row.original.designation ? toTitleCase(row.original.designation) :  'N/A'
      })
    ],
    [columnHelper, page, limit, handleEdit, handleView]
  )

  return (
    <Card>
      <DynamicTable
        tableName = 'Users List'
        columns={columns}
        data={data}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        totalCount={totalCount}
        onPageChange={newPage => onPageChange(newPage + 1)}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Card>
  )
}

export default UserTable
