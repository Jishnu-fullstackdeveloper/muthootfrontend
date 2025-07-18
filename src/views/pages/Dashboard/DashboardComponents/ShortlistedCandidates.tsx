'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import ShortlistedIcon from '@/icons/ShortlistedIcon'

//import { useTheme } from '@mui/material/styles'

const ShortlistedCandidatesPage = () => {
  // Hooks
  // const theme = useTheme()

  return (
    <Card sx={{ bgcolor: '#ED960B', borderRadius: 2 }}>
      <CardContent className='flex justify-between gap-4' sx={{ color: 'white' }}>
        <Box className='flex flex-col justify-between gap-4'>
          <Avatar sx={{ width: '60px', height: '60px', bgcolor: 'white', color: '#ED960B', borderRadius: '8px' }}>
            <ShortlistedIcon />
          </Avatar>
          <Typography variant='body2' color='white'>
            Shortlisted Candidates
          </Typography>
          <Typography variant='h3' color='white' fontWeight='bold'>
            59
          </Typography>
        </Box>
        <Box className='flex items-center justify-center'>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant='determinate'
              value={100}
              size={80}
              thickness={4}
              sx={{ color: 'rgba(255, 255, 255, 0.2)' }}
            />
            <CircularProgress
              variant='determinate'
              value={59}
              size={80}
              thickness={4}
              sx={{ color: 'white', position: 'absolute', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant='caption' component='div' color='white'>
                +59%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ShortlistedCandidatesPage
