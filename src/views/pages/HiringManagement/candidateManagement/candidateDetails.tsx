'use client'

import React, { useState } from 'react'

import { Typography, Box, Chip, Divider, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import {
  PhoneOutlined,
  EmailOutlined,
  Wc,
  Source,
  CreditCard,
  HistoryEdu,
  JoinInner,
  Person,
  Receipt,
  AvTimerOutlined,
  ChangeCircleOutlined
} from '@mui/icons-material'

// Define Candidate interface
interface Candidate {
  id: number
  name: string
  email: string
  status: string
  appliedPortal: string
  gender: string
  panCardStatus: string
  minExperience: string
  maxExperience: string
  phoneNumber: string
  match: string
  resume: string
}

// Define custom TableMeta interface
interface CandidateTableMeta {
  updateData: (rowIndex: number, columnId: string, value: any) => void
}

const CandidateDetails = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(1) // Set limit to 1 to show one candidate per page

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 288,
      name: 'Nikolay Ivankov',
      email: 'operatovna709@gmail.com',
      status: 'Available',
      appliedPortal: 'Skype',
      gender: 'Female',
      panCardStatus: 'Verified',
      minExperience: '6 years 7 months',
      maxExperience: '10 years',
      phoneNumber: '+0502904800',
      match: '2.7',
      resume: 'resume_nikolay_ivankov.pdf'
    }
  ])

  const statusOptions = ['Screened', 'HR Round', 'Offered']
  const panCardStatusOptions = ['Verified', 'Pending', 'Invalid']

  // Table meta to handle data updates
  const tableMeta: CandidateTableMeta = {
    updateData: (rowIndex: number, columnId: string, value: any) => {
      setCandidates(old => old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)))
    }
  }

  const paginatedCandidates = candidates.slice((page - 1) * limit, page * limit)

  return (
    <Box sx={{  bgcolor: '#f5f5f5' }}>
      {paginatedCandidates.map((candidate, index) => (
        <Box key={candidate.id} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          {/* Header Section */}
          <Box
            sx={{
              p: 5,
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize='small' color='primary' />
              <Typography variant='h6'>{candidate.name}</Typography>
            </Box>

            <Chip label={candidate.status} color='success' size='small' />
          </Box>

          {/* Candidate Information and Experience Sections */}
          <Box sx={{ p: 5, display: 'flex', gap: 4 }}>
            {/* Left Side: Candidate Information */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneOutlined fontSize='small' color='primary' />
                  <strong>Phone:</strong> {candidate.phoneNumber}
                </Typography>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailOutlined fontSize='small' color='primary' />
                  <strong>Email:</strong> {candidate.email}
                </Typography>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Wc fontSize='small' color='primary' />
                  <strong>Gender:</strong> {candidate.gender}
                </Typography>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Source fontSize='small' color='primary' />
                  <strong>Applied Portal:</strong> {candidate.appliedPortal}
                </Typography>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard fontSize='small' color='primary' />
                  <strong>PAN Card Status:</strong> {candidate.panCardStatus}
                </Typography>
              </Box>
            </Box>

            {/* Right Side: Experience Section */}
            <Box sx={{ p: 5, display: 'flex' }}>
              <Box sx={{ flex: 1 }}>
                {/* <Typography variant='h6'>Experience</Typography> */}

                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryEdu fontSize='small' color='primary' />
                  <strong>Total Experience:</strong> {candidate.minExperience}
                </Typography>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <JoinInner fontSize='small' color='primary' />
                  <strong>Match:</strong> {candidate.match}
                </Typography>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt fontSize='small' color='primary' />
                  <strong>Resume:</strong>
                  <Button
                    variant='text'
                    size='small'
                    sx={{ ml: 1, textTransform: 'none' }}
                    onClick={() => console.log(`Downloading ${candidate.resume}`)}
                  >
                    Download {candidate.resume}
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Resume Download and Selectors Section */}
          <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', display: 'flex', flexDirection: 'row', gap: 2 ,  }}>
            <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AvTimerOutlined fontSize='small' color='primary' />
              <strong>Status</strong>
              <FormControl sx={{ mt: 2, minWidth: 200 }} size='small'>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusOptions.includes(candidate.status) ? candidate.status : ''}
                  onChange={e => {
                    const newStatus = e.target.value

                    tableMeta.updateData((page - 1) * limit + index, 'status', newStatus)
                    console.log(`Updated status for ${candidate.name} to ${newStatus}`)
                  }}
                  label='Status'
                >
                  <MenuItem value=''>Select Status</MenuItem>
                  {statusOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>

            {/* PAN Card Status Selector */}
            <Box sx={{ p: 5, display: 'flex', gap: 4 }}>
            <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChangeCircleOutlined fontSize='small' color='primary' />
              <strong>PAN Card Status</strong>
              <FormControl sx={{ mt: 2, minWidth: 200 }} size='small'>
                <InputLabel>PAN Card Status</InputLabel>
                <Select
                  value={panCardStatusOptions.includes(candidate.panCardStatus) ? candidate.panCardStatus : ''}
                  onChange={e => {
                    const newPanStatus = e.target.value

                    tableMeta.updateData((page - 1) * limit + index, 'panCardStatus', newPanStatus)
                    console.log(`Updated PAN Card status for ${candidate.name} to ${newPanStatus}`)
                  }}
                  label='PAN Card Status'
                >
                  <MenuItem value='' disabled>
                    Select PAN Card Status
                  </MenuItem>
                  {panCardStatusOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default CandidateDetails
