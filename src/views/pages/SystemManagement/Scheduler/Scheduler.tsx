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
  Switch,
  CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { createColumnHelper } from '@tanstack/react-table'
import { useFormik } from 'formik'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState } from '@/redux/store'
import type { SchedulerManagementState } from '@/types/scheduler'
import { getSchedulerConfigList, updateSchedulerConfig, createScheduler } from '@/redux/Scheduler/schedulerSlice'
import DynamicTable from '@/components/Table/dynamicTable'
import DynamicButton from '@/components/Button/dynamicButton'

interface SchedulerFormDrawerProps {
  open: boolean
  onClose: () => void
  editData: {
    id: string
    url: string
    category: string
    cronExpression: string
    duration: number
    isActive: boolean
  } | null
  onSubmit: (values: {
    id?: string
    url: string
    category: string
    cronExpression: string
    duration: string
    isActive: boolean
  }) => void
}

const SchedulerFormDrawer: React.FC<SchedulerFormDrawerProps> = ({ open, onClose, editData, onSubmit }) => {
  const validate = (values: {
    url: string
    category: string
    cronExpression: string
    duration: string
    isActive?: boolean
  }) => {
    const errors: { url?: string; category?: string; cronExpression?: string; duration?: string } = {}
    const cronRegex = /^(\*|[0-5]?\d)(\/[1-5]?\d)?(\s+(\*|[0-5]?\d)(\/[1-5]?\d)?){4}$/ // Basic cron validation for 5 fields

    if (!values.url) {
      errors.url = 'Type of Data is required'
    }

    if (!values.category) {
      errors.category = 'Category is required'
    }

    if (!values.cronExpression) {
      errors.cronExpression = 'Cron Expression is required'
    } else if (!cronRegex.test(values.cronExpression)) {
      errors.cronExpression = 'Invalid cron expression (e.g., * * * * * or 0/5 * * * *)'
    }

    if (!values.duration) {
      errors.duration = 'Duration is required'
    } else if (isNaN(Number(values.duration)) || Number(values.duration) <= 0) {
      errors.duration = 'Duration must be a positive number'
    }

    return errors
  }

  const SchedulerFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      url: editData?.url || '',
      category: editData?.category || '',
      cronExpression: editData?.cronExpression || '',
      duration: editData?.duration?.toString() || '',
      isActive: editData?.isActive ?? false
    },
    validate,
    onSubmit: values => {
      onSubmit({
        id: editData?.id,
        url: values.url,
        category: values.category,
        cronExpression: values.cronExpression,
        duration: values.duration,
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
                  <div>
                    <TextField
                      label='Type of Data'
                      value={SchedulerFormik.values.url}
                      onChange={e => SchedulerFormik.setFieldValue('url', e.target.value)}
                      sx={{ width: 300 }}
                      placeholder='e.g., employment.sync'
                    />
                    {SchedulerFormik.touched.url && SchedulerFormik.errors.url && (
                      <Typography color='error'>{SchedulerFormik.errors.url}</Typography>
                    )}
                  </div>
                  <div>
                    <TextField
                      label='Category'
                      value={SchedulerFormik.values.category}
                      onChange={e => SchedulerFormik.setFieldValue('category', e.target.value)}
                      sx={{ width: 300 }}
                      placeholder='e.g., user'
                    />
                    {SchedulerFormik.touched.category && SchedulerFormik.errors.category && (
                      <Typography color='error'>{SchedulerFormik.errors.category}</Typography>
                    )}
                  </div>
                  <div>
                    <TextField
                      label='Cron Expression'
                      value={SchedulerFormik.values.cronExpression}
                      onChange={e => SchedulerFormik.setFieldValue('cronExpression', e.target.value)}
                      sx={{ width: 300 }}
                      placeholder='e.g., * * * * * or 0/5 * * * *'
                    />
                    {SchedulerFormik.touched.cronExpression && SchedulerFormik.errors.cronExpression && (
                      <Typography color='error'>{SchedulerFormik.errors.cronExpression}</Typography>
                    )}
                  </div>
                  <div>
                    <TextField
                      type='number'
                      label='Duration'
                      value={SchedulerFormik.values.duration}
                      onChange={e => SchedulerFormik.setFieldValue('duration', e.target.value)}
                      sx={{ width: 300 }}
                    />
                    {SchedulerFormik.touched.duration && SchedulerFormik.errors.duration && (
                      <Typography color='error'>{SchedulerFormik.errors.duration}</Typography>
                    )}
                  </div>
                  <div>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography>Active</Typography>
                      <Switch
                        checked={SchedulerFormik.values.isActive}
                        onChange={e => SchedulerFormik.setFieldValue('isActive', e.target.checked)}
                      />
                    </Box>
                  </div>
                </div>
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
    url: string
    category: string
    cronExpression: string
    duration: number
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
    url: string
    category: string
    cronExpression: string
    duration: string
    isActive: boolean
  }) => {
    const params = { key: 'value' } // Replace with actual params if needed

    if (values.id) {
      // Update existing scheduler
      dispatch(
        updateSchedulerConfig({
          id: values.id,
          url: values.url,
          category: values.category,
          cronExpression: values.cronExpression,
          duration: Number(values.duration),
          isActive: values.isActive,
          params
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            getSchedulerConfigList({
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize,
              search: searchQuery || undefined
            })
          )
        })
        .catch(err => console.error('Update scheduler config failed:', err))
    } else {
      // Create new scheduler
      dispatch(
        createScheduler({
          url: values.url,
          category: values.category,
          cronExpression: values.cronExpression,
          duration: Number(values.duration),
          isActive: values.isActive,
          params
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            getSchedulerConfigList({
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize,
              search: searchQuery || undefined
            })
          )
        })
        .catch(err => console.error('Create scheduler config failed:', err))
    }
  }

  const handleToggleActive = (
    id: string,
    url: string,
    category: string,
    cronExpression: string,
    duration: number,
    isActive: boolean
  ) => {
    dispatch(
      updateSchedulerConfig({
        id,
        url,
        category,
        cronExpression,
        duration,
        isActive: !isActive,
        params: { key: 'value' } // Replace with actual params if needed
      })
    )
      .unwrap()
      .then(() => {
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

  // Map API data to table data
  const tableData = useMemo(() => {
    const configsArray = Array.isArray(schedulerConfigs?.data) ? schedulerConfigs?.data : []

    return configsArray.map(config => ({
      id: config.id,
      url: config.url,
      category: config.category,
      cronExpression: config.cronExpression,
      duration: config.duration,
      isActive: config.isActive
    }))
  }, [schedulerConfigs])

  const columnHelper = createColumnHelper<any>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('url', {
        header: 'Type of Data',
        cell: ({ row }) => <Typography>{row.original.url}</Typography>
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) => <Typography>{row.original.category}</Typography>
      }),
      columnHelper.accessor('cronExpression', {
        header: 'Cron Expression',
        cell: ({ row }) => <Typography>{row.original.cronExpression}</Typography>
      }),
      columnHelper.accessor('duration', {
        header: 'Duration',
        cell: ({ row }) => <Typography>{row.original.duration}</Typography>
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
              onChange={() =>
                handleToggleActive(
                  row.original.id,
                  row.original.url,
                  row.original.category,
                  row.original.cronExpression,
                  row.original.duration,
                  row.original.isActive
                )
              }
              onClick={e => e.stopPropagation()}
              color='primary'
            />
          </Box>
        )
      })
    ],
    []
  )

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
            <DynamicButton
              onClick={() => {
                setEditData(null)
                setIsOpen(true)
              }}
              variant='contained'
              size='medium'
              label='New Schedule'
            >
              New Schedule
            </DynamicButton>
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
        <DynamicTable
          columns={columns}
          data={tableData}
          totalCount={schedulerConfigs?.total || 0}
          pagination={pagination}
          tableName='Schedule List'
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      )}
    </Box>
  )
}

export default SchedulerPage
