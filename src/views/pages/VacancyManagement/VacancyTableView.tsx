'use client'

import React, { useState, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Box, Typography, Chip, IconButton, Tooltip, Button } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import type { RootState } from '@/redux/store'
import type { VacancyManagementState, Vacancy } from '@/types/vacancyManagement'
import { updateVacancyStatus, fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import { ROUTES } from '@/utils/routes'
import { getUserId } from '@/utils/functions'

interface VacancyListingTableViewProps {
  tabMode: 'list' | 'request'
}

const VacancyListingTableView = ({ tabMode }: VacancyListingTableViewProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userId = getUserId()
  const searchParams = useSearchParams()

  // URL query params
  const initialParams = useMemo(
    () => ({
      designation: searchParams.get('designation') ? [searchParams.get('designation')!] : undefined,
      department: searchParams.get('department') ? [searchParams.get('department')!] : undefined,
      branch: searchParams.get('branch') ? [searchParams.get('branch')!] : undefined,
      cluster: searchParams.get('cluster') ? [searchParams.get('cluster')!] : undefined,
      area: searchParams.get('area') ? [searchParams.get('area')!] : undefined,
      region: searchParams.get('region') ? [searchParams.get('region')!] : undefined,
      zone: searchParams.get('zone') ? [searchParams.get('zone')!] : undefined,
      territory: searchParams.get('territory') ? [searchParams.get('territory')!] : undefined
    }),
    [searchParams]
  )

  // Redux selectors
  const { vacancyListData, vacancyListLoading, vacancyListFailureMessage, updateVacancyStatusLoading } = useAppSelector(
    (state: RootState) => state.vacancyManagementReducer
  ) as VacancyManagementState

  // Pagination state (0-based for table, 1-based for API)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const columnHelper = createColumnHelper<Vacancy>()

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: newPage
    }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({
      pageIndex: 0,
      pageSize: newPageSize
    })
  }

  const handlePageCountChange = (newPageCount: number) => {
    console.log('Page Count:', newPageCount)
  }

  // Check if current user is an approver with PENDING status
  const canApproveOrFreeze = (vacancy: Vacancy) => {
    return (
      vacancy.approvalStatus?.some(status => status.approverId === userId && status.approvalStatus === 'PENDING') ||
      false
    )
  }

  // Get IDs of all eligible PENDING vacancies for bulk actions
  const eligibleVacancyIds = useMemo(() => {
    return (vacancyListData?.data || []).filter(vacancy => canApproveOrFreeze(vacancy)).map(vacancy => vacancy.id)
  }, [vacancyListData, userId])

  // Handle bulk actions
  const handleBulkAction = (status: 'APPROVED' | 'FREEZED') => {
    if (!eligibleVacancyIds.length) return

    dispatch(updateVacancyStatus({ ids: eligibleVacancyIds, status }))
      .unwrap()
      .then(() => {
        toast.success(`All eligible vacancies ${status.toLowerCase()} successfully`, {
          position: 'top-right',
          autoClose: 3000
        })

        // Refresh data
        const params: {
          page: number
          limit: number
          search?: string
          status: 'PENDING' | 'APPROVED'
          designation?: string[]
          department?: string[]
          branch?: string[]
          cluster?: string[]
          area?: string[]
          region?: string[]
          zone?: string[]
          territory?: string[]
        } = {
          page: 1,
          limit: pagination.pageSize,
          status: tabMode === 'list' ? 'APPROVED' : 'PENDING',
          designation: initialParams.designation,
          department: initialParams.department,
          ...(initialParams.branch && { branch: initialParams.branch }),
          ...(initialParams.cluster && { cluster: initialParams.cluster }),
          ...(initialParams.area && { area: initialParams.area }),
          ...(initialParams.region && { region: initialParams.region }),
          ...(initialParams.zone && { zone: initialParams.zone }),
          ...(initialParams.territory && { territory: initialParams.territory })
        }

        dispatch(fetchVacancies(params))
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
      })
      .catch(err => {
        toast.error(`Failed to update vacancies: ${err}`, {
          position: 'top-right',
          autoClose: 3000
        })
      })
  }

  // Handle individual vacancy action
  const handleVacancyAction = (id: string, status: 'APPROVED' | 'FREEZED') => {
    dispatch(updateVacancyStatus({ ids: [id], status }))
      .unwrap()
      .then(() => {
        toast.success(`Vacancy ${status.toLowerCase()} successfully`, {
          position: 'top-right',
          autoClose: 3000
        })

        // Refresh data
        const params: {
          page: number
          limit: number
          search?: string
          status: 'PENDING' | 'APPROVED'
          designation?: string[]
          department?: string[]
          branch?: string[]
          cluster?: string[]
          area?: string[]
          region?: string[]
          zone?: string[]
          territory?: string[]
        } = {
          page: 1,
          limit: pagination.pageSize,
          status: tabMode === 'list' ? 'APPROVED' : 'PENDING',
          designation: initialParams.designation,
          department: initialParams.department,
          ...(initialParams.branch && { branch: initialParams.branch }),
          ...(initialParams.cluster && { cluster: initialParams.cluster }),
          ...(initialParams.area && { area: initialParams.area }),
          ...(initialParams.region && { region: initialParams.region }),
          ...(initialParams.zone && { zone: initialParams.zone }),
          ...(initialParams.territory && { territory: initialParams.territory })
        }

        dispatch(fetchVacancies(params))
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
      })
      .catch(err => {
        toast.error(`Failed to update vacancy: ${err}`, {
          position: 'top-right',
          autoClose: 3000
        })
      })
  }

  const columns = useMemo<ColumnDef<Vacancy, any>[]>(
    () => [
      columnHelper.accessor('jobTitle', {
        header: 'JOB TITLE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.jobTitle}
          </Typography>
        )
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.designation}
          </Typography>
        )
      }),
      columnHelper.accessor('jobRole', {
        header: 'JOB ROLE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.jobRole}
          </Typography>
        )
      }),
      columnHelper.accessor('openings', {
        header: 'OPENINGS',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.openings}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            size='small'
            variant='tonal'
            color={
              row.original.status === 'Open'
                ? 'success'
                : row.original.status === 'Closed'
                  ? 'error'
                  : row.original.status === 'Freeze'
                    ? 'info'
                    : 'default'
            }
            sx={{ ml: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
          />
        )
      }),
      columnHelper.accessor('campusOrLateral', {
        header: 'CAMPUS/LATERAL',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.campusOrLateral}
          </Typography>
        )
      }),
      columnHelper.accessor('employeeCategory', {
        header: 'EMPLOYEE CATEGORY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.employeeCategory}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton
                onClick={() =>
                  router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_LIST_VIEW_DETAIL(row.original.id))
                }
              >
                <VisibilityIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {tabMode === 'request' && canApproveOrFreeze(row.original) && (
              <>
                <Tooltip title='Approve' placement='top'>
                  <IconButton
                    color='success'
                    onClick={() => handleVacancyAction(row.original.id, 'APPROVED')}
                    disabled={updateVacancyStatusLoading}
                    sx={{ '&:hover': { bgcolor: 'success.light' } }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Freeze' placement='top'>
                  <IconButton
                    color='info'
                    onClick={() => handleVacancyAction(row.original.id, 'FREEZED')}
                    disabled={updateVacancyStatusLoading}
                    sx={{ '&:hover': { bgcolor: 'info.light' } }}
                  >
                    <PauseCircleOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('employeeType', {
        header: 'EMPLOYEE TYPE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.employeeType}
          </Typography>
        )
      }),
      columnHelper.accessor('hiringManager', {
        header: 'HIRING MANAGER',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.hiringManager}
          </Typography>
        )
      }),
      columnHelper.accessor('startingDate', {
        header: 'START DATE',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={`${row.original.startingDate.split('T')[0]}`}
            color='success'
            size='medium'
            sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 103 }}
          />
        )
      }),
      columnHelper.accessor('closingDate', {
        header: 'CLOSE DATE',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={`${row.original.closingDate.split('T')[0]}`}
            color='error'
            size='medium'
            sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 105 }}
          />
        )
      }),
      columnHelper.accessor('company', {
        header: 'COMPANY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.company}
          </Typography>
        )
      }),
      columnHelper.accessor('businessUnit', {
        header: 'BUSINESS UNIT',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.businessUnit}
          </Typography>
        )
      }),
      columnHelper.accessor('department', {
        header: 'DEPARTMENT',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.department}
          </Typography>
        )
      }),
      columnHelper.accessor('territory', {
        header: 'TERRITORY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.territory}
          </Typography>
        )
      }),
      columnHelper.accessor('zone', {
        header: 'ZONE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.zone}
          </Typography>
        )
      }),
      columnHelper.accessor('region', {
        header: 'REGION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.region}
          </Typography>
        )
      }),
      columnHelper.accessor('area', {
        header: 'AREA',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.area}
          </Typography>
        )
      }),
      columnHelper.accessor('cluster', {
        header: 'CLUSTER',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.cluster}
          </Typography>
        )
      }),
      columnHelper.accessor('branch', {
        header: 'BRANCH',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.branch}
          </Typography>
        )
      }),
      columnHelper.accessor('branchCode', {
        header: 'BRANCH CODE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.branchCode}
          </Typography>
        )
      }),
      columnHelper.accessor('city', {
        header: 'CITY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.city}
          </Typography>
        )
      }),
      columnHelper.accessor('state', {
        header: 'STATE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.state}
          </Typography>
        )
      }),
      columnHelper.accessor('origin', {
        header: 'ORIGIN',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.origin}
          </Typography>
        )
      })
    ],
    [userId]
  )

  return (
    <Box>
      <ToastContainer position='top-right' autoClose={3000} />
      {tabMode === 'request' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
          <Button
            variant='outlined'
            color='success'
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => handleBulkAction('APPROVED')}
            disabled={!eligibleVacancyIds.length || updateVacancyStatusLoading}
            sx={{
              borderColor: 'success.main',
              color: 'success.main',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'success.main' }
            }}
          >
            Approve All
          </Button>
          <Button
            variant='outlined'
            color='info'
            startIcon={<PauseCircleOutlineIcon />}
            onClick={() => handleBulkAction('FREEZED')}
            disabled={!eligibleVacancyIds.length || updateVacancyStatusLoading}
            sx={{
              borderColor: 'info.main',
              color: 'info.main',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'info.main' }
            }}
          >
            Freeze All
          </Button>
        </Box>
      )}
      {vacancyListLoading && <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading...</Typography>}
      {vacancyListFailureMessage && (
        <Typography sx={{ mt: 2, textAlign: 'center', color: 'error.main' }}>No record is found</Typography>
      )}
      {!vacancyListLoading &&
      !vacancyListFailureMessage &&
      (!vacancyListData?.data || vacancyListData?.data?.length === 0) ? (
        <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>No record is found</Typography>
      ) : (
        !vacancyListLoading &&
        !vacancyListFailureMessage && (
          <DynamicTable
            columns={columns}
            data={vacancyListData?.data || []}
            totalCount={vacancyListData?.totalCount}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageCountChange={handlePageCountChange}
            tableName='Vacancy Listing Table'
            sorting={null}
            onSortingChange={undefined}
            isRowCheckbox={false}
            initialState={undefined}
          />
        )
      )}
    </Box>
  )
}

export default VacancyListingTableView
