import { Grid, Box } from '@mui/material'

//import EmployeeCountChart from './Reports/EmployeeCountChart'
//import TotalBranchesChart from './Reports/TotalBranchesChart'
//import ShortlistedCandidateChart from './Reports/ShortlistedChart'

//import RecruitmentRequestChart from './Reports/RecruitmentRequestChart'
//import HiringChart from './Reports/HiringCountChart'
//import CandidatesCountChart from './Reports/CandidatesChart'
//import RecentlyHiredChart from './Reports/RecentlyHiredChart'
import TotalVacancies from './Reports/TotalVacanciesChart'
import ViewDetailsPage from './DashboardComponents/ViewDetails'
import ProfileDetailsPage from './DashboardComponents/ProfileDetails'
import BranchCountPage from './DashboardComponents/BranchCount'
import EmployeeCountPage from './DashboardComponents/EmployeeCount'
import ShortlistedCandidatesPage from './DashboardComponents/ShortlistedCandidates'
import EmployeeCompositionChart from './DashboardComponents/Charts/EmployeeComposition'
import TargetVsRealityCard from './DashboardComponents/Charts/TargetVsReality'
import RecruitmentProgressPage from './DashboardComponents/RecruitmentProgress'
import RecentAddedJobsPage from './DashboardComponents/RecentlyAddedJobs'

//import IndiaSalesMap from './DashboardComponents/Charts/MapOfIndia'

const Dashboard = () => {
  return (
    <Box>
      {/* <Typography variant='h4' color='primary' fontWeight='bold' sx={{ mb: 2 }}>
        Dashboard
      </Typography> */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          {/* <EmployeeCountChart /> */}
          <ViewDetailsPage />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          {/* <TotalBranchesChart /> */}
          <ProfileDetailsPage />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {/* <RecruitmentRequestChart /> */}
          <BranchCountPage />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {/* <HiringChart /> */}
          <EmployeeCountPage />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {/* <ShortlistedCandidateChart /> */}
          <ShortlistedCandidatesPage />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {/* <CandidatesCountChart /> */}
          <EmployeeCompositionChart />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {/* <RecentlyHiredChart /> */}
          <TargetVsRealityCard />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TotalVacancies />
          {/* <IndiaSalesMap /> */}
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <RecruitmentProgressPage />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <RecentAddedJobsPage />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
