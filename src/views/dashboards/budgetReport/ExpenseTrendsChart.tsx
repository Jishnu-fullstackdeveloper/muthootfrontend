'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Data for the chart
const series = [{ data: [5000, 4500, 6000, 5200, 4800, 5300, 5700] }] // Example monthly expense data

const ExpenseTrendsChart = () => {
  // Hooks
  const theme = useTheme()

  // Colors and theme variables
  const primaryColor = theme.palette.primary.main

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: val => `$${val.toFixed(2)}`
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        top: 10,
        bottom: 15
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: primaryColor
            },
            {
              opacity: 0,
              offset: 100,
              color: theme.palette.background.paper
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: primaryColor
      }
    },
    xaxis: {
      //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Months of the year
      labels: {
        style: { fontSize: '12px' }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: false,
      labels: {
        formatter: value => `$${value.toFixed(0)}` // Format y-axis values
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Monthly Expense Trends' subheader='Year to Date' className='pbe-0' />
      <AppReactApexCharts type='area' height={84} width='100%' options={options} series={series} />
      <CardContent className='flex flex-col pbs-0'>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='text.primary'>
            $5.3k
          </Typography>
          <Typography variant='body2' color='success.main'>
            +3.5%
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExpenseTrendsChart
