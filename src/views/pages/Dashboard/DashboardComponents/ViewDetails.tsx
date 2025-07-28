'use client'

// MUI Imports
import Image from 'next/image'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Box } from '@mui/material'

import { useTheme } from '@mui/material/styles'

import illustrationImage from '@assets/images/dashboard/Illustration.png'

const ViewDetailsPage = () => {
  // Hooks
  const theme = useTheme()

  return (
    <Card
      sx={{
        bgcolor: '#0191DA',
        borderRadius: '10px',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
          height: 'auto',
          padding: 2
        },
        [theme.breakpoints.between('sm', 'md')]: {
          height: 'auto',
          padding: 1
        }
      }}
    >
      <CardContent className='flex flex-col justify-between items-center py-0'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Box className='flex flex-col gap-6 justify-start w-full whitespace-nowrap'>
            <CardHeader
              title='Hello Mr. Smith!'
              sx={{
                padding: 0,
                '& .MuiCardHeader-title': { color: 'white' },
                fontWeight: 'bold',
                [theme.breakpoints.down('sm')]: { fontSize: '1.2rem' }
              }}
            />
            <Typography variant='body2' color='white' sx={{ [theme.breakpoints.down('sm')]: { fontSize: '0.9rem' } }}>
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
                mt: 9,
                [theme.breakpoints.down('sm')]: { mt: 4, width: '80%', maxWidth: 100 }
              }}
            >
              View Details
            </Button>
          </Box>
          <Box className='pl-10' sx={{ pl: { xs: 0, sm: 10 }, mt: { xs: 2, sm: 0 } }}>
            <Image
              src={illustrationImage}
              alt='illustration'
              style={{ objectFit: 'cover' }}
              width={341}
              height={250}
              sizes='(max-width: 600px) 100vw, 341px'
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ViewDetailsPage
