'use client'

// MUI Imports
import Image from 'next/image'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

//import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

import LineImage from '@assets/images/dashboard/Line.png'

const ProfileDetailsPage = () => {
  return (
    <Card sx={{ width: '100%', height: '250px' }}>
      {/* <CardHeader title='Profile Details' subheader='User Information' className='pbe-0' /> */}
      <CardContent className='flex flex-col'>
        <Box className='flex flex-col items-center gap-2'>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main', borderRadius: '4px' }}>
            <i className='tabler-user text-white' />
          </Avatar>
          <Typography variant='h5' color='text.primary' fontWeight='bold'>
            Mr. Smith Warhol
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            smith.warhole@example.com
          </Typography>
        </Box>
        {/* <Divider sx={{ my: 6, borderStyle: 'dashed', borderWidth: '0.5px', borderColor: 'gray' }} /> */}

        {/* <Divider sx={{ my: 6, borderStyle: 'dashed', borderWidth: '0.5px', borderColor: 'gray' }} /> */}
        <Box sx={{ my: 6, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Image
            src={LineImage} // make sure this path matches your actual file location in the public folder
            alt='line divider'
            width={1000} // or use a suitable value
            height={2} // adjust as needed to fit design
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </Box>

        <Box className='flex flex-col justify-between gap-y-3'>
          <Box className='flex w-full justify-between items-center'>
            <Typography variant='body2' color='text.primary' fontWeight='bold'>
              Projects:
            </Typography>
            <Typography variant='body2' color='text.primary'>
              5
            </Typography>
          </Box>
          <Box className='flex w-full justify-between items-center'>
            <Typography variant='body2' color='text.primary' fontWeight='bold'>
              Joining Date:
            </Typography>
            <Typography variant='body2' color='text.primary'>
              Jan 2023
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProfileDetailsPage
