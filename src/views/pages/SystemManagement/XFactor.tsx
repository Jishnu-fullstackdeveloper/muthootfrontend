import React, { useMemo, useState } from 'react'

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

const DesignationForm = ({ formik }) => {
  const [searchText, setSearchText] = useState('')
  const [accordionExpanded, setAccordionExpanded] = useState(false)
  const [tempDesignations, setTempDesignations] = useState([{ name: '', days: '' }])
  const [savedDesignations, setSavedDesignations] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const designationOptions = [
    { id: 1, name: 'Developer' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Designer' }
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)

  const handleXFactorClick = () => {
    setAccordionExpanded(prev => !prev)

    if (!accordionExpanded) {
      setTempDesignations([{ name: '', days: '' }])
    }
  }

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('serialNo', {
        header: 'Sl No',
        cell: ({ row }) => <Typography>{(page - 1) * limit + row.index + 1}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Designation',
        cell: ({ row }) => <Typography>{row.original.name || '-'}</Typography>
      }),
      columnHelper.accessor('days', {
        header: 'Days',
        cell: ({ row }) => <Typography>{row.original.days || '0'}</Typography>
      }),
      columnHelper.accessor('Action', {
        header: 'Action',
        cell: ({ row }) => (
          <IconButton title='Edit' sx={{ fontSize: '30px' }}>
            <i className='tabler-edit w-5 h-5' />
          </IconButton>
        )
      })
    ],
    [page, limit]
  )

  const handleSave = () => {
    const validDesignations = tempDesignations.filter(d => d.name && d.days)

    console.log('Saving designations:', validDesignations) // Debug log
    setSavedDesignations([...savedDesignations, ...validDesignations])

    formik.setFieldValue('designations', validDesignations)

    if (formik.handleSubmit) {
      formik.handleSubmit()
    } 

    setTempDesignations([{ name: '', days: '' }])

   
    setAccordionExpanded(false)
  }

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
                onChange={handleSearch}
                value={searchText}
                placeholder='Search roles...'
                size='small'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <i className='tabler-search text-xxl' />
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
                            options={designationOptions}
                            getOptionLabel={option => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={designationOptions.find(item => item.name === designation.name) || null}
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
                    <Button variant='contained' color='primary' onClick={handleSave} disabled={isSaveDisabled}>
                      Save
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
      <DynamicTable
       tableName = 'Xfactor List'
        columns={columns}
        data={savedDesignations}
        totalCount={savedDesignations.length}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  )
}

export default DesignationForm
