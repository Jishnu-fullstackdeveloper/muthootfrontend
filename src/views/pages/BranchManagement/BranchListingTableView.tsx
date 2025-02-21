import React, { useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography } from '@mui/material'
import type { ColumnDef} from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'

const BranchListingTableView = ({ branchData }: any) => {
  const router = useRouter()
  const columnHelper = createColumnHelper<any>()

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'BRANCH NAME',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('branchCode', {
        header: 'BRANCH CODE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.branchCode}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('territory', {
        header: 'TERRITORY',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.territory}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('zonal', {
        header: 'ZONAL',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.zonal}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('region', {
        header: 'REGION',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.region}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('area', {
        header: 'AREA',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.area}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('cluster', {
        header: 'CLUSTER',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.cluster}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('cityClassification', {
        header: 'CITY CLASSIFICATION',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.cityClassification}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('state', {
        header: 'STATE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.state}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.status}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: {
          className: 'sticky right-0'
        },
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/branch-management/view/${row.original.id}`)}>
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
      <DynamicTable columns={columns} data={branchData} />
    </div>
  )
}

export default BranchListingTableView
