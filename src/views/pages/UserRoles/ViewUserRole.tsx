
'use client'

import React from 'react'

import router from 'next/router'

import Typography from '@mui/material/Typography'
import { Box, Card, CardContent, Button, Divider } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const ViewUserRole: React.FC<{ mode: 'view'; id?: string }> = () => {
  const roleData = {
    name: 'Admin', // Example role name
    modules: [
      { name: 'Module1', permissions: ['read', 'write'] },
      { name: 'Module2', permissions: ['read'] }
    ]
  }


  return (
    <Box>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box className='flex justify-between'>
            <Box>
              <Typography variant='h3' sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {roleData.name}
              </Typography>
            </Box>
            <Box></Box>
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Box sx={{ marginTop: 3, padding: 5, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
            <ul>
              {roleData.modules.map((module, index) => (
                <li key={index}>
                  {module.name}:
                  <ul>
                    {module.permissions.map((permission, permIndex) => (
                      <li key={permIndex}>
                        <input type='checkbox' checked readOnly /> {permission}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Box>
        </CardContent>

        <Box sx={{ marginTop: 3, marginLeft: 5, marginBottom: 10 }}>
          <Button startIcon={<ArrowBack />} variant='outlined' onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default ViewUserRole
