'use client'
import React from 'react'
import { Box, Card, Grid } from '@mui/material'
import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'
import RevenueByBranchChart from '@/views/dashboards/budgetReport/RevenueByBranchChart'
import ExpenseTrendsChart from '@/views/dashboards/budgetReport/ExpenseTrendsChart'
import ProfitMarginChart from '@/views/dashboards/budgetReport/ProfitMarginChart'
import BudgetAllocationReport from '@/views/dashboards/budgetReport/BudgetAllocationReport'
import CostEfficiencyStatus from '@/views/dashboards/budgetReport/CostEfficiencyStatus'
import ApprovalStatus from '@/views/dashboards/budgetReport/ApprovalStatus'

// Custom Popper component to fix dropdown positioning
import { Popper } from '@mui/material'
const CustomPopper = (props: any) => <Popper {...props} placement='bottom-start' style={{ zIndex: 1300 }} />

const BudgetReport = () => {
  return (
    <>
      {/* Header with filters */}
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
                  { name: 'North Region' },
                  { name: 'South Region' },
                  { name: 'East Region' },
                  { name: 'West Region' },
                  { name: 'Central Branch' },
                  { name: 'Coastal Branch' }
                ]}
              />
            </Box>
          </Box>
        </div>
      </Card>

      {/* Main Grid Layout */}
      <Grid container spacing={6}>
        {/* Revenue by Branch */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <RevenueByBranchChart />
        </Grid>

        {/* Expense Trends */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <ExpenseTrendsChart />
        </Grid>

        {/* Profit Margin Analysis */}
        <Grid item xs={12} md={8} lg={4}>
          <ProfitMarginChart />
        </Grid>

        {/* Budget Allocation */}
        <Grid item xs={12} md={12}>
          <BudgetAllocationReport />
        </Grid>

        {/* Cost Efficiency Status */}
        <Grid item xs={12} md={6}>
          <CostEfficiencyStatus />
        </Grid>

        {/* Approval Status */}
        <Grid item xs={12} md={6}>
          <ApprovalStatus />
        </Grid>
      </Grid>
    </>
  )
}

export default BudgetReport
