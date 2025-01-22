import DynamicTable from '@/components/Table/dynamicTable'
import { IconButton, Tooltip, Typography } from '@mui/material'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'

const RecruitmentListTableView = ({ designationData }: any) => {
  const router = useRouter()
  const columnHelper = createColumnHelper<any>()
  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('requestType', {
        header: 'REQUEST TYPE',
        cell: ({ row }) => {
          // console.log('row', row)
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.requestType}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('department', {
        header: 'DEPARTMENT',
        cell: ({ row }) => {
          // console.log('row', row)
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.department}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('branch', {
        header: 'BRANCH',
        cell: ({ row }) => {
          // console.log('row', row)
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.branch}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('bubble_positions', {
        header: 'BUBBLE POSITIONS',
        cell: ({ row }) => {
          // console.log('row', row)
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.bubblePositionsCount}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('band', {
        header: 'BAND',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {/* {row.original.band} */} B1
                </Typography>
              </div>
            </div>
          )
        }
      }),
      columnHelper.accessor('grade', {
        header: 'GRADE',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {/* {row.original.grade} */} G1
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('action', {
        header: 'Action',
        meta: {
          className: 'sticky right-0'
        },
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push('/recruitment-management/view/123')}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit' placement='top'>
              <IconButton
              // onClick={() => handleEditUserClick(row.original.id)}
              >
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Approve' placement='top'>
              <IconButton>
                <i className='tabler-check text-green-500'></i>
              </IconButton>
            </Tooltip>
            <Tooltip title='Reject' placement='top'>
              <IconButton>
                <i className='tabler-x text-red-500'></i>
              </IconButton>
            </Tooltip>

            {/* <IconButton onClick={() => deleteUser(row.original)}>
              <i className='tabler-trash' />
            </IconButton> */}
          </div>
        ),
        enableSorting: false
      })
    ],
    []
  )

  return (
    <div>
      <DynamicTable columns={columns} data={designationData} />
    </div>
  )
}

export default RecruitmentListTableView
