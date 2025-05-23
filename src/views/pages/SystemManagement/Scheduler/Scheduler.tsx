import { useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  AccordionDetails,
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Drawer,
  Divider
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { createColumnHelper } from '@tanstack/react-table'

import { useFormik } from 'formik'

import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicTable from '@/components/Table/dynamicTable'

interface SchedulerFormDrawerProps {
  open: boolean
  onClose: () => void
  editData: { typeofdata: string; frequency: string; frequencyCount: number } | null
  onSubmit: (values: { typeofdata: string; frequency: string; frequencyCount: string }) => void
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
    { name: 'Daily' },
    { name: 'Weekly' },
    { name: 'Monthly' },
    { name: 'Quarterly' },
    { name: 'Annually' }
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
      frequencyCount: editData?.frequencyCount?.toString() || ''
    },
    validate,
    onSubmit: values => {
      onSubmit(values)
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
                flexDirection: 'column', // Changed to column to stack fields vertically
                alignItems: 'flex-start', // Align items to the start for better spacing
                width: '100%',
                gap: '16px' // Increased gap for better spacing between fields
              }}
            >
              <Box sx={{ width: '100%', boxShadow: 'none' }}>
                <div className='flex flex-col gap-4' style={{ zIndex: 999 }}>
                  <div className='flex flex-col gap-4'>
                    {' '}
                    {/* Changed to flex-col to stack fields */}
                    <div>
                      <Autocomplete
                        disablePortal
                        options={options}
                        getOptionLabel={option => option.name} // Ensures label is shown correctly
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
                        getOptionLabel={option => option.name} // Ensures label is shown correctly
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
                        sx={{ width: 300 }} // Match width with Autocomplete fields for consistency
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
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState<{
    typeofdata: string
    frequency: string
    frequencyCount: number
  } | null>(null)

  const handleButtonClick = () => {
    setEditData(null) // Clear edit data if opening normally
    setIsOpen(true)
  }

  const handleClose = () => {
    setEditData(null)
    setIsOpen(false)
  }

  const handleSubmit = (values: { typeofdata: string; frequency: string; frequencyCount: string }) => {
    alert(JSON.stringify(values, null, 2))
  }

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
      columnHelper.accessor('Action', {
        header: 'Action',
        cell: ({ row }) => (
          <IconButton
            title='Edit'
            sx={{ fontSize: '30px' }}
            onClick={() => {
              setIsOpen(true)
              setEditData(row.original)
            }}
          >
            <i className='tabler-edit w-5 h-5' />
          </IconButton>
        )
      })
    ],
    []
  )

  const data = useMemo(
    () => [
      { typeofdata: 'Employment Data', frequency: 'Monthly', frequencyCount: 12 },
      { typeofdata: 'Resignation Data', frequency: 'Annually', frequencyCount: 1 },
      { typeofdata: 'Branch Data', frequency: 'Weekly', frequencyCount: 52 },
      { typeofdata: 'Branch Budget Data', frequency: 'Quarterly', frequencyCount: 4 },
      { typeofdata: 'Department Budget Data', frequency: 'Monthly', frequencyCount: 12 }
    ],
    []
  )

  return (
    <div style={{ overflow: 'visible' }}>
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
              label='Search by File Name'
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
            {/* <Tooltip title='Add Schedule'> */}
            <Button
              onClick={handleButtonClick}
              variant='contained'
              color='primary'
              sx={{ minWidth: '80px', textTransform: 'none' }}
              size='small'
            >
              New Schedule
            </Button>
            {/* </Tooltip> */}
          </Box>
        </Box>
      </Card>

      <SchedulerFormDrawer open={isOpen} onClose={handleClose} editData={editData} onSubmit={handleSubmit} />

      <div>
        <DynamicTable tableName='Schedule List' columns={columns} data={data} />
      </div>
    </div>
  )
}

export default SchedulerPage
