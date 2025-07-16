'use client'

import { Card, CardContent, Typography, Box, Avatar, Select, MenuItem } from '@mui/material'

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
          <Typography variant='h6' className='font-semibold'>
            New Applications
          </Typography>
          <Select size='small' value='Today' disabled className='bg-[#F5F7FE] rounded-md text-sm'>
            <MenuItem value='Today'>Today</MenuItem>
          </Select>
        </Box>

        <Box className='flex flex-col gap-3'>
          {applicants.map((applicant, idx) => (
            <Box key={idx} className='flex items-center gap-3'>
              <Avatar sx={{ width: 36, height: 36 }} />
              <Box>
                <Typography variant='body2' className='font-medium'>
                  {applicant.name}
                </Typography>
                <Typography variant='caption' className='text-gray-500'>
                  Applied for {applicant.role}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
