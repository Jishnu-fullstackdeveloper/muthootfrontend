'use client'

import React from 'react'

import { Typography, Card, Grid, Box, Tooltip, Button, Chip, Divider } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

interface Candidate {
  id: number
  name: string
  email: string
  status: string
  appliedDate: string
  gender?: string
  appliedPortal?: string
  minExperience?: string
  maxExperience?: string
  phoneNumber?: string
  match?: string
}

interface CandidateGridProps {
  data: Candidate[]
  loading: boolean
  page: number
  totalCount: number
  onLoadMore: (newPage: number) => void
  updateCandidateStatus: (candidateId: number, newStatus: string) => void
  handleCadidateDetails?: (candidateId: number) => void
}

const CandidateGrid = ({
  data,
  loading,

  // page,
  // totalCount,
  // onLoadMore,
  updateCandidateStatus,
  handleCadidateDetails
}: CandidateGridProps) => {
  // const statusOptions = ['Shortlisted', 'Rejected', 'L1']
  // const limit = 6
  // const totalPages = Math.ceil(totalCount / limit)

  return (
    <Box>
      <Grid container spacing={3}>
        {data.map(candidate => (
          <Grid item xs={12} sm={6} md={4} key={candidate.id}>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                },
                cursor: 'pointer'
              }}
              onClick={() => handleCadidateDetails(candidate.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6' fontWeight='600' sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                  {candidate.name}
                </Typography>
                <Tooltip title='Status'>
                  <Chip
                    label={candidate.status || 'Pending'}
                    size='small'
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 'medium',
                      borderRadius: '16px',
                      height: '24px'
                    }}
                    color={
                      candidate.status === 'Shortlisted'
                        ? 'success'
                        : candidate.status === 'Rejected'
                          ? 'error'
                          : candidate.status === 'L1'
                            ? 'info'
                            : 'default'
                    }
                  />
                </Tooltip>
              </Box>

              <Divider sx={{ mb: 2, borderColor: 'grey.200' }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, fontSize: '0.85rem' }}>
                <Tooltip title='Email'>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}
                  >
                    <EmailOutlinedIcon fontSize='small' color='action' />
                    {candidate.email}
                  </Typography>
                </Tooltip>
                <Tooltip title='Phone Number'>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}
                  >
                    <PhoneOutlinedIcon fontSize='small' color='action' />
                    {candidate.phoneNumber || 'N/A'}
                  </Typography>
                </Tooltip>
                <Tooltip title='Applied Portal'>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}
                  >
                    <WorkOutlineIcon fontSize='small' color='action' />
                    {candidate.appliedPortal || 'N/A'}
                  </Typography>
                </Tooltip>
                <Tooltip title='Applied Date'>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}
                  >
                    <CalendarTodayOutlinedIcon fontSize='small' color='action' />
                    {candidate.appliedDate}
                  </Typography>
                </Tooltip>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  <strong>Min Exp:</strong> {candidate.minExperience || 'N/A'}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  <strong>Max Exp:</strong> {candidate.maxExperience || 'N/A'}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', gridColumn: 'span 2' }}>
                  <strong>Match:</strong> {candidate.match || 'N/A'}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>Loading...</Typography>
        </Box>
      )}
      {data.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', p: 5 }}>
          <Typography variant='h6' color='secondary'>
            No candidates found
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default CandidateGrid
