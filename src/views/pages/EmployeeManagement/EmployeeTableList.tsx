'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import VisibilityIcon from '@mui/icons-material/Visibility'

//import DeleteIcon from '@mui/icons-material/Delete'

import DynamicTable from '@/components/Table/dynamicTable'

//import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchEmployees } from '@/redux/EmployeeManagement/employeeManagementSlice' // Import the employee slice

const EmployeeTable = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const columnHelper = createColumnHelper<any>()

  const { employees, totalCount, status, error } = useAppSelector(state => state.employeeManagementReducer)

  //const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  //const [employeeIdToDelete, setEmployeeIdToDelete] = useState<string | number | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Fetch employees on mount and when pagination changes
  useEffect(() => {
    dispatch(
      fetchEmployees({
        page: pagination.pageIndex + 1, // API uses 1-based indexing
        limit: pagination.pageSize
      })
    )
  }, [dispatch, pagination.pageIndex, pagination.pageSize])

  // Map API data to table format
  const tableData = useMemo(() => {
    const mappedData = employees.map(employee => ({
      id: employee.id,
      employeeCode: employee.employeeCode,

      // title: employee.title || '-',
      // firstName: employee.firstName,
      // middleName: employee.middleName || '-',
      // lastName: employee.lastName,
      fullName: `${employee.title} ${employee.firstName}${employee.middleName ? ` ${employee.middleName}` : ''} ${employee.lastName}`, // Combine firstName, middleName, lastName
      employeeType: employee.employeeDetails.employmentType,
      status: employee.employeeDetails.employmentStatus,
      company: employee.companyStructure.company,
      businessUnit: employee.businessUnit.name,
      department: employee.department.name,
      territory: '-', // Not in API response
      zone: '-', // Not in API response
      region: '-', // Not in API response
      //area: employee.designation.type || '-', // Using designation.type as a proxy
      cluster: '-', // Not in API response
      branch: employee.companyStructure.branchCode || '-',
      branchCode: employee.companyStructure.branchCode || '-',
      cityClassification: employee.address.cityClassification,
      state: employee.address.state,
      dateOfJoining: employee.employeeDetails.dateOfJoining,
      groupDOJ: employee.employeeDetails.groupDOJ,
      grade: employee.grade.name,
      band: employee.band.name,
      designation: employee.designation.name,
      employeeCategory: '-', // Not in API response
      employeeCategoryType: '-', // Not in API response
      l1ManagerCode: employee.managementHierarchy.l1ManagerCode,
      l1Manager: '-', // Not in API response
      l2ManagerCode: employee.managementHierarchy.l2ManagerCode,
      l2Manager: '-', // Not in API response
      hrManagerCode: employee.managementHierarchy.hrManagerCode,
      hrManager: '-', // Not in API response
      functionHead: '-', // Not in API response
      practiceHead: '-', // Not in API response
      jobRole: '-' // Not in API response
    }))

    return {
      data: mappedData,
      totalCount
    }
  }, [employees, totalCount])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  // const handleDeleteClick = (id: string | number) => {
  //   setEmployeeIdToDelete(id)
  //   setDeleteModalOpen(true)
  // }

  // const handleDeleteConfirm = async (id?: string | number) => {
  //   if (id && typeof id === 'string') {
  //     try {
  //       await dispatch(deleteEmployee(id)).unwrap()
  //       console.log('Deleted employee with ID:', id)
  //     } catch (err) {
  //       console.error('Delete failed:', err)
  //     }
  //   }

  //   setDeleteModalOpen(false)
  //   setEmployeeIdToDelete(null)
  // }

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('employeeCode', {
        header: 'EMPLOYEE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeCode}</Typography>
      }),

      // columnHelper.accessor('title', {
      //   header: 'TITLE',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.title}</Typography>
      // }),
      // columnHelper.accessor('firstName', {
      //   header: 'FIRST NAME',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.firstName}</Typography>
      // }),
      // columnHelper.accessor('middleName', {
      //   header: 'MIDDLE NAME',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.middleName || '-'}</Typography>
      // }),
      // columnHelper.accessor('lastName', {
      //   header: 'LAST NAME',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.lastName}</Typography>
      // }),

      columnHelper.accessor('fullName', {
        header: 'FULL NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fullName}</Typography>
      }),
      columnHelper.accessor('employeeType', {
        header: 'EMPLOYEE TYPE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeType}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'ACTIONS',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton
                onClick={() => router.push(`/employee-management/view/profile-?id=${row.original.id}`)}
                sx={{ fontSize: 18 }}
              >
                {/* <i className='tabler-eye text-textSecondary' /> */}
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/employee-management/edit/${row.original.id}`)}>
                <i className='tabler-edit text-textSecondary' />
              </IconButton>
            </Tooltip> */}
          </Box>
        ),
        enableSorting: false
      }),

      columnHelper.accessor('status', {
        header: 'EMPLOYEE STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.status}</Typography>
      }),

      columnHelper.accessor('company', {
        header: 'COMPANY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.company}</Typography>
      }),
      columnHelper.accessor('businessUnit', {
        header: 'BUSINESS UNIT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.businessUnit}</Typography>
      }),
      columnHelper.accessor('department', {
        header: 'DEPARTMENT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.department}</Typography>
      }),
      columnHelper.accessor('territory', {
        header: 'TERRITORY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.territory}</Typography>
      }),
      columnHelper.accessor('zone', {
        header: 'ZONE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.zone}</Typography>
      }),
      columnHelper.accessor('region', {
        header: 'REGION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.region}</Typography>
      }),

      // columnHelper.accessor('area', {
      //   header: 'AREA',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.area}</Typography>
      // }),
      columnHelper.accessor('cluster', {
        header: 'CLUSTER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.cluster}</Typography>
      }),
      columnHelper.accessor('branch', {
        header: 'BRANCH',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.branch}</Typography>
      }),
      columnHelper.accessor('branchCode', {
        header: 'BRANCH CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.branchCode}</Typography>
      }),
      columnHelper.accessor('cityClassification', {
        header: 'CITY CLASSIFICATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.cityClassification}</Typography>
      }),
      columnHelper.accessor('state', {
        header: 'STATE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.state}</Typography>
      }),
      columnHelper.accessor('dateOfJoining', {
        header: 'DATE OF JOINING',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.dateOfJoining}</Typography>
      }),
      columnHelper.accessor('groupDOJ', {
        header: 'GROUP DOJ',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.groupDOJ}</Typography>
      }),
      columnHelper.accessor('grade', {
        header: 'GRADE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.grade}</Typography>
      }),
      columnHelper.accessor('band', {
        header: 'BAND',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.band}</Typography>
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designation}</Typography>
      }),
      columnHelper.accessor('employeeCategory', {
        header: 'EMPLOYEE CATEGORY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeCategory}</Typography>
      }),
      columnHelper.accessor('employeeCategoryType', {
        header: 'EMPLOYEE CATEGORY TYPE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeCategoryType}</Typography>
      }),
      columnHelper.accessor('l1ManagerCode', {
        header: 'L1 MANAGER CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.l1ManagerCode}</Typography>
      }),
      columnHelper.accessor('l1Manager', {
        header: 'L1 MANAGER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.l1Manager}</Typography>
      }),
      columnHelper.accessor('l2ManagerCode', {
        header: 'L2 MANAGER CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.l2ManagerCode}</Typography>
      }),
      columnHelper.accessor('l2Manager', {
        header: 'L2 MANAGER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.l2Manager}</Typography>
      }),
      columnHelper.accessor('hrManagerCode', {
        header: 'HR MANAGER CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.hrManagerCode}</Typography>
      }),
      columnHelper.accessor('hrManager', {
        header: 'HR MANAGER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.hrManager}</Typography>
      }),
      columnHelper.accessor('functionHead', {
        header: 'FUNCTION HEAD',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.functionHead}</Typography>
      }),
      columnHelper.accessor('practiceHead', {
        header: 'PRACTICE HEAD',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.practiceHead}</Typography>
      }),
      columnHelper.accessor('jobRole', {
        header: 'JOB ROLE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.jobRole}</Typography>
      })
    ],
    [columnHelper, router]
  )

  return (
    <>
      {status === 'loading' && <Typography>Loading...</Typography>}
      {status === 'failed' && <Typography color='error'>Error: {error}</Typography>}
      {status === 'succeeded' && (
        <DynamicTable
          columns={columns}
          data={tableData.data}
          totalCount={tableData.totalCount}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Employee Listing'
        />
      )}
      {/* <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={employeeIdToDelete}
      /> */}
    </>
  )
}

export default EmployeeTable
