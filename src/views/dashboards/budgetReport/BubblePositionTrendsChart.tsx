'use client'

// Next Imports
// import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import Typography from '@mui/material/Typography'

// Props interface
interface BubblePositionTrendsChartProps {
  bubblePositions: { designationName: string; count: number }[]
}

const BubblePositionTrendsChart = ({ bubblePositions }: BubblePositionTrendsChartProps) => {
  // Hooks
  const theme = useTheme()

  // Transform bubblePositions into chart data, handle empty or undefined case
  const chartData =
    bubblePositions?.length > 0
      ? bubblePositions.map(position => ({
          position: position.designationName,
          excessCount: position.count
        }))
      : []

  return (
    <Card>
      <CardHeader title='Bubble Positions Overview' className='pbe-0' />
      <CardContent style={{ height: '193px', paddingTop: '20px' }}>
        {bubblePositions?.length > 0 ? (
          <ResponsiveContainer width='100%' height={135}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='position' name='Designation' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='excessCount' fill={theme.palette.primary.main} name='Excess Count' />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography
            variant='body1'
            align='center'
            className='flex justify-center items-center pt-10'
            color='text.secondary'
            sx={{ padding: 2, height: 100 }}
          >
            There are no bubble positions
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default BubblePositionTrendsChart
