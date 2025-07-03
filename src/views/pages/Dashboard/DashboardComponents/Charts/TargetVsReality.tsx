'use client'

import { Card, Typography, Box, Stack } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

//import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
//import LocalMallIcon from '@mui/icons-material/LocalMall'

import BagIcon from '@/icons/BagIconInChart'
import TicketStarIcon from '@/icons/TicketStarIconChart'

const data = [
  { name: 'Jan', Reality: 8, Target: 12 },
  { name: 'Feb', Reality: 7, Target: 11 },
  { name: 'Mar', Reality: 6, Target: 13 },
  { name: 'Apr', Reality: 8, Target: 11 },
  { name: 'May', Reality: 9, Target: 14 },
  { name: 'June', Reality: 9, Target: 13 },
  { name: 'July', Reality: 8, Target: 12 }
]

export default function TargetVsRealityCard() {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        p: 6,
        bgcolor: 'background.paper',

        //width: '100%',
        maxWidth: 500
      }}
    >
      <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 2 }}>
        Target vs Reality
      </Typography>
      {/* <CardHeader
        title='Target vs Reality'
        sx={{ fontWeight: 'bold', '& .MuiCardHeader-title': { fontWeight: 'bold' } }}
      /> */}

      <Box sx={{ height: 155 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} barGap={8}>
            {/* <CartesianGrid strokeDasharray='3 3' vertical={false} /> */}
            <XAxis dataKey='name' tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey='Reality' radius={[4, 4, 0, 0]} fill='#0DBF88' barSize={7} />
            <Bar dataKey='Target' radius={[4, 4, 0, 0]} fill='#F5A623' barSize={7} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Stack direction='column' spacing={2}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Box
            sx={{
              bgcolor: '#E6FBF4',
              borderRadius: 1,
              p: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <BagIcon />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='subtitle2' fontWeight={600} color='text.primary'>
              Reality Sales
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Global
            </Typography>
          </Box>
          <Typography variant='subtitle1' fontWeight={600} color='#0DBF88'>
            8.823
          </Typography>
        </Stack>

        <Stack direction='row' spacing={2} alignItems='center'>
          <Box
            sx={{
              bgcolor: '#FFF7E6',
              borderRadius: 1,
              p: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TicketStarIcon />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='subtitle2' fontWeight={600} color='text.primary'>
              Target Sales
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Commercial
            </Typography>
          </Box>
          <Typography variant='subtitle1' fontWeight={600} color='#F5A623'>
            12.122
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
}
