'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

// Data for the bar chart
const bubblePositionData = [
  { position: 'Position A', requiredCount: 5000, actualCount: 4500 },
  { position: 'Position B', requiredCount: 6000, actualCount: 5200 },
  { position: 'Position C', requiredCount: 4800, actualCount: 5300 },
  { position: 'Position D', requiredCount: 5700, actualCount: 6000 },
  { position: 'Position E', requiredCount: 5500, actualCount: 5800 }
]

const BubblePositionTrendsChart = () => {
  // Hooks
  const theme = useTheme()

  return (
    <Card>
      <CardHeader title='Bubble Positions Overview' subheader='Current Month' className='pbe-0' />
      <CardContent style={{ height: '172px' }}>
        <ResponsiveContainer width='100%' height={135}>
          <BarChart data={bubblePositionData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='position' name='Position' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='actualCount' fill={theme.palette.primary.main} />
            <Bar dataKey='requiredCount' fill={theme.palette.secondary.main} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default BubblePositionTrendsChart
