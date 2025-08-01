'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import {
  Card,
  Typography,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  TextField,
  Chip,
  Tooltip,
  Button,
  Menu,
  MenuItem
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJd, fetchJdDismiss } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicButton from '@/components/Button/dynamicButton'
import JobListingTableView from './JobListingTable'
import { ROUTES } from '@/utils/routes'
import JDIcon from '@/icons/JdIcon'

const JobDetailsList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { jdData, totalCount, isJdLoading, jdSuccess, jdFailure, jdFailureMessage } = useAppSelector(
    state => state.jdManagementReducer
  )

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<string | null>(null) // State for jdType filter
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null) // For filter menu
  const open = Boolean(anchorEl)

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
    hasMore: true
  })

  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Handle filter menu open/close
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  const handleFilterSelect = (jdType: string | null) => {
    setFilter(jdType)
    setPaginationState(prev => ({ ...prev, page: 1, hasMore: true })) // Reset pagination
    setIsFetchingMore(false)
    handleFilterClose()
  }

  useEffect(() => {
    const payload: any = {
      page: paginationState.page,
      limit: paginationState.limit
    }

    if (searchQuery) {
      payload.search = searchQuery
    }

    if (filter) {
      payload.jdType = filter
    }

    dispatch(fetchJd(payload)).then(() => {
      setIsFetchingMore(false)
    })
  }, [dispatch, paginationState.page, paginationState.limit, searchQuery, filter])

  // Update hasMore based on totalCount and loaded data
  useEffect(() => {
    setPaginationState(prev => ({
      ...prev,
      hasMore: jdData.length < totalCount
    }))
  }, [jdData, totalCount])

  // Intersection Observer for lazy loading
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isJdLoading || isFetchingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && paginationState.hasMore && !isFetchingMore) {
          setIsFetchingMore(true)
          setPaginationState(prev => ({
            ...prev,
            page: prev.page + 1
          }))
        }
      })

      if (node) observer.current.observe(node)
    },
    [isJdLoading, isFetchingMore, paginationState.hasMore]
  )

  const handleDismiss = () => {
    dispatch(fetchJdDismiss())
  }

  const handleChangeLimit = (value: number) => {
    setPaginationState(prev => ({ ...prev, limit: value, page: 1, hasMore: true }))
    setIsFetchingMore(false)
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          paddingBottom: 2
        }}
      >
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <TextField
              size='small'
              placeholder='Search JD...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label='Search job descriptions'
              sx={{ width: '100%', minWidth: '200px', maxWidth: '420px' }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.400' }} />,
                endAdornment: searchQuery && (
                  <IconButton size='small' onClick={() => setSearchQuery('')} aria-label='Clear search'>
                    <ClearIcon />
                  </IconButton>
                )
              }}
            />

            {/* Filter Button and Menu */}
            <Box>
              <Button
                variant='outlined'
                startIcon={<FilterListIcon />}
                onClick={handleFilterClick}
                sx={{ textTransform: 'none', fontWeight: 500 }}
                aria-label='Open filter menu'
              >
                {filter ? toTitleCase(filter) : 'Filter by JD Type'}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleFilterClose}
                MenuListProps={{
                  'aria-labelledby': 'filter-button'
                }}
              >
                <MenuItem onClick={() => handleFilterSelect(null)}>All</MenuItem>
                <MenuItem onClick={() => handleFilterSelect('campus')}>Campus</MenuItem>
                <MenuItem onClick={() => handleFilterSelect('lateral')}>Lateral</MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'start', md: 'end' }, alignItems: 'center' }}>
            <DynamicButton
              label='New JD'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(ROUTES.JD_ADD)}
              sx={{ fontSize: '14px', fontWeight: 500 }}
            >
              New JD
            </DynamicButton>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                padding: '4px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('grid')}
                  aria-label='Switch to grid view'
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  aria-label='Switch to table view'
                >
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Card>

      {viewMode === 'grid' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {jdSuccess &&
            jdData.length > 0 &&
            jdData.map((jobRole, index) => (
              <Card
                key={jobRole.id}
                ref={index === jdData.length - 1 ? lastElementRef : null}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 3,
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3,
                    borderBottom: '1px solid #e0e0e0',
                    position: 'relative'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <JDIcon />
                    <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#23262F' }}>
                      {jobRole.details.roleSpecification?.jobRole?.toUpperCase() || 'N/A'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor:
                        jobRole.approvalStatus?.toLowerCase() === 'complete'
                          ? '#C8E6C9'
                          : jobRole.approvalStatus?.toLowerCase() === 'pending'
                            ? '#FFE0B2'
                            : jobRole.approvalStatus?.toLowerCase() === 'rejected'
                              ? '#FFCDD2'
                              : '#E0E0E0',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background:
                          jobRole.approvalStatus?.toLowerCase() === 'complete'
                            ? '#00B798'
                            : jobRole.approvalStatus?.toLowerCase() === 'pending'
                              ? '#FFA500'
                              : jobRole.approvalStatus?.toLowerCase() === 'rejected'
                                ? '#FF0000'
                                : '#9e9e9e'
                      }}
                    />
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '13px',
                        color:
                          jobRole.approvalStatus?.toLowerCase() === 'complete'
                            ? 'success.main'
                            : jobRole.approvalStatus?.toLowerCase() === 'pending'
                              ? 'warning.main'
                              : jobRole.approvalStatus?.toLowerCase() === 'rejected'
                                ? 'error.main'
                                : 'text.secondary'
                      }}
                    >
                      {jobRole.approvalStatus?.toUpperCase() || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 3, flex: 1 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78' }}>Experience:</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 1 }}>
                        {jobRole.details.educationAndExperience?.[0]?.experienceDescription
                          ? `${jobRole.details.educationAndExperience[0].experienceDescription.min} - ${jobRole.details.educationAndExperience[0].experienceDescription.max} years`
                          : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78', mt: 2 }}>
                        Salary:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 1 }}>
                        {jobRole.details.roleSpecification?.salaryRange
                          ? `₹ ${toTitleCase(jobRole.details.roleSpecification.salaryRange.replace(/_/g, ' '))}`
                          : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78', mt: 2 }}>
                        Education:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 1 }}>
                        {jobRole.details.educationAndExperience?.[0]?.minimumQualification
                          ? toTitleCase(jobRole.details.educationAndExperience[0].minimumQualification)
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78' }}>
                        Company Name:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 1 }}>
                        {jobRole.details.roleSpecification?.companyName
                          ? toTitleCase(jobRole.details.roleSpecification.companyName.replace(/_/g, ' '))
                          : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78', mt: 2 }}>
                        Job Type:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 1 }}>
                        {jobRole.details.roleSpecification?.jobType
                          ? toTitleCase(jobRole.details.roleSpecification.jobType)
                          : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78', mt: 2 }}>
                        JD Type:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 1 }}>
                        {jobRole.details.jdType ? toTitleCase(jobRole.details.jdType) : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1, mt: 4 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: '40px', mt: 2 }}>
                    {jobRole.details.skills?.length > 0 ? (
                      jobRole.details.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={toTitleCase(skill)}
                          sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        No skills listed
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    px: 2,
                    pb: 2,
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                      border: '1px solid #0096DA',
                      borderRadius: '4px',
                      px: 3,
                      py: 1.5,
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      '&:hover': {
                        backgroundColor: '#0096DA'
                      },
                      '&:hover .view-text': {
                        color: '#fff'
                      }
                    }}
                    onClick={() => router.push(ROUTES.JD_VIEW(jobRole.id))}
                  >
                    <Typography className='view-text' sx={{ color: '#0096DA', fontWeight: 500 }}>
                      View Details
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                      border: '1px solid #0096DA',
                      borderRadius: '4px',
                      px: 3,
                      py: 1.5,
                      backgroundColor: '#0096DA',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      '&:hover': {
                        backgroundColor: '#fff'
                      },
                      '&:hover .edit-text': {
                        color: '#0096DA'
                      }
                    }}
                    onClick={() => router.push(ROUTES.JD_EDIT(jobRole.id, jobRole?.details.roleSpecification?.jobRole))}
                  >
                    <Typography className='edit-text' sx={{ color: '#fff', fontWeight: 500 }}>
                      Edit
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
        </Box>
      ) : (
        <JobListingTableView
          jobs={jdData}
          totalCount={totalCount}
          pagination={{
            pageIndex: paginationState.page - 1,
            pageSize: paginationState.limit
          }}
          onPageChange={newPage => setPaginationState(prev => ({ ...prev, page: newPage + 1 }))}
          onRowsPerPageChange={handleChangeLimit}
        />
      )}

      {viewMode === 'grid' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          {isFetchingMore && <CircularProgress />}
          {!isFetchingMore && !paginationState.hasMore && jdData.length > 0 && (
            <Typography variant='body2' color='text.secondary'>
              No more job details to load
            </Typography>
          )}
        </Box>
      )}

      {isJdLoading && !isFetchingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {jdFailure && (
        <Alert severity='error' onClose={handleDismiss} sx={{ mb: 2 }}>
          {jdFailureMessage}
        </Alert>
      )}
      {jdSuccess && jdData.length === 0 && <Alert severity='info'>No job details found.</Alert>}
      {!isJdLoading && !jdSuccess && !jdFailure && (
        <Alert severity='warning'>No data loaded. Check Redux state or API call.</Alert>
      )}
    </Box>
  )
}

export default JobDetailsList
