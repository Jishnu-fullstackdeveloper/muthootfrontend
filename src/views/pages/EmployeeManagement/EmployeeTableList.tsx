'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import VisibilityIcon from '@mui/icons-material/Visibility'

//import DeleteIcon from '@mui/icons-material/Delete'

import DynamicTable from '@/components/Table/dynamicTable'

//import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchEmployees } from '@/redux/EmployeeManagement/employeeManagementSlice' // Import the employee slice
import { ROUTES } from '@/utils/routes'

const EmployeeTable = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const columnHelper = createColumnHelper<any>()

  const { employees, totalCount, status } = useAppSelector(state => state.employeeManagementReducer)

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
    const mappedData = employees?.map(employee => ({
      id: employee.id,
      employeeCode: employee.employeeCode,
      fullName: `${employee.title} ${employee.firstName}${employee.middleName ? ` ${employee.middleName}` : ''} ${employee.lastName ? ` ${employee.lastName}` : ''}`, // Combine firstName, middleName, lastName
      employeeType: employee.employeeDetails.employmentType,
      status: employee.employeeDetails.employmentStatus,
      company: employee.companyStructure.company,
      businessUnit: employee.businessUnit.name,
      department: employee.department.name,
      territory: employee.companyStructure.territory || '-',
      zone: employee.companyStructure.zone || '-',
      region: employee.companyStructure.region || '-',
      cluster: employee.companyStructure.cluster || '-',
      branch: employee.companyStructure.branch || '-',
      branchCode: employee.companyStructure.branchCode || '-',
      area: employee.companyStructure.area || '-',
      cityClassification: employee.address.cityClassification,
      state: employee.address.state,
      dateOfJoining: employee.employeeDetails.dateOfJoining,
      groupDOJ: employee.employeeDetails.groupDOJ,
      grade: employee.grade.name,
      band: employee.band.name,
      designation: employee.designation.name,
      employeeCategory: employee.department.employeeCategoryTypeId ? 'Defined' : '-', // Assuming category exists if ID is present
      employeeCategoryType: '-', // Not directly in API response
      l1ManagerCode: employee.managementHierarchy.l1ManagerCode,
      l1Manager: employee.managementHierarchy.l1Manager || '-',
      l2ManagerCode: employee.managementHierarchy.l2ManagerCode,
      l2Manager: employee.managementHierarchy.l2Manager || '-',
      hrManagerCode: employee.managementHierarchy.hrManagerCode,
      hrManager: employee.managementHierarchy.hrManager || '-',
      functionHead: employee.managementHierarchy.functionHead || '-',
      practiceHead: employee.managementHierarchy.practiceHead || '-',
      jobRole: employee.jobRole.name || '-',
      dateOfBirth: employee.personalDetails?.dateOfBirth || '-',
      gender: employee.personalDetails?.gender || '-',
      maritalStatus: employee.personalDetails?.maritalStatus || '-',
      personalEmailAddress: employee.personalEmailAddress || '-',
      officialEmailAddress: employee.officeEmailAddress || '-',
      confirmationStatus: employee.employeeDetails?.confirmationStatus || '-',
      residenceAddressLine1: employee.address?.residenceAddressLine1 || '-',
      residenceState: employee.address?.residenceState || '-',
      residenceCity: employee.address?.residenceCity || '-',
      residenceCountry: employee.address?.residenceCountry || '-',
      residencePostalCode: employee.address?.residencePostalCode || '-',
      residenceLandline: employee.address?.residenceLandline || '-',
      bloodGroup: employee.personalDetails?.bloodGroup || '-',
      confirmationDate: employee.employeeDetails?.confirmationDate || '-',
      emergencyContactName: employee.emergencyContact?.emergencyContactName || '-',
      emergencyContactRelation: employee.emergencyContact?.emergencyContactRelationship || '-',
      emergencyContactMobilePhone: employee.emergencyContact?.emergencyContactMobilePhone || '-',
      pfAccountNumber: employee.payrollDetails?.pfAccountNo || '-',
      panNumber: employee.payrollDetails?.panNo || '-',
      bankName: employee.payrollDetails?.bankName || '-',
      bankAccountNumber: employee.payrollDetails?.bankAccountNo || '-',
      ifscCode: employee.payrollDetails?.ifscCode || '-',
      uanNumber: employee.payrollDetails?.uanNumber || '-',
      noticePeriod: employee.resignationDetails?.noticePeriod || '-',
      mobileNumber: employee.mobileNumber || '-',
      dateOfResignation: employee.resignationDetails?.dateOfResignation || '-',
      lwd: employee.resignationDetails?.lwd || '-',
      foodCardNumber: employee.payrollDetails?.foodCardNo || '-',
      npsAccountNumber: employee.payrollDetails?.npsAccountNo || '-',
      esiNo: employee.payrollDetails?.esiNo || '-',
      isDisability: employee.personalDetails?.isDisability ? 'Yes' : 'No',
      typeOfDisability: employee.personalDetails?.typeOfDisability || '-',
      nameAsPerAdhaar: employee.personalDetails?.nameAsPerAdhaar || '-',
      functionalManager: employee.managementHierarchy?.functionalManager || '-',
      totalExperience: employee.experienceDetails?.totalExperience || '-',
      currentCompanyExperience: employee.experienceDetails?.currentCompanyExperience || '-',
      age: employee.experienceDetails?.ageYYMM || '-',
      retirementDate: employee.experienceDetails?.retirementDate || '-',
      pfApplicable: employee.payrollDetails?.pfApplicable ? 'Yes' : 'No',
      pfGrossLimit: employee.payrollDetails?.pfGrossLimit || '-',
      lwfApplicable: employee.payrollDetails?.lwfApplicable ? 'Yes' : 'No',
      esiApplicable: employee.payrollDetails?.esiApplicable ? 'Yes' : 'No',
      aadharNumber: employee.personalDetails?.aadharNumber || '-',
      matrixManagerCode: employee.managementHierarchy?.matrixManagerCode || '-',
      functionalManagerCode: employee.managementHierarchy?.functionalManagerCode || '-'
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
                onClick={() => router.push(ROUTES.USER_MANAGEMENT.EMPLOYEE_VIEW(row.original.id))} // onClick={() => router.push(`/employee-management/view/profile-?id=${row.original.id}`)}
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

      // columnHelper.accessor('territory', {
      //   header: 'TERRITORY',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.territory}</Typography>
      // }),
      // columnHelper.accessor('zone', {
      //   header: 'ZONE',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.zone}</Typography>
      // }),
      // columnHelper.accessor('region', {
      //   header: 'REGION',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.region}</Typography>
      // }),
      // columnHelper.accessor('cluster', {
      //   header: 'CLUSTER',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.cluster}</Typography>
      // }),
      // columnHelper.accessor('branch', {
      //   header: 'BRANCH',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.branch}</Typography>
      // }),
      columnHelper.accessor('branchCode', {
        header: 'BRANCH CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.branchCode}</Typography>
      }),

      // columnHelper.accessor('area', {
      //   header: 'AREA',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.area}</Typography>
      // }),
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

      // columnHelper.accessor('employeeCategoryType', {
      //   header: 'EMPLOYEE CATEGORY TYPE',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeCategoryType}</Typography>
      // }),
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
      }),
      columnHelper.accessor('dateOfBirth', {
        header: 'DATE OF BIRTH',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.dateOfBirth}</Typography>
      }),
      columnHelper.accessor('gender', {
        header: 'GENDER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.gender}</Typography>
      }),
      columnHelper.accessor('maritalStatus', {
        header: 'MARITAL STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.maritalStatus}</Typography>
      }),
      columnHelper.accessor('personalEmailAddress', {
        header: 'PERSONAL EMAIL ADDRESS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.personalEmailAddress}</Typography>
      }),
      columnHelper.accessor('officialEmailAddress', {
        header: 'OFFICIAL EMAIL ADDRESS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.officialEmailAddress}</Typography>
      }),
      columnHelper.accessor('confirmationStatus', {
        header: 'CONFIRMATION STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.confirmationStatus}</Typography>
      }),
      columnHelper.accessor('residenceAddressLine1', {
        header: 'RESIDENCE ADDRESS LINE 1',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.residenceAddressLine1}</Typography>
      }),
      columnHelper.accessor('residenceState', {
        header: 'RESIDENCE STATE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.residenceState}</Typography>
      }),
      columnHelper.accessor('residenceCity', {
        header: 'RESIDENCE CITY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.residenceCity}</Typography>
      }),
      columnHelper.accessor('residenceCountry', {
        header: 'RESIDENCE COUNTRY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.residenceCountry}</Typography>
      }),
      columnHelper.accessor('residencePostalCode', {
        header: 'RESIDENCE POSTAL CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.residencePostalCode}</Typography>
      }),
      columnHelper.accessor('residenceLandline', {
        header: 'RESIDENCE LANDLINE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.residenceLandline}</Typography>
      }),
      columnHelper.accessor('bloodGroup', {
        header: 'BLOOD GROUP',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.bloodGroup}</Typography>
      }),
      columnHelper.accessor('confirmationDate', {
        header: 'CONFIRMATION DATE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.confirmationDate}</Typography>
      }),
      columnHelper.accessor('emergencyContactName', {
        header: 'EMERGENCY CONTACT NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.emergencyContactName}</Typography>
      }),
      columnHelper.accessor('emergencyContactRelation', {
        header: 'EMERGENCY CONTACT RELATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.emergencyContactRelation}</Typography>
      }),
      columnHelper.accessor('emergencyContactMobilePhone', {
        header: 'EMERGENCY CONTACT MOBILE PHONE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.emergencyContactMobilePhone}</Typography>
      }),
      columnHelper.accessor('pfAccountNumber', {
        header: 'PF ACCOUNT NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.pfAccountNumber}</Typography>
      }),
      columnHelper.accessor('panNumber', {
        header: 'PAN NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.panNumber}</Typography>
      }),
      columnHelper.accessor('bankName', {
        header: 'BANK NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.bankName}</Typography>
      }),
      columnHelper.accessor('bankAccountNumber', {
        header: 'BANK ACCOUNT NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.bankAccountNumber}</Typography>
      }),
      columnHelper.accessor('ifscCode', {
        header: 'IFSC CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.ifscCode}</Typography>
      }),
      columnHelper.accessor('uanNumber', {
        header: 'UAN NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.uanNumber}</Typography>
      }),
      columnHelper.accessor('noticePeriod', {
        header: 'NOTICE PERIOD',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.noticePeriod}</Typography>
      }),
      columnHelper.accessor('mobileNumber', {
        header: 'MOBILE NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.mobileNumber}</Typography>
      }),
      columnHelper.accessor('dateOfResignation', {
        header: 'DATE OF RESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.dateOfResignation.split('T')[0]}</Typography>
      }),
      columnHelper.accessor('finalApprovalLWD', {
        header: 'FINAL APPROVAL LWD',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.lwd.split('T')[0]}</Typography>
      }),
      columnHelper.accessor('foodCardNumber', {
        header: 'FOOD CARD NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.foodCardNumber}</Typography>
      }),
      columnHelper.accessor('npsAccountNumber', {
        header: 'NPS ACCOUNT NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.npsAccountNumber}</Typography>
      }),
      columnHelper.accessor('esiNo', {
        header: 'ESI NO',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.esiNo}</Typography>
      }),
      columnHelper.accessor('isDisability', {
        header: 'IS DISABILITY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.isDisability}</Typography>
      }),
      columnHelper.accessor('typeOfDisability', {
        header: 'TYPE OF DISABILITY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.typeOfDisability}</Typography>
      }),
      columnHelper.accessor('nameAsPerAadhar', {
        header: 'NAME AS PER AADHAR',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.nameAsPerAdhaar}</Typography>
      }),
      columnHelper.accessor('functionalManager', {
        header: 'FUNCTIONAL MANAGER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.functionalManager}</Typography>
      }),
      columnHelper.accessor('totalExperience', {
        header: 'TOTAL EXPERIENCE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.totalExperience}</Typography>
      }),
      columnHelper.accessor('currentCompanyExperience', {
        header: 'CURRENT COMPANY EXPERIENCE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.currentCompanyExperience}</Typography>
      }),
      columnHelper.accessor('age', {
        header: 'AGE (YY:MM)',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.age}</Typography>
      }),
      columnHelper.accessor('retirementDate', {
        header: 'RETIREMENT DATE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.retirementDate}</Typography>
      }),
      columnHelper.accessor('pfApplicable', {
        header: 'PF APPLICABLE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.pfApplicable}</Typography>
      }),
      columnHelper.accessor('pfGrossLimit', {
        header: 'PF GROSS LIMIT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.pfGrossLimit}</Typography>
      }),
      columnHelper.accessor('lwfApplicable', {
        header: 'LWF APPLICABLE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.lwfApplicable}</Typography>
      }),
      columnHelper.accessor('esiApplicable', {
        header: 'ESI APPLICABLE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.esiApplicable}</Typography>
      }),
      columnHelper.accessor('aadharNumber', {
        header: 'AADHAR NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.adharNo}</Typography>
      }),
      columnHelper.accessor('matrixManagerCode', {
        header: 'MATRIX MANAGER CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.matrixManagerCode}</Typography>
      }),
      columnHelper.accessor('functionalManagerCode', {
        header: 'FUNCTIONAL MANAGER CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.functionalManagerCode}</Typography>
      })
    ],
    [columnHelper, router]
  )

  return (
    <>
      {status === 'loading' && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'failed' && (
        <Typography color='secondary' align='center'>
          No Employee Data
        </Typography>
      )}
      {status === 'succeeded' && (
        <DynamicTable
          columns={columns}
          data={tableData.data}
          totalCount={tableData.totalCount}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Employee Listing'
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
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
