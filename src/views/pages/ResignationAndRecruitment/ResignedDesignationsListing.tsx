// src/form/generatedForms/ResignedDesignationsListing.tsx
'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import type { TextFieldProps } from '@mui/material'
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Typography,
  Tooltip,
  Divider,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import GridViewIcon from '@mui/icons-material/GridView'

// import ViewListIcon from '@mui/icons-material/ViewList'
import TableChartIcon from '@mui/icons-material/TableChart'
import { CheckCircle, Clear, HourglassEmpty } from '@mui/icons-material'

// Components and Utils
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import RecruitmentListTableView from './RecruitmentListTableView'
import AreaFilterDialog from '@/@core/components/dialogs/recruitment-location-filters'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { approveRecruitment, fetchResignationOverviewList } from '@/redux/RecruitmentResignationSlice'
import { getAccessToken, decodeToken } from '@/utils/functions'
import withPermission from '@/hocs/withPermission'

// Sample Data (to be removed if using real API data)
// import designationData from './sampleDesignationData'
import type { RootState } from '@/redux/store'

// import type { TextFieldProps } from '@mui/material/TextField'

const ResignedDesignationsListing = () => {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ limit: 10, page: 2, display_numbers_count: 5 }) // Page 2 for second page
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

    // Add logic to handle filters (e.g., make API calls, update state)
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParams = searchParams.get('filter') // Assuming filterParams provides designationName
  const dispatch = useAppDispatch()

  const {
    fetchResignationOverviewListLoading,
    fetchResignationOverviewListData,
    fetchResignationOverviewListFailure,
    fetchResignationOverviewListFailureMessage
  } = useAppSelector((state: RootState) => state.recruitmentResignationReducer)

  const safeGetData = (source: any): any[] => (source?.data && Array.isArray(source.data) ? source.data : [])

  // Use real API data instead of sample data
  const designationData = safeGetData(fetchResignationOverviewListData)

  const [selectedTabs, setSelectedTabs] = useState<{ [key: number]: number }>({})

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approval Pending':
        return <HourglassEmpty sx={{ color: '#ff9800' }} />
      case 'Approved':
        return <CheckCircle sx={{ color: '#4caf50' }} />
      case 'Rejected':
        return <Clear sx={{ color: '#f44336' }} />
      default:
        return null
    }
  }

  const getApproverId = () => {
    const token = getAccessToken()

    if (!token) return null
    const decodedToken = decodeToken(token)

    return decodedToken?.sub
  }

  const handlePageChange = (event: any, value: number) => {
    setPaginationState(prev => ({ ...prev, page: value }))
  }

  const handleChangeLimit = (value: number) => {
    setPaginationState(prev => ({ ...prev, limit: value }))
  }

  const handleTabChange = (index: number, newTab: number) => {
    setSelectedTabs(prev => ({ ...prev, [index]: newTab }))
  }

  const handleApprove = async (designation: any) => {
    try {
      dispatch(approveRecruitment(designation))
        .unwrap()
        .then(response => console.log('Approval successful:', response))
        .catch(error => console.error('Approval failed:', error))
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleReject = async (id: number, approval_id: number) => {
    try {
      const approverId = getApproverId()

      if (!approverId) throw new Error('No approver ID found')
      console.log(id, approval_id)

      // await dispatch(
      //   submitRequestDecision({
      //     id: approval_id,
      //     approvalStatus: 'REJECTED',
      //     approverId
      //   })
      // ).unwrap()
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

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

  // Fetch data for second page with designationName
  useEffect(() => {
    const params = {
      search: search || '',
      page: paginationState.page,
      limit: paginationState.limit,
      designationName: filterParams?.replace(/-/g, ' ') || 'Developer' // Example designationName, adjust as needed
    }

    dispatch(fetchResignationOverviewList(params))
  }, [dispatch, paginationState.page, paginationState.limit, search, filterParams])

  useEffect(() => {
    if (designationData?.length > 0) {
      const initialTabs = designationData.reduce(
        (acc, _, index) => {
          acc[index] = 0 // Default tab is 'Basic Details'

          return acc
        },
        {} as { [key: number]: number }
      )

      setSelectedTabs(initialTabs)
    }
  }, [designationData])

  if (fetchResignationOverviewListLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (fetchResignationOverviewListFailure) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography color='error'>Error loading data: {fetchResignationOverviewListFailureMessage}</Typography>
      </Box>
    )
  }

  return (
    <>
      <div className='min-h-screen'>
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
                color: '#333',
                letterSpacing: 1
              }}
            >
              Recruitment Requests
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Typography variant='body2' color='textSecondary'>
                Last Bot Update on: <span style={{ fontWeight: 'bold', color: '#2d2c2c' }}>January 6, 2025</span>
              </Typography>
              <Tooltip title='Click here for help'>
                <IconButton size='small'>
                  <HelpOutlineIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
            <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
              <DebouncedInput
                label='Search Department'
                value={search}
                onChange={value => setSearch(value)}
                placeholder='Search by Department...'
                className='is-full sm:is-[400px]'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                      <i className='tabler-search text-xxl' />
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{ mt: 5 }}>
                <DynamicButton
                  label='Add filter'
                  variant='tonal'
                  icon={<i className='tabler-plus' />}
                  position='start'
                  children='Add filter'
                  onClick={() => setOpenLocationFilter(true)}
                />
              </Box>
            </div>
            <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
              <DynamicButton
                label='Export Excel'
                variant='tonal'
                icon={<i className='tabler-file-arrow-right' />}
                position='start'
                children='Export Excel'
              />
              {withPermission(() => (
                <DynamicButton
                  label='New JD'
                  variant='contained'
                  icon={<i className='tabler-plus' />}
                  position='start'
                  onClick={() => router.push(`/recruitment-management/add/new`)}
                  children='New Request'
                />
              ))({ individualPermission: 'recruitment_create' })}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Tooltip title='Grid View'>
                  <IconButton color={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}>
                    <GridViewIcon />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title='List View'>
                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                  <ViewListIcon />
                </IconButton>
              </Tooltip> */}
                <Tooltip title='Table View'>
                  <IconButton
                    color={viewMode === 'table' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('table')}
                  >
                    <TableChartIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </div>
        </Card>

        {(viewMode === 'grid' || viewMode === 'list') && (
          <Box
            className={`${
              viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6' : 'space-y-4'
            }`}
          >
            {designationData.map((designation: any, index: number) => (
              <Box
                key={index}
                onClick={() => router.push(`/recruitment-management/view/${designation.id}`)}
                className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 ${
                  viewMode !== 'grid' ? 'p-0' : ''
                }`}
                sx={{
                  cursor: 'pointer',
                  minHeight: viewMode !== 'grid' ? '150px' : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  {viewMode === 'grid' ? (
                    <>
                      <Box className='p-4 border-t'>
                        <Tabs
                          value={selectedTabs[index] ?? 0}
                          onClick={e => e.stopPropagation()}
                          onChange={(e, newValue) => handleTabChange(index, newValue)}
                          aria-label='employee details'
                          sx={{ minHeight: '40px' }}
                        >
                          <Tab
                            label='Basic Details'
                            sx={{ minWidth: 0, padding: '6px 12px', fontSize: '0.85rem', minHeight: '40px' }}
                          />
                          <Tab
                            label={
                              <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                                <Typography sx={{ fontSize: '0.85rem' }}>Bubble Positions</Typography>
                                <Box
                                  sx={{
                                    backgroundColor: '#2faad3',
                                    color: '#fff',
                                    borderRadius: '100%',
                                    padding: '3px 6px',
                                    marginLeft: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    minWidth: '24px',
                                    textAlign: 'center'
                                  }}
                                >
                                  {designation?.bubblePositionBranchIds?.length || 0}
                                </Box>
                              </Box>
                            }
                            sx={{ minWidth: 0, padding: '6px 12px', fontSize: '0.85rem', minHeight: '40px' }}
                          />
                          <Tab
                            label='More Details'
                            sx={{ minWidth: 0, padding: '6px 12px', fontSize: '0.85rem', minHeight: '40px' }}
                          />
                        </Tabs>

                        <Box className='mt-4'>
                          {selectedTabs[index] === 0 && (
                            <Box className='space-y-2 text-sm text-gray-700'>
                              {/* <p>
                              <strong>Request Type:</strong> {designation?.origin}
                            </p> */}
                              <p>
                                <strong>Department:</strong> {designation?.departmentName}
                              </p>
                              <p>
                                <strong>Branch:</strong> {designation?.branchesName}
                              </p>
                              {designation.origin === 'Resignation' && (
                                <p>
                                  <strong>Resigned Employee Code:</strong> {designation?.id}
                                </p>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                                  <strong>Status:</strong> 
                                  <span
                                    style={{
                                      marginRight: '3px',
                                      color:
                                        designation?.approvalStatus === 'PENDING'
                                          ? '#ff9800'
                                          : designation?.approvalStatus === 'APPROVE'
                                            ? '#4caf50'
                                            : designation?.approvalStatus === 'REJECTED'
                                              ? '#f44336'
                                              : '#757575'
                                    }}
                                  >
                                    {designation?.approvalStatus}
                                  </span>
                                  {getStatusIcon(designation?.employmentStatus)}
                                </Typography>
                              </Box>
                              <Divider sx={{ marginY: 2 }} />
                              {withPermission(() => (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                  <Tooltip title='Approve Request'>
                                    <Button
                                      variant='contained'
                                      color='success'
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleApprove(designation)
                                      }}
                                      sx={{ padding: '6px 16px' }}
                                      startIcon={<i className='tabler-check' />}
                                    >
                                      Approve
                                    </Button>
                                  </Tooltip>

                                  <Tooltip title='Reject Request'>
                                    <Button
                                      variant='contained'
                                      color='error'
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleReject(designation?.id, designation?.approvalId)
                                      }}
                                      sx={{ padding: '6px 16px' }}
                                      startIcon={<i className='tabler-playstation-x' />}
                                    >
                                      Reject All
                                    </Button>
                                  </Tooltip>
                                </Box>
                              ))({ individualPermission: 'recruitment_approval' })}
                              <Box sx={{ marginTop: 2, backgroundColor: '#f4f4f4', borderRadius: 2, padding: 2 }}>
                                <Typography
                                  variant='body2'
                                  sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.9rem' }}
                                >
                                  Additional Details: {designation.additionalDetails || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          {selectedTabs[index] === 1 && (
                            <Box className='space-y-2 text-sm text-gray-700'>
                              {designation?.bubblePositionBranchIds?.length > 0 ? (
                                <Box>
                                  <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                    Branch IDs with Bubble Positions
                                  </Typography>
                                  {designation?.bubblePositionBranchIds.slice(0, 3).map((codes: any, idx: number) => (
                                    <Box
                                      key={idx}
                                      sx={{
                                        backgroundColor: '#f3f3f3',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        color: 'black',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.875rem',
                                        marginBottom: '8px'
                                      }}
                                    >
                                      <Typography>{codes}</Typography>
                                    </Box>
                                  ))}
                                  {designation?.bubblePositionBranchIds.length > 3 && (
                                    <Box
                                      sx={{
                                        padding: '8px 12px',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        color: '#007bff'
                                      }}
                                      onClick={e => {
                                        e.stopPropagation()
                                        alert('Show all branch IDs')
                                      }}
                                    >
                                      <Typography>
                                        +{designation?.bubblePositionBranchIds.length - 3} more...
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              ) : (
                                <Typography variant='body2' sx={{ color: '#757575' }}>
                                  No branch IDs available.
                                </Typography>
                              )}
                            </Box>
                          )}
                          {selectedTabs[index] === 2 && (
                            <Box className='space-y-2 text-sm text-gray-700'>
                              <p>
                                <strong>Band:</strong> {designation?.bandName}
                              </p>
                              <p>
                                <strong>Grade:</strong> {designation?.gradeName}
                              </p>
                              <p>
                                <strong>Company:</strong> {designation?.Company}
                              </p>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box className='p-4'>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <Box>
                          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            Basic Details
                          </Typography>
                          <Box className='space-y-2 text-sm text-gray-700'>
                            <p>
                              <strong>Request Type:</strong> {designation?.origin}
                            </p>
                            <p>
                              <strong>Department:</strong> {designation?.Department}
                            </p>
                            <p>
                              <strong>Branch:</strong> {designation?.Branches}
                            </p>
                            {designation.origin === 'Resignation' && (
                              <p>
                                <strong>Resigned Employee Code:</strong> {designation?.id}
                              </p>
                            )}
                            <Typography variant='body1'>
                              <strong>Status:</strong> 
                              <span
                                style={{
                                  marginRight: '3px',
                                  color:
                                    designation?.employmentStatus === 'Approval Pending'
                                      ? '#ff9800'
                                      : designation?.employmentStatus === 'Approved'
                                        ? '#4caf50'
                                        : designation?.employmentStatus === 'Rejected'
                                          ? '#f44336'
                                          : '#757575'
                                }}
                              >
                                {designation?.employmentStatus}
                              </span>
                              {getStatusIcon(designation?.employmentStatus)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            Bubble Positions
                          </Typography>
                          {designation?.bubblePositionBranchIds?.length > 0 ? (
                            <Box>
                              {designation?.bubblePositionBranchIds.slice(0, 3).map((codes: any, idx: number) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    backgroundColor: '#f3f3f3',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    color: 'black',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.875rem',
                                    marginBottom: '8px'
                                  }}
                                >
                                  <Typography>{codes}</Typography>
                                </Box>
                              ))}
                              {designation?.bubblePositionBranchIds.length > 3 && (
                                <Box
                                  sx={{
                                    padding: '8px 12px',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    color: '#007bff'
                                  }}
                                  onClick={() => alert('Show all branch IDs')}
                                >
                                  <Typography>+{designation?.bubblePositionBranchIds.length - 3} more...</Typography>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Typography variant='body2' sx={{ color: '#757575' }}>
                              No bubble positions available.
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <Box className='space-y-2 text-sm text-gray-700'>
                            <p>
                              <strong>Band:</strong> {designation?.bandName}
                            </p>
                            <p>
                              <strong>Grade:</strong> {designation?.gradeName}
                            </p>
                            <p>
                              <strong>Company:</strong> {designation?.Company}
                            </p>
                          </Box>
                          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            Additional Details
                          </Typography>
                          <Box sx={{ marginTop: 2, backgroundColor: '#f4f4f4', borderRadius: 2, padding: 2 }}>
                            <Typography variant='body2' sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.9rem' }}>
                              {designation?.additionalDetails || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                {designation.employmentStatus === 'Approval Pending' && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2,
                      marginTop: 'auto',
                      padding: 2,
                      marginRight: 2
                    }}
                  >
                    <Button
                      variant='contained'
                      color='success'
                      onClick={e => {
                        e.stopPropagation()
                        handleApprove(designation)
                      }}
                      sx={{ padding: '6px 16px' }}
                      startIcon={<i className='tabler-check' />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      onClick={e => {
                        e.stopPropagation()
                        handleReject(designation?.id, designation?.approval_id)
                      }}
                      sx={{ padding: '6px 16px' }}
                      startIcon={<i className='tabler-playstation-x' />}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {viewMode === 'table' && <RecruitmentListTableView designationData={designationData} />}

        <div className='flex items-center justify-end mt-6'>
          <FormControl size='small' sx={{ minWidth: 70 }}>
            <InputLabel>Count</InputLabel>
            <Select
              value={paginationState?.limit}
              onChange={e => handleChangeLimit(Number(e.target.value))}
              label='Limit per page'
            >
              {[10, 25, 50, 100].map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Pagination
            color='primary'
            shape='rounded'
            showFirstButton
            showLastButton
            count={paginationState?.display_numbers_count}
            page={paginationState?.page}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  )
}

export default ResignedDesignationsListing
