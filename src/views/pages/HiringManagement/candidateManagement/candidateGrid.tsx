'use client'

import React from 'react'
import {
  Typography,
  Card,
  MenuItem,
  Select,
  Grid,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Tooltip,
  Button,
  Chip
} from '@mui/material'
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
}

const CandidateGrid = ({ data, loading, page, totalCount, onLoadMore, updateCandidateStatus }: CandidateGridProps) => {
  const statusOptions = ['Shortlisted', 'Rejected', 'L1']
  const limit = 6
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <Box>
      <Grid container spacing={3}>
        {data.map(candidate => (
          <Grid item xs={12} sm={6} md={4} key={candidate.id}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                },
                cursor: 'pointer'
              }}
              onClick={() => console.log(`Navigate to candidate details: ${candidate.id}`)} // Replace with actual navigation logic
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant='h6' fontWeight='bold' fontSize='13px'>
                  {candidate.name}
                </Typography>
                <Tooltip title='Status'>
                  <Chip
                    label={candidate.status || 'Pending'}
                    size='small'
                    variant='outlined'
                    sx={{ fontSize: '10px' }}
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
              <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '10px', color: 'text.secondary' }}>
                  <Tooltip title='Email'>
                    <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailOutlinedIcon fontSize='small' /> {candidate.email}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Phone Number'>
                    <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneOutlinedIcon fontSize='small' /> {candidate.phoneNumber || 'N/A'}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Applied Portal'>
                    <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkOutlineIcon fontSize='small' /> {candidate.appliedPortal || 'N/A'}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Applied Date'>
                    <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayOutlinedIcon fontSize='small' /> {candidate.appliedDate}
                    </Typography>
                  </Tooltip>
                  <Typography variant='body2'>
                    <strong>Min Exp:</strong> {candidate.minExperience || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Max Exp:</strong> {candidate.maxExperience || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Match:</strong> {candidate.match || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title='Shortlist'>
                      <Button
                        variant='tonal'
                        color='success'
                        size='small'
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={e => {
                          e.stopPropagation()
                          updateCandidateStatus(candidate.id, 'Shortlisted')
                        }}
                      >
                        Shortlist
                      </Button>
                    </Tooltip>
                    <Tooltip title='Reject'>
                      <Button
                        variant='tonal'
                        color='error'
                        size='small'
                        startIcon={<CancelOutlinedIcon />}
                        onClick={e => {
                          e.stopPropagation()
                          updateCandidateStatus(candidate.id, 'Rejected')
                        }}
                      >
                        Reject
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => onLoadMore(newPage)}
          color='primary'
        />
      </Box>
    </Box>
  )
}

export default CandidateGrid
