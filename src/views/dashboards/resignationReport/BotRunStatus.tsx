'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import type { TimelineProps } from '@mui/lab/Timeline'
import MuiTimeline from '@mui/lab/Timeline'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const BotRunStatusReport = () => {
  return (
    <Card
      sx={{
        maxHeight: '67vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd' // Optional border for better visibility
      }}
    >
      {/* Sticky Header */}
      <CardHeader
        avatar={<i className='tabler-robot text-xl' />}
        title='Bot Run Status Report'
        titleTypographyProps={{ variant: 'h5' }}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'white'
          // borderBottom: '1px solid #ddd', // Optional for better header separation
          // '& .MuiCardHeader-avatar': { mr: 3 }
        }}
      />

      {/* Scrollable Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: '#f0f0f0'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d4d4d4',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfbfbf'
          }
        }}
      >
        <CardContent>
          <Typography variant='h6' className='font-medium mbe-4'>
            Last Run Details
          </Typography>

          {/* Timeline Content */}
          <Timeline>
            {[...Array(20)].map((_, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color={index % 2 === 0 ? 'success' : 'error'} />
                  {index !== 19 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                    <Typography className='font-medium' color='text.primary'>
                      Date: Jan {index + 1}, 2025
                    </Typography>
                    <Typography className='font-medium' color='text.primary'>
                      Run By: User {index + 1}
                    </Typography>
                  </div>
                  <Typography className='mbe-2' color={index % 2 === 0 ? 'success.main' : 'error.main'}>
                    Status: {index % 2 === 0 ? 'Success' : 'Failed'}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Box>
    </Card>
  )
}

export default BotRunStatusReport
