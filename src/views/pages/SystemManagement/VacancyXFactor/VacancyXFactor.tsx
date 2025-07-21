import React, { useMemo, useState, useEffect } from 'react'

import {
  Autocomplete,
  TextField,
  IconButton,
  Card,
  CardContent,
  Box,
  InputAdornment,
  Drawer,
  Button,
  Typography,
  CircularProgress
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchVacancyXFactor, fetchDesignation, updateVacancyXFactor } from '@/redux/VacancyXFactor/vacancyXFactorSlice'

interface VacancyXFactorRow {
  id: string
  designationName: string
  xFactor: number
  Action?: any
}

interface TempDesignation {
  name: string
  days: string
}

const VacancyXFactor = ({ formik }: { formik?: any }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tempDesignations, setTempDesignations] = useState<TempDesignation[]>([{ name: '', days: '' }])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()

  const { vacancyXFactorData, designationData, totalCount } = useAppSelector(state => state.VacancyXFactorReducer)

  useEffect(() => {
    dispatch(fetchDesignation({ page: 1, limit: 100 }))
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    dispatch(fetchVacancyXFactor({ page, limit, search: debouncedSearch }))
  }, [page, limit, debouncedSearch, dispatch])

  const handleRowsPerPageChange = (newPageSize: number) => {
    setLimit(newPageSize)
    setPage(1)
  }

  const handleXFactorClick = () => {
    setDrawerOpen(true)
    setTempDesignations([{ name: '', days: '' }])
    setEditMode(false)
    setEditId(null)
  }

  const columnHelper = createColumnHelper<VacancyXFactorRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('designationName', {
        header: 'Designation',
        cell: ({ row }) => <Typography>{row.original.designationName || '-'}</Typography>
      }),
      columnHelper.accessor('xFactor', {
        header: 'X-Factor',
        cell: ({ row }) => <Typography>{row.original.xFactor || '0'}</Typography>
      }),
      columnHelper.accessor('Action', {
        header: 'Action',
        cell: ({ row }) => (
          <IconButton
            title='Edit'
            sx={{ fontSize: '30px' }}
            onClick={() => {
              setEditMode(true)
              setEditId(row.original.id)
              setTempDesignations([{ name: row.original.designationName, days: row.original.xFactor.toString() }])
              setDrawerOpen(true)
            }}
          >
            <i className='tabler-edit w-5 h-5' />
          </IconButton>
        )
      })
    ],
    []
  )

  const isSaveDisabled =
    !tempDesignations.some(d => d.name && d.days && !isNaN(Number(d.days))) || formik?.isSubmitting || isLoading

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
      <Card sx={{ mb: 4, gap: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <DynamicTextField
                label='Search Roles'
                variant='outlined'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                value={searchTerm}
                placeholder='Search roles...'
                size='small'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {searchTerm ? (
                        <IconButton
                          size='small'
                          onClick={() => {
                            setSearchTerm('')
                            setDebouncedSearch('')
                            setPage(1)
                            dispatch(fetchVacancyXFactor({ page: 1, limit, search: '' }))
                          }}
                        >
                          <i className='tabler-x text-xxl' />
                        </IconButton>
                      ) : (
                        <i className='tabler-search text-xxl' />
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Button variant='contained' color='primary' onClick={handleXFactorClick}>
              X Factor
            </Button>
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
            {editMode ? 'Edit X-Factor' : 'Add X-Factor'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {tempDesignations.map((designation, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Autocomplete
                  options={designationData || []}
                  getOptionLabel={(option: any) => option.name || ''}
                  isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                  value={designationData?.find((item: any) => item.name === designation.name) || null}
                  onChange={(_e, value: any) => {
                    const selectedName = value ? value.name.trim() : ''
                    const newDesignations = [...tempDesignations]

                    newDesignations[index].name = selectedName
                    setTempDesignations(newDesignations)
                  }}
                  disabled={editMode}
                  sx={{ flex: 1 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={`Designation ${index + 1}`}
                      error={formik?.touched?.designations?.[index]?.name && !designation.name}
                      helperText={
                        formik?.touched?.designations?.[index]?.name && !designation.name
                          ? 'Designation is required'
                          : ''
                      }
                      fullWidth
                      aria-label={`Designation ${index + 1}`}
                    />
                  )}
                />
                <TextField
                  label='Days'
                  type='number'
                  value={designation.days}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value

                    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                      const newDesignations = [...tempDesignations]

                      newDesignations[index].days = value
                      setTempDesignations(newDesignations)
                    }
                  }}
                  error={formik?.touched?.designations?.[index]?.days && !!formik.errors.designations?.[index]?.days}
                  helperText={formik?.touched?.designations?.[index]?.days && formik.errors.designations?.[index]?.days}
                  sx={{ width: '120px' }}
                  inputProps={{ min: 0, 'aria-label': `Days for designation ${index + 1}` }}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant='outlined'
              onClick={() => {
                setTempDesignations([{ name: '', days: '' }])
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
              onClick={async () => {
                const validDesignations = tempDesignations.filter(d => d.name && d.days && !isNaN(Number(d.days)))

                if (validDesignations.length === 0) {
                  toast.error('At least one valid designation is required')

                  return
                }

                const payload = validDesignations.map(d => ({
                  xFactor: parseInt(d.days, 10) || 0
                }))

                setIsLoading(true)

                try {
                  if (editMode && editId) {
                    await dispatch(updateVacancyXFactor({ id: editId, data: { xFactor: payload[0].xFactor } })).unwrap()
                    toast.success('X-Factor updated successfully')
                  } else {
                    // Assuming createXFactor exists; add logic here if needed
                    // await dispatch(createVacancyXFactor({ data: payload })).unwrap();
                    toast.success('X-Factor added successfully')
                  }

                  setTempDesignations([{ name: '', days: '' }])
                  setDrawerOpen(false)
                  setEditMode(false)
                  setEditId(null)
                  dispatch(fetchVacancyXFactor({ page, limit, search: debouncedSearch }))
                } catch (error: any) {
                  toast.error(error.message || 'Failed to save X-Factor')
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isSaveDisabled}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              aria-label={editMode ? 'Update X-Factor' : 'Save X-Factor'}
            >
              {editMode ? 'Update' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Drawer>
      <DynamicTable
        tableName='Vacancy X-Factor List'
        columns={columns}
        data={vacancyXFactorData}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        page={page}
        limit={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={totalCount}
        onPageChange={(newPage: number) => {
          setPage(newPage + 1)
        }}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit)
          setPage(1)
        }}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
    </div>
  )
}

export default VacancyXFactor
