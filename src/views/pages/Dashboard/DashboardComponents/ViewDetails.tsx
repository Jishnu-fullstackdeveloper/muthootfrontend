'use client'

// MUI Imports
import Image from 'next/image'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Box } from '@mui/material'

import illustrationImage from '@assets/images/dashboard/Illustration.png'

//import { useTheme } from '@mui/material/styles'

const ViewDetailsPage = () => {
  // Hooks
  // const theme = useTheme()

  return (
    <Card
      sx={{
        bgcolor: '#0191DA',
        height: '250px',
        top: '128px',
        left: '280px',
        borderRadius: '10px'
      }}
    >
      <CardContent className='flex flex-col justify-between items-center py-0'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box className='flex flex-col gap-6 justify-start w-full whitespace-nowrap'>
            <CardHeader
              title='Hello Mr. Smith!'
              sx={{
                padding: 0,
                '& .MuiCardHeader-title': { color: 'white' },
                fontWeight: 'bold'
              }}
            />
            <Typography variant='body2' color='white'>
              Today you have 9 new applications.
              <br /> Also you have a meeting with HR members.
            </Typography>
            <Button
              variant='contained'
              sx={{
                bgcolor: '#f28c38',
                color: 'white',
                textTransform: 'none',
                '&:hover': { bgcolor: '#e07b30' },
                width: 100,
                p: 2,
                mt: 9
              }}
            >
              View Details
            </Button>
          </Box>
          <Box className='pl-10'>
            <Image
              src={illustrationImage}
              alt='illustration'
              style={{ objectFit: 'cover', width: '341px', height: '250px' }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ViewDetailsPage
