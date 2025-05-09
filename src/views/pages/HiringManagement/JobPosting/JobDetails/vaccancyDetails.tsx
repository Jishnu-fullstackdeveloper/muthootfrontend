'use client'
import React from 'react'

import { Box, Typography, Divider, Paper } from '@mui/material'

const JobVacancyView = () => {
  // Dummy data for UI display
  const dummyVacancy = {
    jobTitle: 'Software Engineer',
    designation: 'Developer',
    jobRole: 'Frontend Developer',
    grade: 'G4',
    openings: 3,
    campusOrLateral: 'Lateral',
    employeeCategory: 'Full-Time',
    employeeType: 'Permanent',
    hiringManager: 'Jane Doe',
    company: 'TechCorp',
    businessUnit: 'Product Dev',
    department: 'Engineering',
    startingDate: '2025-05-01',
    closingDate: '2025-06-01',
    territory: 'North',
    region: 'Delhi',
    area: 'Zone A',
    cluster: 'Cluster 1',
    branch: 'Main Branch',
    branchCode: 'BR001',
    city: 'New Delhi',
    state: 'Delhi',
    origin: 'Internal'
  }

  return (
    <Box>
      <Paper elevation={4} sx={{ padding: 4, margin: 'auto', borderRadius: 1 }}>
        <Box mb={4} className='space-y-2'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
              {dummyVacancy.jobTitle}
            </Typography>
          </Box>

          <Box>
            <Box className='mb-4 mt-2 p-6 border-primary  rounded-lg bg-white' sx={{ margin: 'auto', borderRadius: 4 }}>
              <Typography variant='h6' color='text.primary'>
                Application Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <Typography variant='body2'>
                  Designation: <strong>{dummyVacancy.designation}</strong>
                </Typography>
                <Typography variant='body2'>
                  Job Role: <strong>{dummyVacancy.jobRole}</strong>
                </Typography>
                <Typography variant='body2'>
                  Grade: <strong>{dummyVacancy.grade}</strong>
                </Typography>
                <Typography variant='body2'>
                  Openings: <strong>{dummyVacancy.openings}</strong>
                </Typography>
                <Typography variant='body2'>
                  Campus/Lateral: <strong>{dummyVacancy.campusOrLateral}</strong>
                </Typography>
                <Typography variant='body2'>
                  Employee Category: <strong>{dummyVacancy.employeeCategory}</strong>
                </Typography>
                <Typography variant='body2'>
                  Employee Type: <strong>{dummyVacancy.employeeType}</strong>
                </Typography>
                <Typography variant='body2'>
                  Hiring Manager: <strong>{dummyVacancy.hiringManager}</strong>
                </Typography>
                <Typography variant='body2'>
                  Company: <strong>{dummyVacancy.company}</strong>
                </Typography>
                <Typography variant='body2'>
                  Business Unit: <strong>{dummyVacancy.businessUnit}</strong>
                </Typography>
                <Typography variant='body2'>
                  Department: <strong>{dummyVacancy.department}</strong>
                </Typography>
                <Typography variant='body2'>
                  Starting Date: <strong>{dummyVacancy.startingDate}</strong>
                </Typography>
                <Typography variant='body2'>
                  Closing Date: <strong>{dummyVacancy.closingDate}</strong>
                </Typography>
              </Box>
            </Box>

            <Box className='mb-4 mt-2 p-6 border-primary  rounded-lg bg-white' sx={{ margin: 'auto', borderRadius: 4 }}>
              <Typography variant='h6' color='text.primary' gutterBottom>
                Location Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <Typography variant='body2'>
                  Territory: <strong>{dummyVacancy.territory}</strong>
                </Typography>
                <Typography variant='body2'>
                  Region: <strong>{dummyVacancy.region}</strong>
                </Typography>
                <Typography variant='body2'>
                  Area: <strong>{dummyVacancy.area}</strong>
                </Typography>
                <Typography variant='body2'>
                  Cluster: <strong>{dummyVacancy.cluster}</strong>
                </Typography>
                <Typography variant='body2'>
                  Branch: <strong>{dummyVacancy.branch}</strong>
                </Typography>
                <Typography variant='body2'>
                  Branch Code: <strong>{dummyVacancy.branchCode}</strong>
                </Typography>
                <Typography variant='body2'>
                  City: <strong>{dummyVacancy.city}</strong>
                </Typography>
                <Typography variant='body2'>
                  State: <strong>{dummyVacancy.state}</strong>
                </Typography>
                <Typography variant='body2'>
                  Origin: <strong>{dummyVacancy.origin}</strong>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default JobVacancyView
