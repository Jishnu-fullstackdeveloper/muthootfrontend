'use client'

import { Card, CardContent, Typography, Box, Avatar, Select, MenuItem } from '@mui/material'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

const applicants = [
  { name: 'Douglas Ray', role: 'Sales Manager' },
  { name: 'Cameron Williamson', role: 'Senior Accountant' },
  { name: 'Jane Cooper', role: 'Front Office' },
  { name: 'Guy Hawkins', role: 'Marketing Manager' },
  { name: 'Jenny Wilson', role: 'Accountant' },
  { name: 'Jenny Wilson', role: 'Accountant' }
]

export default function NewApplications() {
  return (
    <Card className='bg-white rounded-lg shadow-sm'>
      <CardContent>
        <Box className='flex justify-between items-center mb-4'>
          <Typography variant='h6' className='font-bold'>
            New Applications
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
                  Today
                </Typography>
              </Box>
            )}
          >
            <MenuItem value='Today'>Today</MenuItem>
          </Select>
        </Box>

        <Box className='flex flex-col gap-3'>
          {applicants.map((applicant, idx) => (
            <Box key={idx} className='flex items-center gap-3 py-1'>
              <Avatar sx={{ width: 36, height: 36 }} />
              <Box>
                <Typography variant='body2' className='font-medium' color='#333333' fontSize='14px' fontWeight={500}>
                  {applicant.name}
                </Typography>
                <Typography variant='caption' className='text-gray-500'>
                  Applied for{' '}
                  <Box component='span' sx={{ color: '#333333', fontSize: '14px' }} fontWeight={500}>
                    {applicant.role}
                  </Box>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
