// MUI Imports
'use client'
import { Box, Card, Grid, TextField } from '@mui/material'
import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'
import DistributedBarChartOrder from '@/views/dashboards/resignationReport/DistributedBarChartOrder'
import LineAreaYearlySalesChart from '@/views/dashboards/resignationReport/LineAreaYearlySalesChart'
import BarChartRevenueGrowth from '@/views/dashboards/resignationReport/BarChartRevenueGrowth'
import DesignationReport from '@/views/dashboards/resignationReport/DesignationReport'
import BotRunStatus from '@/views/dashboards/resignationReport/BotRunStatus'
import ApprovalStatus from '@/views/dashboards/resignationReport/ApprovalStatus'

// Custom Popper component to fix dropdown positioning
import { Popper } from '@mui/material'
const CustomPopper = (props: any) => <Popper {...props} placement='bottom-start' style={{ zIndex: 1300 }} />
const ResignationReportData = () => {
  return (
    <>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          paddingBottom: 2,
          overflow: 'visible' // Ensure overflow is visible
        }}
      >
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <Box mt={1}>
              <DynamicAutocomplete
                sx={{ width: '300px' }}
                PopperComponent={CustomPopper}
                ListboxProps={{
                  style: {
                    maxHeight: '150px', // Set fixed height
                    overflowY: 'auto' // Enable scrolling
                  }
                }}
                label='Branch Filter'
                options={[
                  { name: 'Software Engineer' },
                  { name: 'Project Manager' },
                  { name: 'HR Executive' },
                  { name: 'Senior Developer' },
                  { name: 'UI/UX Designer' },
                  { name: 'QA Analyst' },
                  { name: 'Product Owner' }
                ]}
                value={undefined} // renderInput={(params: any) => <TextField {...params} label='Branch Filter' />}
              />
            </Box>
          </Box>
        </div>
      </Card>

      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <DistributedBarChartOrder />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <LineAreaYearlySalesChart />
        </Grid>
        <Grid item xs={12} md={8} lg={4}>
          <BarChartRevenueGrowth />
        </Grid>
        <Grid item xs={12} md={12}>
          <DesignationReport />
        </Grid>
        <Grid item xs={12} md={6}>
          <BotRunStatus />
        </Grid>
        <Grid item xs={12} md={6}>
          <ApprovalStatus />
        </Grid>
      </Grid>
    </>
  )
}

export default ResignationReportData
