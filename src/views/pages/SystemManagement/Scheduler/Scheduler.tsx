'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Drawer,
  Divider,
  Autocomplete,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { createColumnHelper } from '@tanstack/react-table'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState } from '@/redux/store'
import {
  getSchedulerConfigList,
  updateSchedulerConfig,
  toggleSchedulerConfig,
  SchedulerManagementState
} from '@/redux/Scheduler/schedulerSlice'
import DynamicTable from '@/components/Table/dynamicTable'
import DynamicButton from '@/components/Button/dynamicButton'

interface SchedulerFormDrawerProps {
  open: boolean
  onClose: () => void
  editData: { id: string; typeofdata: string; frequency: string; frequencyCount: number; isActive: boolean } | null
  onSubmit: (values: {
    id?: string
    typeofdata: string
    frequency: string
    frequencyCount: string
    isActive: boolean
  }) => void
}

const SchedulerFormDrawer: React.FC<SchedulerFormDrawerProps> = ({ open, onClose, editData, onSubmit }) => {
  const options = [
    { name: 'Employment Data' },
    { name: 'Resignation Data' },
    { name: 'Branch Data' },
    { name: 'Branch Budget Data' },
    { name: 'Department Budget Data' }
  ]

  const frequencyOptions = [
    { name: 'Daily', value: 'd' },
    { name: 'Weekly', value: 'w' },
    { name: 'Monthly', value: 'm' },
    { name: 'Yearly', value: 'y' }
  ]

  const validate = (values: { typeofdata: string; frequency: string; frequencyCount: string }) => {
    const errors: { typeofdata?: string; frequency?: string; frequencyCount?: string } = {}

    if (!values.typeofdata) {
      errors.typeofdata = 'Type of Data is required'
    }

    if (!values.frequency) {
      errors.frequency = 'Frequency is required'
    }

    if (!values.frequencyCount) {
      errors.frequencyCount = 'Frequency Count is required'
    } else if (isNaN(Number(values.frequencyCount)) || Number(values.frequencyCount) <= 0) {
      errors.frequencyCount = 'Frequency Count must be a positive number'
    }

    return errors
  }

  const SchedulerFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      typeofdata: editData?.typeofdata || '',
      frequency: editData?.frequency || '',
      frequencyCount: editData?.frequencyCount?.toString() || '',
      isActive: editData?.isActive ?? false
    },
    validate,
    onSubmit: values => {
      onSubmit({
        id: editData?.id,
        typeofdata: values.typeofdata,
        frequency: values.frequency,
        frequencyCount: values.frequencyCount,
        isActive: values.isActive
      })
      onClose()
    }
  })

  return (
    <Drawer anchor='right' open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 330 } } }}>
      <Box sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          {editData ? 'Edit Schedule' : 'New Schedule'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={SchedulerFormik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                gap: '16px'
              }}
            >
              <Box sx={{ width: '100%', boxShadow: 'none' }}>
                <div className='flex flex-col gap-4' style={{ zIndex: 999 }}>
                  <div className='flex flex-col gap-4'>
                    <div>
                      <Autocomplete
                        disablePortal
                        options={options}
                        getOptionLabel={option => option.name}
                        value={
                          options.find(
                            opt => opt.name === (SchedulerFormik.values.typeofdata || editData?.typeofdata)
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          SchedulerFormik.setFieldValue('typeofdata', newValue ? newValue.name : '')
                        }}
                        sx={{ width: 300, zIndex: 999 }}
                        renderInput={params => <TextField {...params} label='Type of Data' />}
                      />
                      {SchedulerFormik.touched.typeofdata && SchedulerFormik.errors.typeofdata && (
                        <Typography color='error'>{SchedulerFormik.errors.typeofdata}</Typography>
                      )}
                    </div>
                    <div>
                      <Autocomplete
                        disablePortal
                        options={frequencyOptions}
                        getOptionLabel={option => option.name}
                        value={
                          frequencyOptions.find(
                            opt => opt.name === (SchedulerFormik.values.frequency || editData?.frequency)
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          SchedulerFormik.setFieldValue('frequency', newValue ? newValue.name : '')
                        }}
                        sx={{ width: 300, zIndex: 999 }}
                        renderInput={params => <TextField {...params} label='Frequency' />}
                      />
                      {SchedulerFormik.touched.frequency && SchedulerFormik.errors.frequency && (
                        <Typography color='error'>{SchedulerFormik.errors.frequency}</Typography>
                      )}
                    </div>
                    <div>
                      <TextField
                        type='number'
                        label='Frequency Count'
                        value={SchedulerFormik.values.frequencyCount}
                        onChange={e => SchedulerFormik.setFieldValue('frequencyCount', e.target.value)}
                        sx={{ width: 300 }}
                      />
                      {SchedulerFormik.touched.frequencyCount && SchedulerFormik.errors.frequencyCount && (
                        <Typography color='error'>{SchedulerFormik.errors.frequencyCount}</Typography>
                      )}
                    </div>
                  </div>
                </div>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <DynamicButton label='Cancel' variant='outlined' size='medium' onClick={onClose}>
              Cancel
            </DynamicButton>
            <DynamicButton
              label={editData ? 'Update' : 'Save'}
              type='submit'
              variant='contained'
              size='medium'
              onClick={() => SchedulerFormik.handleSubmit()}
            >
              {editData ? 'Update' : 'Save'}
            </DynamicButton>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

const SchedulerPage = () => {
  const dispatch = useAppDispatch()
  const {
    schedulerConfigListLoading: loading,
    schedulerConfigListData: schedulerConfigs,
    schedulerConfigListTotal: totalCount,
    schedulerConfigListFailure: failure,
    schedulerConfigListFailureMessage: failureMessage
  } = useAppSelector((state: RootState) => state.schedulerManagementSliceReducer) as SchedulerManagementState

  // Debug the state to inspect schedulerConfigs
  console.log('Scheduler Configs State:', {
    loading,
    schedulerConfigs,
    totalCount,
    failure,
    failureMessage
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState<{
    id: string
    typeofdata: string
    frequency: string
    frequencyCount: number
    isActive: boolean
  } | null>(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0, // 0-based index for table compatibility
    pageSize: 5
  })

  // Fetch scheduler configs on mount and when pagination or search changes
  useEffect(() => {
    dispatch(
      getSchedulerConfigList({
        page: pagination.pageIndex + 1, // Convert to 1-based index for API
        limit: pagination.pageSize,
        search: searchQuery || undefined
      })
    )
  }, [dispatch, pagination.pageIndex, pagination.pageSize, searchQuery])

  const handleClose = () => {
    setEditData(null)
    setIsOpen(false)
  }

  const handleSubmit = (values: {
    id?: string
    typeofdata: string
    frequency: string
    frequencyCount: string
    isActive: boolean
  }) => {
    const frequencyMap: { [key: string]: string } = {
      Daily: 'd',
      Weekly: 'w',
      Monthly: 'm',
      Yearly: 'y'
    }

    dispatch(
      updateSchedulerConfig({
        id: values.id || '',
        functionName: values.typeofdata,
        schedule: frequencyMap[values.frequency] || 'd',
        duration: Number(values.frequencyCount),
        isActive: values.isActive,
        params: { key: 'value' } // Include params as specified
      })
    )
      .unwrap()
      .then(() => {
        // Refetch the scheduler configs to update the table
        dispatch(
          getSchedulerConfigList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: searchQuery || undefined
          })
        )
      })
      .catch(err => console.error('Update scheduler config failed:', err))
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    dispatch(toggleSchedulerConfig({ id, isActive: !isActive }))
      .unwrap()
      .then(() => {
        // Refetch the scheduler configs to update the table
        dispatch(
          getSchedulerConfigList({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: searchQuery || undefined
          })
        )
      })
      .catch(err => console.error('Toggle scheduler config failed:', err))
  }

  // Map schedule values to display names
  const scheduleDisplayMap: { [key: string]: string } = {
    d: 'Daily',
    w: 'Weekly',
    m: 'Monthly',
    y: 'Yearly'
  }

  // Ensure schedulerConfigs is an array before mapping
  const tableData = useMemo(() => {
    const configsArray = Array.isArray(schedulerConfigs?.data) ? schedulerConfigs?.data : []
    return configsArray.map(config => ({
      id: config.id,
      typeofdata: config.functionName,
      frequency: scheduleDisplayMap[config.schedule] || config.schedule,
      frequencyCount: config.duration,
      isActive: config.isActive
    }))
  }, [schedulerConfigs])

  const columnHelper = createColumnHelper<any>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('typeofdata', {
        header: 'Type of Data',
        cell: ({ row }) => <Typography>{row.original.typeofdata}</Typography>
      }),
      columnHelper.accessor('frequency', {
        header: 'Frequency',
        cell: ({ row }) => <Typography>{row.original.frequency}</Typography>
      }),
      columnHelper.accessor('frequencyCount', {
        header: 'Frequency Count',
        cell: ({ row }) => <Typography>{row.original.frequencyCount}</Typography>
      }),
      columnHelper.accessor('isActive', {
        header: 'Active',
        cell: ({ row }) => (
          <Typography color={row.original.isActive ? 'success.main' : 'error.main'}>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Typography>
        )
      }),
      columnHelper.accessor('Action', {
        header: 'Action',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              title='Edit'
              sx={{ fontSize: '30px' }}
              onClick={e => {
                e.stopPropagation()
                setIsOpen(true)
                setEditData(row.original)
              }}
            >
              <i className='tabler-edit w-5 h-5' />
            </IconButton>
            <Switch
              checked={row.original.isActive}
              onChange={() => handleToggleActive(row.original.id, row.original.isActive)}
              onClick={e => e.stopPropagation()}
              color='primary'
            />
          </Box>
        )
      })
    ],
    []
  )

  const handlePaginationChange = (key: 'pageIndex' | 'pageSize', value: number) => {
    setPagination(prev => ({
      ...prev,
      [key]: key === 'pageIndex' ? value - 1 : value, // Convert to 0-based index for table
      pageIndex: key === 'pageSize' ? 0 : prev.pageIndex // Reset pageIndex when pageSize changes
    }))
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    handlePaginationChange('pageIndex', value)
  }

  const handleChangeLimit = (value: number) => {
    handlePaginationChange('pageSize', value)
  }

  return (
    <Box sx={{ overflow: 'visible' }}>
      <Card
        sx={{
          mb: 4,
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2,
          overflow: 'hidden'
        }}
      >
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-4 border-bs gap-4 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap mt-2'>
            <TextField
              label='Search by Type of Data'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ width: '400px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box className='flex items-center mt-2'>
            {/* Commented out as requested */}
            {/* <Button
              onClick={() => {
                setEditData(null)
                setIsOpen(true)
              }}
              variant="contained"
              color="primary"
              sx={{ minWidth: '80px', textTransform: 'none' }}
              size="small"
            >
              New Schedule
            </Button> */}
          </Box>
        </Box>
      </Card>

      <SchedulerFormDrawer open={isOpen} onClose={handleClose} editData={editData} onSubmit={handleSubmit} />

      {loading && !tableData.length && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {failure && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color='error'>Error: {failureMessage}</Typography>
        </Box>
      )}

      {!loading && tableData.length > 0 && (
        <>
          <DynamicTable
            columns={columns}
            data={tableData}
            totalCount={schedulerConfigs?.totalCount}
            pagination={pagination}
            tableName='Schedule List'
          />
          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 6, gap: 2 }}>
            <FormControl size='small' sx={{ minWidth: 70 }}>
              <InputLabel>Count</InputLabel>
              <Select
                value={pagination.pageSize}
                onChange={e => handleChangeLimit(Number(e.target.value))}
                label='Limit per page'
              >
                {[5, 10, 25, 50, 100].map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography>{totalCount}</Typography>
            <Pagination
              color='primary'
              shape='rounded'
              showFirstButton
              showLastButton
              count={Math.ceil(totalCount / pagination.pageSize)}
              page={pagination.pageIndex + 1} // Convert back to 1-based index for pagination
              onChange={handlePageChange}
            />
          </Box> */}
        </>
      )}
    </Box>
  )
}

export default SchedulerPage
