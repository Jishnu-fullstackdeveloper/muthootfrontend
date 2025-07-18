/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from 'react'

import type { SelectChangeEvent } from '@mui/material'
import { Card, Box, Typography, Divider, useTheme, MenuItem, Select } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

const departmentData = [
  { name: 'Marketing', value: 380, color: '#1D99FF' },
  { name: 'Sales', value: 217, color: '#00B798' },
  { name: 'Finance', value: 165, color: '#EF6C85' },
  { name: 'Customer Support', value: 86, color: '#F5A623' },
  { name: 'Human Resources', value: 35, color: '#999999' }
]

const totalApplicants = departmentData.reduce((sum, d) => sum + d.value, 0)

export default function ApplicationsByDepartmentCard() {
  const theme = useTheme()
  const [period, setPeriod] = React.useState('This Month')

  const handleChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value)
  }

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h6' fontWeight={700}>
          Applications by Department
        </Typography>

        <Select
          value={period}
          onChange={handleChange}
          size='small'
          displayEmpty
          sx={{
            fontSize: 10,
            px: 1,
            bgcolor: '#F7F9FC',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
          renderValue={() => (
            <Box display='flex' alignItems='center' gap={1}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />

              <Typography variant='body2' fontWeight={600} color='#2D3748'>
                {period}
              </Typography>
            </Box>
          )}
        >
          <MenuItem value='This Month'>This Month</MenuItem>
          <MenuItem value='Last Month'>Last Month</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
        <Box sx={{ width: 200, height: 200, position: 'relative' }}>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey='value'
                innerRadius={55}
                outerRadius={80}
                paddingAngle={0}
                stroke='none'
              >
                {departmentData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
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
              textAlign: 'center',
              p: 2
            }}
          >
            <Typography variant='h6' fontWeight={700} color='#222529' sx={{ fontSize: '20px' }}>
              {totalApplicants}
            </Typography>
            <Typography variant='caption' color='text.secondary' fontWeight={500} sx={{ fontSize: '10px' }}>
              Total Applicants
            </Typography>
          </Box>
        </Box>

        <Divider orientation='vertical' flexItem sx={{ mx: 2, borderColor: '#E0E0E0' }} />

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', rowGap: 3 }}>
          {departmentData.map((d, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: '22px',
                    height: '10px',
                    borderRadius: '20px',
                    bgcolor: d.color
                  }}
                />
                <Typography variant='body2' sx={{ ml: 2 }}>
                  {d.name}
                </Typography>
              </Box>
              <Typography variant='body2' fontWeight={600} sx={{ mr: 3, color: 'black' }}>
                {d.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  )
}
