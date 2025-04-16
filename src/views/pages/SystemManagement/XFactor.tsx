import React, { useMemo, useState, useEffect } from 'react'

import {
  Autocomplete,
  TextField,
  IconButton,
  Card,
  CardContent,
  Box,
  InputAdornment,
  Accordion,
  AccordionDetails,
  Button,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchXFactor, fetchDesignation, createXFactor, updateXFactor } from '@/redux/XFactor/xFactorSlice'

const DesignationForm = ({ formik }) => {
  const [accordionExpanded, setAccordionExpanded] = useState(false)
  const [tempDesignations, setTempDesignations] = useState([{ name: '', days: '' }])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  const dispatch = useAppDispatch()

  const { xFactorData, designationData, totalCount } = useAppSelector(state => state.xFactorReducer)

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
    dispatch(fetchXFactor({ page, limit, search: debouncedSearch }))
  }, [page, limit, debouncedSearch, dispatch])

  const handleXFactorClick = () => {
    setAccordionExpanded(prev => !prev)

    if (!accordionExpanded) {
      setTempDesignations([{ name: '', days: '' }])
      setEditMode(false)
      setEditId(null)
    }
  }

  const columnHelper = createColumnHelper()

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
              setTempDesignations([{ name: row.original.designationName, days: row.original.xFactor }])
              setAccordionExpanded(true)
            }}
          >
            <i className='tabler-edit w-5 h-5' />
          </IconButton>
        )
      })
    ],
    [page, limit]
  )

  const isSaveDisabled = !tempDesignations.some(d => d.name && d.days) || formik?.isSubmitting

  return (
    <div>
      <Card sx={{ mb: 4, gap: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <DynamicTextField
                label='Search Roles'
                variant='outlined'
                onChange={e => setSearchTerm(e.target.value)}
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
                            dispatch(fetchXFactor({ page: 1, limit, search: '' }))
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

          {accordionExpanded && (
            <Accordion
              className='shadow-none border'
              expanded={accordionExpanded}
              onChange={(event, isExpanded) => setAccordionExpanded(isExpanded)}
            >
              <AccordionDetails className='shadow-none'>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    {tempDesignations?.map((designation, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginTop: '16px',
                          alignItems: 'center',
                          width: '100%',
                          gap: '10px'
                        }}
                      >
                        <Box sx={{ width: '300px', boxShadow: 'none' }}>
                          <Autocomplete
                            options={designationData || []}
                            getOptionLabel={option => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={designationData?.find(item => item.name === designation.name) || null}
                            onChange={(e, value) => {
                              const selectedName = value ? value.name.trim() : ''
                              const newDesignations = [...tempDesignations]

                              newDesignations[index].name = selectedName
                              setTempDesignations(newDesignations)
                            }}
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
                              />
                            )}
                          />
                        </Box>

                        <Box style={{ width: '150px', boxShadow: 'none' }}>
                          <TextField
                            label='Days'
                            type='number'
                            value={designation.days === '' ? '' : designation.days}
                            onChange={e => {
                              const value = e.target.value
                              const newDesignations = [...tempDesignations]

                              newDesignations[index].days = value === '' ? '' : parseInt(value, 10) || 0
                              setTempDesignations(newDesignations)
                            }}
                            error={
                              formik?.touched?.designations?.[index]?.days && formik.errors.designations?.[index]?.days
                            }
                            helperText={
                              formik?.touched?.designations?.[index]?.days && formik.errors.designations?.[index]?.days
                            }
                            fullWidth
                            inputProps={{ min: 0 }}
                          />
                        </Box>

                        {index > 0 && (
                          <IconButton
                            color='secondary'
                            onClick={() => setTempDesignations(tempDesignations.filter((_, i) => i !== index))}
                          >
                            <RemoveIcon />
                          </IconButton>
                        )}

                        {index === tempDesignations.length - 1 && (
                          <IconButton
                            color='primary'
                            onClick={() => setTempDesignations([...tempDesignations, { name: '', days: '' }])}
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, boxShadow: 'none' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={async () => {
                        const validDesignations = tempDesignations.filter(d => d.name && d.days)

                        if (validDesignations.length > 0) {
                          const payload = validDesignations.map(d => ({
                            designationName: d.name,
                            xFactor: d.days
                          }))

                          try {
                            if (editMode && editId) {
                              // Update the existing X-Factor for the first valid designation
                              await dispatch(updateXFactor({ id: editId, data: payload[0] }))

                              // Create any additional X-Factors if provided
                              if (payload.length > 1) {
                                await dispatch(createXFactor({ data: payload.slice(1) }))
                              }
                            } else {
                              // Create all valid designations in bulk
                              await dispatch(createXFactor({ data: payload }))
                            }

                            setTempDesignations([{ name: '', days: '' }])
                            setAccordionExpanded(false)
                            setEditMode(false)
                            setEditId(null)

                            dispatch(fetchXFactor({ page, limit, search: debouncedSearch }))
                          } catch (error) {
                            console.error('Error saving X-Factor:', error)
                          }
                        }
                      }}
                      disabled={isSaveDisabled}
                    >
                      {editMode ? 'Update' : 'Save'}
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
      <DynamicTable
        tableName='X-Factor List'
        columns={columns}
        data={xFactorData}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        page={page}
        limit={limit}
        totalCount={totalCount}
        onPageChange={newPage => {
          setPage(newPage + 1)
        }}
        onLimitChange={newLimit => {
          setLimit(newLimit)
          setPage(1)
        }}
      />
    </div>
  )
}

export default DesignationForm
