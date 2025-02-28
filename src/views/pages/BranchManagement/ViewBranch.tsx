/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, Typography, Divider, Tab, Tabs, Grid, Button } from '@mui/material'

// import ListAltIcon from '@mui/icons-material/ListAlt'
// import WorkIcon from '@mui/icons-material/Work'
import AssessmentIcon from '@mui/icons-material/Assessment'

import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import CustomTable from '@/components/Table/CustomTable'
import sampleEmployeeData from '@/utils/sampleData/sampleEmployeeData.json'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getBranchDetails, getEmployeeDetailsWithBranchId } from '@/redux/BranchManagementSlice'
import type { RootState } from '@/redux/store'
import DynamicTable from '@/components/Table/dynamicTable'

interface ViewBranchProps {
  mode: string
  id: string
  branchTab: string
}

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
}

interface BranchDetailsResponse {
  status: string
  message: string
  data: Branch
}

interface Employee {
  id: string
  employeeCode: string
  title: string
  firstName: string
  middleName: string
  lastName: string
  officeEmailAddress: string
  personalEmailAddress: string
  mobileNumber: string
  businessUnitId: string
  resignedEmployeeId: string | null
  departmentId: string
  gradeId: string
  bandId: string
  designationId: string
  employeeDetails: {
    position: string
    experience: string
  }
  companyStructure: {
    structure: string
  }
  managementHierarchy: {
    hierarchy: string
  }
  payrollDetails: {
    tax: string
    salary: string
  }
  address: {
    city: string
    street: string
    country: string
  }
  emergencyContact: {
    name: string
    contact: string
    relation: string
  }
  experienceDetails: {
    previousCompany: string
    yearsOfExperience: number
  }
  personalDetails: {
    dob: string
    nationality: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  band: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  businessUnit: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  grade: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  designation: {
    id: string
    name: string
    departmentId: string
    type: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  department: {
    id: string
    name: string
    employeeCategoryTypeId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

interface BranchManagementState {
  branchDetailsData: Branch | null
  branchDetailsLoading: boolean
  branchDetailsSuccess: boolean
  branchDetailsFailure: boolean
  branchDetailsFailureMessage: string
  employeeListData: EmployeeListResponse | null // Updated to store the full API response
}

interface EmployeeDetails {
  id: string
  employeeCode: string
  title: string
  firstName: string
  middleName: string
  lastName: string
  officeEmailAddress: string
  personalEmailAddress: string
  mobileNumber: string
  businessUnitId: string
  resignedEmployeeId: string | null
  departmentId: string
  gradeId: string
  bandId: string
  designationId: string
  employeeDetails: {
    position: string
    experience: string
  }
  companyStructure: {
    structure: string
  }
  managementHierarchy: {
    hierarchy: string
  }
  payrollDetails: {
    tax: string
    salary: string
  }
  address: {
    city: string
    street: string
    country: string
  }
  emergencyContact: {
    name: string
    contact: string
    relation: string
  }
  experienceDetails: {
    previousCompany: string
    yearsOfExperience: number
  }
  personalDetails: {
    dob: string
    nationality: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  band: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  businessUnit: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  grade: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  designation: {
    id: string
    name: string
    departmentId: string
    type: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  department: {
    id: string
    name: string
    employeeCategoryTypeId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

interface EmployeeListResponse {
  status: string
  message: string
  totalCount: number
  data: EmployeeDetails[]
  page: number
  limit: number
}

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

  // Fetch branch data from Redux store
  const {
    branchDetailsData,
    branchDetailsLoading,
    branchDetailsFailure,
    branchDetailsFailureMessage,
    employeeListData

    // employeeListLoading,
    // employeeListFailure,
    // employeeListFailureMessage
  } = useAppSelector((state: RootState) => state.branchManagementReducer) as BranchManagementState

  // Simulated bubble position data (unchanged)
  const bubblePositionData = [
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
  ]

  // Sample employee data (updated to use the full API response)
  const employeeData: EmployeeDetails[] = employeeListData?.data || []
  const totalCount: number = employeeListData?.totalCount || 0

  const columnHelper = createColumnHelper<EmployeeDetails>()

  const columns = useMemo<ColumnDef<EmployeeDetails, any>[]>(
    () => [
      columnHelper.accessor('employeeCode', {
        header: 'ID',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.employeeCode}
          </Typography>
        )
      }),
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.firstName}
          </Typography>
        )
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.lastName}
          </Typography>
        )
      }),
      columnHelper.accessor('personalEmailAddress', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.personalEmailAddress}
          </Typography>
        )
      }),
      columnHelper.accessor('designation.name', {
        header: 'Designation',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.designation?.name || 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('resignedEmployeeId', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography color={row.original.resignedEmployeeId ? 'error.main' : 'success.main'} className='font-medium'>
            {row.original.resignedEmployeeId ? 'Resigned' : 'Active'}
          </Typography>
        )
      })

      // columnHelper.accessor('id', {
      //   header: 'Action',
      //   cell: ({ row }) => (
      //     <Box sx={{ display: 'flex', gap: 1 }}>
      //       <IconButton
      //         onClick={(e: any) => {
      //           e.stopPropagation()
      //           router.push(`/employee-details?employeeId=${row.original.employeeCode}`)
      //         }}
      //       >
      //         <i className='tabler-eye' />
      //       </IconButton>
      //     </Box>
      //   ),
      //   enableSorting: false
      // })
    ],
    []
  )

  // Action buttons for the employee table (unchanged)
  const actionButtons = [
    {
      icon: <i className='tabler-eye' style={{ fontSize: 18 }} />,
      onClick: (rowData: any) => router.push(`/employee-details?employeeId=${rowData.employeeCode}`),
      tooltip: 'View Details'
    }
  ]

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const handlePageChange = (newPage: number) => {
    console.log(employeeListData)
    setPagination(prev => {
      const updatedPagination = { ...prev, pageIndex: newPage }

      console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex
      console.log('Page Size:', updatedPagination.pageSize) // Log pageSize

      return updatedPagination
    })
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    const updatedPagination = { pageIndex: 0, pageSize: newPageSize }

    console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex
    console.log('Page Size:', updatedPagination.pageSize) // Log pageSize
    setPagination(updatedPagination)
  }

  // Tab change handler (unchanged)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)

    if (newValue === 0) {
      router.push(`employees-details?id=${id}`)
    } else if (newValue === 1) {
      router.push(`bubble-positions?id=${id}`)
    } else if (newValue === 2) {
      router.push(`bucket-management?id=${id}`)
    } else if (newValue === 3) {
      router.push(`vacancy-management?id=${id}`)
    }
  }

  useEffect(() => {
    // Fetch branch details when the component mounts or id changes
    dispatch(getBranchDetails({ id }))
    const branchId = id

    dispatch(getEmployeeDetailsWithBranchId({ branchId, page: 1, limit: 10 }))
  }, [dispatch, id])

  // useEffect(() => {
  //   console.log('SearchParams', branchTab, branchDetailsData)
  // }, [])

  if (branchDetailsLoading) {
    return <div>Loading branch details...</div>
  }

  if (branchDetailsFailure) {
    return <div>Error: {branchDetailsFailureMessage}</div>
  }

  // Use branchDetailsData from API or fallback to empty object if null
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
    area: {
      id: '',
      name: '',
      regionId: '',
      createdAt: '',
      updatedAt: '',
      deletedAt: null
    },
    district: {
      id: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      deletedAt: null
    },
    state: {
      id: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      deletedAt: null
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Branch Details */}
      <Card sx={{ padding: 4, marginBottom: 4 }}>
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
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<ListAltIcon />}
                onClick={() => router.push(`/bucket-management/view/1`)}
                size='small'
              >
                Bucket Management
              </Button>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<WorkIcon />}
                onClick={() => router.push(`/vacancy-management/view/${id}`)}
                size='small'
              >
                Vacancy Management
              </Button>
            </Box> */}
          </Grid>
        </Grid>
        <Divider sx={{ marginY: 3 }} />
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

      {/* Tabs Section */}
      <Card sx={{ padding: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor='primary' indicatorColor='primary'>
          <Tab label='Employees Details' />
          <Tab label='Bubble Position' />
          <Tab label='Bucket Management' />
          <Tab label='Vacancy Management' />
        </Tabs>
        <Divider sx={{ marginY: 3 }} />

        {/* Tab Content */}
        {activeTab === 0 && (
          <>
            {employeeData.length === 0 ? (
              <Typography variant='body1' sx={{ textAlign: 'center', p: 4 }}>
                No employees found for this branch.
              </Typography>
            ) : (
              <DynamicTable
                columns={columns}
                data={employeeData}
                totalCount={totalCount}
                pagination={{ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }} // Pass pagination state
                onPageChange={(newPage: number) => handlePageChange(newPage)} // Use 0-based indexing for DynamicTable
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            )}
          </>

          // <CustomTable
          //   columns={employeeColumns}
          //   data={employeeData}
          //   showCheckbox={false}
          //   actionButtons={actionButtons}
          // />
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Bubble Positions Overview
            </Typography>
            {bubblePositionData.map((position: any, index: number) => (
              <Card key={index} sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant='h6' color='primary'>
                        {position.position}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          backgroundColor: '#e3f2fd',
                          padding: '8px 16px',
                          borderRadius: '8px'
                        }}
                      >
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
                      {position.employees.map((employee: any, empIndex: number) => (
                        <Grid item xs={12} md={4} key={empIndex}>
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
            <Typography variant='h6' sx={{ mb: 3 }}>
              Bucket Management Overview
            </Typography>
            {/* Use bucket data from API response */}
            <Card sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant='body1'>
                <strong>Bucket Name:</strong> {branchData?.bucket?.name || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Total Position Categories:</strong>{' '}
                {branchData.bucket?.positionCategories.reduce((sum, category) => sum + category.count, 0) || 0}
              </Typography>
              {/* <Typography variant='body1'>
                <strong>Current Count:</strong>{' '}
                {branchData?.bucket?.positionCategories.reduce((sum, category) => sum + category.count, 0) || 0}
              </Typography> */}
              {/* <Typography variant='body1' color='error'>
                <strong>Available Slots:</strong> 0
              </Typography> */}
            </Card>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Vacancy Management Overview
            </Typography>
            {/* Sample Vacancy Management Data */}
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
