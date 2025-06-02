'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  Typography,
  Autocomplete,
  Button,
  Tooltip,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState } from '@/redux/store'
import type { VacancyManagementState, VacancyRequest } from '@/types/vacancyManagement'
import {
  fetchVacancyRequests,
  updateVacancyRequestStatus,
  autoApproveVacancyRequests
} from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import type { BudgetManagementState } from '@/types/budget'
import {
  fetchBranch,
  fetchTerritory,
  fetchArea,
  fetchRegion,
  fetchZone
} from '@/redux/BudgetManagement/BudgetManagementSlice'
import { ROUTES } from '@/utils/routes'
import { getPermissionRenderConfig, getUserId } from '@/utils/functions'
import ActionButtons from './ActionButtons'
import withPermission from '@/hocs/withPermission'

const filterOptions = ['Branch', 'Area', 'Region', 'Zone', 'Territory']

const VacancyRequestDetail = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current user ID
  const userId = getUserId()

  // State for search, filters, and pagination
  const [searchDesignation, setSearchDesignation] = useState<string>('')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false)
  const [selectedFilterType, setSelectedFilterType] = useState<string | null>(null)
  const [selectedFilterValues, setSelectedFilterValues] = useState<string[]>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const designationId = searchParams.get('id')

  // State for confirmation dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<
    'APPROVED' | 'REJECTED' | 'FREEZED' | 'UNFREEZED' | 'TRANSFER' | null
  >(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<string>('')
  const permissions = getPermissionRenderConfig()

  const ActionButtonsWithPermission = withPermission(ActionButtons)

  // Selectors for vacancy management state
  const {
    vacancyRequestListLoading = false,
    vacancyRequestListSuccess = false,
    vacancyRequestListData = null,
    vacancyRequestListTotal = 0,
    vacancyRequestListFailure = false,
    vacancyRequestListFailureMessage = '',
    updateVacancyRequestStatusLoading = false,
    autoApproveVacancyRequestsLoading = false
  } = useAppSelector((state: RootState) => state.vacancyManagementReducer) as VacancyManagementState

  // Selectors for budget management state (filter values)
  const {
    fetchBranchData,
    fetchBranchLoading,
    fetchTerritoryData,
    fetchTerritoryLoading,
    fetchAreaData,
    fetchAreaLoading,
    fetchRegionData,
    fetchRegionLoading,
    fetchZoneData,
    fetchZoneLoading
  } = useAppSelector((state: RootState) => state.budgetManagementReducer) as BudgetManagementState

  // Fetch vacancy requests
  useEffect(() => {
    const params: {
      page: number
      limit: number
      search?: string
      employeeId?: string
      id?: string
      designationId?: string
      departmentId?: string
      branchIds?: string[]
      status?: string
      approvalIds?: string
      approverIds?: string
      areaIds?: string[]
      regionIds?: string[]
      zoneIds?: string[]
      territoryIds?: string[]
    } = {
      page: pagination.pageIndex + 1, // API expects 1-based page index
      limit: pagination.pageSize,
      designationId: designationId || ''
    }

    if (searchDesignation) params.search = searchDesignation

    // Add filter IDs based on selected filter type and values
    if (selectedFilterType && selectedFilterValues.length > 0) {
      if (selectedFilterType === 'Branch') params.branchIds = selectedFilterValues
      else if (selectedFilterType === 'Area') params.areaIds = selectedFilterValues
      else if (selectedFilterType === 'Region') params.regionIds = selectedFilterValues
      else if (selectedFilterType === 'Zone') params.zoneIds = selectedFilterValues
      else if (selectedFilterType === 'Territory') params.territoryIds = selectedFilterValues
    }

    dispatch(fetchVacancyRequests(params))
  }, [dispatch, searchDesignation, selectedFilterType, selectedFilterValues, pagination])

  // Fetch filter values
  useEffect(() => {
    dispatch(fetchBranch({ page: 1, limit: 100 }))
    dispatch(fetchTerritory({ page: 1, limit: 100 }))
    dispatch(fetchArea({ page: 1, limit: 100 }))
    dispatch(fetchRegion({ page: 1, limit: 100 }))
    dispatch(fetchZone({ page: 1, limit: 100 }))
  }, [dispatch])

  // Map fetched filter values
  const filterValuesMap = useMemo(() => {
    return {
      Branch: fetchBranchData?.data?.map(branch => ({ id: branch.id, name: branch.name })) || [],
      Area: fetchAreaData?.data?.map(area => ({ id: area.id, name: area.name })) || [],
      Region: fetchRegionData?.data?.map(region => ({ id: region.id, name: region.name })) || [],
      Zone: fetchZoneData?.data?.map(zone => ({ id: zone.id, name: zone.name })) || [],
      Territory: fetchTerritoryData?.data?.map(territory => ({ id: territory.id, name: territory.name })) || []
    }
  }, [fetchBranchData, fetchAreaData, fetchRegionData, fetchZoneData, fetchTerritoryData])

  const columnHelper = createColumnHelper<VacancyRequest>()

  const handleFilterDrawerToggle = (filterType?: string) => {
    if (filterType) {
      setSelectedFilterType(filterType)
      setSelectedFilterValues([])
    }

    setIsFilterDrawerOpen(!isFilterDrawerOpen)
  }

  const handleViewDetails = (designationId: string) => {
    router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_REQUEST_DETAIL(designationId))
  }

  const handleViewEmployeeDetails = (employeeId: string) => {
    router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.RESIGNED_DETAILS(employeeId))
  }

  // Handle opening the confirmation dialog
  const handleOpenDialog = (id: string, action: 'APPROVED' | 'REJECTED' | 'FREEZED' | 'UNFREEZED' | 'TRANSFER') => {
    setSelectedId(id)
    setSelectedAction(action)
    setNotes('') // Reset notes when opening the dialog
    setIsDialogOpen(true)
  }

  // Handle closing the confirmation dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedId(null)
    setSelectedAction(null)
    setNotes('')
  }

  // Consolidated handler for all status actions
  const handleConfirmAction = async () => {
    if (!selectedId || !selectedAction) return

    if (selectedAction === 'TRANSFER') {
      console.log(`Transferring request with ID: ${selectedId}`)
      toast.info('Transfer action initiated', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      handleCloseDialog()

      return
    }

    const newStatus = selectedAction === 'UNFREEZED' ? 'PENDING' : selectedAction

    try {
      await dispatch(
        updateVacancyRequestStatus({
          id: selectedId,
          approverId: userId, // Use current userId as approverId
          status: newStatus,
          notes // Include the notes from the text field
        })
      ).unwrap()

      // Refresh the list with current filters, search, and pagination
      const params: {
        page: number
        limit: number
        search?: string
        employeeId?: string
        id?: string
        designationId?: string
        departmentId?: string
        branchIds?: string[]
        status?: string
        approvalIds?: string
        approverIds?: string
        areaIds?: string[]
        regionIds?: string[]
        zoneIds?: string[]
        territoryIds?: string[]
      } = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        designationId: designationId || ''
      }

      if (searchDesignation) params.search = searchDesignation

      if (selectedFilterType && selectedFilterValues.length > 0) {
        if (selectedFilterType === 'Branch') params.branchIds = selectedFilterValues
        else if (selectedFilterType === 'Area') params.areaIds = selectedFilterValues
        else if (selectedFilterType === 'Region') params.regionIds = selectedFilterValues
        else if (selectedFilterType === 'Zone') params.zoneIds = selectedFilterValues
        else if (selectedFilterType === 'Territory') params.territoryIds = selectedFilterValues
      }

      dispatch(fetchVacancyRequests(params))

      toast.success(`Vacancy request ${newStatus.toLowerCase()} successfully`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      handleCloseDialog()
    } catch (err: any) {
      console.log('Error updating status:', err)
      toast.error(`Failed to update status to ${newStatus}: ${err}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      handleCloseDialog()
    }
  }

  const handleApproveAll = () => {
    dispatch(autoApproveVacancyRequests()).then(() => {
      const params: {
        page: number
        limit: number
        search?: string
        designationId?: string
        branchIds?: string[]
        areaIds?: string[]
        regionIds?: string[]
        zoneIds?: string[]
        territoryIds?: string[]
      } = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        designationId: designationId || ''
      }

      if (searchDesignation) params.search = searchDesignation

      if (selectedFilterType && selectedFilterValues.length > 0) {
        if (selectedFilterType === 'Branch') params.branchIds = selectedFilterValues
        else if (selectedFilterType === 'Area') params.areaIds = selectedFilterValues
        else if (selectedFilterType === 'Region') params.regionIds = selectedFilterValues
        else if (selectedFilterType === 'Zone') params.zoneIds = selectedFilterValues
        else if (selectedFilterType === 'Territory') params.territoryIds = selectedFilterValues
      }

      dispatch(fetchVacancyRequests(params))
      toast.success('All vacancy requests approved successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    })
  }

  const handleRejectAll = () => {
    if (vacancyRequestListData?.data) {
      Promise.all(
        vacancyRequestListData.data
          .filter(request => request.status === 'PENDING')
          .map(request =>
            dispatch(
              updateVacancyRequestStatus({
                id: request.id,
                approverId: userId, // Use current userId
                status: 'REJECTED',
                notes: `Bulk rejection on ${new Date().toISOString()}`
              })
            )
          )
      )
        .then(() => {
          const params: {
            page: number
            limit: number
            search?: string
            designationId?: string
            branchIds?: string[]
            areaIds?: string[]
            regionIds?: string[]
            zoneIds?: string[]
            territoryIds?: string[]
          } = {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            designationId: designationId || ''
          }

          if (searchDesignation) params.search = searchDesignation

          if (selectedFilterType && selectedFilterValues.length > 0) {
            if (selectedFilterType === 'Branch') params.branchIds = selectedFilterValues
            else if (selectedFilterType === 'Area') params.areaIds = selectedFilterValues
            else if (selectedFilterType === 'Region') params.regionIds = selectedFilterValues
            else if (selectedFilterType === 'Zone') params.zoneIds = selectedFilterValues
            else if (selectedFilterType === 'Territory') params.territoryIds = selectedFilterValues
          }

          dispatch(fetchVacancyRequests(params))
          toast.success('All vacancy requests rejected successfully', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        })
        .catch((err: any) => {
          toast.error(`Failed to reject all requests: ${err}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        })
    }
  }

  const handleFreezeAll = () => {
    if (vacancyRequestListData?.data) {
      Promise.all(
        vacancyRequestListData.data
          .filter(request => request.status === 'PENDING')
          .map(request =>
            dispatch(
              updateVacancyRequestStatus({
                id: request.id,
                approverId: userId, // Use current userId
                status: 'FREEZED',
                notes: `Bulk freeze on ${new Date().toISOString()}`
              })
            )
          )
      )
        .then(() => {
          const params: {
            page: number
            limit: number
            search?: string
            designationId?: string
            branchIds?: string[]
            areaIds?: string[]
            regionIds?: string[]
            zoneIds?: string[]
            territoryIds?: string[]
          } = {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            designationId: designationId || ''
          }

          if (searchDesignation) params.search = searchDesignation

          if (selectedFilterType && selectedFilterValues.length > 0) {
            if (selectedFilterType === 'Branch') params.branchIds = selectedFilterValues
            else if (selectedFilterType === 'Area') params.areaIds = selectedFilterValues
            else if (selectedFilterType === 'Region') params.regionIds = selectedFilterValues
            else if (selectedFilterType === 'Zone') params.zoneIds = selectedFilterValues
            else if (selectedFilterType === 'Territory') params.territoryIds = selectedFilterValues
          }

          dispatch(fetchVacancyRequests(params))
          toast.success('All vacancy requests FREEZED successfully', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        })
        .catch((err: any) => {
          toast.error(`Failed to freeze all requests: ${err}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        })
    }
  }

  const handleApplyFilters = () => {
    setIsFilterDrawerOpen(false)
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page on filter apply
  }

  const handleResetFilters = () => {
    setSelectedFilterType(null)
    setSelectedFilterValues([])
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page on filter reset
  }

  const filteredData = useMemo(() => {
    return vacancyRequestListData?.data || []
  }, [vacancyRequestListData])

  const columns = useMemo<ColumnDef<VacancyRequest, any>[]>(
    () => [
      columnHelper.accessor('employees.employeeCode', {
        header: 'EMPLOYEE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employees.employeeCode}</Typography>
      }),
      columnHelper.accessor('employees.firstName', {
        header: 'EMPLOYEE NAME',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.employees.firstName} {row.original.employees.middleName || ''}{' '}
            {row.original.employees.lastName}
          </Typography>
        )
      }),
      columnHelper.accessor('designations.name', {
        header: 'DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designations.name}</Typography>
      }),
      columnHelper.accessor('departments.name', {
        header: 'DEPARTMENT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.departments.name}</Typography>
      }),
      columnHelper.accessor('branches.name', {
        header: 'BRANCH',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.branches.name}</Typography>
      }),
      columnHelper.accessor('branches.cluster.area.name', {
        header: 'AREA',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.branches.cluster.area.name}</Typography>
      }),
      columnHelper.accessor('branches.cluster.area.region.name', {
        header: 'REGION',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.branches.cluster.area.region.name}</Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.status}</Typography>
      }),
      // Approver Status Column
      columnHelper.accessor('approvalStatus', {
        header: 'APPROVER STATUS',
        cell: ({ row }) => {
          const approvalStatus = row.original.approvalStatus || []
          // Find the current approver's status where approverId matches userId
          const currentApprover = approvalStatus.find((status: any) => {
            const level = status.id ? status : Object.values(status)[0]
            return level.approverId === userId
          })

          if (!currentApprover) {
            return <Typography color='text.secondary'>Not Assigned</Typography>
          }

          const status = currentApprover.id ? currentApprover.approvalStatus : Object.values(currentApprover)[0].status

          return (
            <Typography
              color={
                status === 'APPROVED'
                  ? 'success.main'
                  : status === 'REJECTED'
                    ? 'error.main'
                    : status === 'PENDING'
                      ? 'warning.main'
                      : 'text.primary'
              }
            >
              {status}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('id', {
        header: 'ACTIONS',
        cell: ({ row }) => (
          <ActionButtonsWithPermission
            row={row}
            handleOpenDialog={handleOpenDialog}
            handleViewEmployeeDetails={handleViewEmployeeDetails}
            updateVacancyRequestStatusLoading={updateVacancyRequestStatusLoading}
            userId={userId} // Pass userId to ActionButtons
            individualPermission={permissions.HIRING_VACANCY_VACANCYREQUEST_APPROVAL}
          />
        ),
        enableSorting: false
      })
    ],
    [columnHelper, updateVacancyRequestStatusLoading, userId]
  )

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const isFilterLoading =
    fetchBranchLoading || fetchTerritoryLoading || fetchAreaLoading || fetchRegionLoading || fetchZoneLoading

  // Define the ApproveAllButton component inline and wrap it with withPermission
  const ApproveAllButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
    <Button
      variant='outlined'
      color='success'
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderColor: 'success.main',
        '&:hover': {
          backgroundColor: 'success.main'
        }
      }}
    >
      Approve All
    </Button>
  )

  // Define the FreezeAllButton component inline and wrap it with withPermission
  const FreezeAllButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
    <Button
      variant='outlined'
      color='info'
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderColor: 'info.main',
        '&:hover': {
          backgroundColor: 'info.main'
        }
      }}
    >
      Freeze All
    </Button>
  )

  // Wrap the buttons with withPermission HOC
  const ApproveAllButtonWithPermission = withPermission(ApproveAllButton)
  const FreezeAllButtonWithPermission = withPermission(FreezeAllButton)

  return (
    <Box>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <TextField
            label='Reason/Notes'
            variant='outlined'
            fullWidth
            multiline
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color='primary' disabled={updateVacancyRequestStatusLoading}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: 1,
          p: 5,
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '60%',
            gap: 2,
            alignItems: { md: 'center' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: '40%' } }}>
            <TextField
              label='Search by Designation'
              variant='outlined'
              size='small'
              value={searchDesignation}
              onChange={e => {
                setSearchDesignation(e.target.value)
                setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page on search
              }}
              sx={{ flex: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <IconButton
              color='primary'
              onClick={() => handleFilterDrawerToggle()}
              sx={{
                borderRadius: '8px',
                p: 1,
                '&:hover': { bgcolor: 'primary.main' }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, whiteSpace: 'nowrap', mt: { xs: 2, md: 0 } }}>
            {filterOptions.map(option => (
              <Chip
                key={option}
                label={option}
                onClick={() => handleFilterDrawerToggle(option)}
                color={selectedFilterType === option ? 'primary' : 'default'}
                sx={{
                  '&:hover': {
                    backgroundColor: selectedFilterType === option ? 'primary.dark' : 'action.hover'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <ApproveAllButtonWithPermission
            onClick={handleApproveAll}
            disabled={
              autoApproveVacancyRequestsLoading || !vacancyRequestListData?.data?.some(req => req.status === 'PENDING')
            }
            individualPermission={permissions.HIRING_VACANCY_VACANCYREQUEST_APPROVAL}
            fallback={
              <Button variant='outlined' color='success' disabled>
                Approve All (No Permission)
              </Button>
            }
          />
          <FreezeAllButtonWithPermission
            onClick={handleFreezeAll}
            disabled={
              updateVacancyRequestStatusLoading || !vacancyRequestListData?.data?.some(req => req.status === 'PENDING')
            }
            individualPermission={permissions.HIRING_VACANCY_VACANCYREQUEST_APPROVAL}
            fallback={
              <Button variant='outlined' color='info' disabled>
                Freeze All (No Permission)
              </Button>
            }
          />
        </Box>
      </Box>

      <Drawer
        anchor='right'
        open={isFilterDrawerOpen}
        onClose={() => handleFilterDrawerToggle()}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '80%', sm: 400 }, p: 3 } }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' fontWeight='bold'>
            Filter Options
          </Typography>
        </Box>
        <Autocomplete
          options={filterOptions}
          value={selectedFilterType}
          onChange={(event, newValue) => {
            setSelectedFilterType(newValue)
            setSelectedFilterValues([])
          }}
          renderInput={params => <TextField {...params} label='Choose Filter Type' variant='outlined' size='small' />}
          sx={{ mb: 3 }}
        />
        {isFilterLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Autocomplete
            multiple
            options={selectedFilterType ? filterValuesMap[selectedFilterType].map(item => item.id) : ['Choose Filter']}
            getOptionLabel={option =>
              selectedFilterType
                ? filterValuesMap[selectedFilterType].find(item => item.id === option)?.name || option
                : option
            }
            value={selectedFilterValues}
            onChange={(event, newValue) => setSelectedFilterValues(newValue)}
            disabled={!selectedFilterType}
            renderInput={params => (
              <TextField
                {...params}
                label='Filter Values'
                variant='outlined'
                size='small'
                sx={{
                  '& .MuiInputBase-input': {
                    color: !selectedFilterType ? 'text.disabled' : 'text.primary'
                  }
                }}
              />
            )}
            sx={{ mb: 3 }}
          />
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='contained' color='primary' onClick={handleApplyFilters} fullWidth>
            Apply Filters
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleResetFilters} fullWidth>
            Reset
          </Button>
        </Box>
      </Drawer>

      {vacancyRequestListFailure ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>No Data</Box>
      ) : (
        <DynamicTable
          columns={columns}
          data={filteredData}
          totalCount={vacancyRequestListData?.totalCount}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Resignation Approvals'
          isRowCheckbox={true}
          onRowSelectionChange={selectedRows => {}}
          loading={vacancyRequestListLoading || updateVacancyRequestStatusLoading}
        />
      )}
    </Box>
  )
}

export default VacancyRequestDetail
