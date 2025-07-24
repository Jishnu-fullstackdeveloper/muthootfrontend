'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Add, ClearOutlined, Group, SearchOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import IntersectImage from '@/assets/images/dashboard/Intersect.png'
import IntersectGreenTopLeft from '@/assets/images/dashboard/IntersectGreenTopLeft.png'
import DynamicTable from '@/components/Table/dynamicTable'
import { ROUTES } from '@/utils/routes'

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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchQuery, setSearchQuery] = useState('')

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const columnHelper = createColumnHelper<any>()

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('employeeId', {
        header: 'EMPLOYEE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeId}</Typography>
      }),
      columnHelper.accessor('fullName', {
        header: 'FULL NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fullName}</Typography>
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designation}</Typography>
      }),
      columnHelper.accessor('dateOfJoining', {
        header: 'DATE OF JOINING',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.dateOfJoining ? row.original.dateOfJoining.split('T')[0] : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('employmentStatus', {
        header: 'EMPLOYMENT STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employmentStatus}</Typography>
      })

      // columnHelper.display({
      //   id: 'action',
      //   header: 'ACTIONS',
      //   meta: { className: 'sticky right-0' },
      //   cell: ({ row }) => (
      //     <Box className='flex items-center'>
      //       <IconButton
      //         onClick={() => router.push(ROUTES.USER_MANAGEMENT.EMPLOYEE_VIEW(row.original.id))}
      //         sx={{ fontSize: 18 }}
      //       >
      //         <VisibilityOutlined />
      //       </IconButton>
      //     </Box>
      //   ),
      //   enableSorting: false
      // })
    ],
    [columnHelper] // router
  )

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
                <AnimatedNumber number={21} />
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
                <AnimatedNumber number={5} />
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
                <AnimatedNumber number={3} />
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
                <AnimatedNumber number={12} />
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
          data={[]}
          totalCount={0}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Trainer Table'
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      </Box>
    </Box>
  )
}

export default TrainerDashboard
