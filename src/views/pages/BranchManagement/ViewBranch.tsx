/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, Typography, Divider, Tab, Tabs, Grid, Button } from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  getBranchDetails,
  getEmployeeDetailsWithBranchId,
  fetchBubblePositions,
  fetchVacancies
} from '@/redux/BranchManagementSlice'
import type { RootState } from '@/redux/store'
import DynamicTable from '@/components/Table/dynamicTable'
import type { ViewBranchProps, BranchManagementState, EmployeeDetails } from '@/types/branch'
import { EmployeeListResponse } from '@/types/branch'

import BubblePositionsOverview from '@/views/branch/components/BubblePositionsOverview'
import BucketManagementOverview from '@/views/branch/components/BucketManagementOverview'
import VacancyManagementOverview from '@/views/branch/components/VacancyManagementOverview'

const tabMapping: { [key: string]: number } = {
  'employees-details': 0,
  'bubble-positions': 1,
  'bucket-management': 2,
  'vacancy-management': 3
}

const ViewBranch: React.FC<ViewBranchProps> = ({ mode, id, branchTab }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<number>(tabMapping[branchTab] || 0)

  console.log(mode)

  const {
    branchDetailsData,
    branchDetailsLoading,
    branchDetailsFailure,
    branchDetailsFailureMessage,
    employeeListData,
    fetchBubblePositionsData,
    fetchBubblePositionsLoading,
    fetchBubblePositionsFailure,
    fetchBubblePositionsFailureMessage,
    fetchVacanciesData,
    fetchVacanciesLoading,
    fetchVacanciesFailure,
    fetchVacanciesFailureMessage
  } = useAppSelector((state: RootState) => state.branchManagementReducer) as BranchManagementState

  // Data
  const bubblePositionData = useMemo(
    () =>
      fetchBubblePositionsData?.data
        ?.filter(item => item.designations) // Filter out the branchId item
        .map(item => ({
          position: item.designations,
          actualCount: item.count,
          requiredCount: 0, // Placeholder, adjust if requiredCount is available in the future
          employees: [] // Placeholder, adjust if employee data is available
        })) || [],
    [fetchBubblePositionsData]
  )

  const employeeData: EmployeeDetails[] = employeeListData?.data || []
  const totalCount: number = employeeListData?.totalCount || 0

  const columnHelper = createColumnHelper<EmployeeDetails>()

  const columns = useMemo<ColumnDef<EmployeeDetails, any>[]>(
    () => [
      columnHelper.accessor('employeeCode', {
        header: 'ID',
        cell: info => (
          <Typography color='text.primary' className='font-medium'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: info => (
          <Typography color='text.primary' className='font-medium'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: info => (
          <Typography color='text.primary' className='font-medium'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('personalEmailAddress', {
        header: 'Email',
        cell: info => (
          <Typography color='text.primary' className='font-medium'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('designation.name', {
        header: 'Designation',
        cell: info => (
          <Typography color='text.primary' className='font-medium'>
            {info.getValue() || 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('resignedEmployeeId', {
        header: 'Status',
        cell: info => (
          <Typography color={info.getValue() ? 'error.main' : 'success.main'} className='font-medium'>
            {info.getValue() ? 'Resigned' : 'Active'}
          </Typography>
        )
      })
    ],
    []
  )

  const actionButtons = useMemo(
    () => [
      {
        icon: <i className='tabler-eye' style={{ fontSize: 18 }} />,
        onClick: (rowData: any) => router.push(`/employee-details?employeeId=${rowData.employeeCode}`),
        tooltip: 'View Details'
      }
    ],
    [router]
  )

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

  // Combined pagination handler
  const handlePaginationChange = (key: 'pageIndex' | 'pageSize', value: number) => {
    setPagination(prev => ({
      ...prev,
      [key]: key === 'pageIndex' ? value : value,
      pageIndex: key === 'pageSize' ? 0 : prev.pageIndex // Reset pageIndex when pageSize changes
    }))
  }

  const handlePageChange = (newPage: number) => {
    console.log(employeeListData)
    handlePaginationChange('pageIndex', newPage)
  }

  const handleRowsPerPageChange = (newPageSize: number) => handlePaginationChange('pageSize', newPageSize)

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    const paths = ['employees-details', 'bubble-positions', 'bucket-management', 'vacancy-management']

    router.push(`${paths[newValue]}?id=${id}`)
  }

  useEffect(() => {
    dispatch(getBranchDetails({ id }))
    dispatch(
      getEmployeeDetailsWithBranchId({ branchId: id, page: pagination.pageIndex + 1, limit: pagination.pageSize })
    )
    dispatch(fetchBubblePositions({ branchId: id }))
    dispatch(fetchVacancies({ branchId: id }))
  }, [dispatch, id, pagination.pageIndex, pagination.pageSize])

  if (branchDetailsLoading) return <div>Loading branch details...</div>
  if (branchDetailsFailure) return <div>Error: {branchDetailsFailureMessage}</div>

  const branchData = branchDetailsData?.data || {
    id: '',
    name: '',
    branchCode: '',
    turnoverCode: '',
    bucketName: '',
    branchStatus: '',
    areaId: '',
    districtId: '',
    stateId: '',
    createdAt: '',
    updatedAt: '',
    bucket: {
      id: '',
      name: '',
      positionCategories: [],
      turnoverCode: '',
      notes: '',
      createdAt: '',
      updatedAt: '',
      deletedAt: null
    },
    area: { id: '', name: '', regionId: '', createdAt: '', updatedAt: '', deletedAt: null },
    district: { id: '', name: '', createdAt: '', updatedAt: '', deletedAt: null },
    state: { id: '', name: '', createdAt: '', updatedAt: '', deletedAt: null }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid className='flex justify-between' item xs={12}>
            <Typography variant='h5'>Branch Details</Typography>
            <Button
              className='mr-2'
              variant='contained'
              color='primary'
              startIcon={<AssessmentIcon />}
              onClick={() => router.push('/branch-management/budget-report')}
            >
              Branch Report Dashboard
            </Button>
          </Grid>
          <Grid className='flex justify-between' item xs={6}>
            {/* Action buttons commented out */}
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>ID:</strong> {branchData.id}
            </Typography>
            <Typography variant='body1'>
              <strong>Name:</strong> {branchData.name}
            </Typography>
            <Typography variant='body1'>
              <strong>Branch Code:</strong> {branchData.branchCode}
            </Typography>
            <Typography variant='body1'>
              <strong>Territory:</strong> {branchData.area?.regionId || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>Zonal:</strong> {branchData.area?.name || 'N/A'}
            </Typography>
            <Typography variant='body1'>
              <strong>Region:</strong> {branchData.area?.regionId || 'N/A'}
            </Typography>
            <Typography variant='body1'>
              <strong>Area:</strong> {branchData.area?.name || 'N/A'}
            </Typography>
            <Typography variant='body1'>
              <strong>Cluster:</strong> {branchData?.bucket?.name || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>City Classification:</strong> {branchData?.district?.name || 'N/A'}
            </Typography>
            <Typography variant='body1'>
              <strong>State:</strong> {branchData.state?.name || 'N/A'}
            </Typography>
            <Typography variant='body1'>
              <strong>Turnover Code:</strong> {branchData.turnoverCode}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor='primary' indicatorColor='primary'>
          <Tab label='Employees Details' />
          <Tab label='Bubble Position' />
          <Tab label='Bucket Management' />
          <Tab label='Vacancy Management' />
        </Tabs>
        <Divider sx={{ my: 3 }} />

        {activeTab === 0 &&
          (employeeData.length === 0 ? (
            <Typography variant='body1' sx={{ textAlign: 'center', p: 4 }}>
              No employees found for this branch.
            </Typography>
          ) : (
            <DynamicTable
              columns={columns}
              data={employeeData}
              totalCount={totalCount}
              pagination={{ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          ))}
        {activeTab === 1 && (
          <BubblePositionsOverview
            bubblePositionData={bubblePositionData}
            loading={fetchBubblePositionsLoading}
            failure={fetchBubblePositionsFailure}
            failureMessage={fetchBubblePositionsFailureMessage}
          />
        )}
        {activeTab === 2 && <BucketManagementOverview branchData={branchData} />}
        {activeTab === 3 && (
          <VacancyManagementOverview
            vacanciesData={fetchVacanciesData?.data || []}
            loading={fetchVacanciesLoading}
            failure={fetchVacanciesFailure}
            failureMessage={fetchVacanciesFailureMessage}
          />
        )}
      </Card>
    </Box>
  )
}

export default ViewBranch
