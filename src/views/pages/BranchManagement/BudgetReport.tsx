'use client'
import React from 'react'

import { Box, Card, Grid , Popper } from '@mui/material'


import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'
import BranchEmployeeChart from '@/views/dashboards/budgetReport/BranchEmployeeChart'
import BubblePositionTrendsChart from '@/views/dashboards/budgetReport/BubblePositionTrendsChart'
import BranchOpeningsChart from '@/views/dashboards/budgetReport/BranchOpeningsChart'
import ResignationsListReport from '@/views/dashboards/budgetReport/ResignationsListReport'
import CostEfficiencyStatus from '@/views/dashboards/budgetReport/CostEfficiencyStatus'
import ApprovalStatus from '@/views/dashboards/budgetReport/ApprovalStatus'

// Custom Popper component to fix dropdown positioning
const CustomPopper = (props: any) => <Popper {...props} placement='bottom-start' style={{ zIndex: 1300 }} />

const BudgetReport = () => {
  return (
    <>
      {/* Header with filters */}
      {/* <Card
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
                  { name: 'North Region' },
                  { name: 'South Region' },
                  { name: 'East Region' },
                  { name: 'West Region' },
                  { name: 'Central Branch' },
                  { name: 'Coastal Branch' }
                ]}
                value={undefined}
              />
            </Box>
          </Box>
        </div>
      </Card> */}

      {/* Main Grid Layout */}
      <Grid container spacing={6}>
        {/* Revenue by Branch */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <BranchEmployeeChart />
        </Grid>

        {/* Expense Trends */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <BubblePositionTrendsChart />
        </Grid>

        {/* Profit Margin Analysis */}
        <Grid item xs={12} md={8} lg={4}>
          <BranchOpeningsChart />
        </Grid>

        {/* Budget Allocation */}
        <Grid item xs={12} md={12}>
          <ResignationsListReport />
        </Grid>

        {/* Cost Efficiency Status */}
        {/* <Grid item xs={12} md={6}>
          <CostEfficiencyStatus />
        </Grid> */}

        {/* Approval Status */}
        {/* <Grid item xs={12} md={6}>
          <ApprovalStatus />
        </Grid> */}
      </Grid>
    </>
  )
}

export default BudgetReport
