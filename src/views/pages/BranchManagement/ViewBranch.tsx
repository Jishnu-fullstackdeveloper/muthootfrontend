/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  Typography,
  Divider,
  Tab,
  Tabs,
  Grid,
  Button,
  Chip,
  ListItem,
  List,
  ListItemText
} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getBranchDetails, getEmployeeDetailsWithBranchId } from '@/redux/BranchManagementSlice'
import type { RootState } from '@/redux/store'
import DynamicTable from '@/components/Table/dynamicTable'
import type { ViewBranchProps, BranchManagementState, EmployeeDetails } from '@/types/branch'
import { EmployeeListResponse } from '@/types/branch'

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
    employeeListData
  } = useAppSelector((state: RootState) => state.branchManagementReducer) as BranchManagementState

  // Data
  const bubblePositionData = useMemo(
    () => [
      {
        position: 'Branch Manager',
        actualCount: 2,
        requiredCount: 1,
        employees: [
          { name: 'John Doe', employeeCode: 'EMP001', joiningDate: '2023-01-15' },
          { name: 'Jane Smith', employeeCode: 'EMP002', joiningDate: '2023-02-01' }
        ]
      },
      {
        position: 'Sales Executive',
        actualCount: 3,
        requiredCount: 2,
        employees: [
          { name: 'Mike Johnson', employeeCode: 'EMP003', joiningDate: '2023-03-10' },
          { name: 'Sarah Williams', employeeCode: 'EMP004', joiningDate: '2023-03-15' },
          { name: 'Robert Brown', employeeCode: 'EMP005', joiningDate: '2023-04-01' }
        ]
      }
    ],
    []
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
  }, [dispatch, id, pagination.pageIndex, pagination.pageSize])

  if (branchDetailsLoading) return <div>Loading branch details...</div>
  if (branchDetailsFailure) return <div>Error: {branchDetailsFailureMessage}</div>

  const branchData = branchDetailsData || {
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
          <Box>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Bubble Positions Overview
            </Typography>
            {bubblePositionData.map((position, index) => (
              <Card key={index} sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant='h6' color='primary'>
                        {position.position}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, backgroundColor: '#e3f2fd', p: '8px 16px', borderRadius: 8 }}>
                        <Typography>
                          <strong>Required:</strong> {position.requiredCount}
                        </Typography>
                        <Typography>
                          <strong>Actual:</strong> {position.actualCount}
                        </Typography>
                        <Typography color='error'>
                          <strong>Excess:</strong> {position.actualCount - position.requiredCount}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' sx={{ mb: 2 }}>
                      Assigned Employees:
                    </Typography>
                    <Grid container spacing={2}>
                      {position.employees.map((employee, empIndex) => (
                        <Grid key={empIndex} item xs={12} md={4}>
                          <Card sx={{ p: 2, backgroundColor: '#ffffff' }}>
                            <Typography variant='subtitle1'>{employee.name}</Typography>
                            <Typography variant='body2' color='textSecondary'>
                              Employee ID: {employee.employeeCode}
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                              Joining Date: {employee.joiningDate}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            <Typography variant='h6' sx={{ mb: 3, fontWeight: 'bold', color: '#2e7d32' }}>
              Bucket Management Overview
            </Typography>
            <Card sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, boxShadow: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant='body1' sx={{ fontWeight: '500', color: '#333' }}>
                  <strong>Bucket Name:</strong> {branchData?.bucket?.name || 'N/A'}
                </Typography>
                <Typography variant='body1' sx={{ fontWeight: '500', color: '#333' }}>
                  <strong>Total Position Categories:</strong>{' '}
                  {branchData.bucket?.positionCategories.reduce((sum, category) => sum + category.count, 0) || 0}
                </Typography>

                {/* Position Categories List */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant='subtitle1' sx={{ fontWeight: '600', mb: 1, color: '#1976d2' }}>
                    Position Categories
                  </Typography>
                  <List
                    sx={{ p: 0, backgroundColor: '#fff', borderRadius: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                  >
                    {branchData.bucket?.positionCategories.map((category, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          borderBottom:
                            index < (branchData.bucket?.positionCategories.length || 0) - 1 ? '1px solid #eee' : 'none',
                          py: 1.5,
                          '&:hover': { backgroundColor: '#f5f5f5', transition: 'background-color 0.3s ease' }
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant='body2' sx={{ fontWeight: '500', color: '#444' }}>
                                {category.designationName}
                              </Typography>
                            }
                            secondary={
                              <Typography variant='caption' sx={{ color: '#666' }}>
                                Grade: {category.grade}
                              </Typography>
                            }
                          />
                          <Chip
                            label={category.count}
                            color='primary'
                            size='small'
                            sx={{
                              backgroundColor: '#1976d2',
                              color: '#fff',
                              fontWeight: '600',
                              borderRadius: 1,
                              height: 24,
                              '&:hover': { backgroundColor: '#1565c0' }
                            }}
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                  {(!branchData.bucket?.positionCategories || branchData.bucket.positionCategories.length === 0) && (
                    <Typography variant='body2' sx={{ textAlign: 'center', color: '#777', p: 2 }}>
                      No position categories available.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Card>
          </Box>
        )}
        {activeTab === 3 && (
          <Box>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Vacancy Management Overview
            </Typography>
            <Card sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant='body1'>
                <strong>Position:</strong> Sales Executive
              </Typography>
              <Typography variant='body1'>
                <strong>Vacancies:</strong> 2
              </Typography>
              <Typography variant='body1'>
                <strong>Applications Received:</strong> 5
              </Typography>
              <Typography variant='body1' color='error'>
                <strong>Open Vacancies:</strong> {2 - 5}
              </Typography>
            </Card>
          </Box>
        )}
      </Card>
    </Box>
  )
}

export default ViewBranch
