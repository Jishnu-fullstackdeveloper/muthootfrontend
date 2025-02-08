import DynamicTable from '@/components/Table/dynamicTable'
import { IconButton, Tooltip, Typography } from '@mui/material'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import { submitRequestDecision } from '@/redux/RecruitmentResignationSlice'
import { getAccessToken, decodeToken } from '@/utils/functions'
import { useAppDispatch } from '@/lib/hooks'
import { isAdmin } from '@/utils/functions'

const RecruitmentListTableView = ({ designationData }: any) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const getApproverId = () => {
    const token = getAccessToken()
    if (!token) return null

    const decodedToken = decodeToken(token)
    return decodedToken?.sub
  }

  const handleApprove = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const approverId = getApproverId()
      if (!approverId) throw new Error('No approver ID found')

      // Find the row data from designationData using id
      const rowData = designationData.find((row: any) => row.id === id)
      if (!rowData?.approval_id) throw new Error('No approval ID found')

      await dispatch(
        submitRequestDecision({
          id: rowData.approval_id, // Using approval_id from table data
          approvalStatus: 'APPROVED',
          approverId
        })
      ).unwrap()
      router.push('/recruitment-management/overview')
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleReject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const approverId = getApproverId()
      if (!approverId) throw new Error('No approver ID found')

      // Find the row data from designationData using id
      const rowData = designationData.find((row: any) => row.id === id)
      if (!rowData?.approval_id) throw new Error('No approval ID found')

      await dispatch(
        submitRequestDecision({
          id: rowData.approval_id, // Using approval_id from table data
          approvalStatus: 'REJECTED',
          approverId
        })
      ).unwrap()
      router.push('/recruitment-management/overview')
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const columnHelper = createColumnHelper<any>()
  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('requestType', {
        header: 'REQUEST TYPE',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.origin}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('department', {
        header: 'DEPARTMENT',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.Department}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('branch', {
        header: 'BRANCH',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.Branches}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor('bubble_positions', {
        header: 'BUBBLE POSITIONS',
        cell: ({ row }) => {
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
                  {row.original.Grade}
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
              <IconButton onClick={() => router.push(`/recruitment-management/view/${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>
            {/* <Tooltip title='Edit' placement='top'>
              <IconButton
              // onClick={() => handleEditUserClick(row.original.id)}
              >
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip> */}

            {isAdmin() ? (
              <>
                <Tooltip title='Approve' placement='top'>
                  <IconButton onClick={e => handleApprove(row.original.id, e)}>
                    <i className='tabler-check text-green-500'></i>
                  </IconButton>
                </Tooltip>
                <Tooltip title='Reject' placement='top'>
                  <IconButton onClick={e => handleReject(row.original.id, e)}>
                    <i className='tabler-x text-red-500'></i>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Typography
                color={row.original.status === 'APPROVED' ? 'success.main' : 'error.main'}
                className='font-medium'
              >
                {row.original.status}
              </Typography>
            )}

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
