'use client'

import { useState } from 'react'

import { Box, Typography, Grid, Card, CardContent, Chip, Button, IconButton, Menu, MenuItem } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import ProjectManagerIcon from '@/icons/ProjectManagerIcon'
import SalesManagerIcon from '@/icons/SalesManagerIcon'
import SeniorAccountantIcon from '@/icons/SeniorAccountantIcon'
import CustomerSupportIcon from '@/icons/DashboardRecruitHr/CustomerSupportIcon'
import HrResourcesIcon from '@/icons/DashboardRecruitHr/HrResourcesIcon'
import Option2Icon from '@/icons/DashboardRecruitHr/Option2Icon'

interface Vacancy {
  id: number
  title: string
  icon: React.ReactNode
  badges: string[]
  salary: string
  applicants: number
}

const vacanciesData: Vacancy[] = [
  {
    id: 1,
    title: 'Project Manager',
    icon: <ProjectManagerIcon />,
    badges: ['Full Time', 'Remote'],
    salary: '₹ 1,42K - ₹ 1,60K/y',
    applicants: 120
  },
  {
    id: 2,
    title: 'Sales Manager',
    icon: <SalesManagerIcon />,
    badges: ['Full Time', 'On-site'],
    salary: '₹ 1,30K - ₹ 1,40K/y',
    applicants: 85
  },
  {
    id: 3,
    title: 'Senior Accountant',
    icon: <SeniorAccountantIcon />,
    badges: ['Full Time', 'Remote'],
    salary: '₹ 1,60K - ₹ 1,75K/y',
    applicants: 36
  },
  {
    id: 4,
    title: 'Junior Accountant',
    icon: <SeniorAccountantIcon />,
    badges: ['Full Time', 'On-site'],
    salary: '₹ 80K - ₹ 90K/y',
    applicants: 112
  },
  {
    id: 5,
    title: 'Customer Support',
    icon: <CustomerSupportIcon />,
    badges: ['Full Time', 'On-site'],
    salary: '₹ 70K - ₹ 80K/y',
    applicants: 316
  },
  {
    id: 6,
    title: 'Human Resources',
    icon: <HrResourcesIcon />,
    badges: ['Full Time', 'On-site'],
    salary: '₹ 1,05K - ₹ 1,10K/y',
    applicants: 40
  }
]

export default function CurrentVacanciesCard() {
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null)
  const [sortBy, setSortBy] = useState('Popular')

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchor(event.currentTarget)
  }

  const handleSortClose = (value?: string) => {
    if (value) setSortBy(value)
    setSortAnchor(null)
  }

  return (
    <Box className='bg-[#F5F7FE]  rounded-lg'>
      {/* Header */}
      <Box className='flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4'>
        <Typography variant='h6' className='font-bold'>
          Current Vacancies (104)
        </Typography>

        <Box className='flex items-center gap-3'>
          <Box className='flex items-center gap-1 text-sm text-gray-600'>
            Sort by:
            <Button
              variant='text'
              size='small'
              endIcon={<ArrowDropDownIcon />}
              onClick={handleSortClick}
              className='text-gray-800 normal-case'
            >
              {sortBy}
            </Button>
            <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => handleSortClose()}>
              <MenuItem onClick={() => handleSortClose('Popular')}>Popular</MenuItem>
              <MenuItem onClick={() => handleSortClose('Newest')}>Newest</MenuItem>
            </Menu>
          </Box>
          <Button variant='contained' size='small' className='normal-case !bg-[#0191DA]'>
            View all
          </Button>
        </Box>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={3}>
        {vacanciesData.map(vacancy => (
          <Grid item xs={12} sm={6} md={4} key={vacancy.id}>
            <Card
              sx={{
                borderRadius: 2
              }}
            >
              <CardContent className='flex flex-col gap-2 p-3'>
                <Box className='flex items-start justify-between'>
                  <Box className='flex'>
                    <Box
                      className='bg-[#F5F7FE] p-2 rounded-lg flex items-center justify-center'
                      sx={{ width: 40, height: 40 }}
                    >
                      {vacancy.icon}
                    </Box>
                    <Box className='ml-2 mt-1'>
                      <Typography variant='subtitle1' className='font-medium mt-1' sx={{ color: 'black' }}>
                        {vacancy.title}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size='small'>
                    <Option2Icon />
                  </IconButton>
                </Box>

                {/* <Typography variant='subtitle1' className='font-medium mt-1'>
                  {vacancy.title}
                </Typography> */}

                <Box className='flex flex-wrap gap-2 mt-4'>
                  {vacancy.badges.map((badge, idx) => (
                    <Chip key={idx} label={badge} size='small' className='!bg-[#EAEFFC] !text-[#64748B] !text-xs' />
                  ))}
                </Box>

                <Box className='flex items-center justify-between mt-2 '>
                  <Typography variant='body2' className='font-semibold' sx={{ color: 'black' }}>
                    {vacancy.salary}
                  </Typography>
                  <Typography variant='body2' className='text-gray-500'>
                    {vacancy.applicants} Applicants
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
