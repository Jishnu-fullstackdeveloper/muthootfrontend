'use client'
import {
    Box,
    Card,
    Chip,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    Button
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import CustomTextField from '@/@core/components/mui/TextField'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import EditIcon from '@mui/icons-material/Edit'
import ReportIcon from '@mui/icons-material/Assessment'

const BranchListing = () => {
    const router = useRouter()
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedTabs, setSelectedTabs] = useState<Record<number, number>>({})

    const branches = [
        {
            id: 1,
            name: 'Downtown Branch',
            location: 'New York',
            totalEmployees: 50,
            turnover: '$5M',
            bucketLevel: 'Gold',
            status: 'Active',
            contact: '123-456-7890',
            hours: '9 AM - 6 PM',
            recentActivity: 'Quarterly meeting held on Jan 10th'
        },
        {
            id: 2,
            name: 'Market Square',
            location: 'San Francisco',
            totalEmployees: 30,
            turnover: '$3M',
            bucketLevel: 'Silver',
            status: 'Inactive',
            contact: '987-654-3210',
            hours: '10 AM - 7 PM',
            recentActivity: 'System maintenance completed on Jan 8th'
        },
        {
            id: 3,
            name: 'Tech Hub',
            location: 'Austin',
            totalEmployees: 80,
            turnover: '$10M',
            bucketLevel: 'Platinum',
            status: 'Active',
            contact: '456-789-1234',
            hours: '8 AM - 5 PM',
            recentActivity: 'New project launched on Jan 5th'
        }
    ]

    const [paginationState, setPaginationState] = useState({
        page: 1,
        limit: 10,
        display_numbers_count: 5
    })

    // Initialize selected tabs state with default value for each branch
    useEffect(() => {
        const initialTabsState = branches.reduce((acc, branch) => {
            acc[branch.id] = 0 // Default to the 'Details' tab
            return acc
        }, {} as Record<number, number>)
        setSelectedTabs(initialTabsState)
    }, [])

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPaginationState({ ...paginationState, page: value })
    }

    const handleChangeLimit = (value: any) => {
        setPaginationState({ ...paginationState, limit: value })
    }

    const handleTabChange = (id: number, value: number) => {
        setSelectedTabs(prev => ({ ...prev, [id]: value }))
    }

    return (
        <div className=''>
            <Card
                sx={{
                    mb: 4,
                    position: 'sticky',
                    top: 70,
                    zIndex: 10,
                    backgroundColor: 'white',
                    height: 'auto',
                    paddingBottom: 2
                }}
            >
                <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
                    <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
                        <CustomTextField
                            label='Search Branch'
                            placeholder='Search by Branch Name or Location...'
                            className='is-full sm:is-[400px]'
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                                        <i className='tabler-search text-xxl' />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>

                    <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
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
                            <Tooltip title='List View'>
                                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                                    <ViewListIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </div>
            </Card>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}>
                {branches?.map((branch) => (
                    <Box
                        onClick={() => router.push(`/branch-management/view/${branch.id}`)}
                        key={branch.id}
                        className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 ${viewMode !== 'grid' && 'p-6'
                            }`}
                        sx={{
                            cursor: 'pointer',
                            minHeight: viewMode !== 'grid' ? '150px' : 'auto'
                        }}
                    >
                        {viewMode === 'grid' ? (
                            <>
                                <Box className='pt-4 pl-4 pb-3 flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <Typography variant='h5' mt={2} fontWeight='bold' gutterBottom>
                                            {branch.name}
                                        </Typography>
                                    </div>
                                    <div className='flex space-x-2 mr-10'>
                                        <Stack sx={{ marginTop: 2 }}>
                                            <Chip
                                                label={branch.status}
                                                color={
                                                    branch.status === 'Active' ? 'success' : branch.status === 'Inactive' ? 'default' : 'warning'
                                                }
                                                size='small'
                                                sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: '0.85rem',
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                        </Stack>
                                    </div>
                                </Box>
                                <Box className='p-4 border-t'>
                                    <Tabs
                                        value={selectedTabs[branch.id] || 0}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e, newValue) => handleTabChange(branch.id, newValue)}
                                        aria-label='branch details'
                                    >
                                        <Tab label='Details' />
                                        <Tab label='Activity' />
                                        <Tab label='Contact' />
                                    </Tabs>
                                    <Box className='mt-4'>
                                        {selectedTabs[branch.id] === 0 && (
                                            <Box className='space-y-2 text-sm text-gray-700'>
                                                <p><strong>Location:</strong> {branch.location}</p>
                                                <p><strong>Total Employees:</strong> {branch.totalEmployees}</p>
                                                <p><strong>Branch Turnover:</strong> {branch.turnover}</p>
                                                <p><strong>Bucket Level:</strong> {branch.bucketLevel}</p>
                                            </Box>
                                        )}
                                        {selectedTabs[branch.id] === 1 && (
                                            <Box className='space-y-2 text-sm text-gray-700'>
                                                <p><strong>Recent Activity:</strong> {branch.recentActivity}</p>
                                            </Box>
                                        )}
                                        {selectedTabs[branch.id] === 2 && (
                                            <Box className='space-y-2 text-sm text-gray-700'>
                                                <p><strong>Contact:</strong> {branch.contact}</p>
                                                <p><strong>Operating Hours:</strong> {branch.hours}</p>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant='h5' fontWeight='bold'>
                                        {branch.name}
                                    </Typography>
                                    <Typography>
                                        <strong>Location:</strong> {branch.location}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography>
                                        <strong>Total Employees:</strong> {branch.totalEmployees}
                                    </Typography>
                                    <Typography>
                                        <strong>Branch Turnover:</strong> {branch.turnover}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography>
                                        <strong>Bucket Level:</strong> {branch.bucketLevel}
                                    </Typography>
                                    <Typography>
                                        <strong>Contact:</strong> {branch.contact}
                                    </Typography>
                                    <Typography>
                                        <strong>Operating Hours:</strong> {branch.hours}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                ))}
            </div>

            <div className='flex items-center justify-end mt-6'>
                <FormControl size='small' sx={{ minWidth: 70 }}>
                    <InputLabel>Count</InputLabel>
                    <Select
                        value={paginationState?.limit}
                        onChange={(e) => handleChangeLimit(e.target.value)}
                        label='Limit per page'
                    >
                        {[10, 25, 50, 100].map((option) => (
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
    );
};

export default BranchListing;
