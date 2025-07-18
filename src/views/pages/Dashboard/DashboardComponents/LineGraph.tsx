/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'

import type { SelectChangeEvent } from '@mui/material'
import { Card, CardContent, Typography, Box, MenuItem, Select, useTheme } from '@mui/material'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan 2025', hired: 25000, budget: 12000 },
  { month: 'Feb 2025', hired: 12000, budget: 16000 },
  { month: 'Mar 2025', hired: 15000, budget: 24000 },
  { month: 'Apr 2025', hired: 10000, budget: 18000 },
  { month: 'May 2025', hired: 13000, budget: 14000 },
  { month: 'Jun 2025', hired: 11000, budget: 22000 }
]

const BudgetSummaryCard = () => {
  const theme = useTheme()
  const [range, setRange] = useState('Jan 25 - Jun 2025')

  const handleChange = (event: SelectChangeEvent) => {
    setRange(event.target.value)
  }

  return (
    <Card className='rounded-xl shadow-sm'>
      <CardContent className='relative'>
        {/* Title and Filter */}
        <Box className='flex justify-between items-center mb-6 '>
          <Typography variant='h6' fontWeight='bold'>
            Budget Summary
          </Typography>
          <Select
            size='small'
            value={range}
            onChange={handleChange}
            displayEmpty
            sx={{
              fontSize: 12,
              bgcolor: '#F5F7FE',
              borderRadius: '6px',
              height: '36px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                paddingLeft: 1.5
              }
            }}
            renderValue={() => (
              <Box display='flex' alignItems='center' gap={1}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: '#15192C' }} />
                <Typography variant='body2' fontWeight={600} color='#15192C'>
                  {range}
                </Typography>
              </Box>
            )}
          >
            <MenuItem value='Jan 25 - Jun 2025'>Jan 25 - Jun 2025</MenuItem>
          </Select>
        </Box>

        {/* Chart */}
        <ResponsiveContainer width='100%' height={202}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id='colorHired' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#2196f3' stopOpacity={0.2} />
                <stop offset='95%' stopColor='#2196f3' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='colorBudget' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#4caf50' stopOpacity={0.2} />
                <stop offset='95%' stopColor='#4caf50' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke='#E7ECF3' vertical={false} />
            <XAxis dataKey='month' stroke='#B0B7C3' fontSize={12} />
            <YAxis stroke='#B0B7C3' fontSize={12} />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='hired'
              stroke='#2196f3'
              strokeWidth={2}
              fillOpacity={1}
              fill='url(#colorHired)'
            />
            <Area
              type='monotone'
              dataKey='budget'
              stroke='#4caf50'
              strokeWidth={2}
              fillOpacity={1}
              fill='url(#colorBudget)'
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <Box className='flex gap-8 justify-center mt-4'>
          <Box className='flex items-center gap-1'>
            <Box className='w-2.5 h-2.5 rounded-full bg-[#2196f3]' />
            <Typography variant='caption'>Employees Hired</Typography>
          </Box>
          <Box className='flex items-center gap-1'>
            <Box className='w-2.5 h-2.5 rounded-full bg-[#4caf50]' />
            <Typography variant='caption'>Total Budget</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BudgetSummaryCard
