import { Grid } from '@mui/material'

import EmployeeCountChart from './Reports/EmployeeCountChart'
import TotalBranchesChart from './Reports/TotalBranchesChart'
import ShortlistedCandidateChart from './Reports/ShortlistedChart'

const Page = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <EmployeeCountChart />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <TotalBranchesChart />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <ShortlistedCandidateChart />
      </Grid>
    </Grid>
  )
}

export default Page
