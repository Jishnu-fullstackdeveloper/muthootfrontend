import React, { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import { getBranchList } from '@/redux/BranchManagement/BranchManagementSlice'
import { useAppDispatch } from '@/lib/hooks'

interface Branch {
  id: string
  name: string
  branchCode: string
  turnoverCode: string
  bucketName: string
  branchStatus: string
  areaId: string
  districtId: string
  stateId: string
  createdAt: string
  updatedAt: string
  branchData: any
  bucket: {
    id: string
    name: string
    positionCategories: {
      designationName: string
      count: number
      grade: string
    }[]
    turnoverCode: string
    notes: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  cluster: {
    name: any
    area?: {
      name?: any
      region?: {
        name?: any
        zone?: {
          name?: any
          territory?: {
            name?: any
          }
        }
      }
    }
  }
  area: {
    id: string
    name: string
    regionId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  district: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  state: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  data: any
  totalCount: any
}

type BranchData = Branch

const BranchListingTableView = ({ branchData }: { branchData: BranchData }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const columnHelper = createColumnHelper<Branch>()

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  useEffect(() => {
    dispatch(
      getBranchList({
        page: pagination.pageIndex + 1, // API uses 1-based indexing
        limit: pagination.pageSize
      })
    )
  }, [dispatch, pagination.pageIndex, pagination.pageSize])

  const columns = useMemo<ColumnDef<Branch, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'BRANCH NAME',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.name}
          </Typography>
        )
      }),

      columnHelper.accessor('branchCode', {
        header: 'BRANCH CODE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original?.branchCode}
          </Typography>
        )
      }),

      columnHelper.accessor('area.regionId', {
        id: 'territory', // Use a custom ID to match the expected header name
        header: 'TERRITORY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.cluster?.area?.region?.zone?.territory?.name}
          </Typography>
        )
      }),

      columnHelper.accessor('area.name', {
        id: 'zonal', // Use a custom ID to match the expected header name
        header: 'ZONAL',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.cluster?.area?.region?.zone?.name}
          </Typography>
        )
      }),

      columnHelper.accessor('area.regionId', {
        id: 'region', // Use a custom ID to match the expected header name
        header: 'REGION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.cluster?.area?.region?.name}
          </Typography>
        )
      }),

      columnHelper.accessor('area.name', {
        id: 'area', // Use a custom ID to match the expected header name
        header: 'AREA',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.cluster?.area?.name}
          </Typography>
        )
      }),

      columnHelper.accessor('bucket.name', {
        id: 'cluster', // Use a custom ID to match the expected header name
        header: 'CLUSTER',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.cluster?.name}
          </Typography>
        )
      }),

      columnHelper.accessor('district.name', {
        id: 'cityClassification', // Use a custom ID to match the expected header name
        header: 'CITY CLASSIFICATION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.district?.name}
          </Typography>
        )
      }),

      columnHelper.accessor('state.name', {
        id: 'state', // Use a custom ID to match the expected header name
        header: 'STATE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.state?.name}
          </Typography>
        )
      }),

      columnHelper.accessor('branchStatus', {
        id: 'status', // Use a custom ID to match the expected header name
        header: 'STATUS',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.branchStatus}
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
          <div className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/branch-management/view/employee-details?id=${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>

            {/* <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/branch-management/edit/${row.original.id}`)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete' placement='top'>
              <IconButton>
                <i className='tabler-trash text-red-500'></i>
              </IconButton>
            </Tooltip> */}
          </div>
        ),
        enableSorting: false
      })
    ],
    []
  )

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={branchData?.data}
        totalCount={branchData?.totalCount}
        pagination={pagination} // Pass pagination state
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
      {/* Removed the duplicate DynamicTable call to avoid redundancy */}
    </div>
  )
}

export default BranchListingTableView
