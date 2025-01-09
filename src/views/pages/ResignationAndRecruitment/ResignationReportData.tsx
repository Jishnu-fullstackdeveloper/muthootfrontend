// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import DistributedBarChartOrder from '@/views/dashboards/resignationReport/DistributedBarChartOrder'
import LineAreaYearlySalesChart from '@/views/dashboards/resignationReport/LineAreaYearlySalesChart'
import CardStatVertical from '@/components/card-statistics/Vertical'
import BarChartRevenueGrowth from '@/views/dashboards/resignationReport/BarChartRevenueGrowth'
import EarningReportsWithTabs from '@/views/dashboards/resignationReport/EarningReportsWithTabs'
import RadarSalesChart from '@/views/dashboards/resignationReport/RadarSalesChart'
import SalesByCountries from '@/views/dashboards/resignationReport/SalesByCountries'
import ProjectStatus from '@/views/dashboards/resignationReport/ProjectStatus'
import ActiveProjects from '@/views/dashboards/resignationReport/ActiveProjects'
import LastTransaction from '@/views/dashboards/resignationReport/DesignationReport'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import ApexDonutChart from '@/views/charts/apex/ApexDonutChart'
import ApprovalStatus from '@/views/dashboards/resignationReport/ApprovalStatus'
import { Box, Button, Card, IconButton, Tooltip, Typography } from '@mui/material'
import DesignationReport from '@/views/dashboards/resignationReport/DesignationReport'
import BotRunStatus from '@/views/dashboards/resignationReport/BotRunStatus'
import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'

const ResignationReportData = () => {
  // Vars
  const serverMode = getServerMode()

  return (
    <>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          paddingBottom: 2
        }}
      >
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <Box mt={1}>
              {/* <DynamicAutocomplete
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    height: '15px',
                    padding: '12px'
                  }
                }}
                label='Branch'
                options={[
                  { name: 'Software Engineer' },
                  { name: 'Project Manager' },
                  { name: 'HR Executive' },
                  { name: 'Senior Developer' },
                  { name: 'UI/UX Designer' }
                ]}
              /> */}
            </Box>
            <Box mt={1}></Box>
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
        {/* <Grid item xs={12} sm={6} md={4} lg={2}>
        <CardStatVertical
          title='Total Profit'
          subtitle='Last Week'
          stats='1.28k'
          avatarColor='error'
          avatarIcon='tabler-credit-card'
          avatarSkin='light'
          avatarSize={44}
          avatarIconSize={28}
          chipText='-12.2%'
          chipColor='error'
          chipVariant='tonal'
        />
      </Grid> */}
        {/* <Grid item xs={12} lg={6}>
          <EarningReportsWithTabs serverMode={serverMode} />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <ApexDonutChart serverMode={serverMode} />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
        <SalesByCountries />
      </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <ProjectStatus />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
        <ActiveProjects />
      </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={2}>
          <CardStatVertical
            title='Total Sales'
            subtitle='Last Week'
            stats='24.67k'
            avatarColor='success'
            avatarIcon='tabler-currency-dollar'
            avatarSkin='light'
            avatarSize={44}
            avatarIconSize={28}
            chipText='+24.67%'
            chipColor='success'
            chipVariant='tonal'
          />
        </Grid> */}
        <Grid item xs={12} md={8} lg={4}>
          <BarChartRevenueGrowth serverMode={serverMode} />
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
