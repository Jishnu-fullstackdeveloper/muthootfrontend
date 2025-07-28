'use client'

import { Card, CardContent, Typography, Box, Select, MenuItem } from '@mui/material'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

export default function AcquisitionsCard() {
  const acquisitions = [
    { label: 'Applications', color: '#0096DA', percent: 64 },
    { label: 'Shortlisted', color: '#00B798', percent: 18 },
    { label: 'On-hold', color: '#00BFA5', percent: 10 },
    { label: 'Rejected', color: '#F76565', percent: 8 }
  ]

  return (
    <Card className='bg-white rounded-lg shadow-sm p-0'>
      <CardContent>
        <Box className='flex justify-between items-center mb-4'>
          <Typography variant='h6' className='font-semibold'>
            Acquisitions
          </Typography>
          <Select
            size='small'
            displayEmpty
            sx={{
              fontSize: 10,

              // px: 1,
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
              <Box display='flex' alignItems='center' gap={2}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />

                <Typography variant='body2' fontWeight={600} color='#2D3748'>
                  This Month
                </Typography>
              </Box>
            )}
          >
            <MenuItem value='This Month'>This Month</MenuItem>
            <MenuItem value='Last Month'>Last Month</MenuItem>
          </Select>
        </Box>

        <Box className='flex mb-6 overflow-hidden h-2 rounded-full'>
          {acquisitions.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                flexGrow: item.percent,
                backgroundColor: item.color,
                borderTopLeftRadius: idx === 0 ? '9999px' : 0,
                borderBottomLeftRadius: idx === 0 ? '9999px' : 0,
                borderTopRightRadius: idx === acquisitions.length - 1 ? '9999px' : 0,
                borderBottomRightRadius: idx === acquisitions.length - 1 ? '9999px' : 0
              }}
            />
          ))}
        </Box>

        {acquisitions.map((item, idx) => (
          <Box key={idx} className='flex justify-between items-center py-2  text-sm'>
            <Box className='flex items-center gap-2'>
              <Box sx={{ width: 22, height: 10, borderRadius: 2, backgroundColor: item.color }} />
              <Typography>{item.label}</Typography>
            </Box>
            <Typography sx={{ color: 'black' }} fontWeight={500}>
              {item.percent}%
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}
