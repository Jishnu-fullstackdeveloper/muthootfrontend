'use client'

import { Box, Button, Card, Chip, Stack, Typography, Avatar, IconButton } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

const rows = [
  {
    name: 'Jimmy Wilson',
    role: 'Project Manager',
    status: 'Tech Interview',
    avatar: '/avatar1.png',
    roleColor: '#d4e5fc',
    roleTextColor: '#0096DA',
    statusDot: '#00AEEF'
  },
  {
    name: 'Mary Schuelke',
    role: 'Accountant',
    status: 'Machine Test',
    avatar: '/avatar2.png',
    roleColor: '#FFECCC',
    roleTextColor: '#ED960B',
    statusDot: '#FF9F00'
  },
  {
    name: 'Vivian Joseph',
    role: 'Sales Manager',
    status: 'Mock Test',
    avatar: '/avatar3.png',
    roleColor: '#D3F7F3',
    roleTextColor: '#00B798',
    statusDot: '#00C48C'
  }
]

const RecruitmentProgressPage = () => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: '#F5F7FF',
        p: 3,
        height: '359px'
      }}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h5' fontWeight={600}>
          Recruitment Progress
        </Typography>
        <Button
          variant='contained'
          sx={{
            textTransform: 'none',
            borderRadius: 1,
            bgcolor: '#008CDB',
            '&:hover': { bgcolor: '#007AC2' }
          }}
        >
          View all
        </Button>
      </Stack>

      <Stack spacing={2} mt={5} gap={'7px'}>
        <Stack direction='row' spacing={3} px={2}>
          <Typography sx={{ width: '30%', fontWeight: 600 }}>Full Name</Typography>
          <Typography sx={{ width: '30%', fontWeight: 600 }}>Designation</Typography>
          <Typography sx={{ width: '30%', fontWeight: 600 }}>Status</Typography>
        </Stack>

        {rows.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#fff',
              borderRadius: 2,
              py: 1.5,
              px: 2,
              height: '70px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '30%' }}>
              <Avatar src={item.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
              <Typography>{item.name}</Typography>
            </Box>

            <Box sx={{ width: '30%' }}>
              <Chip
                label={item.role}
                sx={{
                  bgcolor: item.roleColor,
                  fontWeight: 500,
                  fontSize: '10px',
                  color: item.roleTextColor,
                  alignItems: 'center'
                }}
              />
            </Box>

            <Box sx={{ width: '30%', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: item.statusDot
                }}
              />
              <Typography>{item.status}</Typography>
            </Box>

            <Box sx={{ ml: 'auto' }}>
              <IconButton>
                <MoreHorizIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  )
}

export default RecruitmentProgressPage
