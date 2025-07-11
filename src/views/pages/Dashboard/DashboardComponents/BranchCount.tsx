'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import BranchIcon from '@/icons/BranchIcon'

//import { useTheme } from '@mui/material/styles'

const BranchCountPage = () => {
  // Hooks
  // const theme = useTheme()

  return (
    <Card
      sx={{
        bgcolor: '#0096DA',
        borderRadius: 2,
        position: 'relative'

        // '&::after': {
        //   content: '""',
        //   position: 'absolute',
        //   bottom: 0,
        //   right: 0,
        //   width: 130,
        //   height: 50,
        //   backgroundColor: '#006ED3',
        //   borderRadius: '150px 0 0 0',
        //   clipPath: 'polygon(0% 0%,70% 30%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)'
        // }
      }}
    >
      {/* <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 40,
          height: 20,
          backgroundColor: '#006ED3',
          borderRadius: '20px 0 0 0',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 40,
          height: 20,
          backgroundColor: '#006ED3',
          borderRadius: '0 0 20px 0',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)'
        }}
      /> */}
      <CardContent className='flex justify-between gap-4' sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
        <Box className='flex flex-col justify-between gap-4'>
          <Avatar sx={{ width: '60px', height: '60px', bgcolor: 'white', color: '#0096DA', borderRadius: '8px' }}>
            <BranchIcon />
          </Avatar>
          <Typography variant='body2' color='white'>
            Branches in India
          </Typography>
          <Typography variant='h3' color='white' fontWeight='bold'>
            1128
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
              value={74}
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
                +74%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BranchCountPage
