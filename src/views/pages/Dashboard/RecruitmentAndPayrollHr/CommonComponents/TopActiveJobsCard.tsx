'use client'

import { Card, CardContent, Typography, Box, Divider, MenuItem, Select } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

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
          <Select size='small' value='Last 30 days' disabled className='bg-[#F5F7FE] rounded-md text-sm'>
            <MenuItem value='Last 30 days'>Last 30 days</MenuItem>
          </Select>
        </Box>

        <Box className='w-full h-[240px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Area type='monotone' dataKey='Applications' stroke='#00B798' fill='#00B79822' />
              <Area type='monotone' dataKey='Selected' stroke='#0096DA' fill='#0096DA22' />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Divider className='my-4' />

        <Box sx={{ bgcolor: 'grey.300', p: 4, borderRadius: 2 }}>
          <Box className='flex justify-between text-sm text-gray-500 font-medium mb-2'>
            <span>Job Title</span>
            <span>Applications</span>
          </Box>
          {jobTable.map((job, idx) => (
            <Box key={idx} className='flex justify-between py-1 border-b last:border-b-0'>
              <Typography variant='body2'>{job.title}</Typography>
              <Typography variant='body2' className='font-semibold'>
                {job.applications}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
