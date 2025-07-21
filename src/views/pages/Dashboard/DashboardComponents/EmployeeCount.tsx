'use client'

// MUI Imports
import Image from 'next/image'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import EmployeeIcon from '@/icons/EmployeeIcon'
import IntersectImage from '@/assets/images/dashboard/Intersect.png' // Update this path based on your project structure
import IntersectGreenTopLeft from '@/assets/images/dashboard/IntersectGreenTopLeft.png'

//import { useTheme } from '@mui/material/styles'

const EmployeeCountPage = () => {
  // Hooks
  //const theme = useTheme()

  return (
    <Card sx={{ bgcolor: '#00B798', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
      <CardContent className='flex justify-between gap-4' sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
        <Box className='flex flex-col justify-between gap-4'>
          <Avatar sx={{ width: '60px', height: '60px', bgcolor: 'white', color: '#00B798', borderRadius: '8px' }}>
            <EmployeeIcon />
          </Avatar>
          <Typography variant='body2' color='white'>
            Total Employee
          </Typography>
          <Typography variant='h3' color='white' fontWeight='bold'>
            921
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
              value={86}
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
                +86%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
      <Image
        src={IntersectGreenTopLeft}
        alt='Green top decoration'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          opacity: 1
        }}
      />
      <Image
        src={IntersectImage}
        alt='decorative shape'
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          zIndex: 0,
          opacity: 0.5
        }}
      />
    </Card>
  )
}

export default EmployeeCountPage
