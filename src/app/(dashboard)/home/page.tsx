import { Grid, Typography, Box } from '@mui/material'

import EmployeeCountChart from './Reports/EmployeeCountChart'
import TotalBranchesChart from './Reports/TotalBranchesChart'
import ShortlistedCandidateChart from './Reports/ShortlistedChart'
import RecruitmentRequestChart from './Reports/RecruitmentRequestChart'
import HiringChart from './Reports/HiringCountChart'
import CandidatesCountChart from './Reports/CandidatesChart'
import RecentlyHiredChart from './Reports/RecentlyHiredChart'
import TotalVacancies from './Reports/TotalVacanciesChart'

const Page = () => {
  return (
    <Box>
      <Typography variant='h4' color='primary' fontWeight='bold' sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <EmployeeCountChart />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <TotalBranchesChart />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <RecruitmentRequestChart />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <HiringChart />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <ShortlistedCandidateChart />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <CandidatesCountChart />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <RecentlyHiredChart />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TotalVacancies />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Page
