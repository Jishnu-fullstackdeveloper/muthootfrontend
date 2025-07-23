'use client'

import React, { useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { createColumnHelper } from '@tanstack/react-table'
import { Box, Card, IconButton, Typography } from '@mui/material'

import DynamicTable from '@/components/Table/dynamicTable'
import { ROUTES } from '@/utils/routes'

interface User {
  userId: string
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  source?: string
  employeeCode?: string
  status?: string
  designation?: string
  designationRole?: { name: string }
  groupRoles?: { name: string; description: string }[]
}

interface UserTableProps {
  data: User[]
  page: number
  limit: number
  totalCount: number
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
  onEdit: (userId: string) => void
  handleView: (role: any) => void
}

const UserTable = ({
  data,
  page,
  limit,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  handleView
}: UserTableProps) => {
  const columnHelper = createColumnHelper<User>()
  const router = useRouter()
  const [expandedRoles] = useState<{ [key: string]: boolean }>({})

  const toTitleCase = (str: string) =>
    str
      .toString()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const cleanName = (name: string, prefix: string) => {
    if (!name) return ''

    return name.replace(new RegExp(`^${prefix}`), '').trim()
  }

  // const toggleShowRoles = (userId: string) => {
  //   setExpandedRoles(prev => ({
  //     ...prev,
  //     [userId]: !prev[userId]
  //   }))
  // }

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
       columnHelper.accessor('source', {
        header: 'Source',
        cell: ({ row }) => row.original.source || 'N/A'
      }),

      // columnHelper.accessor('groupRoles', {
      //   header: 'Group Roles',
      //   cell: ({ row }) => (
      //     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      //       {row.original.groupRoles?.length > 0 ? (
      //         <>
      //           {(expandedRoles[row.original.userId]
      //             ? row.original.groupRoles
      //             : row.original.groupRoles.slice(0, 2)
      //           ).map((role: { name: string; description: string }, idx: number) => (
      //             <Chip
      //               key={idx}
      //               label={role.name}
      //               sx={{
      //                 background: '#377DFF33',
      //                 color: '#0096DA',
      //                 fontSize: '12px',
      //                 height: '24px'
      //               }}
      //               onClick={() => handleView(role)}
      //             />
      //           ))}
      //           {row.original.groupRoles.length > 2 && !expandedRoles[row.original.userId] && (
      //             <Chip
      //               label={`+${row.original.groupRoles.length - 2} more`}
      //               sx={{
      //                 background: '#377DFF33',
      //                 color: '#0096DA',
      //                 fontSize: '12px',
      //                 height: '24px',
      //                 cursor: 'pointer'
      //               }}
      //               onClick={() => toggleShowRoles(row.original.userId)}
      //             />
      //           )}
      //         </>
      //       ) : (
      //         <Typography variant='body2'>N/A</Typography>
      //       )}
      //     </Box>
      //   )
      // }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background:
                  row.original.status?.toLowerCase() === 'active' ? 'var(--Green, #00B798)' : 'var(--Red, #FF0000)',
                opacity: 1,
                transform: 'rotate(0deg)'
              }}
            />
            <Typography
              component='span'
              sx={{
                color: row.original.status?.toLowerCase() === 'active' ? 'success.main' : 'error.main',

                fontSize: '14px'
              }}
            >
              {row.original.status || 'N/A'}
            </Typography>
          </Box>
        )
      }),
      columnHelper.display({
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => router.push(ROUTES.USER_MANAGEMENT.USER_EDIT(row.original.userId))}
              title='Edit'
              sx={{ fontSize: '20px' }}
            >
              <i className='tabler-edit' />
            </IconButton>
            <IconButton onClick={() => router.push(ROUTES.USER_MANAGEMENT.USER_VIEW(row.original.userId))}>
              <i className='tabler-eye text-textSecondary'></i>
            </IconButton>
          </Box>
        )
      }),
     
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => row.original.email || 'N/A'
      }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: ({ row }) => (row.original.designation ? toTitleCase(row.original.designation) : 'N/A')
      }),
      columnHelper.accessor('designationRole', {
        header: 'Designation Role',
        cell: ({ row }) =>
          row.original.designationRole?.name ? toTitleCase(cleanName(row.original.designationRole.name, 'des_')) : 'N/A'
      })
    ],
    [columnHelper, onEdit, handleView, expandedRoles]
  )

  return (
    <Card>
      <DynamicTable
        tableName='Users List'
        columns={columns}
        data={data}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        totalCount={totalCount}
        onPageChange={newPage => {
          console.log('Page changed to:', newPage + 1)
          onPageChange(newPage + 1)
        }}
        onRowsPerPageChange={newPageSize => {
          console.log('Rows per page changed to:', newPageSize)
          onRowsPerPageChange(newPageSize)
        }}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
    </Card>
  )
}

export default UserTable
