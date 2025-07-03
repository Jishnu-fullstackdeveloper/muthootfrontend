'use client'

import { Box, Card, Typography, Stack, Avatar } from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import StoreIcon from '@mui/icons-material/Store'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CampaignIcon from '@mui/icons-material/Campaign'

const jobs = [
  {
    title: 'Project Manager',
    location: 'Kannur, Kerala',
    time: '8 Hours ago',
    icon: <WorkIcon />,
    bgColor: '#E6FBF4'
  },
  {
    title: 'Sales Manager',
    location: 'Trivandrum, Kerala',
    time: '1 Day ago',
    icon: <StoreIcon />,
    bgColor: '#FFF7E6'
  },
  {
    title: 'Senior Accountant',
    location: 'Ernakulam, Kerala',
    time: '1 Day ago',
    icon: <AccountBalanceIcon />,
    bgColor: '#E6F0FF'
  },
  {
    title: 'Marketing Manager',
    location: 'Salem, Tamilnadu',
    time: '2 Days ago',
    icon: <CampaignIcon />,
    bgColor: '#FFE6E6'
  }
]

export default function RecentAddedJobsPage() {
  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        p: 3,
        width: '100%',
        maxWidth: 400
      }}
    >
      <Typography variant='h6' fontWeight={600} mb={2}>
        Recent Added Jobs
      </Typography>

      <Stack spacing={2}>
        {jobs.map((job, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#F9F9F9',
              borderRadius: 2,
              p: 2,
              boxShadow: 'none'
            }}
          >
            <Avatar
              variant='rounded'
              sx={{
                bgcolor: job.bgColor,
                color: 'inherit',
                width: 40,
                height: 40,
                mr: 2
              }}
            >
              {job.icon}
            </Avatar>
            <Box>
              <Typography fontWeight={600} variant='subtitle2'>
                {job.title}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {job.location} - {job.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  )
}
