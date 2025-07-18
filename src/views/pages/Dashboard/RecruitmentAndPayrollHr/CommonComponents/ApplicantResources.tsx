'use client'

import React from 'react'

import Image from 'next/image'

import { Card, Box, Typography } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

import LineImage from '@assets/images/dashboard/Line.png'

const resources = [
  { name: 'Job Boards', value: 780, color: '#00B798' },
  { name: 'Recruitment Agencies', value: 218, color: '#E66D6F' },
  { name: 'Social Media Campaigns', value: 612, color: '#0096DA' },

  { name: 'Employee Referrals', value: 456, color: '#ED960B' }
]

const totalApplicants = resources.reduce((sum, r) => sum + r.value, 0)

export default function ApplicantResourcesCard() {
  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant='h6' fontWeight={700} mb={3}>
        Applicant Resources
      </Typography>

      <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie data={resources} innerRadius={60} outerRadius={80} paddingAngle={1} cornerRadius={3} dataKey='value'>
              {resources.map((r, i) => (
                <Cell key={i} fill={r.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography variant='h6' fontWeight={700} color='#222529' sx={{ fontSize: '20px' }}>
            {totalApplicants}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Total Applicants
          </Typography>
        </Box>
      </Box>

      <Box sx={{ my: 6, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Image
          src={LineImage} // make sure this path matches your actual file location in the public folder
          alt='line divider'
          width={1000} // or use a suitable value
          height={2} // adjust as needed to fit design
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2
        }}
      >
        {resources.map((r, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: '18px',
                  height: '14px',
                  borderRadius: '3px',
                  bgcolor: r.color
                }}
              />
              <Typography variant='subtitle2' fontWeight={700} color='#000000'>
                {r.value}
              </Typography>
            </Box>
            <Typography color='#5E6E78' fontWeight={500} sx={{ fontSize: '9.7px', pl: '20px' }}>
              {r.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
