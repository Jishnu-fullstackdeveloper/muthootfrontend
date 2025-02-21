'use client'

// MUI Imports
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Tooltip } from '@mui/material'

// Style Imports
import { Clear } from '@mui/icons-material'

import CalendarToday from '@mui/icons-material/CalendarToday'

import tableStyles from '@core/styles/table.module.css'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'

import custom_theme_settings from '@/utils/custom_theme_settings.json'

// Data Type for the Resignation List Report
type ResignationDataType = {
  employeeName: string
  department: string
  resignationDate: string
  reason: string
}

// Sample Data for Resignation List Report
const data: ResignationDataType[] = [
  { employeeName: 'John Doe', department: 'IT', resignationDate: '2023-10-01', reason: 'Personal Reasons' },
  { employeeName: 'Jane Smith', department: 'HR', resignationDate: '2023-09-15', reason: 'Career Change' },
  { employeeName: 'Alice Johnson', department: 'Marketing', resignationDate: '2023-08-20', reason: 'Relocation' },
  { employeeName: 'Bob Brown', department: 'Finance', resignationDate: '2023-07-30', reason: 'Health Issues' },
  {
    employeeName: 'Charlie Davis',
    department: 'Operations',
    resignationDate: '2023-06-25',
    reason: 'Pursuing Education'
  }
]

const ResignationsListReport = () => {
  const router = useRouter()

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
    display_numbers_count: 5
  })

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginationState({ ...paginationState, page: value })
  }

  const handleChangeLimit = (value: any) => {
    setPaginationState({ ...paginationState, limit: value })
  }

  // Function to handle View Details action
  const onViewDetails = (employeeName: string) => {
    router.push(`/resignation-management/view/${employeeName}`)
  }

  return (
    <Card>
      <CardHeader
        title='Resignations List Report'
        subheader='A detailed report of employee resignations'
        action={
          <Grid container spacing={2} alignItems='center' justifyContent='flex-end'>
            {/* Autocomplete for Employee Name */}
            <Grid item xs={12} sm={4} md={5}>
              <DynamicAutocomplete
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    height: '15px',
                    padding: '12px'
                  }
                }}
                label='Employee Name'
                options={data.map(item => ({ name: item.employeeName }))}
              />
            </Grid>

            {/* Date Range Picker */}
            <Grid item xs={12} sm={4} md={5}>
              <AppReactDatepicker
                selectsRange={true}
                onChange={(date: [Date | null, Date | null] | null) => {}}
                dateFormat='dd-MMMM-yyyy'
                placeholderText='Filter by date'
                customInput={
                  <CustomTextField
                    name='date_ticket'
                    id='date_ticket'
                    sx={{
                      '& .MuiInputBase-input': {
                        height: '30px',
                        padding: '12px'
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <>
                          <IconButton size='small' onClick={() => {}}>
                            <Clear />
                          </IconButton>
                          <IconButton size='small'>
                            <CalendarToday />
                          </IconButton>
                        </>
                      )
                    }}
                  />
                }
              />
            </Grid>

            {/* Apply Filters Button */}
            <Grid item xs={12} sm={4} md={2}>
              <Button variant='contained' style={{ height: 45 }}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        }
      />

      <Box
        className='table-container'
        sx={{
          overflowY: 'auto',
          maxHeight: '400px',
          '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: '#f0f0f0'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: custom_theme_settings?.theme?.primaryColor || '#d4d4d4',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: custom_theme_settings?.theme?.primaryColor || '#bfbfbf'
          }
        }}
      >
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='leading-6 plb-4 pis-6 pli-2'>Employee Name</th>
              <th className='leading-6 plb-4 pli-2'>Department</th>
              <th className='leading-6 plb-4 pli-2'>Resignation Date</th>
              <th className='leading-6 plb-4 pli-2'>Reason</th>
              <th className='leading-6 plb-4 pli-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <Typography color='text.primary'>{row.employeeName}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row.department}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row.resignationDate}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row.reason}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Tooltip title='Click here to view the details of this resignation.' placement='top'>
                    <IconButton onClick={() => onViewDetails(row.employeeName)}>
                      <i className='tabler-eye text-textSecondary'></i>
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <div className='flex items-center justify-end mt-6 pt-5 pb-5 border'>
        {/* Right-aligned Pagination */}
        <FormControl size='small' sx={{ minWidth: 70 }}>
          <InputLabel>Count</InputLabel>
          <Select
            value={paginationState?.limit}
            onChange={e => handleChangeLimit(e.target.value)}
            label='Limit per page'
          >
            {[10, 25, 50, 100].map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Pagination
            color='primary'
            shape='rounded'
            showFirstButton
            showLastButton
            count={paginationState?.display_numbers_count} //pagination numbers display count
            page={paginationState?.page} //current page
            onChange={handlePageChange} //changing page function
          />
        </div>
      </div>
    </Card>
  )
}

export default ResignationsListReport
