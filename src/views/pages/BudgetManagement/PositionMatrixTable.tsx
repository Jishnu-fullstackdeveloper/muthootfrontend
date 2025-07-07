'use client'
import React, { useState, useMemo } from 'react'

import { Box, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'

interface EmployeeDetails {
  employeeId: string
  fullName: string
  designation: string
  locationUnit: string
  hireDate: string
  employmentStatus: string
}

interface PositionMatrixTableProps {
  designation: string // Filter by designation
}

const EmployeeDetailsData: EmployeeDetails[] = [
  {
    employeeId: 'EMP001',
    fullName: 'John Doe',
    designation: 'Senior Developer',
    locationUnit: 'Branch 1',
    hireDate: '2023-01-15',
    employmentStatus: 'Permanent'
  },
  {
    employeeId: 'EMP002',
    fullName: 'Jane Smith',
    designation: 'Senior Developer',
    locationUnit: 'Branch 1',
    hireDate: '2023-03-22',
    employmentStatus: 'Permanent'
  },
  {
    employeeId: 'EMP003',
    fullName: 'Alice Johnson',
    designation: 'Senior Developer',
    locationUnit: 'Branch 1',
    hireDate: '2023-06-10',
    employmentStatus: 'Contract'
  },
  {
    employeeId: 'EMP004',
    fullName: 'Bob Wilson',
    designation: 'Sales Executive',
    locationUnit: 'Branch 2',
    hireDate: '2022-11-05',
    employmentStatus: 'Permanent'
  },
  {
    employeeId: 'EMP005',
    fullName: 'Carol Brown',
    designation: 'Sales Executive',
    locationUnit: 'Branch 2',
    hireDate: '2023-02-18',
    employmentStatus: 'Permanent'
  },
  {
    employeeId: 'EMP006',
    fullName: 'David Lee',
    designation: 'Sales Executive',
    locationUnit: 'Region 1',
    hireDate: '2023-04-12',
    employmentStatus: 'Permanent'
  },
  {
    employeeId: 'EMP007',
    fullName: 'Emma Davis',
    designation: 'HR Manager',
    locationUnit: 'Zone 2',
    hireDate: '2024-01-30',
    employmentStatus: 'Temporary'
  },
  {
    employeeId: 'EMP008',
    fullName: 'Frank Miller',
    designation: 'HR Manager',
    locationUnit: 'Zone 2',
    hireDate: '2024-03-15',
    employmentStatus: 'Temporary'
  },
  {
    employeeId: 'EMP009',
    fullName: 'Grace Taylor',
    designation: 'Project Lead',
    locationUnit: 'Area 3',
    hireDate: '2023-07-20',
    employmentStatus: 'Temporary'
  },
  {
    employeeId: 'EMP010',
    fullName: 'Henry Clark',
    designation: 'Finance Officer',
    locationUnit: 'Cluster 2',
    hireDate: '2022-09-10',
    employmentStatus: 'Permanent'
  },
  {
    employeeId: 'EMP011',
    fullName: 'Isabella Martinez',
    designation: 'Marketing Specialist',
    locationUnit: 'Territory 3',
    hireDate: '2023-05-25',
    employmentStatus: 'Temporary'
  },
  {
    employeeId: 'EMP012',
    fullName: 'James Rodriguez',
    designation: 'Marketing Specialist',
    locationUnit: 'Territory 3',
    hireDate: '2023-08-14',
    employmentStatus: 'Temporary'
  }
]

const PositionMatrixTable = ({ designation }: PositionMatrixTableProps) => {
  // const router = useRouter()

  const columnHelper = createColumnHelper<EmployeeDetails>()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Map data to table format
  const tableData = useMemo(() => {
    const filteredData = EmployeeDetailsData.filter(
      item => item.designation.toLowerCase() === designation?.toLowerCase()
    )

    console.log('PositionMatrixTable: Table data updated', { data: filteredData, totalCount: filteredData.length })

    return {
      data: filteredData,
      totalCount: filteredData.length
    }
  }, [designation])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const columns = useMemo<ColumnDef<EmployeeDetails, any>[]>(
    () => [
      columnHelper.accessor('employeeId', {
        header: 'EMPLOYEE ID',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeId}</Typography>
      }),
      columnHelper.accessor('fullName', {
        header: 'FULL NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fullName}</Typography>
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designation}</Typography>
      }),
      columnHelper.accessor('locationUnit', {
        header: 'LOCATION UNIT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.locationUnit}</Typography>
      }),
      columnHelper.accessor('hireDate', {
        header: 'HIRE DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.hireDate ? row.original.hireDate.split('T')[0] : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('employmentStatus', {
        header: 'EMPLOYMENT STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employmentStatus}</Typography>
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {tableData.data.length === 0 && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No employee data found
          </Typography>
        </Box>
      )}
      <DynamicTable
        columns={columns}
        data={tableData.data}
        totalCount={tableData.totalCount}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableName='Position Matrix Table'
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
    </Box>
  )
}

export default PositionMatrixTable
