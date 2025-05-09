'use client'

import React, { useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, CardContent, Grid, Typography, CircularProgress, Fade } from '@mui/material'
import { styled } from '@mui/material/styles'

interface JobPosting {
  id: number
  designation: string // Renamed from title
  jobRole: string // Added new field
  location: string
  status: 'Hiring' | 'In Progress' | 'Completed' // Updated status values
  openings: number
  candidatesApplied: number
  shortlisted: number
  hired: number
}

interface JobPostGridProps {
  data: JobPosting[]
  loading: boolean
  page: number
  totalCount: number
  onLoadMore: (newPage: number) => void
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    backgroundColor: theme.palette.grey[50]
  }
}))

const StatusBadge = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  display: 'inline-block'
}))

const JobPostGrid = ({ data, loading, page, totalCount, onLoadMore }: JobPostGridProps) => {
  const router = useRouter()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const handleView = (jobId: number) => {
    router.push(`/candidateListing/${jobId}`)
  }

  const loadMoreJobs = useCallback(() => {
    if (loading || data.length >= totalCount) return
    const nextPage = page + 1

    onLoadMore(nextPage)
  }, [loading, data.length, totalCount, page, onLoadMore])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreJobs()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreJobs])

  return (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {data.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Fade in timeout={300 + index * 100}>
              <StyledCard onClick={() => handleView(job.id)} sx={{ cursor: 'pointer' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2
                    }}
                  >
                    <Typography
                      variant='h5'
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        lineHeight: 1.3
                      }}
                    >
                      {job.designation}
                    </Typography>
                    <StatusBadge
                      sx={{
                        backgroundColor:
                          job.status === 'Hiring'
                            ? 'success.light'
                            : job.status === 'In Progress'
                              ? 'warning.light'
                              : 'error.light',
                        color:
                          job.status === 'Hiring'
                            ? 'success.contrastText'
                            : job.status === 'In Progress'
                              ? 'warning.contrastText'
                              : 'error.contrastText'
                      }}
                    >
                      {job.status}
                    </StatusBadge>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant='body2'
                        sx={{
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <strong>Job Role:</strong> {job.jobRole}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant='body2'
                        sx={{
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <strong>Location:</strong> {job.location}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        <strong>Openings:</strong> {job.openings}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        <strong>Applied:</strong> {job.candidatesApplied}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        <strong>Shortlisted:</strong> {job.shortlisted}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>
                        <strong>Hired:</strong> {job.hired}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {data.length < totalCount && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
          <Typography sx={{ color: 'text.secondary' }}>
            {loading ? 'Loading more jobs...' : 'Scroll to load more jobs'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default JobPostGrid
