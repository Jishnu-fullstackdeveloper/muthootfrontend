'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import { useColorScheme, useTheme, alpha } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Util Imports
import { rgbaToHex } from '@/utils/rgbaToHex'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Sample data for a single selected branch's openings and shortlisted candidates
const series = [{ data: [30, 20] }] // Example data: [Openings, Shortlisted]

const BranchOpeningsChart = () => {
  // Hooks
  const theme = useTheme()
  const { mode } = useColorScheme()

  // Vars
  const primaryColorWithOpacity = rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 0.16)`)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        distributed: true,
        columnWidth: '55%'
      }
    },
    legend: { show: false },
    tooltip: {
      enabled: true,
      theme: 'dark',
      shared: true,
      intersect: false

      // y: {
      //   formatter: value => `${value}` // Display the value directly
      // }
    },
    dataLabels: { enabled: false },
    colors: [theme.palette.primary.main, primaryColorWithOpacity],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -15,
        left: 0,
        right: 0,
        bottom: -5
      }
    },
    xaxis: {
      categories: ['O', 'S'], // Updated categories for single branch
      axisTicks: { show: true },
      axisBorder: { show: true },
      tickPlacement: 'on',
      labels: {
        style: {
          colors: alpha(theme.palette.text.secondary, 0.4),
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: { show: true, title: { text: 'Count' } }, // Show y-axis with title
    responsive: [
      {
        breakpoint: 1240,
        options: {
          chart: {
            width: 150
          }
        }
      },
      {
        breakpoint: 1200,
        options: {
          plotOptions: { bar: { columnWidth: '65%' } },
          options: {
            chart: {
              width: 200
            }
          }
        }
      },
      {
        breakpoint: 410,
        options: {
          chart: {
            width: 150
          },
          plotOptions: {
            bar: { columnWidth: '60%' }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent className='flex justify-between gap-2'>
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col gap-y-2'>
            <Typography variant='h5'>Branch Openings & Shortlisted</Typography>
            {/* <Typography>Performance for Selected Branch</Typography> */}
          </div>
          <div className='flex flex-col gap-y-2 items-start'>
            <Typography variant='h3'>Total: 50</Typography> {/* Example total count for the selected branch */}
            <Chip variant='tonal' size='small' color='success' label='+12.8%' />
          </div>
        </div>
        <AppReactApexCharts type='bar' width={170} height={195} series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default BranchOpeningsChart
