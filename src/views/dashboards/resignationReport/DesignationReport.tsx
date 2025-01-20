'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import { Clear } from '@mui/icons-material'
import CalendarToday from '@mui/icons-material/CalendarToday'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import { useState } from 'react'

// Data Type for the Resigned Report
type ResignedDataType = {
  name: string
  designation: string
  resignationDate: string
  status: 'approved' | 'rejected' | 'pending'
}

type StatusObj = Record<
  ResignedDataType['status'],
  {
    text: string
    color: 'success' | 'error' | 'warning' | 'default' | 'primary' | 'secondary' | 'info'
  }
>

// Status Mapping for Chips
const statusObj: StatusObj = {
  approved: { text: 'Approved', color: 'success' },
  rejected: { text: 'Rejected', color: 'error' },
  pending: { text: 'Pending', color: 'warning' }
}

// Sample Data for Resigned Report
const data: ResignedDataType[] = [
  {
    name: 'John Doe',
    designation: 'Software Engineer',
    resignationDate: `17 Mar ${new Date().getFullYear()}`,
    status: 'approved'
  },
  {
    name: 'Jane Smith',
    designation: 'Project Manager',
    resignationDate: `12 Feb ${new Date().getFullYear()}`,
    status: 'rejected'
  },
  {
    name: 'Michael Brown',
    designation: 'HR Executive',
    resignationDate: `28 Feb ${new Date().getFullYear()}`,
    status: 'approved'
  },
  {
    name: 'Emily Davis',
    designation: 'Senior Developer',
    resignationDate: `08 Jan ${new Date().getFullYear()}`,
    status: 'pending'
  },
  {
    name: 'Sophia Lee',
    designation: 'UI/UX Designer',
    resignationDate: `19 Oct ${new Date().getFullYear()}`,
    status: 'rejected'
  },
  {
    name: 'Sophia Lee',
    designation: 'UI/UX Designer',
    resignationDate: `19 Oct ${new Date().getFullYear()}`,
    status: 'rejected'
  }
]

const DesignationResignedReport = () => {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange

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
  const onViewDetails = (employeeId: string) => {
    router.push(`/recruitment-management/view/${employeeId}`)
  }

  return (
    <Card
    //  sx={{ minHeight: '67.5vh' }}
    >
      <CardHeader
        title='Designation Resigned Report'
        subheader='A detailed report of all resigned employees'
        action={
          <Grid
            container
            spacing={2}
            alignItems='center'
            justifyContent='flex-end'
            sx={
              {
                // Add responsive behavior for small screens
                // '@media (max-width: 900px)': {
                //   flexDirection: 'column', // Stack the items on small screens
                //   gap: 1 // Adjust the gap between items
                // }
              }
            }
          >
            {/* Autocomplete for Designation */}
            <Grid item xs={12} sm={4} md={5}>
              <DynamicAutocomplete
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    height: '15px',
                    padding: '12px'
                  }
                }}
                label='Designation'
                options={[
                  { name: 'Software Engineer' },
                  { name: 'Project Manager' },
                  { name: 'HR Executive' },
                  { name: 'Senior Developer' },
                  { name: 'UI/UX Designer' }
                ]}
              />
            </Grid>

            {/* Date Range Picker */}
            <Grid item xs={12} sm={4} md={5}>
              <AppReactDatepicker
                selectsRange={true}
                startDate={dateRange[0] || undefined}
                endDate={dateRange[1] || undefined}
                onChange={(date: [Date | null, Date | null] | null) => setDateRange(date ?? [null, null])}
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
                          <IconButton size='small' onClick={() => setDateRange([null, null])}>
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
              <th className='leading-6 plb-4 pli-2'>Designation</th>
              <th className='leading-6 plb-4 pli-2'>Resignation Date</th>
              <th className='leading-6 plb-4 pli-2'>Status</th>
              <th className='leading-6 plb-4 pli-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <Typography color='text.primary'>{row.name}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row.designation}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row.resignationDate}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Chip
                    variant='tonal'
                    size='small'
                    label={statusObj[row.status].text}
                    color={statusObj[row.status].color}
                  />
                </td>
                <td className='pli-2 plb-3'>
                  <Tooltip title='Click here to view the details of this employee.' placement='top'>
                    <IconButton onClick={() => onViewDetails('id')}>
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

export default DesignationResignedReport
