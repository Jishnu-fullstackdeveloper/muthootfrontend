'use client'
import React, { useState, useEffect, useRef } from 'react'

import Image from 'next/image'

import { CalendarToday, Clear, DownloadOutlined, Group } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
  Stack,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'

// import { linearProgressClasses } from '@mui/material/LinearProgress'

import { Gauge } from '@mui/x-charts/Gauge'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import IntersectImage from '@/assets/images/dashboard/Intersect.png'
import IntersectGreenTopLeft from '@/assets/images/dashboard/IntersectGreenTopLeft.png'

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

// const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 10,
//   borderRadius: 5,
//   [`&.${linearProgressClasses.colorPrimary}`]: {
//     backgroundColor: theme.palette.grey[200],
//     ...theme.applyStyles('dark', {
//       backgroundColor: theme.palette.grey[800]
//     })
//   },
//   [`& .${linearProgressClasses.bar}`]: {
//     borderRadius: 5,
//     backgroundColor: '#1a90ff',
//     ...theme.applyStyles('dark', {
//       backgroundColor: '#308fe8'
//     })
//   }
// }))

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
  // const learningHoursData = [
  //   { type: 'Target Learning Hours', value: 20 },
  //   { type: 'Actual Learning Hours', value: 17 }
  // ]

  // Calculate fill percentage
  // const targetHours = learningHoursData.find(item => item.type === 'Target Learning Hours')?.value || 0
  // const actualHours = learningHoursData.find(item => item.type === 'Actual Learning Hours')?.value || 0

  // const fillPercentage = targetHours > 0 ? (actualHours / targetHours) * 100 : 0

  // Data array for Progress on Mandatory Courses
  // const mandatoryCoursesData = [
  //   { title: 'Courses Assigned', count: 5023683 },
  //   { title: 'In Progress', count: 173147 },
  //   { title: 'Course Completed', count: 2023097 },
  //   { title: 'Not Started', count: 2827439 }
  // ]

  // Data array for Training Undergoing Candidates
  const trainingTypesData = [
    { name: 'Mentor Branch Training', value: 120, color: '#0088FE' },
    { name: 'Gurukul Training', value: 80, color: '#00C49F' },
    { name: 'Online Training', value: 200, color: '#FFBB28' },
    { name: 'Classroom Training', value: 150, color: '#FF8042' }
  ]

  // Calculate total candidates for pie chart center
  const totalCandidates = trainingTypesData.reduce((sum, item) => sum + item.value, 0)

  // Data array for Leaderboard
  const leaderboardData = [
    { name: 'John Doe', trainingType: 'Online Training', score: 95 },
    { name: 'Jane Smith', trainingType: 'Classroom Training', score: 90 },
    { name: 'Alex Johnson', trainingType: 'Mentor Branch Training', score: 85 },
    { name: 'Emily Brown', trainingType: 'Gurukul Training', score: 80 },
    { name: 'Michael Lee', trainingType: 'Online Training', score: 75 }
  ]

  // Data array for Assessment Status
  const assessmentData = [
    { title: 'Assessments Assigned', count: 1500 },
    { title: 'In Progress', count: 300 },
    { title: 'Completed', count: 900 },
    { title: 'Not Started', count: 300 }
  ]

  // Data array for Faculty Insights
  const facultyData = [
    { name: 'Dr. Alice Carter', sessions: 25, feedback: 4.8 },
    { name: 'Prof. Bob Wilson', sessions: 20, feedback: 4.5 },
    { name: 'Ms. Clara Davis', sessions: 15, feedback: 4.2 }
  ]

  // Data array for Feedback
  const feedbackData = [
    { title: 'Total Feedback Received', count: 1200 },
    { title: 'Average Feedback Score', count: 4.3 },
    { title: 'Positive Feedback Rate', count: 85 },
    { title: 'Negative Feedback Rate', count: 15 }
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
    { title: 'Newly Onboarded Count', total: 150, addedInMonth: 20 },
    { title: 'Batches Created Count', total: 45, addedInMonth: 5 },
    { title: 'Total Trainers Assigned', total: 30, addedInMonth: 3 }
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
        <Box className='grid grid-cols-3 w-full gap-4'>
          <Card sx={{ bgcolor: '#ED960B', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <CardContent
              className='flex justify-between gap-2'
              sx={{ color: 'white', position: 'relative', zIndex: 1 }}
            >
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
                <Box className='flex flex-col gap-2'>
                  <Typography variant='body2' color='white'>
                    {statisticsData[0].title}
                  </Typography>
                  <Typography variant='h3' color='white' fontWeight='bold'>
                    <AnimatedNumber number={statisticsData[0].total} />
                  </Typography>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='white' className='text-[12px]'>
                      <AnimatedNumber number={statisticsData[0].addedInMonth} />
                    </Typography>
                    <Typography variant='body2' color='white' className='text-[8px] font-medium'>
                      Added in July 2025
                    </Typography>
                  </Box>
                </Box>
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
            <CardContent
              className='flex justify-between gap-2'
              sx={{ color: 'white', position: 'relative', zIndex: 1 }}
            >
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
                <Box className='flex flex-col gap-2'>
                  <Typography variant='body2' color='white'>
                    {statisticsData[1].title}
                  </Typography>
                  <Typography variant='h3' color='white' fontWeight='bold'>
                    <AnimatedNumber number={statisticsData[1].total} />
                  </Typography>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='white' className='text-[12px]'>
                      <AnimatedNumber number={statisticsData[1].addedInMonth} />
                    </Typography>
                    <Typography variant='body2' color='white' className='text-[8px] font-medium'>
                      Added in July 2025
                    </Typography>
                  </Box>
                </Box>
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
            <CardContent
              className='flex justify-between gap-2'
              sx={{ color: 'white', position: 'relative', zIndex: 1 }}
            >
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
                <Box className='flex flex-col gap-2'>
                  <Typography variant='body2' color='white'>
                    {statisticsData[2].title}
                  </Typography>
                  <Typography variant='h3' color='white' fontWeight='bold'>
                    <AnimatedNumber number={statisticsData[2].total} />
                  </Typography>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='white' className='text-[12px]'>
                      <AnimatedNumber number={statisticsData[2].addedInMonth} />
                    </Typography>
                    <Typography variant='body2' color='white' className='text-[8px] font-medium'>
                      Added in July 2025
                    </Typography>
                  </Box>
                </Box>
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
                      +76%
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

        <Box className='grid grid-cols-3 gap-4 w-full'>
          <Card
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
              Training Undergoing Candidates
            </Typography>

            <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={trainingTypesData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={1}
                    cornerRadius={3}
                    dataKey='value'
                  >
                    {trainingTypesData.map((r, i) => (
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
                  {totalCandidates}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Total Candidates
                </Typography>
              </Box>
            </Box>

            {/* <Box sx={{ my: 6, display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Image
                src={LineImage} // Note: LineImage is undefined; provide the correct path or replace with a divider
                alt='line divider'
                width={1000}
                height={2}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </Box> */}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2
              }}
            >
              {trainingTypesData.map((r, i) => (
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
          </Card>
          <Card className='p-4 space-y-4 col-span-2'>
            <Typography variant='h6' fontWeight={700}>
              Content Consumption Summary
            </Typography>
            <Box className='flex w-full gap-3 items-center'>
              <Box className='w-[70%]'>
                <Chart options={chartData.options} series={chartData.series} type='line' width='100%' />
              </Box>
              <Box className='flex flex-col gap-4 w-[30%]'>
                <Box className='flex flex-col gap-2 p-2 border rounded-md'>
                  <Typography className='text-md'>Active Learners</Typography>
                  <Box className='flex gap-2 w-full'>
                    <Box className='flex w-full flex-col gap-1 items-baseline bg-[#E6F0FFFF] p-2 rounded-md'>
                      <Typography className='text-lg font-bold text-[#000]'>
                        <AnimatedNumber number={25169} />
                      </Typography>
                      <Typography className='text-[8px] font-medium'>This Month</Typography>
                    </Box>
                    <Box className='flex w-full flex-col gap-1 items-baseline bg-[#F0F0F0FF] p-2 rounded-md'>
                      <Typography className='text-lg font-bold text-[#000]'>
                        <AnimatedNumber number={25734} />
                      </Typography>
                      <Typography className='text-[8px] font-medium'>Last Month</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className='flex flex-col gap-2 p-2 border rounded-md'>
                  <Typography className='text-md'>Course Completions</Typography>
                  <Box className='flex gap-2 w-full'>
                    <Box className='flex w-full flex-col gap-1 items-baseline bg-[#E6F0FFFF] p-2 rounded-md'>
                      <Typography className='text-lg font-bold text-[#000]'>
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

        <Box className='flex gap-4 w-full'>
          <Card className='flex flex-col gap-4 p-4 w-full'>
            <Box className='flex w-full justify-between items-center'>
              <Typography variant='h6' fontWeight={700}>
                Course Insight
              </Typography>
              <Autocomplete
                className='w-1/3'
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
          <Card className='flex flex-col gap-4 p-4 w-full'>
            <Typography variant='h6' fontWeight={700}>
              Leader Board
            </Typography>
            <Table
              className='w-full'
              aria-label='leaderboard table'
              sx={{
                '& .MuiTableCell-root': {
                  border: 'none'
                }
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: '#E6F0FFFF' }}>
                  <TableCell className='rounded-l-md'>
                    <Typography variant='body2' fontWeight={700} sx={{ fontSize: '13px' }}>
                      Rank
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' fontWeight={700} sx={{ fontSize: '13px' }}>
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' fontWeight={700} sx={{ fontSize: '13px' }}>
                      Training Type
                    </Typography>
                  </TableCell>
                  <TableCell className='rounded-r-md' align='right'>
                    <Typography variant='body2' fontWeight={700} sx={{ fontSize: '13px' }}>
                      Points
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.map((row, index) => (
                  <TableRow key={row.name}>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontSize: '12px' }}>
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontSize: '12px' }}>
                        {row.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontSize: '12px' }}>
                        {row.trainingType}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography variant='body2' fontWeight='bold' sx={{ fontSize: '12px' }}>
                        <AnimatedNumber number={row.score} />
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Box>

        <Box className='grid grid-cols-3 w-full h-56 gap-4'>
          <Card className='flex flex-col space-y-4 p-4'>
            <Typography className='text-[13px] font-bold'>Assessment Status</Typography>
            <Box className='flex flex-col space-y-3'>
              <Box className='grid grid-cols-2 gap-2 w-full'>
                {assessmentData.map((data, index) => (
                  <CourseProgressCard key={index} title={data.title} count={data.count} index={index} />
                ))}
              </Box>
            </Box>
          </Card>
          <Card className='flex flex-col space-y-4 p-4'>
            <Typography className='text-[13px] font-bold'>Faculty Insights</Typography>
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
                    placeholderText='Filter by commitment date range'
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
                <Gauge width={100} height={100} value={4.5} valueMin={0} valueMax={5} />
                <Typography>Average Feedback Score</Typography>
              </Box>
              <Table aria-label='faculty insights table'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F0F0F0FF' }}>
                    <TableCell>
                      <Typography variant='body2' fontWeight={700} sx={{ fontSize: '13px' }}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight={700} sx={{ fontSize: '13px' }}>
                        Sessions
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography variant='body2' fontWeight={700} sx={{ fontSize: '13px' }}>
                        Feedback
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facultyData.map(row => (
                    <TableRow key={row.name}>
                      <TableCell>
                        <Typography variant='body2' sx={{ fontSize: '12px' }}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ fontSize: '12px' }}>
                          {row.sessions}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2' fontWeight='bold' sx={{ fontSize: '12px' }}>
                          <AnimatedNumber number={row.feedback} />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
          <Card className='flex flex-col space-y-4 p-4'>
            <Typography className='text-[13px] font-bold'>Feedback</Typography>
            <Box className='flex flex-col space-y-3'>
              <Box className='grid grid-cols-2 gap-2 w-full'>
                {feedbackData.map((data, index) => (
                  <CourseProgressCard key={index} title={data.title} count={data.count} index={index} />
                ))}
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

export default LDDashboard
