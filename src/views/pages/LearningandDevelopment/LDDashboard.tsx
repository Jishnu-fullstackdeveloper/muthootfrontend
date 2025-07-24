'use client'
import React, { useState, useEffect, useRef } from 'react'

import { CalendarToday, Clear, DownloadOutlined } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
  LinearProgress,
  styled,
  Stack
} from '@mui/material'

import { linearProgressClasses } from '@mui/material/LinearProgress'
import { Gauge } from '@mui/x-charts/Gauge'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Chart from '@/libs/ApexCharts'

// Define interfaces for ApexCharts options and series
interface ApexChartSeries {
  name: string
  data: number[]
}

interface ApexChartOptions {
  chart: {
    id: string
    type: 'line'
    height: number
    toolbar?: {
      show: boolean
    }
  }
  xaxis: {
    categories: string[]
    title?: {
      text: string
      style?: {
        fontWeight: string
      }
    }
  }
  yaxis: {
    title?: {
      text: string
      style?: {
        fontWeight: string
      }
    }
    min?: number
  }
  stroke?: {
    curve: 'smooth' | 'straight' | 'stepline'
    width: number
  }
  colors?: string[]
  dataLabels?: {
    enabled: boolean
  }
  tooltip?: {
    theme: string
  }
  grid?: {
    borderColor: string
  }
}

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

interface StatisticsCardProps {
  title: string
  total: number
  addedInMonth: number
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, total, addedInMonth }) => {
  return (
    <Card className='flex flex-col gap-1 p-4'>
      {/* <Box className='flex gap-2 items-center'><GroupOutlined sx={{ fill: '#0095DA' }} /></Box> */}
      <Box className='flex flex-col gap-1 items-baseline p-2'>
        <Typography className='font-bold'>{title}</Typography>
        <Typography className='text-2xl font-bold text-[#000]'>
          <AnimatedNumber number={total} />
        </Typography>
        <Typography className='font-medium'>Total {title}</Typography>
      </Box>

      <Box className='flex flex-col gap-1 items-baseline bg-[#E6F0FFFF] p-2 rounded-md'>
        <Typography className='text-xl font-bold text-[#000]'>
          <AnimatedNumber number={addedInMonth} />
        </Typography>
        <Typography className='text-[8px] font-medium'>Added in July 2025</Typography>
      </Box>
    </Card>
  )
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8'
    })
  }
}))

// Define ViewType for type safety
type ViewType = 'Branch' | 'Area' | 'Cluster' | 'Region' | 'Zone' | 'Territory' | 'Corporate'

// Reusable component for Progress on Mandatory Courses
interface CourseProgressCardProps {
  title: string
  count: number
  index: number
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ title, count, index }) => {
  return (
    <Box
      className='flex w-full flex-col gap-1 items-baseline p-2 rounded-md'
      sx={{ backgroundColor: index === 0 || index === 3 ? '#F0F0F0FF' : '#E6F0FFFF' }}
    >
      <Typography className='text-xl font-bold text-[#000]'>
        <AnimatedNumber number={count} />
      </Typography>
      <Typography className='text-[8px] font-medium'>{title}</Typography>
    </Box>
  )
}

const COURSE_ANALYSIS = [
  {
    label: 'Total Registered',
    count: 11512,
    color: '#1E90FF'
  },
  {
    label: 'Not Started',
    count: 6387,
    color: '#F5A623'
  },
  {
    label: 'In Progress',
    count: 410,
    color: '#26A69A'
  },
  {
    label: 'Completed',
    count: 4715,
    color: '#34495E'
  }
]

const LDDashboard = () => {
  // Explicitly type viewTypes as ViewType[]
  const viewTypes: ViewType[] = ['Branch', 'Area', 'Cluster', 'Region', 'Zone', 'Territory', 'Corporate']
  const [selectedViewType, setSelectedViewType] = useState<ViewType>('Branch')

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default: one month ago
    new Date() // Default: today
  ])

  const [errorMessage, setErrorMessage] = useState<string>('')

  // Data array for Target and Actual Learning Hours
  const learningHoursData = [
    { type: 'Target Learning Hours', value: 20 },
    { type: 'Actual Learning Hours', value: 17 }
  ]

  // Calculate fill percentage
  const targetHours = learningHoursData.find(item => item.type === 'Target Learning Hours')?.value || 0
  const actualHours = learningHoursData.find(item => item.type === 'Actual Learning Hours')?.value || 0
  const fillPercentage = targetHours > 0 ? (actualHours / targetHours) * 100 : 0

  // Data array for Progress on Mandatory Courses
  const mandatoryCoursesData = [
    { title: 'Courses Assigned', count: 5023683 },
    { title: 'In Progress', count: 173147 },
    { title: 'Course Completed', count: 2023097 },
    { title: 'Not Started', count: 2827439 }
  ]

  // Handle date range change with future date validation
  const handleDateChange = (date: [Date | null, Date | null] | null) => {
    if (!date) return

    const [start, end] = date

    console.log(start)
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    if (end && end > today) {
      setErrorMessage('Future dates are not allowed.')

      return
    }

    setDateRange(date)
    setErrorMessage('') // Clear error message if valid
    console.log('Selected date range:', date)
  }

  const [chartData] = useState<{
    options: ApexChartOptions
    series: ApexChartSeries[]
  }>({
    options: {
      chart: {
        id: 'content-consumption',
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        title: {
          text: 'Month (2025)',
          style: {
            fontWeight: 'normal'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Active Users / Completions',
          style: {
            fontWeight: 'normal'
          }
        },
        min: 0
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: ['#0095DA', '#FF5733'],
      dataLabels: {
        enabled: false
      },
      tooltip: {
        theme: 'light'
      },
      grid: {
        borderColor: '#E6F0FFFF'
      }
    },
    series: [
      {
        name: 'Active Users',
        data: [44, 55, 41, 17, 15, 30, 50, 60, 45, 55, 40, 65]
      },
      {
        name: 'Course Completions',
        data: [120, 150, 130, 90, 80, 110, 140, 160, 125, 145, 100, 170]
      }
    ]
  })

  const statisticsData = [
    { title: 'Trainings', total: 7193, addedInMonth: 251 },
    { title: 'Assessments', total: 918, addedInMonth: 8 },
    { title: 'Surveys', total: 539, addedInMonth: 2 },
    { title: 'Learning Paths', total: 2, addedInMonth: 0 },
    { title: 'Wiki Articles', total: 14, addedInMonth: 0 }
  ]

  // Calculate percentages for progress bar and display based on Total Registered count
  const totalRegisteredCount = COURSE_ANALYSIS.find(item => item.label === 'Total Registered')?.count || 1

  const calculatedPercentages = COURSE_ANALYSIS.map(item => ({
    ...item,
    calculatedPercentage: totalRegisteredCount > 0 ? (item.count / totalRegisteredCount) * 100 : 0
  }))

  // State for date range picker
  // const [startDate, setStartDate] = useState<string>('')
  // const [endDate, setEndDate] = useState<string>('')

  // State for branch type filter
  // const viewTypes = ['All', 'Main Branch', 'Regional', 'Satellite']
  // const [selectedLocationType, setSelectedLocationType] = useState<string>('All')

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
            Dashboard
          </Typography>
          <Button className='flex px-2 gap-1 border rounded-md' sx={{ border: '1px solid #8C8D8BFF' }}>
            <DownloadOutlined sx={{ fill: '#8C8D8BFF' }} />
            <Typography>Overview Report</Typography>
          </Button>
        </Box>
      </Card>
      <Box className='flex flex-col gap-4'>
        <Box className='grid grid-cols-5 w-full gap-4'>
          {statisticsData.map((data, index) => (
            <StatisticsCard key={index} title={data.title} total={data.total} addedInMonth={data.addedInMonth} />
          ))}
        </Box>

        <Box className='flex flex-col gap-2'>
          <Card className='p-4 space-y-4'>
            <Typography
              component='h1'
              variant='h4'
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                paddingX: 4,
                letterSpacing: 1,
                whiteSpace: 'nowrap'
              }}
            >
              Content Consumption Summary
            </Typography>
            <Box className='flex w-full gap-3 items-center'>
              <Box className='w-[70%]'>
                <Chart options={chartData.options} series={chartData.series} type='line' width='100%' />
              </Box>
              <Box className='flex flex-col gap-4 w-[30%]'>
                <Box className='flex flex-col gap-2 p-4 border rounded-md'>
                  <Typography className='text-lg'>Active Learners</Typography>
                  <Box className='flex gap-2 w-full'>
                    <Box className='flex w-full flex-col gap-1 items-baseline bg-[#E6F0FFFF] p-2 rounded-md'>
                      <Typography className='text-xl font-bold text-[#000]'>
                        <AnimatedNumber number={25169} />
                      </Typography>
                      <Typography className='text-[8px] font-medium'>This Month</Typography>
                    </Box>
                    <Box className='flex w-full flex-col gap-1 items-baseline bg-[#F0F0F0FF] p-2 rounded-md'>
                      <Typography className='text-xl font-bold text-[#000]'>
                        <AnimatedNumber number={25734} />
                      </Typography>
                      <Typography className='text-[8px] font-medium'>Last Month</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className='flex flex-col gap-2 p-4 border rounded-md'>
                  <Typography className='text-lg'>Course Completions</Typography>
                  <Box className='flex gap-2 w-full'>
                    <Box className='flex w-full flex-col gap-1 items-baseline bg-[#E6F0FFFF] p-2 rounded-md'>
                      <Typography className='text-xl font-bold text-[#000]'>
                        <AnimatedNumber number={97671} />
                      </Typography>
                      <Typography className='text-[8px] font-medium'>This Month</Typography>
                    </Box>
                    <Box className='flex w-full flex-col gap-1 items-baseline bg-[#F0F0F0FF] p-2 rounded-md'>
                      <Typography className='text-xl font-bold text-[#000]'>
                        <AnimatedNumber number={111009} />
                      </Typography>
                      <Typography className='text-[8px] font-medium'>Last Month</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>

        <Box className='grid grid-cols-3 w-full h-56 gap-4'>
          <Card className='flex flex-col space-y-4 p-4'>
            <Typography className='text-[13px] font-bold'>Target vs Actual Learning Hours Per Employee</Typography>
            <Box className='flex flex-col space-y-3'>
              <Box className='flex gap-2 w-full justify-between items-center'>
                <Autocomplete
                  className='w-full'
                  disablePortal
                  options={viewTypes}
                  value={selectedViewType}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setSelectedViewType(newValue as ViewType)
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
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
                />
                <Box className='flex flex-col gap-2 w-full'>
                  {/* Date Range Picker */}
                  <AppReactDatepicker
                    className='w-full'
                    selectsRange={true}
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    onChange={handleDateChange}
                    dateFormat='dd-MMMM-yyyy'
                    placeholderText='Filter by date range'
                    customInput={
                      <CustomTextField
                        name='date_range'
                        id='date_range'
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: 0, // Reduced padding
                            fontSize: '10px' // Reduced font size
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <>
                              <IconButton size='small' className='p-1' onClick={() => setDateRange([null, null])}>
                                <Clear className='w-4 h-4' />
                              </IconButton>
                              <IconButton size='small' className='p-0'>
                                <CalendarToday className='w-4 h-4' />
                              </IconButton>
                            </>
                          )
                        }}
                      />
                    }
                  />

                  {/* Display error message if future date is selected */}
                  {errorMessage && (
                    <Typography color='error' sx={{ mx: 6, mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box className='flex flex-col gap-3 pt-4'>
                {learningHoursData.map((item, index) => (
                  <Box key={index} className='flex w-full justify-between'>
                    <Typography>{item.type}</Typography>
                    <Typography className='font-bold'>{item.value}</Typography>
                  </Box>
                ))}
                <Box className='flex flex-col gap-0.5 mt-3'>
                  <BorderLinearProgress variant='determinate' value={fillPercentage} />
                  <Typography
                    variant='body2'
                    fontSize='8px'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'medium' }}
                  >
                    {fillPercentage.toFixed(0)}% Completed
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
          <Card className='flex flex-col space-y-4 p-4'>
            <Typography className='text-[13px] font-bold'>Average Learning Hours This Month</Typography>
            <Box className='flex flex-col space-y-3'>
              <Box className='flex gap-2 w-full justify-between items-center'>
                <Autocomplete
                  className='w-full'
                  disablePortal
                  options={viewTypes}
                  value={selectedViewType}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setSelectedViewType(newValue as ViewType)
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
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
                />
                <Box className='flex flex-col gap-2 w-full'>
                  {/* Date Range Picker */}
                  <AppReactDatepicker
                    className='w-full'
                    selectsRange={true}
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    onChange={handleDateChange}
                    dateFormat='dd-MMMM-yyyy'
                    placeholderText='Filter by date range'
                    customInput={
                      <CustomTextField
                        name='date_range'
                        id='date_range'
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: 0, // Reduced padding
                            fontSize: '10px' // Reduced font size
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <>
                              <IconButton size='small' className='p-1' onClick={() => setDateRange([null, null])}>
                                <Clear className='w-4 h-4' />
                              </IconButton>
                              <IconButton size='small' className='p-0'>
                                <CalendarToday className='w-4 h-4' />
                              </IconButton>
                            </>
                          )
                        }}
                      />
                    }
                  />

                  {/* Display error message if future date is selected */}
                  {errorMessage && (
                    <Typography color='error' sx={{ mx: 6, mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box className='flex flex-col items-center justify-center mt-2 w-full'>
                <Gauge width={100} height={100} value={50} valueMin={10} valueMax={60} />
                <Typography>Hours</Typography>
              </Box>
            </Box>
          </Card>
          <Card className='flex flex-col space-y-4 p-4'>
            <Typography className='text-[13px] font-bold'>Progress on Mandatory Courses</Typography>
            <Box className='grid grid-cols-2 gap-2 w-full'>
              {mandatoryCoursesData.map((data, index) => (
                <CourseProgressCard key={index} title={data.title} count={data.count} index={index} />
              ))}
            </Box>
          </Card>
        </Box>

        <Card className='flex flex-col gap-4 p-4'>
          <Box className='flex w-full justify-between items-center'>
            <Typography className='text-lg font-bold'>Course Analysis</Typography>
            <Autocomplete
              className='w-1/5'
              disablePortal
              options={viewTypes}
              value={selectedViewType}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedViewType(newValue as ViewType)
                }
              }}
              renderInput={params => (
                <TextField
                  {...params}
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
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              height: 20,
              borderRadius: 0.5,
              overflow: 'hidden',
              mb: 2,
              mt: 1
            }}
          >
            {calculatedPercentages.map(type => (
              <Box
                key={type.label}
                sx={{
                  flex: type.calculatedPercentage,
                  bgcolor: type.color
                }}
              />
            ))}
          </Box>
          <Box
            sx={{
              bgcolor: '#fff',
              p: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              border: '1px solid #E0E0E0',
              borderRadius: 1,
              overflow: 'hidden',
              mb: 2,
              mt: 5
            }}
          >
            {calculatedPercentages.map((type, idx) => (
              <Box
                key={type.label}
                sx={{
                  p: 2,
                  borderRight: idx % 2 === 0 ? '1px solid #E0E0E0' : 'none',
                  borderBottom: idx < 2 ? '1px solid #E0E0E0' : 'none'
                }}
              >
                <Stack direction='row' spacing={1} alignItems='center' mb={0.5}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: type.color
                    }}
                  />
                  <Typography variant='caption' color='text.secondary'>
                    {type.label} ({type.calculatedPercentage.toFixed(1)}%)
                  </Typography>
                </Stack>
                <Typography variant='subtitle1' fontWeight={700} color='black'>
                  {type.count}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default LDDashboard
