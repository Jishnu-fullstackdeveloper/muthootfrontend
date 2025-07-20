'use client'

import { Card, CardContent, Typography, Box, Divider, MenuItem, Select } from '@mui/material'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

const data = [
  { name: 'Jan 2025', Applications: 12000, Selected: 25000 },
  { name: 'Feb 2025', Applications: 14000, Selected: 10000 },
  { name: 'Mar 2025', Applications: 20000, Selected: 15000 },
  { name: 'Apr 2025', Applications: 25000, Selected: 15000 },
  { name: 'May 2025', Applications: 18000, Selected: 10000 },
  { name: 'Jun 2025', Applications: 23000, Selected: 11000 }
]

const jobTable = [
  { title: 'Sales Manager', applications: 200 },
  { title: 'Senior Accountant', applications: 180 },
  { title: 'Accountant', applications: 121 },
  { title: 'Marketing Manager', applications: 101 },
  { title: 'Front Office', applications: 15 }
]

export default function TopActiveJobs() {
  return (
    <Card className='bg-white rounded-lg shadow-sm'>
      <CardContent>
        <Box className='flex justify-between items-center mb-4'>
          <Typography variant='h6' className='font-semibold'>
            Top Active Jobs
          </Typography>
          <Select
            size='small'
            displayEmpty
            sx={{
              fontSize: 10,
              bgcolor: '#F7F9FC',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }}
            renderValue={() => (
              <Box display='flex' alignItems='center' gap={1}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: '#15192C' }} />
                <Typography variant='body2' fontWeight={600} color='#15192C'>
                  Last 30 days
                </Typography>
              </Box>
            )}
          >
            <MenuItem value='Today'>Today</MenuItem>
          </Select>
        </Box>

        <Box className='w-full h-[240px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data}>
              <defs>
                <linearGradient id='colorApplications' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#00B798' stopOpacity={0.3} />
                  <stop offset='100%' stopColor='#00B798' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='colorSelected' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#0096DA' stopOpacity={0.3} />
                  <stop offset='100%' stopColor='#0096DA' stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis dataKey='name' />
              <YAxis tickFormatter={value => `${value / 1000}K`} axisLine={false} tickLine={false} />

              <Tooltip />
              <Area
                type='monotone'
                dataKey='Applications'
                stroke='#00B798'
                fill='url(#colorApplications)'
                strokeWidth={3}
              />
              <Area type='monotone' dataKey='Selected' stroke='#0096DA' fill='url(#colorSelected)' strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ bgcolor: 'grey.100', p: 4, borderRadius: 2, mt: 14 }}>
          <Box className='flex justify-between text-sm text-black font-medium mb-2'>
            <span>Job Title</span>
            <span>Applications</span>
          </Box>
          <Divider className='my-3' />
          {jobTable.map((job, idx) => (
            <Box key={idx} className='flex justify-between py-4  last:border-b-0'>
              <Typography variant='body2' color='#23262F'>
                {job.title}
              </Typography>
              <Typography variant='body2' className='font-medium' color='black'>
                {job.applications}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
