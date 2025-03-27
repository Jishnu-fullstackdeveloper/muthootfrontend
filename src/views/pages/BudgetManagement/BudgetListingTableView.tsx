// BudgetListingTableView.tsx
'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { Box, IconButton, Typography } from '@mui/material'
import { Chip } from '@mui/material'

// Components and Utils
import DynamicTable from '@/components/Table/dynamicTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

// Next Imports
import { useRouter } from 'next/navigation'

// Types
type BudgetData = {
  id: number
  jobTitle: string
  noOfOpenings: number
  grade: string
  designation: string
  businessRole: string
  experienceMin: number
  experienceMax: number
  campusLateral: string
  employeeCategory: string
  employeeType: string
  hiringManager: string
  startDate: string
  closingDate: string
  company: string
  businessUnit: string
  department: string
  territory: string
  zone: string
  region: string
  area: string
  cluster: string
  branch: string
  branchCode: string
  cityClassification: string
  state: string
  budgetDepartment: string
  position: string
  count: number
  yearOfBudget: string
  status: string
}

type PaginationState = {
  pageIndex: number
  pageSize: number
  display_numbers_count: number
}

type BudgetListingTableViewProps = {
  data: BudgetData[]
  totalCount: number
  pagination: PaginationState
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
}

// Define column helper
const columnHelper = createColumnHelper<BudgetData>()

const BudgetListingTableView = ({
  data,
  totalCount,
  pagination,
  onPageChange,
  onRowsPerPageChange
}: BudgetListingTableViewProps) => {
  const router = useRouter()

  // Define columns for DynamicTable
  const columns = [
    columnHelper.accessor('jobTitle', {
      header: 'JOB TITLE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.jobTitle}
        </Typography>
      )
    }),
    columnHelper.accessor('noOfOpenings', {
      header: 'NO. OF OPENINGS',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.noOfOpenings}
        </Typography>
      )
    }),
    columnHelper.accessor('grade', {
      header: 'GRADE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.grade}
        </Typography>
      )
    }),
    columnHelper.accessor('designation', {
      header: 'DESIGNATION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.designation}
        </Typography>
      )
    }),
    columnHelper.accessor('businessRole', {
      header: 'BUSINESS ROLE',
      cell: ({ row, getValue }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {getValue()}
        </Typography>
      )
    }),
    columnHelper.accessor('experienceMin', {
      id: 'experience',
      header: 'EXPERIENCE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {`${row.original.experienceMin} - ${row.original.experienceMax} years`}
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
    }),
    columnHelper.accessor('campusLateral', {
      header: 'CAMPUS / LATERAL',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.campusLateral}
        </Typography>
      )
    }),
    columnHelper.accessor('employeeCategory', {
      header: 'EMPLOYEE CATEGORY',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.employeeCategory}
        </Typography>
      )
    }),
    columnHelper.accessor('employeeType', {
      header: 'EMPLOYEE TYPE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.employeeType}
        </Typography>
      )
    }),
    columnHelper.accessor('hiringManager', {
      header: 'HIRING MANAGER',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.hiringManager}
        </Typography>
      )
    }),
    columnHelper.accessor('startDate', {
      header: 'START DATE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.startDate}
        </Typography>
      )
    }),
    columnHelper.accessor('closingDate', {
      header: 'CLOSING DATE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.closingDate}
        </Typography>
      )
    }),
    columnHelper.accessor('company', {
      header: 'COMPANY',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.company}
        </Typography>
      )
    }),
    columnHelper.accessor('businessUnit', {
      header: 'BUSINESS UNIT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.businessUnit}
        </Typography>
      )
    }),
    columnHelper.accessor('department', {
      header: 'DEPARTMENT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.department}
        </Typography>
      )
    }),
    columnHelper.accessor('territory', {
      header: 'TERRITORY',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.territory}
        </Typography>
      )
    }),
    columnHelper.accessor('zone', {
      header: 'ZONE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.zone}
        </Typography>
      )
    }),
    columnHelper.accessor('region', {
      header: 'REGION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.region}
        </Typography>
      )
    }),
    columnHelper.accessor('area', {
      header: 'AREA',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.area}
        </Typography>
      )
    }),
    columnHelper.accessor('cluster', {
      header: 'CLUSTER',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.cluster}
        </Typography>
      )
    }),
    columnHelper.accessor('branch', {
      header: 'BRANCH',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.branch}
        </Typography>
      )
    }),
    columnHelper.accessor('branchCode', {
      header: 'BRANCH CODE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.branchCode}
        </Typography>
      )
    }),
    columnHelper.accessor('cityClassification', {
      header: 'CITY CLASSIFICATION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.cityClassification}
        </Typography>
      )
    }),
    columnHelper.accessor('state', {
      header: 'STATE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.state}
        </Typography>
      )
    }),
    columnHelper.accessor('budgetDepartment', {
      header: 'BUDGET DEPARTMENT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.budgetDepartment}
        </Typography>
      )
    }),
    columnHelper.accessor('position', {
      header: 'POSITION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.position}
        </Typography>
      )
    }),
    columnHelper.accessor('count', {
      header: 'COUNT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.count}
        </Typography>
      )
    }),
    columnHelper.accessor('yearOfBudget', {
      header: 'YEAR OF BUDGET',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.yearOfBudget}
        </Typography>
      )
    }),
    columnHelper.accessor('status', {
      header: 'STATUS',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={row.original.status === 'Approve' ? 'success' : row.original.status === 'Reject' ? 'error' : 'warning'}
          size='small'
          sx={{
            bgcolor:
              row.original.status === 'Approve'
                ? 'success.light'
                : row.original.status === 'Reject'
                  ? 'error.light'
                  : 'warning.light',
            color: 'white',
            fontWeight: 'medium'
          }}
        />
      )
    })
  ]

  return (
    <Box sx={{ mt: 6 }}>
      <DynamicTable
        columns={columns}
        data={data}
        totalCount={totalCount}
        pagination={pagination}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        tableName='Budget Request List'
      />
    </Box>
  )
}

export default BudgetListingTableView
