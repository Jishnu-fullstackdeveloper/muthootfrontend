'use client'
import React, { useMemo, useState, useEffect } from 'react'

import {
  TextField,
  IconButton,
  Card,
  CardContent,
  Box,
  InputAdornment,
  Drawer,
  Button,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import SearchIcon from '@mui/icons-material/Search'
import { createColumnHelper } from '@tanstack/react-table'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchNoticePeriod,
  updateNoticePeriod,
  createNoticePeriod,
  deleteNoticePeriod,
  resetNoticePeriodState
} from '@/redux/NoticePeriod/noticePeriodSlice'

import type { NoticePeriodRow, TempNoticePeriod } from '@/types/noticePeriod'

const NoticePeriodPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<'resigned' | 'vacancy' | null>(null)

  const [tempNoticePeriods, setTempNoticePeriods] = useState<TempNoticePeriod[]>([
    { minimumDays: '', maximumDays: '', xFactor: '' }
  ])

  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const dispatch = useAppDispatch()

  const {
    resignedData,
    resignedTotalCount,
    vacancyData,
    vacancyTotalCount,
    updateStatus,
    createStatus,
    deleteStatus,
    error,
    updateResponse,
    createResponse,
    deleteResponse
  } = useAppSelector(state => state.noticePeriodReducer)

  //console.log(updateError)

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch data based on tab and search
  useEffect(() => {
    const type = tabValue === 0 ? 'resigned' : 'vacancy'

    dispatch(fetchNoticePeriod({ page, limit, search: debouncedSearch, type }))
  }, [dispatch, page, limit, debouncedSearch, tabValue])

  useEffect(() => {
    if (updateStatus === 'succeeded' && updateResponse) {
      setTempNoticePeriods([{ minimumDays: '', maximumDays: '', xFactor: '' }])
      setDrawerOpen(false)
      setEditMode(false)
      setEditId(null)
      toast.success('Notice Period updated successfully')
      dispatch(resetNoticePeriodState())
    } else if (updateStatus === 'failed' && error) {
      toast.error(error)
      dispatch(resetNoticePeriodState())
    }

    if (createStatus === 'succeeded' && createResponse) {
      setTempNoticePeriods([{ minimumDays: '', maximumDays: '', xFactor: '' }])
      setDrawerOpen(false)
      setEditMode(false)
      setEditId(null)
      toast.success('Notice Period created successfully')
      dispatch(resetNoticePeriodState())
    } else if (createStatus === 'failed' && error) {
      toast.error(error)
      dispatch(resetNoticePeriodState())
    }

    if (deleteStatus === 'succeeded' && deleteResponse) {
      toast.success('Notice Period deleted successfully')
      dispatch(resetNoticePeriodState())
    } else if (deleteStatus === 'failed' && error) {
      toast.error(error)
      dispatch(resetNoticePeriodState())
    }
  }, [updateStatus, updateResponse, createStatus, createResponse, deleteStatus, deleteResponse, error, dispatch])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setPage(1)
  }

  const handleNoticePeriodClick = () => {
    setDrawerOpen(true)
    setTempNoticePeriods([{ minimumDays: '', maximumDays: '', xFactor: '' }])
    setEditMode(false)
    setEditId(null)
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setLimit(newPageSize)
    setPage(1)
  }

  const columnHelper = createColumnHelper<NoticePeriodRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('minimumDays', {
        header: 'Minimum Days',
        cell: ({ row }) => <Typography>{row.original.minimumDays}</Typography>
      }),
      columnHelper.accessor('maximumDays', {
        header: 'Maximum Days',
        cell: ({ row }) => <Typography>{row.original.maximumDays}</Typography>
      }),
      columnHelper.accessor('xFactor', {
        header: 'X-Factor',
        cell: ({ row }) => <Typography>{row.original.xFactor || '0'}</Typography>
      }),

      columnHelper.accessor('Action', {
        header: 'Action',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              title='Edit'
              sx={{ fontSize: '20px' }}
              onClick={() => {
                setEditMode(true)
                setEditId(row.original.id)
                setTempNoticePeriods([
                  {
                    minimumDays: row.original.minimumDays.toString(),
                    maximumDays: row.original.maximumDays.toString(),
                    xFactor: row.original.xFactor.toString()
                  }
                ])
                setDrawerOpen(true)
              }}
            >
              {/* <i className='tabler-edit w-5 h-5' /> */}
              <EditIcon />
            </IconButton>
            <IconButton
              title='Delete'
              sx={{ fontSize: '20px' }}
              onClick={() => {
                setDeleteId(row.original.id)
                setDeleteType(tabValue === 0 ? 'resigned' : 'vacancy')
                setDialogOpen(true)
              }}
            >
              {/* <i className='tabler-trash w-5 h-5' /> */}
              <DeleteIcon />
            </IconButton>
          </Box>
        )
      })
    ],
    []
  )

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDeleteId(null)
    setDeleteType(null)
  }

  const handleConfirmDelete = () => {
    if (deleteId && deleteType) {
      dispatch(deleteNoticePeriod({ id: deleteId, type: deleteType }))
      toast.success('Notice Period deleted successfully')
    }

    handleCloseDialog()
  }

  const isSaveDisabled = !tempNoticePeriods.some(
    d =>
      d.minimumDays &&
      d.maximumDays &&
      d.xFactor &&
      !isNaN(Number(d.minimumDays)) &&
      !isNaN(Number(d.maximumDays)) &&
      !isNaN(Number(d.xFactor))
  )

  return (
    <div>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ConfirmModal
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title='Confirm Deletion'
        description='Are you sure you want to delete this notice period? This action cannot be undone.'
        id={deleteId ?? undefined}
      />
      <Card
        sx={{
          mb: 4,

          //position: 'sticky',
          top: 70,
          zIndex: 1,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-3 border-bs gap-3 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-3 flex-wrap'>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 4 }}>
              Notice Period
            </Typography>
          </Box>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-between', mt: 2 }}>
            <DynamicTextField
              label='Search'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              sx={{ width: '350px', mt: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {searchQuery ? (
                      <IconButton size='small' onClick={() => setSearchQuery('')}>
                        <i className='tabler-x text-xxl' />
                      </IconButton>
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                )
              }}
            />
            <Tooltip title='Add Notice Period'>
              <Button
                variant='contained'
                color='primary'
                size='small'
                onClick={handleNoticePeriodClick}
                sx={{ height: '32px', mt: 1 }}
                startIcon={<AddIcon />}
              >
                Notice Period
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label='Notice Period Tabs'>
            <Tab label='Resigned' />
            <Tab label='Vacancy' />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            <DynamicTable
              tableName={
                tabValue === 0
                  ? 'Notice period configuration for resignation'
                  : 'Notice period configuration for vacancy'
              }
              columns={columns}
              data={
                tabValue === 0
                  ? resignedData.map(item => ({
                      id: item.id,
                      minimumDays: item.minDays,
                      maximumDays: item.maxDays,
                      xFactor: item.xFactor
                    }))
                  : vacancyData.map(item => ({
                      id: item.id,
                      minimumDays: item.minDays,
                      maximumDays: item.maxDays,
                      xFactor: item.xFactor
                    }))
              }
              pagination={{ pageIndex: page - 1, pageSize: limit }}
              page={page}
              limit={limit}
              onRowsPerPageChange={handleRowsPerPageChange}
              totalCount={tabValue === 0 ? resignedTotalCount : vacancyTotalCount}
              onPageChange={(newPage: number) => setPage(newPage + 1)}
              onLimitChange={(newLimit: number) => {
                setLimit(newLimit)
                setPage(1)
              }}
              sorting={undefined}
              onSortingChange={undefined}
              initialState={undefined}
            />
          </Box>
        </CardContent>
      </Card>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '90vw', sm: '500px' },
            padding: 2,
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 3, gap: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
            {editMode ? 'Edit Notice Period' : 'Add Notice Period'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {tempNoticePeriods.map((noticePeriod, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <TextField
                  label='Minimum Days'
                  type='number'
                  value={noticePeriod.minimumDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value

                    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                      const newNoticePeriods = [...tempNoticePeriods]

                      newNoticePeriods[index].minimumDays = value
                      setTempNoticePeriods(newNoticePeriods)
                    }
                  }}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, 'aria-label': `Minimum Days ${index + 1}` }}
                />
                <TextField
                  label='Maximum Days'
                  type='number'
                  value={noticePeriod.maximumDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value

                    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                      const newNoticePeriods = [...tempNoticePeriods]

                      newNoticePeriods[index].maximumDays = value
                      setTempNoticePeriods(newNoticePeriods)
                    }
                  }}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, 'aria-label': `Maximum Days ${index + 1}` }}
                />
                <TextField
                  label='X-Factor'
                  type='number'
                  value={noticePeriod.xFactor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value

                    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                      const newNoticePeriods = [...tempNoticePeriods]

                      newNoticePeriods[index].xFactor = value
                      setTempNoticePeriods(newNoticePeriods)
                    }
                  }}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, 'aria-label': `X-Factor ${index + 1}` }}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant='outlined'
              onClick={() => {
                setTempNoticePeriods([{ minimumDays: '', maximumDays: '', xFactor: '' }])
                setDrawerOpen(false)
                setEditMode(false)
                setEditId(null)
              }}
              aria-label='Cancel'
            >
              Cancel
            </Button>

            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                const validNoticePeriods = tempNoticePeriods.filter(
                  d =>
                    d.minimumDays &&
                    d.maximumDays &&
                    d.xFactor &&
                    !isNaN(Number(d.minimumDays)) &&
                    !isNaN(Number(d.maximumDays)) &&
                    !isNaN(Number(d.xFactor))
                )

                if (validNoticePeriods.length === 0) {
                  toast.error('At least one valid notice period is required')

                  return
                }

                const type = tabValue === 0 ? 'resigned' : 'vacancy'

                const data = {
                  minDays: parseInt(validNoticePeriods[0].minimumDays, 10),
                  maxDays: parseInt(validNoticePeriods[0].maximumDays, 10),
                  xFactor: parseInt(validNoticePeriods[0].xFactor, 10)
                }

                if (editMode && editId) {
                  dispatch(updateNoticePeriod({ id: editId, data, type }))
                } else {
                  dispatch(createNoticePeriod({ data, type }))
                }
              }}
              disabled={isSaveDisabled || updateStatus === 'loading' || createStatus === 'loading'}
              startIcon={
                updateStatus === 'loading' || createStatus === 'loading' ? <CircularProgress size={20} /> : null
              }
              aria-label={editMode ? 'Update Notice Period' : 'Save Notice Period'}
            >
              {editMode ? 'Update' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  )
}

export default NoticePeriodPage
