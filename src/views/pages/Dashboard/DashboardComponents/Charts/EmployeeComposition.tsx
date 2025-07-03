'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Component Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

type LabelProp = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

// Vars
const data = [
  { name: 'Male', value: 73, color: '#00B798' },
  { name: 'Female', value: 27, color: '#0096DA' }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RADIAN = Math.PI / 180

// const renderCustomizedLabel = (props: LabelProp) => {
//   const { cx, cy } = props

//   return (
//     <text
//       x={cx}
//       y={cy}
//       fill='#fff'
//       textAnchor='middle'
//       dominantBaseline='middle'
//       className='max-[400px]:text-xs'
//       style={{ fontSize: '14px', fontWeight: 'bold', color: 'red' }}
//     >
//       Total <br /> 100%
//     </text>
//   )
// }

const renderCustomizedLabel = (props: LabelProp) => {
  const { cx, cy } = props

  return (
    <g>
      <circle cx={cx} cy={cy} r={30} fill='rgba(255, 255, 255, 0.7)' />
      <text x={cx} y={cy - 15} fill='grey' textAnchor='middle' dominantBaseline='middle' style={{ fontSize: '14px' }}>
        Total
      </text>
      <text
        x={cx}
        y={cy + 10}
        fill='black'
        textAnchor='middle'
        dominantBaseline='middle'
        style={{ fontSize: '20px', fontWeight: 'bold' }}
      >
        100%
      </text>
    </g>
  )
}

const EmployeeCompositionChart = () => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader
        title='Employee Composition'
        sx={{ fontWeight: 'bold', '& .MuiCardHeader-title': { fontWeight: 'bold' } }}
      />
      <CardContent>
        <AppRecharts>
          <div className='bs-[200px]'>
            <ResponsiveContainer>
              <PieChart height={280} style={{ direction: 'ltr' }}>
                <Pie
                  data={data}
                  innerRadius={55}
                  dataKey='value'
                  label={renderCustomizedLabel}
                  labelLine={false}
                  stroke='none'
                  startAngle={60}
                  endAngle={-300}
                  paddingAngle={1}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
        <div className='flex justify-center flex-wrap gap-6 mt-2'>
          <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#00B798' } }}>
            <i className='tabler-circle-filled text-xs' />
            <Typography variant='body2'>Male (73%)</Typography>
          </Box>
          <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#0096DA' } }}>
            <i className='tabler-circle-filled text-xs' />
            <Typography variant='body2'>Female (27%)</Typography>
          </Box>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployeeCompositionChart
