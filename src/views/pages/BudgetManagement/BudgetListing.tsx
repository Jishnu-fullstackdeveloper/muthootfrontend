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
  IconButton,
  InputAdornment,
  Typography,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'

// Components and Utils
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import AreaFilterDialog from '@/@core/components/dialogs/recruitment-location-filters'
import DynamicTable from '@/components/Table/dynamicTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

// Mock Data
const mockBudgetData = [
  {
    id: 1,
    jobTitle: 'Software Engineer',
    noOfOpenings: 3,
    grade: 'G1',
    designation: 'Senior Developer',
    businessRole: 'Technical Lead',
    experienceMin: 5,
    experienceMax: 10,
    campusLateral: 'Lateral',
    employeeCategory: 'Permanent',
    employeeType: 'Full-Time',
    hiringManager: 'John Doe',
    startDate: '2025-04-01',
    closingDate: '2025-06-30',
    company: 'Tech Corp',
    businessUnit: 'Engineering',
    department: 'Development',
    territory: 'Territory 1',
    zone: 'Zone 1',
    region: 'Region 1',
    area: 'Area 1',
    cluster: 'Cluster 1',
    branch: 'Branch 1',
    branchCode: 'BR001',
    cityClassification: 'Metro',
    state: 'California',
    budgetDepartment: 'Development',
    position: 'Senior Developer',
    count: 3,
    yearOfBudget: '2025'
  },
  {
    id: 2,
    jobTitle: 'Product Manager',
    noOfOpenings: 2,
    grade: 'G2',
    designation: 'Product Lead',
    businessRole: 'Product Strategy',
    experienceMin: 7,
    experienceMax: 12,
    campusLateral: 'Campus',
    employeeCategory: 'Contract',
    employeeType: 'Part-Time',
    hiringManager: 'Jane Smith',
    startDate: '2025-05-01',
    closingDate: '2025-07-31',
    company: 'Tech Corp',
    businessUnit: 'Product',
    department: 'Product Management',
    territory: 'Territory 2',
    zone: 'Zone 2',
    region: 'Region 2',
    area: 'Area 2',
    cluster: 'Cluster 2',
    branch: 'Branch 2',
    branchCode: 'BR002',
    cityClassification: 'Non-Metro',
    state: 'Texas',
    budgetDepartment: 'Product Management',
    position: 'Product Lead',
    count: 2,
    yearOfBudget: '2025'
  }
]

const mockDropdownOptions = {
  grade: ['G1', 'G2', 'G3'],
  designation: ['Senior Developer', 'Product Lead', 'Team Lead'],
  businessRole: ['Technical Lead', 'Product Strategy', 'Operations'],
  campusLateral: ['Campus', 'Lateral'],
  employeeCategory: ['Permanent', 'Contract'],
  employeeType: ['Full-Time', 'Part-Time'],
  hiringManager: ['John Doe', 'Jane Smith', 'Alice Johnson'],
  company: ['Tech Corp', 'Innovate Inc'],
  businessUnit: ['Engineering', 'Product', 'Sales'],
  department: ['Development', 'Product Management', 'Sales'],
  territory: ['Territory 1', 'Territory 2'],
  zone: ['Zone 1', 'Zone 2'],
  region: ['Region 1', 'Region 2'],
  area: ['Area 1', 'Area 2'],
  cluster: ['Cluster 1', 'Cluster 2'],
  branch: ['Branch 1', 'Branch 2'],
  cityClassification: ['Metro', 'Non-Metro'],
  state: ['California', 'Texas'],
  position: ['Senior Developer', 'Product Lead'],
  yearOfBudget: ['2025', '2026']
}

// Define column helper
const columnHelper = createColumnHelper<any>()

const BudgetListing = () => {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10, display_numbers_count: 5 })
  const [openLocationFilter, setOpenLocationFilter] = useState(false)
  const [selectedTabs, setSelectedTabs] = useState<{ [key: number]: number }>({})

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

  const handlePageCountChange = (newPageCount: number) => {
    // console.log('Page Count:', newPageCount)
    setPaginationState(prev => ({
      ...prev,
      display_numbers_count: newPageCount
    }))
  }

  const handleTabChange = (index: number, newTab: number) => {
    setSelectedTabs(prev => ({ ...prev, [index]: newTab }))
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

  // Define columns for DynamicTable
  const columns = [
    columnHelper.accessor('jobTitle', {
      header: 'JOB TITLE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.jobTitle}
        </Typography>
      )
    }),
    columnHelper.accessor('noOfOpenings', {
      header: 'NO. OF OPENINGS',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.noOfOpenings}
        </Typography>
      )
    }),
    columnHelper.accessor('grade', {
      header: 'GRADE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.grade}
        </Typography>
      )
    }),
    columnHelper.accessor('designation', {
      header: 'DESIGNATION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.designation}
        </Typography>
      )
    }),
    columnHelper.accessor('businessRole', {
      header: 'BUSINESS ROLE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.businessRole}
        </Typography>
      )
    }),
    columnHelper.accessor('experienceMin', {
      id: 'experience',
      header: 'EXPERIENCE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {`${row.original.experienceMin} - ${row.original.experienceMax} years`}
        </Typography>
      )
    }),
    columnHelper.accessor('campusLateral', {
      header: 'CAMPUS / LATERAL',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.campusLateral}
        </Typography>
      )
    }),
    columnHelper.accessor('employeeCategory', {
      header: 'EMPLOYEE CATEGORY',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.employeeCategory}
        </Typography>
      )
    }),
    columnHelper.accessor('employeeType', {
      header: 'EMPLOYEE TYPE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.employeeType}
        </Typography>
      )
    }),
    columnHelper.accessor('hiringManager', {
      header: 'HIRING MANAGER',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.hiringManager}
        </Typography>
      )
    }),
    columnHelper.accessor('startDate', {
      header: 'START DATE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.startDate}
        </Typography>
      )
    }),
    columnHelper.accessor('closingDate', {
      header: 'CLOSING DATE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.closingDate}
        </Typography>
      )
    }),
    columnHelper.accessor('company', {
      header: 'COMPANY',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.company}
        </Typography>
      )
    }),
    columnHelper.accessor('businessUnit', {
      header: 'BUSINESS UNIT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.businessUnit}
        </Typography>
      )
    }),
    columnHelper.accessor('department', {
      header: 'DEPARTMENT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.department}
        </Typography>
      )
    }),
    columnHelper.accessor('territory', {
      header: 'TERRITORY',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.territory}
        </Typography>
      )
    }),
    columnHelper.accessor('zone', {
      header: 'ZONE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.zone}
        </Typography>
      )
    }),
    columnHelper.accessor('region', {
      header: 'REGION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.region}
        </Typography>
      )
    }),
    columnHelper.accessor('area', {
      header: 'AREA',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.area}
        </Typography>
      )
    }),
    columnHelper.accessor('cluster', {
      header: 'CLUSTER',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.cluster}
        </Typography>
      )
    }),
    columnHelper.accessor('branch', {
      header: 'BRANCH',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.branch}
        </Typography>
      )
    }),
    columnHelper.accessor('branchCode', {
      header: 'BRANCH CODE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.branchCode}
        </Typography>
      )
    }),
    columnHelper.accessor('cityClassification', {
      header: 'CITY CLASSIFICATION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.cityClassification}
        </Typography>
      )
    }),
    columnHelper.accessor('state', {
      header: 'STATE',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.state}
        </Typography>
      )
    }),
    columnHelper.accessor('budgetDepartment', {
      header: 'BUDGET DEPARTMENT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.budgetDepartment}
        </Typography>
      )
    }),
    columnHelper.accessor('position', {
      header: 'POSITION',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.position}
        </Typography>
      )
    }),
    columnHelper.accessor('count', {
      header: 'COUNT',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.count}
        </Typography>
      )
    }),
    columnHelper.accessor('yearOfBudget', {
      header: 'YEAR OF BUDGET',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
          {row.original.yearOfBudget}
        </Typography>
      )
    }),
    columnHelper.accessor('id', {
      id: 'action',
      header: 'ACTION',
      meta: {
        className: 'sticky right-0'
      },
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View' placement='top'>
            <IconButton onClick={() => router.push(`/budget-management/view/${row.original.id}`)}>
              <i className='tabler-eye text-textSecondary'></i>
            </IconButton>
          </Tooltip>
        </Box>
      ),
      enableSorting: false
    })
  ]

  useEffect(() => {
    if (mockBudgetData?.length > 0) {
      const initialTabs = mockBudgetData.reduce(
        (acc, _, index) => {
          acc[index] = 0 // Default tab is 'General Budget Request'
          return acc
        },
        {} as { [key: number]: number }
      )
      setSelectedTabs(initialTabs)
    }
  }, [])

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
            p: 6,
            borderTop: 1,
            borderColor: 'divider',
            gap: 4,
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
            <DynamicButton
              label='Add filter'
              variant='tonal'
              icon={<i className='tabler-plus' />}
              position='start'
              children='Add filter'
              onClick={() => setOpenLocationFilter(true)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mt: { xs: 4, md: 0 } }}>
            <DynamicButton
              label='Export Excel'
              variant='tonal'
              icon={<i className='tabler-file-arrow-right' />}
              position='start'
              children='Export Excel'
            />
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
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                backgroundColor: 'background.default',
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
              <Tooltip title='Table View'>
                <IconButton color={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      {(viewMode === 'grid' || viewMode === 'list') && (
        <Grid
          container
          spacing={6}
          sx={{
            ...(viewMode === 'grid' ? {} : { '& > * + *': { mt: 6 } })
          }}
        >
          {mockBudgetData.map((budget: any, index: number) => (
            <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={index}>
              <Box
                onClick={() => router.push(`/budget-management/view/${budget.id}`)}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  },
                  cursor: 'pointer',
                  minHeight: viewMode !== 'grid' ? '150px' : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  p: viewMode !== 'grid' ? 6 : 0
                }}
              >
                {viewMode === 'grid' ? (
                  <>
                    <Box sx={{ p: 4, borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs
                        value={selectedTabs[index] ?? 0}
                        onClick={e => e.stopPropagation()}
                        onChange={(e, newValue) => handleTabChange(index, newValue)}
                        aria-label='budget details'
                        sx={{ minHeight: '40px' }}
                      >
                        <Tab
                          label='General Budget'
                          sx={{ minWidth: 0, padding: '6px 12px', fontSize: '0.85rem', minHeight: '40px' }}
                        />
                        <Tab
                          label='Organization Unit'
                          sx={{ minWidth: 0, padding: '6px 12px', fontSize: '0.85rem', minHeight: '40px' }}
                        />
                        <Tab
                          label='Joining Location'
                          sx={{ minWidth: 0, padding: '6px 12px', fontSize: '0.85rem', minHeight: '40px' }}
                        />
                        <Tab
                          label='Department Budget'
                          sx={{ minWidth: 0, padding: '6px 12px', fontSize: '0.85rem', minHeight: '40px' }}
                        />
                      </Tabs>

                      <Box sx={{ mt: 4 }}>
                        {selectedTabs[index] === 0 && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              General Budget Request
                            </Typography>
                            <TextField
                              label='Job Title'
                              value={budget.jobTitle}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                            />
                            <TextField
                              label='No. of Openings'
                              value={budget.noOfOpenings}
                              type='number'
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                            />
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Grade</InputLabel>
                              <Select value={budget.grade} label='Grade' readOnly>
                                {mockDropdownOptions.grade.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Designation</InputLabel>
                              <Select value={budget.designation} label='Designation' readOnly>
                                {mockDropdownOptions.designation.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Business Role</InputLabel>
                              <Select value={budget.businessRole} label='Business Role' readOnly>
                                {mockDropdownOptions.businessRole.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <TextField
                                label='Experience (Min)'
                                value={budget.experienceMin}
                                type='number'
                                fullWidth
                                InputProps={{ readOnly: true }}
                                variant='outlined'
                              />
                              <TextField
                                label='Experience (Max)'
                                value={budget.experienceMax}
                                type='number'
                                fullWidth
                                InputProps={{ readOnly: true }}
                                variant='outlined'
                              />
                            </Box>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Campus / Lateral</InputLabel>
                              <Select value={budget.campusLateral} label='Campus / Lateral' readOnly>
                                {mockDropdownOptions.campusLateral.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Employee Category</InputLabel>
                              <Select value={budget.employeeCategory} label='Employee Category' readOnly>
                                {mockDropdownOptions.employeeCategory.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Employee Type</InputLabel>
                              <Select value={budget.employeeType} label='Employee Type' readOnly>
                                {mockDropdownOptions.employeeType.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Hiring Manager</InputLabel>
                              <Select value={budget.hiringManager} label='Hiring Manager' readOnly>
                                {mockDropdownOptions.hiringManager.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <TextField
                              label='Start Date'
                              value={budget.startDate}
                              type='date'
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              label='Closing Date'
                              value={budget.closingDate}
                              type='date'
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                            />
                          </Box>
                        )}
                        {selectedTabs[index] === 1 && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Organization Unit Details
                            </Typography>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Company</InputLabel>
                              <Select value={budget.company} label='Company' readOnly>
                                {mockDropdownOptions.company.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Business Unit</InputLabel>
                              <Select value={budget.businessUnit} label='Business Unit' readOnly>
                                {mockDropdownOptions.businessUnit.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Department</InputLabel>
                              <Select value={budget.department} label='Department' readOnly>
                                {mockDropdownOptions.department.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}
                        {selectedTabs[index] === 2 && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Joining Location Details
                            </Typography>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Territory</InputLabel>
                              <Select value={budget.territory} label='Territory' readOnly>
                                {mockDropdownOptions.territory.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Zone</InputLabel>
                              <Select value={budget.zone} label='Zone' readOnly>
                                {mockDropdownOptions.zone.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Region</InputLabel>
                              <Select value={budget.region} label='Region' readOnly>
                                {mockDropdownOptions.region.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Area</InputLabel>
                              <Select value={budget.area} label='Area' readOnly>
                                {mockDropdownOptions.area.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Cluster</InputLabel>
                              <Select value={budget.cluster} label='Cluster' readOnly>
                                {mockDropdownOptions.cluster.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Branch</InputLabel>
                              <Select value={budget.branch} label='Branch' readOnly>
                                {mockDropdownOptions.branch.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <TextField
                              label='Branch Code'
                              value={budget.branchCode}
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                            />
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>City Classification</InputLabel>
                              <Select value={budget.cityClassification} label='City Classification' readOnly>
                                {mockDropdownOptions.cityClassification.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>State</InputLabel>
                              <Select value={budget.state} label='State' readOnly>
                                {mockDropdownOptions.state.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}
                        {selectedTabs[index] === 3 && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Department Budget Fields
                            </Typography>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Department</InputLabel>
                              <Select value={budget.budgetDepartment} label='Department' readOnly>
                                {mockDropdownOptions.department.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Position</InputLabel>
                              <Select value={budget.position} label='Position' readOnly>
                                {mockDropdownOptions.position.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <TextField
                              label='Count'
                              value={budget.count}
                              type='number'
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                            />
                            <FormControl fullWidth variant='outlined'>
                              <InputLabel>Year of Budget</InputLabel>
                              <Select value={budget.yearOfBudget} label='Year of Budget' readOnly>
                                {mockDropdownOptions.yearOfBudget.map(option => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={4}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                          General Budget Request
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            label='Job Title'
                            value={budget.jobTitle}
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant='outlined'
                          />
                          <TextField
                            label='No. of Openings'
                            value={budget.noOfOpenings}
                            type='number'
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant='outlined'
                          />
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Grade</InputLabel>
                            <Select value={budget.grade} label='Grade' readOnly>
                              {mockDropdownOptions.grade.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Designation</InputLabel>
                            <Select value={budget.designation} label='Designation' readOnly>
                              {mockDropdownOptions.designation.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Business Role</InputLabel>
                            <Select value={budget.businessRole} label='Business Role' readOnly>
                              {mockDropdownOptions.businessRole.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                              label='Experience (Min)'
                              value={budget.experienceMin}
                              type='number'
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                            />
                            <TextField
                              label='Experience (Max)'
                              value={budget.experienceMax}
                              type='number'
                              fullWidth
                              InputProps={{ readOnly: true }}
                              variant='outlined'
                            />
                          </Box>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Campus / Lateral</InputLabel>
                            <Select value={budget.campusLateral} label='Campus / Lateral' readOnly>
                              {mockDropdownOptions.campusLateral.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Employee Category</InputLabel>
                            <Select value={budget.employeeCategory} label='Employee Category' readOnly>
                              {mockDropdownOptions.employeeCategory.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Employee Type</InputLabel>
                            <Select value={budget.employeeType} label='Employee Type' readOnly>
                              {mockDropdownOptions.employeeType.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Hiring Manager</InputLabel>
                            <Select value={budget.hiringManager} label='Hiring Manager' readOnly>
                              {mockDropdownOptions.hiringManager.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            label='Start Date'
                            value={budget.startDate}
                            type='date'
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant='outlined'
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            label='Closing Date'
                            value={budget.closingDate}
                            type='date'
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant='outlined'
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                          Organization Unit Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Company</InputLabel>
                            <Select value={budget.company} label='Company' readOnly>
                              {mockDropdownOptions.company.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Business Unit</InputLabel>
                            <Select value={budget.businessUnit} label='Business Unit' readOnly>
                              {mockDropdownOptions.businessUnit.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Department</InputLabel>
                            <Select value={budget.department} label='Department' readOnly>
                              {mockDropdownOptions.department.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mt: 4, mb: 2 }}>
                          Department Budget Fields
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Department</InputLabel>
                            <Select value={budget.budgetDepartment} label='Department' readOnly>
                              {mockDropdownOptions.department.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Position</InputLabel>
                            <Select value={budget.position} label='Position' readOnly>
                              {mockDropdownOptions.position.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            label='Count'
                            value={budget.count}
                            type='number'
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant='outlined'
                          />
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Year of Budget</InputLabel>
                            <Select value={budget.yearOfBudget} label='Year of Budget' readOnly>
                              {mockDropdownOptions.yearOfBudget.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                          Joining Location Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Territory</InputLabel>
                            <Select value={budget.territory} label='Territory' readOnly>
                              {mockDropdownOptions.territory.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Zone</InputLabel>
                            <Select value={budget.zone} label='Zone' readOnly>
                              {mockDropdownOptions.zone.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Region</InputLabel>
                            <Select value={budget.region} label='Region' readOnly>
                              {mockDropdownOptions.region.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Area</InputLabel>
                            <Select value={budget.area} label='Area' readOnly>
                              {mockDropdownOptions.area.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Cluster</InputLabel>
                            <Select value={budget.cluster} label='Cluster' readOnly>
                              {mockDropdownOptions.cluster.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>Branch</InputLabel>
                            <Select value={budget.branch} label='Branch' readOnly>
                              {mockDropdownOptions.branch.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            label='Branch Code'
                            value={budget.branchCode}
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant='outlined'
                          />
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>City Classification</InputLabel>
                            <Select value={budget.cityClassification} label='City Classification' readOnly>
                              {mockDropdownOptions.cityClassification.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>State</InputLabel>
                            <Select value={budget.state} label='State' readOnly>
                              {mockDropdownOptions.state.map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {viewMode === 'table' && (
        <Box sx={{ mt: 6 }}>
          <DynamicTable
            columns={columns}
            data={mockBudgetData || []}
            totalCount={mockBudgetData.length}
            pagination={paginationState}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            // onPageCountChange={handlePageCountChange}
            tableName='Budget Request List'
          />
        </Box>
      )}
    </Box>
  )
}

export default BudgetListing
