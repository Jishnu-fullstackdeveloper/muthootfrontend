// 'use client'

// import React from 'react'

// import { Grid, Box } from '@mui/material'

// import UserCard from './CommonComponents/UserCard'
// import StatisticCards from './CommonComponents/ThreeCardSection'
// import ApplicationsByDepartmentCard from './CommonComponents/ApplicationByDepartment'
// import ApplicantResourcesCard from './CommonComponents/ApplicantResources'

// const DashboardRecruitmentHr = () => {
//   return (
//     <Box>
//       <Grid container spacing={4}>
//         <Grid item xs={12} sm={12} md={12} lg={12}>
//           <UserCard />
//         </Grid>
//         <Grid item xs={12} sm={8} md={8} lg={8}>
//           <StatisticCards />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={4}>
//           <ApplicantResourcesCard />
//         </Grid>
//         <Grid item xs={12} sm={8} md={8} lg={8}>
//           <ApplicationsByDepartmentCard />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={4}></Grid>
//         <Grid item xs={12} sm={8} md={8} lg={8}></Grid>
//         <Grid item xs={12} sm={4} md={4} lg={4}></Grid>
//         <Grid item xs={12} sm={6} md={4} lg={4}></Grid>
//         <Grid item xs={12} sm={6} md={4} lg={4}></Grid>
//         <Grid item xs={12} sm={6} md={4} lg={4}></Grid>
//         <Grid item xs={12} sm={8} md={8} lg={8}></Grid>
//         <Grid item xs={12} sm={4} md={4} lg={4}></Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default DashboardRecruitmentHr

'use client'

import React from 'react'

import { Grid, Box } from '@mui/material'

import UserCard from './CommonComponents/UserCard'
import StatisticCards from './CommonComponents/ThreeCardSection'
import ApplicationsByDepartmentCard from './CommonComponents/ApplicationByDepartment'
import ApplicantResourcesCard from './CommonComponents/ApplicantResources'
import CurrentVacanciesCard from './CommonComponents/CurrentVacancies'
import TopActiveJobs from './CommonComponents/TopActiveJobsCard'
import AcquisitionsCard from './CommonComponents/AcquisitionsCard'
import NewApplications from './CommonComponents/NewApplicationsCard'

const DashboardRecruitmentHr = () => {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Top User Profile Card */}
        <Grid item xs={12}>
          <UserCard />
        </Grid>

        {/* Main Content */}
        <Grid item container spacing={4}>
          {/* Left side: 8 columns on large screens */}
          <Grid item xs={12} sm={8} md={8} lg={8}>
            <Box display='flex' flexDirection='column' gap={4}>
              {/* Top row: 3 Stat Cards */}
              <StatisticCards />

              {/* Below: Applications by Department */}
              <ApplicationsByDepartmentCard />
            </Box>
          </Grid>

          {/* Right side: 4 columns on large screens */}
          <Grid item xs={12} md={4} lg={4}>
            <ApplicantResourcesCard />
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <CurrentVacanciesCard />
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <TopActiveJobs />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Box className='flex flex-col gap-4'>
            <AcquisitionsCard />
            <NewApplications />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardRecruitmentHr
