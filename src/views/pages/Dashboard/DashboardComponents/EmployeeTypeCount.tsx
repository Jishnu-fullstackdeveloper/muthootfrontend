'use client'

import { useState } from 'react'

import type { SelectChangeEvent } from '@mui/material'
import { Box, Card, Typography, Stack, Button } from '@mui/material'

//import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

//import DatePicker from 'react-datepicker'

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'

const EMPLOYEE_TOTAL = 921

const EMPLOYEE_TYPES = [
  {
    label: 'Full Time',
    count: 523,
    percentage: 48,
    color: '#1E90FF'
  },
  {
    label: 'Contract',
    count: 186,
    percentage: 20,
    color: '#F5A623'
  },
  {
    label: 'Probation',
    count: 216,
    percentage: 26,
    color: '#26A69A'
  },
  {
    label: 'WFH',
    count: 32,
    percentage: 6,
    color: '#34495E'
  }
]

export default function EmployeeTypeCard() {
  const [filter, setFilter] = useState('This Week')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string)
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        p: 5

        // width: '100%',
        // maxWidth: 400
      }}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
        <Typography variant='h5' fontWeight={600}>
          Employee Type
        </Typography>
        <Box
          sx={{
            bgcolor: '#F4F5F7',
            borderRadius: 1,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer'
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant='body2' color='text.secondary'>
            {filter}
          </Typography>

          <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
          {/* <DatePicker
            onChange={(date: Date | null) => {
              console.log('DatePicker changed:', date ? date.toISOString() : null)
              setFilter(date ? date.toISOString() : 'This Week')
            }}
            placeholderText='This Week'
            isClearable
            customInput={
              <TextField
                //label='Filter by date'
                variant='standard'
                size='small'
                sx={{ width: '150px', '& .MuiOutlinedInput-root': { border: 'none' } }}
                InputProps={{
                  endAdornment: null,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CalendarMonthOutlinedIcon sx={{ mb: 1 }} />
                    </InputAdornment>
                  )
                }}
              />
            }
            popperProps={{ strategy: 'fixed' }}
            popperClassName='date-picker-popper'
            portalId='date-picker-portal'
          /> */}
        </Box>
      </Stack>

      <Box className='flex flex-row justify-between mt-6'>
        <Typography variant='body2' color='text.secondary' fontWeight={500} gutterBottom>
          Total Employees
        </Typography>
        <Typography variant='h5' fontWeight={700} mb={2}>
          {EMPLOYEE_TOTAL}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          height: 20,
          borderRadius: 0.5,
          overflow: 'hidden',
          mb: 2,
          mt: 1
        }}
      >
        {EMPLOYEE_TYPES.map(type => (
          <Box
            key={type.label}
            sx={{
              flex: type.percentage,
              bgcolor: type.color
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          bgcolor: '#fff',
          p: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid #E0E0E0',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
          mt: 5
        }}
      >
        {EMPLOYEE_TYPES.map((type, idx) => (
          <Box
            key={type.label}
            sx={{
              p: 2,
              borderRight: idx % 2 === 0 ? '1px solid #E0E0E0' : 'none',
              borderBottom: idx < 2 ? '1px solid #E0E0E0' : 'none'
            }}
          >
            <Stack direction='row' spacing={1} alignItems='center' mb={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: type.color
                }}
              />
              <Typography variant='caption' color='text.secondary'>
                {type.label} ({type.percentage}%)
              </Typography>
            </Stack>
            <Typography variant='subtitle1' fontWeight={700} color='black'>
              {type.count}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button
        variant='contained'
        size='large'
        fullWidth
        sx={{
          textTransform: 'none',
          borderRadius: 1,
          mt: 4,
          bgcolor: '#008CDB',
          '&:hover': { bgcolor: '#007AC2' },
          fontSize: '15px' // Reduces text size
        }}
      >
        View all employees
      </Button>
    </Card>
  )
}
