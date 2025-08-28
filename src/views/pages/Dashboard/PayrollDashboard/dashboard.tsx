'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Container, Box, Typography, Card, CardContent, Grid, Stack } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
// import { IconCircleFilled } from '@tabler/icons-react'
import StatCard from '@/components/cards/homedashboardCard'
// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'), { ssr: false })

// Define LabelProp type for custom label rendering
type LabelProp = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

const MonthFilter = () => (
  <Stack
    direction='row'
    alignItems='center'
    spacing={1}
    sx={{ background: '#F4F5F7', borderRadius: '6px', padding: '8px', cursor: 'pointer' }}
  >
    <CalendarTodayIcon sx={{ color: '#1C274C', fontSize: '16px' }} />
    <Typography variant='body2'>This Month</Typography>
  </Stack>
)

const ProfileSection = () => (
  <Card
    sx={{
      mb: 4,
      background: '#E3F2FD',
      borderRadius: '15px',
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        component='img'
        src='https://via.placeholder.com/50'
        alt='Profile'
        sx={{ width: 50, height: 50, borderRadius: '50%' }}
      />
      <Box>
        <Typography variant='h6' fontWeight={600}>
          Mr. John Snow
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          johnsnow@mail.com
        </Typography>
      </Box>
    </Box>
    <Card sx={{ p: 1, minWidth: '200px' }}>
      <Typography variant='body2'>Designation: Recruiting Manager</Typography>
      <Typography variant='body2'>Employee ID: D235123</Typography>
    </Card>
  </Card>
)

const CardSection = () => {
  const cardData = [
    {
      title: 'Total Employee count',
      count: '2',
      subtext: 'All active employees',
      icon: <AccessTimeIcon />,
      overlayColor: '#00B798'
    },
    {
      title: 'Headcount',
      count: '2',
      subtext: 'Current headcount',
      icon: <CheckCircleIcon />,
      overlayColor: '#ED960B'
    },
    {
      title: 'Newly onboarded',
      count: '2',
      subtext: 'Recently joined',
      icon: <CancelIcon />,
      overlayColor: '#0096DA'
    }
  ]

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard
            title={card.title}
            count={card.count}
            subtext={card.subtext}
            icon={card.icon}
            overlayColor={card.overlayColor}
          />
        </Grid>
      ))}
    </Grid>
  )
}
const ApplicationsByDepartment = () => {
  const departmentData = [
    { name: 'Marketing', count: 380, color: '#0096DA' },
    { name: 'Sales', count: 217, color: '#00B798' },
    { name: 'Finance', count: 165, color: '#E66D6F' },
    { name: 'Customer Support', count: 86, color: '#ED960B' },
    { name: 'Human Resources', count: 35, color: '#5E6E78' }
  ]
  const totalApplicants = departmentData.reduce((sum, dept) => sum + dept.count, 0)

  const renderCustomizedLabel = ({ cx, cy }: LabelProp) => (
    <g>
      <circle cx={cx} cy={cy} r={30} fill='rgba(255, 255, 255, 0.7)' />
      <text x={cx} y={cy - 15} fill='grey' textAnchor='middle' dominantBaseline='middle' style={{ fontSize: '14px' }}>
        Total
      </text>
      <text
        x={cx}
        y={cy + 10}
        fill='black'
        textAnchor='middle'
        dominantBaseline='middle'
        style={{ fontSize: '20px', fontWeight: 'bold' }}
      >
        {totalApplicants}
      </text>
    </g>
  )

  return (
    <Card sx={{ p: 3, height: '446px', width: '754px', borderRadius: '15px' }}>
      <Stack direction='row' justifyContent='space-between' mb={3}>
        <Typography variant='h6' fontWeight='bold'>
          Applications by Department
        </Typography>
        <MonthFilter />
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
        <Box sx={{ position: 'relative', width: 200, height: 200 }}>
          <AppRecharts>
            <div className='bs-[200px]'>
              <ResponsiveContainer>
                <PieChart height={240} style={{ direction: 'ltr' }}>
                  <Pie
                    data={departmentData}
                    dataKey='count'
                    innerRadius={55}
                    outerRadius={100}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    stroke='none'
                    startAngle={60}
                    endAngle={-300}
                    paddingAngle={1}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </AppRecharts>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '382px' }}>
          {departmentData.map((dept, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: dept.color }} />
                <Typography variant='body2' sx={{ color: '#5E6E78', fontSize: '14px' }}>
                  {dept.name}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#23262F' }}>{dept.count}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  )
}
const ApplicantResources = () => {
  const resources = [
    { name: 'Job Boards', count: 780, color: '#4E97FD' },
    { name: 'Employee Referrals', count: 456, color: '#F56C6C' },
    { name: 'Social Media Campaigns', count: 612, color: '#4AD991' },
    { name: 'Recruitment Agencies', count: 218, color: '#F6C453' }
  ]
  const totalApplicants = resources.reduce((sum, r) => sum + r.count, 0)

  const renderCustomizedLabel = ({ cx, cy }: LabelProp) => (
    <g>
      <circle cx={cx} cy={cy} r={30} fill='rgba(255, 255, 255, 0.7)' />
      <text x={cx} y={cy - 15} fill='grey' textAnchor='middle' dominantBaseline='middle' style={{ fontSize: '14px' }}>
        Total
      </text>
      <text
        x={cx}
        y={cy + 10}
        fill='black'
        textAnchor='middle'
        dominantBaseline='middle'
        style={{ fontSize: '20px', fontWeight: 'bold' }}
      >
        {totalApplicants}
      </text>
    </g>
  )

  return (
    <Card
      sx={{
        width: '366px',
        height: '446px',
        borderRadius: '14px',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0px 6.84894px 12.1759px rgba(208, 210, 218, 0.15)'
      }}
    >
      <Typography variant='h6' fontWeight='bold' mb={3}>
        Applicant Resources
      </Typography>
      <Box sx={{ position: 'relative', width: 210, height: 210 }}>
        <AppRecharts>
          <div className='bs-[200px]'>
            <ResponsiveContainer>
              <PieChart height={190} style={{ direction: 'ltr' }}>
                <Pie
                  data={resources}
                  dataKey='count'
                  innerRadius={55}
                  outerRadius={90}
                  label={renderCustomizedLabel}
                  labelLine={false}
                  stroke='none'
                  startAngle={60}
                  endAngle={-300}
                  paddingAngle={1}
                >
                  {resources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </Box>
      <Box sx={{ width: '326px', borderTop: '1px dashed #A0AEC0', mt: 3 }} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 3,
          width: '100%',
          mt: 3
        }}
      >
        {resources.map((resource, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: resource.color }} />
            <Box>
              <Typography fontWeight='bold'>{resource.count}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {resource.name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
const HomePage = () => (
  <Container maxWidth={false} sx={{ p: 3 }}>
    <ProfileSection />
    <CardSection />
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <ApplicationsByDepartment />
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'stretch' }}>
        <ApplicantResources />
      </Grid>
    </Grid>
  </Container>
)

export default HomePage
