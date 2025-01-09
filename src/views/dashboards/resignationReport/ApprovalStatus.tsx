'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import { CheckCircle, Error, HourglassEmpty, AccessTime, Warning } from '@mui/icons-material'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled components for the new design
const StatusCard = styled(Card)({
  marginBottom: '16px',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: '24px'
})

const StatusBadge = styled(Box)<{ color: string }>(({ color }) => ({
  padding: '4px 12px',
  borderRadius: '12px',
  backgroundColor: color,
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '12px'
}))

const StatusContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '70%'
})

const StatusTitle = styled(Typography)({
  fontWeight: '600',
  fontSize: '16px',
  marginBottom: '8px'
})

const StatusDate = styled(Typography)({
  fontSize: '12px',
  color: '#6b6b6b'
})

const ApprovalStatus = () => {
  return (
    <Card sx={{ maxHeight: '67vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <CardHeader
        avatar={<i className='tabler-list-details text-xl' />}
        title='Approval Status'
        titleTypographyProps={{ variant: 'h5' }}
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
      />

      {/* Scrollable content */}
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
        // className='custom-scrollbar'
      >
        <CardContent className='flex flex-col gap-6 pbe-5'>
          {/* Approval for Resignation Request */}
          <StatusCard>
            <StatusContent>
              <StatusTitle variant='h6'>Approval for Resignation Request</StatusTitle>
              <Typography variant='body2' color='textPrimary'>
                Pending approval from HR Manager
              </Typography>
              <StatusDate variant='caption'>2 hours ago</StatusDate>
            </StatusContent>
            <StatusBadge color='#ff6f60'>Pending</StatusBadge>
          </StatusCard>

          {/* Approval to Create New Vacancy */}
          <StatusCard>
            <StatusContent>
              <StatusTitle variant='h6'>Approval to Create New Vacancy</StatusTitle>
              <Typography variant='body2' color='textPrimary'>
                Pending approval from Department Head
              </Typography>
              <StatusDate variant='caption'>1 day ago</StatusDate>
            </StatusContent>
            <StatusBadge color='#ffbb33'>Pending</StatusBadge>
          </StatusCard>

          {/* Approval to Validate Job Description */}
          <StatusCard>
            <StatusContent>
              <StatusTitle variant='h6'>Approval to Validate Job Description</StatusTitle>
              <Typography variant='body2' color='textPrimary'>
                Approved by HR
              </Typography>
              <StatusDate variant='caption'>3 days ago</StatusDate>
            </StatusContent>
            <StatusBadge color='#4caf50'>Approved</StatusBadge>
          </StatusCard>

          {/* Approval for Department Budget Increase */}
          <StatusCard>
            <StatusContent>
              <StatusTitle variant='h6'>Approval for Department Budget Increase</StatusTitle>
              <Typography variant='body2' color='textPrimary'>
                Pending approval from Finance
              </Typography>
              <StatusDate variant='caption'>4 days ago</StatusDate>
            </StatusContent>
            <StatusBadge color='#00bcd4'>Pending</StatusBadge>
          </StatusCard>

          {/* Approval to Change Branch Allocation */}
          <StatusCard>
            <StatusContent>
              <StatusTitle variant='h6'>Approval to Change Branch Allocation</StatusTitle>
              <Typography variant='body2' color='textPrimary'>
                Pending approval from Senior Management
              </Typography>
              <StatusDate variant='caption'>5 days ago</StatusDate>
            </StatusContent>
            <StatusBadge color='#9c27b0'>Pending</StatusBadge>
          </StatusCard>

          {/* Overdue Approval */}
          <StatusCard>
            <StatusContent>
              <StatusTitle variant='h6'>Overdue: Approval for Marketing Campaign Budget</StatusTitle>
              <Typography variant='body2' color='textPrimary'>
                Overdue for 2 days
              </Typography>
              <StatusDate variant='caption'>7 days ago</StatusDate>
            </StatusContent>
            <StatusBadge color='#f44336'>Overdue</StatusBadge>
          </StatusCard>
        </CardContent>
      </Box>
    </Card>
  )
}

export default ApprovalStatus
