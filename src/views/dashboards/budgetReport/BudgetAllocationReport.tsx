'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'
import { Clear } from '@mui/icons-material'
import CalendarToday from '@mui/icons-material/CalendarToday'
import custom_theme_settings from '@/utils/custom_theme_settings.json'

// Data Type for the Budget Allocation Report
type BudgetDataType = {
  department: string
  allocatedBudget: number
  spentBudget: number
  remainingBudget: number
  status: 'on-track' | 'exceeded' | 'under-utilized'
}

type StatusObj = Record<
  BudgetDataType['status'],
  {
    text: string
    color: 'success' | 'error' | 'warning'
  }
>

// Status Mapping for Chips
const statusObj: StatusObj = {
  'on-track': { text: 'On Track', color: 'success' },
  exceeded: { text: 'Exceeded', color: 'error' },
  'under-utilized': { text: 'Under Utilized', color: 'warning' }
}

// Sample Data for Budget Allocation Report
const data: BudgetDataType[] = [
  { department: 'IT', allocatedBudget: 50000, spentBudget: 45000, remainingBudget: 5000, status: 'on-track' },
  { department: 'HR', allocatedBudget: 20000, spentBudget: 25000, remainingBudget: -5000, status: 'exceeded' },
  { department: 'Marketing', allocatedBudget: 40000, spentBudget: 30000, remainingBudget: 10000, status: 'on-track' },
  {
    department: 'Finance',
    allocatedBudget: 60000,
    spentBudget: 40000,
    remainingBudget: 20000,
    status: 'under-utilized'
  },
  { department: 'Operations', allocatedBudget: 30000, spentBudget: 35000, remainingBudget: -5000, status: 'exceeded' }
]

const BudgetAllocationReport = () => {
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
  const onViewDetails = (departmentId: string) => {
    router.push(`/budget-management/view/${departmentId}`)
  }

  return (
    <Card>
      <CardHeader
        title='Budget Allocation Report'
        subheader='A detailed report of budget allocation across departments'
        action={
          <Grid container spacing={2} alignItems='center' justifyContent='flex-end'>
            {/* Autocomplete for Department */}
            <Grid item xs={12} sm={4} md={5}>
              <DynamicAutocomplete
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    height: '15px',
                    padding: '12px'
                  }
                }}
                label='Department'
                options={[
                  { name: 'IT' },
                  { name: 'HR' },
                  { name: 'Marketing' },
                  { name: 'Finance' },
                  { name: 'Operations' }
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
              <th className='leading-6 plb-4 pis-6 pli-2'>Department</th>
              <th className='leading-6 plb-4 pli-2'>Allocated Budget</th>
              <th className='leading-6 plb-4 pli-2'>Spent Budget</th>
              <th className='leading-6 plb-4 pli-2'>Remaining Budget</th>
              <th className='leading-6 plb-4 pli-2'>Status</th>
              <th className='leading-6 plb-4 pli-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <Typography color='text.primary'>{row.department}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>${row.allocatedBudget.toLocaleString()}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>${row.spentBudget.toLocaleString()}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>${row.remainingBudget.toLocaleString()}</Typography>
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
                  <Tooltip title='Click here to view the details of this department.' placement='top'>
                    <IconButton onClick={() => onViewDetails(row.department)}>
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

export default BudgetAllocationReport
