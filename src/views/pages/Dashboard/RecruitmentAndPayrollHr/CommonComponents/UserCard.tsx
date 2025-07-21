'use client'

import Image from 'next/image'

import { Card, CardContent, Box, Avatar, Typography } from '@mui/material'

import GradientImage from '@assets/images/dashboard/gradient-image.png'

export default function UserCard() {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
        boxShadow: 3,
        p: 0,
        display: 'flex',
        alignItems: 'center',
        height: '112px' // Match the CardContent height
      }}
    >
      <CardContent
        sx={{
          height: '112px',
          padding: 0,
          position: 'relative',
          background: 'linear-gradient(10deg, #0191DA 0%, rgba(255, 255, 255, 0.8) 110.84%)',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Overlaying image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
        >
          <Image
            src={GradientImage}
            alt='Wave Decoration'
            style={{
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* Responsive Box containing Left and Right sections */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            px: { xs: 1, md: 2 }, // Responsive padding
            zIndex: 1,
            mt: 6
          }}
        >
          {/* Left side: Avatar, Name, Email */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              pl: 1
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80, // Match right side card height
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <Avatar sx={{ width: 80, height: 80, borderRadius: 2 }} /> {/* Match height and width to 80px */}
            </Box>
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                John Doe
              </Typography>{' '}
              {/* Replace with dynamic name */}
              <Typography sx={{ color: '#FFFFFF', fontSize: '0.875rem' }}>john.doe@example.com</Typography>{' '}
              {/* Replace with dynamic email */}
            </Box>
          </Box>

          {/* Right side: Secondary Card */}
          <Box
            sx={{
              ml: 'auto',
              mr: 1
            }}
          >
            <Card
              sx={{
                borderRadius: 2,

                //boxShadow: 1,
                p: 1,
                bgcolor: 'rgba(255, 255, 255, 0.9)',

                width: { xs: '100%', sm: 271 },

                //width: '100%',
                height: 80 // Match avatar height
              }}
            >
              <CardContent
                sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Designation</Typography>
                  <Typography sx={{ color: '#666' }}>Software Engineer</Typography> {/* Replace with dynamic value */}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Employee Id</Typography>
                  <Typography sx={{ color: '#666' }}>EMP12345</Typography> {/* Replace with dynamic value */}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
