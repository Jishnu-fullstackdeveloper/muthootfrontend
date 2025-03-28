'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import type { TextFieldProps } from '@mui/material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  Tooltip,
  Button
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import BusinessIcon from '@mui/icons-material/Business'

// Components and Utils
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import AreaFilterDialog from '@/@core/components/dialogs/recruitment-location-filters'
import BudgetListingTableView from './BudgetListingTableView'
import { mockBudgetData } from '@/utils/sampleData/BudgetManagement/BudgetListingData'

const BudgetListing = () => {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10, display_numbers_count: 5 })
  const [openLocationFilter, setOpenLocationFilter] = useState(false)

  const [selectedLocationFilters, setSelectedLocationFilters] = useState({
    territory: '',
    zone: '',
    region: '',
    area: '',
    cluster: '',
    branch: ''
  })

  const filterAreaOptions = {
    territory: [{ name: 'Territory 1' }, { name: 'Territory 2' }, { name: 'Territory 3' }],
    zone: ['Zone 1', 'Zone 2', 'Zone 3'],
    region: ['Region 1', 'Region 2', 'Region 3'],
    area: ['Area 1', 'Area 2', 'Area 3'],
    cluster: ['Cluster 1', 'Cluster 2', 'Cluster 3'],
    branch: ['Branch 1', 'Branch 2', 'Branch 3']
  }

  const handleLocationFilterChange = (filterKey: string) => (value: any) => {
    setSelectedLocationFilters(prev => ({ ...prev, [filterKey]: value }))
  }

  const handleApplyFilters = (selectedFilters: Record<string, any>) => {
    console.log(selectedFilters)

    // Add logic to handle filters in the future when API is available
  }

  const router = useRouter()

  const handlePageChange = (newPage: number) => {
    setPaginationState(prev => ({
      ...prev,
      pageIndex: newPage
    }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPaginationState({
      pageIndex: 0, // Reset to first page when rows per page changes
      pageSize: newPageSize,
      display_numbers_count: 10
    })
  }

  // const handlePageCountChange = (newPageCount: number) => {
  //   setPaginationState(prev => ({
  //     ...prev,
  //     display_numbers_count: newPageCount
  //   }))
  // }

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string
    onChange: (value: string) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value, debounce, onChange])

    return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  const handleApprove = (id: number) => {
    console.log(`Approved budget with ID: ${id}`)

    // Add API call or state update logic here
  }

  const handleReject = (id: number) => {
    console.log(`Rejected budget with ID: ${id}`)

    // Add API call or state update logic here
  }

  const filteredData = mockBudgetData.filter(budget => budget.jobTitle.toLowerCase().includes(search.toLowerCase()))

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AreaFilterDialog
        open={openLocationFilter}
        setOpen={setOpenLocationFilter}
        selectedLocationFilters={selectedLocationFilters}
        onApplyFilters={handleApplyFilters}
        options={filterAreaOptions}
        handleLocationFilterChange={handleLocationFilterChange}
      />
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
        <Box
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography
            component='h1'
            variant='h4'
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              letterSpacing: 1
            }}
          >
            Budget Requests
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              Last Bot Update on:{' '}
              <Box component='span' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                January 6, 2025
              </Box>
            </Typography>
            <Tooltip title='Click here for help'>
              <IconButton size='small'>
                <HelpOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            p: 3,
            borderTop: 1,
            borderColor: 'divider',
            gap: 2,
            overflowX: 'auto'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 4,
              flexWrap: 'wrap'
            }}
          >
            <DebouncedInput
              label='Search Job Title'
              value={search}
              onChange={value => setSearch(value)}
              placeholder='Search by Job Title...'
              sx={{ width: { xs: '100%', sm: '400px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mt: { xs: 4, md: 0 } }}>
            <DynamicButton
              label='New Budget Request'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(`/budget-management/add/new`)}
              children='New Request'
            />
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                borderRadius: '8px',
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
                  size='small'
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  size='small'
                >
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {filteredData.map((budget: any, index: number) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card
                onClick={() => router.push(`/budget-management/view/${budget.id}`)}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 3,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-4px)'
                  },
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                {/* Card Header with Gradient Background */}
                <Box
                  sx={{
                    bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    p: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WorkOutlineIcon sx={{ fontSize: 28 }} />
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                      {budget.jobTitle}
                    </Typography>
                  </Box>
                  <Chip
                    label={budget.status}
                    color={budget.status === 'Approve' ? 'success' : budget.status === 'Reject' ? 'error' : 'warning'}
                    size='small'
                    sx={{
                      bgcolor:
                        budget.status === 'Approve'
                          ? 'success.light'
                          : budget.status === 'Reject'
                            ? 'error.light'
                            : 'warning.light',
                      color: 'white',
                      fontWeight: 'medium'
                    }}
                  />
                </Box>

                {/* Card Content */}
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {/* Department */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                          Department:
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          {budget.department}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* No. of Openings */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleOutlineIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                          Openings:
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          {budget.noOfOpenings}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Start Date */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                          Start Date:
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          {new Date(budget.startDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Closing Date */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                          Closing Date:
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          {new Date(budget.closingDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Approve and Reject Buttons */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant='contained'
                          color='success'
                          size='small'
                          onClick={e => {
                            e.stopPropagation() // Prevent card click from navigating
                            handleApprove(budget.id)
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          onClick={e => {
                            e.stopPropagation() // Prevent card click from navigating
                            handleReject(budget.id)
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* Card Footer */}
                <Divider />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant='caption' sx={{ color: 'primary.main', fontWeight: 'medium', cursor: 'pointer' }}>
                    View Details
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {viewMode === 'table' && (
        <BudgetListingTableView
          data={filteredData}
          totalCount={mockBudgetData.length}
          pagination={paginationState}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </Box>
  )
}

export default BudgetListing
