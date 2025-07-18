'use client'

// Next Imports
// import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

// import { useTheme } from '@mui/material/styles'

// Third-party Imports
// import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
// const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Data for the chart
// const series = [{ data: [50, 75, 100, 125, 150, 130, 90] }] // Example employee count data for branches

interface BranchEmployeeChartProps {
  totalEmployeeCount: number
}

const BranchEmployeeChart = ({ totalEmployeeCount }: BranchEmployeeChartProps) => {
  // Hooks
  // const theme = useTheme()

  // Colors and theme variables
  // const actionSelectedColor = theme.palette.action.selected

  // const options: ApexOptions = {
  //   chart: {
  //     type: 'bar',
  //     stacked: false,
  //     parentHeightOffset: 0,
  //     toolbar: { show: false },
  //     sparkline: { enabled: true }
  //   },
  //   tooltip: { enabled: true, theme: 'dark' },
  //   legend: { show: false },
  //   dataLabels: { enabled: false },
  //   colors: [theme.palette.primary.main],
  //   states: {
  //     hover: {
  //       filter: { type: 'none' }
  //     },
  //     active: {
  //       filter: { type: 'none' }
  //     }
  //   },
  //   plotOptions: {
  //     bar: {
  //       borderRadius: 3,
  //       horizontal: false,
  //       columnWidth: '22%',
  //       colors: {
  //         backgroundBarRadius: 5,
  //         backgroundBarColors: [
  //           actionSelectedColor,
  //           actionSelectedColor,
  //           actionSelectedColor,
  //           actionSelectedColor,
  //           actionSelectedColor
  //         ]
  //       }
  //     }
  //   },
  //   grid: {
  //     show: false,
  //     padding: {
  //       left: -3,
  //       right: 5,
  //       top: 15,
  //       bottom: 40
  //     }
  //   },
  //   xaxis: {
  //     labels: { show: false },

  //     //categories: ['Branch A', 'Branch B', 'Branch C', 'Branch D', 'Branch E', 'Branch F', 'Branch G'],
  //     axisTicks: { show: false },
  //     axisBorder: { show: false }
  //   },
  //   yaxis: {
  //     show: true,
  //     labels: {
  //       formatter: value => `$${value}k` // Display values in thousands
  //     }
  //   },
  //   responsive: [
  //     {
  //       breakpoint: 1350,
  //       options: {
  //         plotOptions: {
  //           bar: { columnWidth: '45%' }
  //         }
  //       }
  //     },
  //     {
  //       breakpoint: theme.breakpoints.values.lg,
  //       options: {
  //         plotOptions: {
  //           bar: { columnWidth: '20%' }
  //         }
  //       }
  //     },
  //     {
  //       breakpoint: 600,
  //       options: {
  //         plotOptions: {
  //           bar: { columnWidth: '15%' }
  //         }
  //       }
  //     }
  //   ]
  // }

  return (
    <Card>
      <CardHeader title='Total Employees' className='pbe-0' />
      <CardContent className='flex flex-col justify-between' style={{ height: '193px' }}>
        {/* <AppReactApexCharts type='bar' height={95} width='100%' options={options} series={series} /> */}
        <div className='h-full flex items-center justify-center text-center flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='text.primary'>
            {totalEmployeeCount?.toLocaleString()} Employees
          </Typography>
          {/* <Typography variant='body2' color='success.main'>
            +5.0%
          </Typography> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default BranchEmployeeChart
