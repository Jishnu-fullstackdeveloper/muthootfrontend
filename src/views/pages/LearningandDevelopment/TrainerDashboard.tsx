'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  Add,
  Call,
  ClearOutlined,
  CloseOutlined,
  Group,
  MailOutlined,
  SearchOutlined,
  VisibilityOutlined
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import IntersectImage from '@/assets/images/dashboard/Intersect.png'
import IntersectGreenTopLeft from '@/assets/images/dashboard/IntersectGreenTopLeft.png'
import DynamicTable from '@/components/Table/dynamicTable'
import { ROUTES } from '@/utils/routes'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import type { Trainer } from '@/redux/TrainerManagement/TrainerManagementSlice'
import {
  fetchTrainers,
  fetchTrainerById,
  resetTrainerManagementState
} from '@/redux/TrainerManagement/TrainerManagementSlice'

interface AnimatedNumberProps {
  number: number
  duration?: number // in milliseconds
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ number, duration = 900 }) => {
  const [displayNumber, setDisplayNumber] = useState(0)
  const startTimestamp = useRef<number | null>(null)
  const startValue = useRef(0)
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    const step = (timestamp: number) => {
      if (!startTimestamp.current) startTimestamp.current = timestamp
      const progress = timestamp - startTimestamp.current

      const percentage = Math.min(progress / duration, 1)
      const current = Math.floor(startValue.current + (number - startValue.current) * percentage)

      setDisplayNumber(current)

      if (percentage < 1) {
        requestRef.current = requestAnimationFrame(step)
      }
    }

    cancelAnimationFrame(requestRef.current || 0)
    startValue.current = displayNumber
    startTimestamp.current = null
    requestRef.current = requestAnimationFrame(step)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [number])

  return <span>{displayNumber}</span>
}

const TrainerDashboard = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { trainersData, selectedTrainer, trainingCounts, totalCount, status, error } = useAppSelector(
    state => state.TrainerManagementReducer
  )

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Fetch trainers when pagination changes or component mounts
  useEffect(() => {
    dispatch(fetchTrainers({ page: pagination.pageIndex + 1, limit: pagination.pageSize }))
  }, [dispatch, pagination.pageIndex, pagination.pageSize])

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetTrainerManagementState())
    }
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const columnHelper = createColumnHelper<Trainer>()

  const columns = useMemo<ColumnDef<Trainer, any>[]>(
    () => [
      columnHelper.accessor('empCode', {
        header: 'EMPLOYEE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.empCode}</Typography>
      }),
      columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
        header: 'FULL NAME',
        cell: ({ row }) => (
          <Typography color='text.primary'>{`${row.original.firstName} ${row.original.lastName}`}</Typography>
        )
      }),
      columnHelper.accessor('email', {
        header: 'E-MAIL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.email}</Typography>
      }),
      columnHelper.accessor('count', {
        header: 'SESSIONS COMPLETED',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.count}</Typography>
      }),
      columnHelper.accessor('createdAt', {
        header: 'DATE OF JOINING',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.createdAt ? row.original.createdAt.split('T')[0] : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.status}</Typography>
      }),
      columnHelper.display({
        id: 'action',
        header: 'ACTIONS',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <IconButton
              onClick={() => {
                dispatch(fetchTrainerById(row.original.empCode))
                setDrawerOpen(true)
              }}
              sx={{ fontSize: 18 }}
            >
              <VisibilityOutlined />
            </IconButton>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, dispatch]
  )

  // Prepare data for PieChart from trainingCounts
  const coursesData = useMemo(() => {
    if (!trainingCounts) {
      return [
        { name: 'Completed', value: 0, color: '#0088FE' },
        { name: 'In Progress', value: 0, color: '#00C49F' },
        { name: 'Upcoming', value: 0, color: '#FFBB28' },
        { name: 'Cancelled', value: 0, color: '#FF8042' }
      ]
    }

    return [
      { name: 'Completed', value: trainingCounts.COMPLETED, color: '#0088FE' },
      { name: 'In Progress', value: trainingCounts.INPROGRESS, color: '#00C49F' },
      { name: 'Upcoming', value: trainingCounts.UPCOMING, color: '#FFBB28' },
      { name: 'Cancelled', value: trainingCounts.CANCELLED, color: '#FF8042' }
    ]
  }, [trainingCounts])

  // Calculate total candidates for pie chart center
  const totalCourses = coursesData.reduce((sum, item) => sum + item.value, 0)

  // Filter trainers based on search query
  const filteredTrainers = useMemo(() => {
    if (!searchQuery) return trainersData

    return trainersData.filter(trainer =>
      `${trainer.firstName} ${trainer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [trainersData, searchQuery])

  return (
    <Box className='min-h-screen'>
      <Card
        sx={{
          mb: 4,
          top: 70,
          backgroundColor: 'white'
        }}
      >
        <Box
          sx={{
            padding: 4,
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
              letterSpacing: 1,
              whiteSpace: 'nowrap'
            }}
          >
            Trainer Dashboard
          </Typography>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'end',
              alignItems: 'center',
              gap: 2
            }}
          >
            {/* FILTERS */}
            {/* <Autocomplete
              disablePortal
              options={locationTypes}
              sx={{ width: 150 }}
              value={selectedLocationType}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedLocationType(newValue as typeof selectedLocationType)
                }
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Branch Type'
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '30px'
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      textAlign: 'center'
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0 8px',
                      lineHeight: 'normal'
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0,
                      transform: 'translate(10%, -50%) scale(0.85)'
                    }
                  }}
                />
              )}
            /> */}
            {/* <Autocomplete
              disablePortal
              options={['Department 1', 'Department 2', 'Department 3']}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '30px'
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      textAlign: 'center'
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0 8px',
                      lineHeight: 'normal'
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0,
                      transform: 'translate(10%, -50%) scale(0.85)'
                    }
                  }}
                  {...params}
                  label='Departments'
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={[...new Set(positionMatrixData.map(item => item.designation))]}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '30px'
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      textAlign: 'center'
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0 8px',
                      lineHeight: 'normal'
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0,
                      transform: 'translate(10%, -50%) scale(0.85)'
                    }
                  }}
                  {...params}
                  label='Designation'
                />
              )}
            /> */}
          </Box>
        </Box>
      </Card>
      <Box className='grid grid-cols-4 w-full gap-4'>
        <Card sx={{ bgcolor: '#ED960B', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
          <CardContent className='flex justify-between gap-2' sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
            <Box className='flex flex-col justify-between gap-2'>
              <Box className='flex items-center justify-center p-2 bg-white rounded-md w-10 h-10'>
                <Group
                  sx={{
                    width: '30px',
                    height: '30px',
                    bgcolor: 'white',
                    color: '#ED960B',
                    borderRadius: '8px'
                  }}
                />
              </Box>
              <Typography variant='body2' color='white'>
                Total Trainers
              </Typography>
              <Typography variant='h3' color='white' fontWeight='bold'>
                <AnimatedNumber number={totalCount} />
              </Typography>
            </Box>
            <Box className='flex items-center justify-center'>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant='determinate'
                  value={100}
                  size={60}
                  thickness={4}
                  sx={{ color: 'rgba(255, 255, 255, 0.2)' }}
                />
                <CircularProgress
                  variant='determinate'
                  value={86}
                  size={60}
                  thickness={4}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography className='text-[10px]' variant='caption' component='div' color='white'>
                    +86%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Image
            src={IntersectGreenTopLeft}
            alt='Green top decoration'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
              opacity: 1
            }}
          />
          <Image
            src={IntersectImage}
            alt='decorative shape'
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              zIndex: 0,
              opacity: 0.5
            }}
          />
        </Card>
        <Card sx={{ bgcolor: '#00B798', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
          <CardContent className='flex justify-between gap-2' sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
            <Box className='flex flex-col justify-between gap-2'>
              <Box className='flex items-center justify-center p-2 bg-white rounded-md w-10 h-10'>
                <Group
                  sx={{
                    width: '30px',
                    height: '30px',
                    bgcolor: 'white',
                    color: '#00B798',
                    borderRadius: '8px'
                  }}
                />
              </Box>
              <Typography variant='body2' color='white'>
                Active Trainers
              </Typography>
              <Typography variant='h3' color='white' fontWeight='bold'>
                <AnimatedNumber number={trainersData.filter(trainer => trainer.status === 'ACTIVE').length} />
              </Typography>
            </Box>
            <Box className='flex items-center justify-center'>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant='determinate'
                  value={100}
                  size={60}
                  thickness={4}
                  sx={{ color: 'rgba(255, 255, 255, 0.2)' }}
                />
                <CircularProgress
                  variant='determinate'
                  value={86}
                  size={60}
                  thickness={4}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography className='text-[10px]' variant='caption' component='div' color='white'>
                    +86%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Image
            src={IntersectGreenTopLeft}
            alt='Green top decoration'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
              opacity: 1
            }}
          />
          <Image
            src={IntersectImage}
            alt='decorative shape'
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              zIndex: 0,
              opacity: 0.5
            }}
          />
        </Card>
        <Card sx={{ bgcolor: '#FF6C6C', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
          <CardContent className='flex justify-between gap-2' sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
            <Box className='flex flex-col justify-between gap-2'>
              <Box className='flex items-center justify-center p-2 bg-white rounded-md w-10 h-10'>
                <Group
                  sx={{
                    width: '30px',
                    height: '30px',
                    bgcolor: 'white',
                    color: '#FF6C6C',
                    borderRadius: '8px'
                  }}
                />
              </Box>
              <Typography variant='body2' color='white'>
                Available Trainers
              </Typography>
              <Typography variant='h3' color='white' fontWeight='bold'>
                <AnimatedNumber number={trainersData.filter(trainer => trainer.status === 'Available').length} />
              </Typography>
            </Box>
            <Box className='flex items-center justify-center'>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant='determinate'
                  value={100}
                  size={60}
                  thickness={4}
                  sx={{ color: 'rgba(255, 255, 255, 0.2)' }}
                />
                <CircularProgress
                  variant='determinate'
                  value={86}
                  size={60}
                  thickness={4}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography className='text-[10px]' variant='caption' component='div' color='white'>
                    +86%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Image
            src={IntersectGreenTopLeft}
            alt='Green top decoration'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
              opacity: 1
            }}
          />
          <Image
            src={IntersectImage}
            alt='decorative shape'
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              zIndex: 0,
              opacity: 0.5
            }}
          />
        </Card>
        <Card sx={{ bgcolor: '#0095DA', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
          <CardContent className='flex justify-between gap-2' sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
            <Box className='flex flex-col justify-between gap-2'>
              <Box className='flex items-center justify-center p-2 bg-white rounded-md w-10 h-10'>
                <Group
                  sx={{
                    width: '30px',
                    height: '30px',
                    bgcolor: 'white',
                    color: '#0095DA',
                    borderRadius: '8px'
                  }}
                />
              </Box>
              <Typography variant='body2' color='white'>
                Shortlisted Trainers
              </Typography>
              <Typography variant='h3' color='white' fontWeight='bold'>
                <AnimatedNumber number={trainersData.filter(trainer => trainer.status === 'Shortlisted').length} />
              </Typography>
            </Box>
            <Box className='flex items-center justify-center'>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant='determinate'
                  value={100}
                  size={60}
                  thickness={4}
                  sx={{ color: 'rgba(255, 255, 255, 0.2)' }}
                />
                <CircularProgress
                  variant='determinate'
                  value={86}
                  size={60}
                  thickness={4}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography className='text-[10px]' variant='caption' component='div' color='white'>
                    +86%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Image
            src={IntersectGreenTopLeft}
            alt='Green top decoration'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
              opacity: 1
            }}
          />
          <Image
            src={IntersectImage}
            alt='decorative shape'
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              zIndex: 0,
              opacity: 0.5
            }}
          />
        </Card>
      </Box>

      <Card
        className='mt-4'
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
        <Box className='flex justify-between flex-col items-center md:flex-row md:items-start p-4 gap-4 '>
          <TextField
            label='Search by Employee Name'
            variant='outlined'
            size='small'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            sx={{ width: '400px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {searchQuery && (
                    <IconButton size='small' onClick={() => setSearchQuery('')} edge='end'>
                      <ClearOutlined fontSize='small' />
                    </IconButton>
                  )}
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant='contained'
            color='primary'
            className='flex items-center gap-2 '
            onClick={() => router.push(ROUTES.LEARNING_AND_DEVELOPMENT.TRAINER_MANAGEMENT.ADD_TRAINER)}
          >
            <Add />
            Add Trainer
          </Button>
        </Box>
      </Card>

      <Box className='mt-4'>
        <DynamicTable
          columns={columns}
          data={filteredTrainers}
          totalCount={totalCount}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Trainer Table'
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      </Box>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '90vw', sm: '500px' },
            padding: 2,
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 3, gap: 2 }}>
          <Box className='flex w-full justify-between items-center'>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
              Trainer Details
            </Typography>
            <Button
              className='rounded-full'
              aria-label='Close'
              onClick={() => {
                setDrawerOpen(false)
              }}
            >
              <CloseOutlined />
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {status === 'loading' ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : status === 'failed' ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color='error'>Error: {error || 'Failed to load trainer details'}</Typography>
              </Box>
            ) : !selectedTrainer ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color='text.secondary'>No trainer data available</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Box className='flex gap-2 items-center w-full border-b'>
                  <Avatar />
                  <Box className='flex flex-col gap-1 py-3 w-full'>
                    <Typography variant='h6'>
                      {selectedTrainer.firstName} {selectedTrainer.lastName}
                    </Typography>
                    <Typography>{selectedTrainer.empCode}</Typography>
                  </Box>
                  <Box className='flex justify-end w-full'>
                    <Typography className='flex items-center justify-center px-3 py-2 rounded-md bg-green-500 bg-opacity-40 text-green-600'>
                      {selectedTrainer.status}
                    </Typography>
                  </Box>
                </Box>

                <Box className='flex justify-between items-center w-full border-b py-3 px-1'>
                  <Box className='flex gap-2 items-center'>
                    <MailOutlined />
                    <Typography>{selectedTrainer.email}</Typography>
                  </Box>
                  <Box className='flex gap-2 items-center'>
                    <Call />
                    <Typography>{selectedTrainer.phone}</Typography>
                  </Box>
                </Box>

                <Box className='flex flex-col gap-2 p-3'>
                  <Typography variant='h6' fontWeight={700}>
                    Languages
                  </Typography>
                  <Box className='flex flex-wrap gap-2'>
                    {selectedTrainer.languages && selectedTrainer.languages.length > 0 ? (
                      selectedTrainer.languages.map((language, index) => (
                        <Chip
                          key={index}
                          label={language.name}
                          className='bg-red-500 bg-opacity-30 text-red-400 text-[10px]'
                        />
                      ))
                    ) : (
                      <Typography color='text.secondary'>No languages available</Typography>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant='h6' fontWeight={700}>
                    Training Stats
                  </Typography>

                  <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie
                          data={coursesData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={1}
                          cornerRadius={3}
                          dataKey='value'
                        >
                          {coursesData.map((r, i) => (
                            <Cell key={i} fill={r.color} />
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
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant='h6' fontWeight={700} color='#222529' sx={{ fontSize: '20px' }}>
                        {totalCourses}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Total Courses
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2
                    }}
                  >
                    {coursesData.map((r, i) => (
                      <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: '18px',
                              height: '14px',
                              borderRadius: '3px',
                              bgcolor: r.color
                            }}
                          />
                          <Typography variant='subtitle2' fontWeight={700} color='#000000'>
                            {r.value}
                          </Typography>
                        </Box>
                        <Typography color='#5E6E78' fontWeight={500} sx={{ fontSize: '9.7px', pl: '20px' }}>
                          {r.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant='contained' color='primary'>
              View Employee Profile
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

export default TrainerDashboard
