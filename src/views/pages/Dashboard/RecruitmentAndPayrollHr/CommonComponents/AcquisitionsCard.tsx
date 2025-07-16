'use client'

import { Card, CardContent, Typography, Box, LinearProgress, Select, MenuItem } from '@mui/material'

export default function AcquisitionsCard() {
  const acquisitions = [
    { label: 'Applications', color: '#0096DA', percent: 64 },
    { label: 'Shortlisted', color: '#00B798', percent: 18 },
    { label: 'On-hold', color: '#00BFA5', percent: 10 },
    { label: 'Rejected', color: '#F76565', percent: 8 }
  ]

  return (
    <Card className='bg-white rounded-lg shadow-sm'>
      <CardContent>
        <Box className='flex justify-between items-center mb-4'>
          <Typography variant='h6' className='font-semibold'>
            Acquisitions
          </Typography>
          <Select size='small' value='This Month' disabled className='bg-[#F5F7FE] rounded-md text-sm'>
            <MenuItem value='This Month'>This Month</MenuItem>
          </Select>
        </Box>

        <Box className='flex mb-3'>
          {acquisitions.map((item, idx) => (
            <Box
              key={idx}
              sx={{ flexGrow: item.percent, backgroundColor: item.color }}
              className='h-2 rounded-full mx-0.5'
            />
          ))}
        </Box>

        {acquisitions.map((item, idx) => (
          <Box key={idx} className='flex justify-between items-center py-1 text-sm'>
            <Box className='flex items-center gap-2'>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
              <Typography>{item.label}</Typography>
            </Box>
            <Typography>{item.percent}%</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}
